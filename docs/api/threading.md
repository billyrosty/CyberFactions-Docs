# Threading & Thread Safety

CyberFactions does not synchronize the API for you. This page states, per method group, what is safe to call off the main server thread and what is not — derived from what each implementation actually touches.

## The rule in one sentence

**Reads are async-safe. Writes that only touch the caches and storage layer are async-safe. Anything that touches a `Player`, a `World`, a `Chunk`, or fires a Bukkit event must run on the main thread.**

## Why reads are safe

Every cache the services read from is a `ConcurrentHashMap`:

```java
// StorageManager
this.factionsList = new ConcurrentHashMap<>();
this.playersList  = new ConcurrentHashMap<>();
this.claimsList   = new ConcurrentHashMap<>();
```

Snapshot lookups (`getFaction`, `getPlayer`, `getClaimAt`, `getFactionIdAt`, …) are plain map reads wrapped in a snapshot object. They never block and never touch Bukkit.

## Why most writes are safe

`updateFaction` / `updateFPlayer` stamp a `lastUpdate`, put into the concurrent cache, and hand persistence to a dedicated executor:

```java
StorageExecutor.executeFireAndForget("updateFaction(...)",
        () -> this.SQLManager.getFactionAccess().updateFaction(faction));
```

Even the one Bukkit interaction inside `updateFaction` is bounced back to the main thread by the plugin itself:

```java
Bukkit.getScheduler().runTask(CyberPlugin.getInstance(), () -> {
    Bukkit.getPluginManager().callEvent(new FactionAddedEvent(faction));
});
```

So `mutateFaction`, `mutatePlayer` and the simple setters are safe from an async task.

## Per-method verdict

Legend: ✅ safe from any thread · ⚠️ main thread only · 🔶 safe but read the note

### FactionService

| Method | |
|--------|:--:|
| `getFaction`, `getFactionByPlayer`, `getAllFactions`, `isFactionNameTaken` | ✅ |
| `setOwner`, `setName`, `setDescription`, `setLevel`, `setAdmin`, `mutateFaction` | ✅ |
| `changeRole` | ✅ |
| `createFaction` | ⚠️ fires `FactionCreateEvent` |
| `disbandFaction` | ⚠️ fires `FactionDisbandEvent`, messages players |
| `join`, `leave`, `kick` | ⚠️ fire events and message players |
| `invite` | ⚠️ resolves a `Player` and messages them |

### PlayerService

| Method | |
|--------|:--:|
| everything | ✅ |

`isBypassing` / `isAutoClaiming` / their setters mutate runtime `Set`s in `FPlayerManager`; treat them as safe but do not race two threads on the same UUID.

### ClaimService

| Method | |
|--------|:--:|
| `isClaimed(String, String, int, int)`, `getClaimAt(String, …)`, `getFactionIdAt(String, …)` | ✅ |
| `isClaimed(Chunk)`, `isClaimed(Location)`, `getClaimAt(Location)`, `getFactionIdAt(Location)` | 🔶 they call `Location#getWorld()` / `Chunk#getWorld()`, which is a field read on a loaded object — safe in practice, but the `Location` must come from an object you already own, never from a live entity you are reading concurrently |
| `getClaims`, `getClaimCount` | 🔶 safe, but they stream the entire claim table — do this async on purpose, not by accident |
| `claim`, `unclaim`, `unclaimAll` | ⚠️ they notify the web-map integrations (Dynmap / BlueMap / Pl3xMap), which are not thread-safe |
| `isInOwnTerritory` | ✅ reads the cached last chunk |

::: warning `FChunk.of(Location)` loads chunks
The `Location` overloads on `ClaimService` compute chunk coordinates with a bit-shift and never call `Location#getChunk()`, so they do **not** load anything. Some internal helpers do call `getChunk()`, which is a main-thread operation. Prefer the explicit `(server, world, x, z)` overloads in async code and there is no ambiguity.
:::

### EconomyService

| Method | |
|--------|:--:|
| everything | ✅ |

No Vault call, no player messaging, no event.

### RelationService

| Method | |
|--------|:--:|
| everything | ✅ |

`setRelation` / `clearRelation` write both factions and persist them; no events, no messaging.

### TeleportationService

| Method | |
|--------|:--:|
| everything | ⚠️ |

Every method takes a live `Player` and goes through the teleportation manager, which schedules countdown tasks, sends messages and calls `Player#teleport`.

### Registries

| Registry | |
|----------|:--:|
| `PermissionRegistry` — all methods | ✅ backed by a `ConcurrentHashMap`, persists through `updateFaction` |
| `UpgradeRegistry` — all methods | ✅ same |
| `AddonRegistry` — `getAddon`, `getRegisteredAddons`, `isAddonEnabled` | ✅ |
| `AddonRegistry` — `registerAddon`, `unregisterAddon` | ⚠️ these run your addon's `onEnable`/`onDisable`, which will almost certainly touch Bukkit |
| `CommandRegistry` — `registerSubCommand`, `unregisterSubCommand`, `registerTabCompleter`, `unregisterTabCompleter` | ⚠️ the underlying subcommand list is an `ArrayList` and the completer maps are plain `HashMap`s, all read from the command thread. Register during enable, on the main thread, and never afterwards |

::: danger `CommandRegistry` is not thread-safe
`FactionCommand` keeps its subcommands in an `ArrayList` and `FactionCommandCompleter` keeps its completers in `HashMap`s, with no synchronization. Registering a subcommand from an async task while a player is running `/f` can throw or corrupt the list. Do all command registration in `onEnable`.
:::

## Events

Every event in `fr.billyrosty.factions.events` is fired **on the main thread**. Your handlers therefore run on the main thread and may touch Bukkit freely — and must not block.

If a handler needs to do I/O, hand it off:

```java
@EventHandler
public void onClaim(FactionClaimEvent event) {
    int factionId = event.getFaction().getId();
    Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
        // safe: this is a cache read
        int claims = api.getClaimService().getClaimCount(factionId);
        recordToMyDatabase(factionId, claims);
    });
}
```

## Snapshots and concurrency

Snapshots wrap the **live** internal object. Two consequences:

1. Reading the same snapshot twice can return different values.
2. A snapshot obtained on one thread and read on another gives you no memory-visibility guarantee for fields that are not themselves volatile or concurrent.

The safe pattern is: resolve, read what you need, drop the reference.

```java
// good
int level = api.getFactionService().getFaction(id).map(FactionSnapshot::getLevel).orElse(0);

// bad — pins the internal object and goes stale
private FactionSnapshot cachedFaction;
```

`getMembers()`, `getBlocksCount()` and `getRelations()` return **unmodifiable views over live collections**. Iterating one while the plugin mutates it can throw `ConcurrentModificationException`. Copy first if you iterate off-thread:

```java
List<UUID> members = List.copyOf(faction.getMembers());
```

## Redis and multi-server

In a Redis deployment, another server's write arrives through the pub/sub listener and lands in the same caches. Two additional rules:

- A value you read is only current for *this instant on this server*. Do not implement cross-server invariants (e.g. "only one faction may hold this") by reading then writing — there is no distributed lock in the API.
- `FLocationSnapshot.getServer()` and `ClaimSnapshot.getServer()` may name a different server. Check them before acting on a `Location`.

## Checklist

- Reading faction / player / claim data from an async task — fine.
- Writing through `mutateFaction`, `mutatePlayer`, economy, relations, permissions or upgrades from an async task — fine.
- Creating, disbanding, joining, leaving, kicking, inviting, claiming, unclaiming, teleporting — schedule it with `Bukkit.getScheduler().runTask(plugin, …)`.
- All command and addon registration — `onEnable`, main thread.
- Never hold a snapshot across ticks.
