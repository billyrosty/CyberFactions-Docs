# Developer API

CyberFactions ships a dedicated `api` module — a small, dependency-free set of interfaces that third-party plugins compile against. Nothing in the API exposes the plugin's internal data classes: every read returns an immutable *snapshot*, and every write goes through a service.

::: tip Where to start
New to the API? Jump straight to [Getting Started](/api/getting-started) for a complete, compilable addon skeleton.
:::

## What the API is made of

| Package | Contents |
|---------|----------|
| `fr.billyrosty.factions.api` | `CyberFactionsAPI`, `CyberFactionsAPIProvider` |
| `fr.billyrosty.factions.api.service` | `FactionService`, `PlayerService`, `ClaimService`, `EconomyService`, `RelationService`, `TeleportationService` |
| `fr.billyrosty.factions.api.model` | `FactionSnapshot`, `FPlayerSnapshot`, `ClaimSnapshot`, `CoreSnapshot`, `FLocationSnapshot`, `RelationSnapshot`, `RoleSnapshot` |
| `fr.billyrosty.factions.api.command` | `CommandRegistry`, `FactionSubCommand`, `TabCompleter` |
| `fr.billyrosty.factions.api.permission` | `PermissionRegistry`, `CustomPermission`, `PermissionState`, `PermissionType` |
| `fr.billyrosty.factions.api.upgrade` | `UpgradeRegistry`, `CustomProperty` |
| `fr.billyrosty.factions.api.addon` | `AddonRegistry`, `CyberAddon` |
| `fr.billyrosty.factions.api.event.faction` | Faction lifecycle, territory, core, relations events |
| `fr.billyrosty.factions.api.event.player` | Player membership, economy, territory, chat events |

::: tip Events are in the API module
All events are in the API — you only need `cyberfactions-api` to listen to them. See [Events](/api/events).
:::

## The entry point

```java
package fr.billyrosty.factions.api;

public interface CyberFactionsAPI {

    FactionService getFactionService();

    PlayerService getPlayerService();

    ClaimService getClaimService();

    EconomyService getEconomyService();

    RelationService getRelationService();

    TeleportationService getTeleportationService();

    CommandRegistry getCommandRegistry();

    PermissionRegistry getPermissionRegistry();

    UpgradeRegistry getUpgradeRegistry();

    AddonRegistry getAddonRegistry();

    Plugin getPlugin();

    static CyberFactionsAPI getInstance() {
        return CyberFactionsAPIProvider.get();
    }
}
```

`getPlugin()` returns the `CyberPlugin` instance as a plain Bukkit `Plugin` — useful for scheduling tasks or registering listeners under CyberFactions' own plugin handle.

## Obtaining the instance

```java
package fr.billyrosty.factions.api;

public final class CyberFactionsAPIProvider {

    public static CyberFactionsAPI get();          // throws IllegalStateException if not loaded

    public static void register(CyberFactionsAPI api); // internal — do not call

    public static void unregister();                   // internal — do not call
}
```

`CyberFactionsAPIProvider.register()` is called by CyberFactions at the **very end** of its `onEnable()`, after every manager and scheduler is up. `unregister()` runs in `onDisable()`, right after all addons have been disabled.

Two ways to get the instance, both equivalent:

```java
CyberFactionsAPI api = CyberFactionsAPIProvider.get();
// or
CyberFactionsAPI api = CyberFactionsAPI.getInstance();
```

::: danger Never call get() from your own onLoad()
`get()` throws `IllegalStateException("CyberFactions API is not loaded yet.")` when CyberFactions has not finished enabling. With `depend: [CyberFactions]` in your `plugin.yml`, your `onEnable()` is guaranteed to run after CyberFactions', so calling it there is safe. `onLoad()` is not.
:::

## Method summary by service

### `FactionService`

| Method | Returns |
|--------|---------|
| `getFaction(int id)` | `Optional<FactionSnapshot>` |
| `getFaction(String name)` | `Optional<FactionSnapshot>` |
| `getFactionByPlayer(UUID player)` | `Optional<FactionSnapshot>` |
| `getAllFactions()` | `Collection<FactionSnapshot>` |
| `isFactionNameTaken(String name)` | `boolean` |
| `createFaction(String name, UUID owner)` | `FactionSnapshot` |
| `disbandFaction(int factionId)` | `void` |
| `join(UUID player, int factionId)` | `void` |
| `leave(UUID player)` | `void` |
| `kick(UUID kicker, UUID target)` | `void` |
| `invite(int factionId, UUID target, String inviterName)` | `void` |
| `changeRole(UUID target, String roleId)` | `void` |
| `setOwner(int factionId, UUID newOwner)` | `void` |
| `setName(int factionId, String name)` | `void` |
| `setDescription(int factionId, String description)` | `void` |
| `setLevel(int factionId, int level)` | `void` |
| `setAdmin(int factionId, boolean admin)` | `void` |
| `mutateFaction(int factionId, Consumer<MutableFaction> mutator)` | `void` |

### `PlayerService`

| Method | Returns |
|--------|---------|
| `getPlayer(UUID uuid)` | `Optional<FPlayerSnapshot>` |
| `getPlayer(String name)` | `Optional<FPlayerSnapshot>` |
| `getAllPlayers()` | `Collection<FPlayerSnapshot>` |
| `hasAccount(UUID uuid)` | `boolean` |
| `hasFaction(UUID uuid)` | `boolean` |
| `isBypassing(UUID uuid)` | `boolean` |
| `setBypassing(UUID uuid, boolean bypass)` | `void` |
| `isAutoClaiming(UUID uuid)` | `boolean` |
| `setAutoClaiming(UUID uuid, boolean autoClaim)` | `void` |
| `addPower(UUID uuid, double amount)` | `void` |
| `removePower(UUID uuid, double amount)` | `void` |
| `setFlyTime(UUID uuid, long seconds)` | `void` |
| `setChatMode(UUID uuid, String chatMode)` | `void` |
| `setSpyMode(UUID uuid, boolean spy)` | `void` |
| `mutatePlayer(UUID uuid, Consumer<MutablePlayer> mutator)` | `void` |

### `ClaimService`

| Method | Returns |
|--------|---------|
| `isClaimed(String server, String world, int x, int z)` | `boolean` |
| `isClaimed(Chunk chunk)` | `boolean` |
| `isClaimed(Location location)` | `boolean` |
| `getClaimAt(String server, String world, int x, int z)` | `Optional<ClaimSnapshot>` |
| `getClaimAt(Location location)` | `Optional<ClaimSnapshot>` |
| `getFactionIdAt(String server, String world, int x, int z)` | `int` |
| `getFactionIdAt(Location location)` | `int` |
| `getClaims(int factionId)` | `Collection<ClaimSnapshot>` |
| `getClaimCount(int factionId)` | `int` |
| `claim(int factionId, String server, String world, int x, int z)` | `void` |
| `claim(int factionId, Chunk chunk)` | `void` |
| `unclaim(String server, String world, int x, int z)` | `void` |
| `unclaim(Chunk chunk)` | `void` |
| `unclaimAll(int factionId)` | `void` |
| `isInOwnTerritory(UUID player)` | `boolean` |

### `EconomyService`

| Method | Returns |
|--------|---------|
| `getBalance(int factionId)` | `double` |
| `setBalance(int factionId, double amount)` | `void` |
| `deposit(int factionId, double amount)` | `void` |
| `withdraw(int factionId, double amount)` | `void` |
| `getBankLimit(int factionId)` | `double` |
| `hasEnough(int factionId, double amount)` | `boolean` |

### `RelationService`

| Method | Returns |
|--------|---------|
| `getRegisteredRelations()` | `Collection<RelationSnapshot>` |
| `getRelation(String id)` | `Optional<RelationSnapshot>` |
| `getRelationBetween(int factionId1, int factionId2)` | `String` |
| `areAllied(int factionId1, int factionId2)` | `boolean` |
| `areEnemies(int factionId1, int factionId2)` | `boolean` |
| `areNeutral(int factionId1, int factionId2)` | `boolean` |
| `setRelation(int factionId1, int factionId2, String relationId)` | `void` |
| `clearRelation(int factionId1, int factionId2)` | `void` |
| `getFactionsWithRelation(int factionId, String relationId)` | `List<Integer>` |
| `isPvpAllowed(int factionId1, int factionId2)` | `boolean` |

### `TeleportationService`

| Method | Returns |
|--------|---------|
| `teleportToHome(Player player)` | `void` |
| `teleportToHome(Player player, boolean bypassWarmup)` | `void` |
| `teleport(Player player, Location location, boolean bypassWarmup)` | `void` |
| `teleport(Player player, String server, Location location, boolean bypassWarmup)` | `void` |
| `hasPendingTeleportation(Player player)` | `boolean` |
| `cancelPendingTeleportation(Player player)` | `void` |
| `getWarmupDuration()` | `int` |

### `CommandRegistry`

| Method | Returns |
|--------|---------|
| `registerSubCommand(FactionSubCommand command)` | `void` |
| `unregisterSubCommand(String name)` | `void` |
| `hasSubCommand(String name)` | `boolean` |
| `getRegisteredCommands()` | `Collection<FactionSubCommand>` |
| `registerTabCompleter(String commandName, int argIndex, TabCompleter completer)` | `void` |
| `unregisterTabCompleter(String commandName, int argIndex)` | `void` |

### `PermissionRegistry`

| Method | Returns |
|--------|---------|
| `registerPermission(CustomPermission permission)` | `void` |
| `unregisterPermission(String id)` | `void` |
| `getPermission(String id)` | `Optional<CustomPermission>` |
| `getRegisteredPermissions()` | `Collection<CustomPermission>` |
| `hasPermission(int factionId, UUID player, String permissionId)` | `boolean` |
| `setPermission(int factionId, String roleOrRelationId, String permissionId, PermissionState state)` | `void` |
| `getPermissionState(int factionId, String roleOrRelationId, String permissionId)` | `PermissionState` |

### `UpgradeRegistry`

| Method | Returns |
|--------|---------|
| `registerProperty(CustomProperty property)` | `void` |
| `unregisterProperty(String key)` | `void` |
| `getProperty(String key)` | `Optional<CustomProperty>` |
| `getRegisteredProperties()` | `Collection<CustomProperty>` |
| `getPropertyValue(int factionId, String propertyKey)` | `Object` (nullable) |
| `<T> getPropertyValue(int factionId, String propertyKey, Class<T> type)` | `T` (nullable) |
| `getFactionLevel(int factionId)` | `int` |

### `AddonRegistry`

| Method | Returns |
|--------|---------|
| `registerAddon(CyberAddon addon)` | `void` |
| `unregisterAddon(String id)` | `void` |
| `getAddon(String id)` | `Optional<CyberAddon>` |
| `getRegisteredAddons()` | `Collection<CyberAddon>` |
| `isAddonEnabled(String id)` | `boolean` |

## Reserved faction IDs

Three faction IDs are reserved by the plugin and are returned by `ClaimService.getFactionIdAt(...)` like any other:

| ID | Meaning | Snapshot predicate |
|:--:|---------|--------------------|
| `0` | Wilderness (also the value returned for *unclaimed*) | `isWilderness()` |
| `1` | SafeZone | `isSafeZone()` |
| `2` | WarZone | `isWarZone()` |

`FactionSnapshot.isSystemFaction()` returns `true` for any of the three.

## Next steps

- [Getting Started](/api/getting-started) — a full addon project you can copy
- [Services](/api/services) — every service method with its exact signature and behaviour
- [Models](/api/models) — the snapshot interfaces
- [Events](/api/events) — the real Bukkit events and their getters
- [Commands](/api/commands) — adding `/f <yourcommand>`
- [Registries](/api/registries) — permissions, upgrade properties, addons
- [Threading](/api/threading) — what is safe off the main thread
- [Examples](/api/examples) — eight complete, compilable use cases
