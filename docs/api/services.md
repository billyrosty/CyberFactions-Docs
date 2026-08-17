# Services

Every service is obtained from the `CyberFactionsAPI` instance and is a **singleton for the lifetime of the plugin**. Holding a reference to a service is safe; holding a reference to a snapshot it returned is not (see [Models](/api/models)).

Signatures on this page are copied verbatim from `api/src/main/java/fr/billyrosty/factions/api/service/`.

## FactionService

```java
package fr.billyrosty.factions.api.service;

public interface FactionService {

    Optional<FactionSnapshot> getFaction(int id);

    Optional<FactionSnapshot> getFaction(String name);

    Optional<FactionSnapshot> getFactionByPlayer(UUID player);

    Collection<FactionSnapshot> getAllFactions();

    boolean isFactionNameTaken(String name);

    FactionSnapshot createFaction(String name, UUID owner);

    void disbandFaction(int factionId);

    void join(UUID player, int factionId);

    void leave(UUID player);

    void kick(UUID kicker, UUID target);

    void invite(int factionId, UUID target, String inviterName);

    void changeRole(UUID target, String roleId);

    void setOwner(int factionId, UUID newOwner);

    void setName(int factionId, String name);

    void setDescription(int factionId, String description);

    void setLevel(int factionId, int level);

    void setAdmin(int factionId, boolean admin);

    void mutateFaction(int factionId, Consumer<MutableFaction> mutator);

    interface MutableFaction {

        void setName(String name);

        void setDescription(String description);

        void setLevel(int level);

        void setBank(double bank);

        void setAdmin(boolean admin);

        void setOwner(UUID owner);
    }
}
```

### Behaviour notes

| Method | Notes |
|--------|-------|
| `getFaction(int)` / `getFaction(String)` | Cache lookup. Empty `Optional` when unknown. Name lookup is delegated to `FactionManager` and matches the stored name. |
| `getFactionByPlayer(UUID)` | Empty when the player has no account **or** no faction. |
| `getAllFactions()` | Unmodifiable list, includes the Wilderness/SafeZone/WarZone system factions. Allocates a fresh snapshot per faction — don't call it in a tight loop. |
| `createFaction(String, UUID)` | Constructs the faction, persists it, sets the owner's faction and role to `leader`. Fires `FactionCreateEvent` internally, so this **must run on the main thread**. Returns the new snapshot. It does *not* check `isFactionNameTaken` for you. |
| `disbandFaction(int)` | Silently does nothing for an unknown id. Bypasses the disband cooldown (`force = false` is passed, so the configured cooldown still applies and the call can be a no-op). |
| `join`, `leave`, `kick` | All are no-ops when the player/faction cannot be resolved. `kick` derives the faction from the **kicker**'s faction, not the target's. |
| `invite(int, UUID, String)` | See the warning below. |
| `changeRole(UUID, String)` | Writes the role id directly with no validation against `roles.yml` and no permission check. An unknown role id will be stored as-is. |
| `setOwner` / `setName` / `setDescription` / `setLevel` / `setAdmin` | Thin wrappers over `mutateFaction`. They write to the live object and persist, but do **not** fire the corresponding events (`FactionRenameEvent`, `FactionDescChangeEvent`, …). |
| `mutateFaction(int, Consumer)` | Runs the mutator against the live faction, then persists once. No-op for an unknown id. Prefer it over several setters — it produces a single write instead of one per field. |

::: tip `invite()` usage
Call as `invite(factionId, targetUUID, inviterName)`. Resolves the inviter by name, looks up the target by UUID, then sends the invitation. No-op if the inviter is offline.
:::

::: tip Batch your writes
```java
api.getFactionService().mutateFaction(factionId, f -> {
    f.setDescription("Reforged");
    f.setLevel(4);
    f.setBank(0);
});
```
One persist, one Redis broadcast. Calling `setDescription` + `setLevel` + a bank write separately costs three.
:::

## PlayerService

```java
package fr.billyrosty.factions.api.service;

public interface PlayerService {

    Optional<FPlayerSnapshot> getPlayer(UUID uuid);

    Optional<FPlayerSnapshot> getPlayer(String name);

    Collection<FPlayerSnapshot> getAllPlayers();

    boolean hasAccount(UUID uuid);

    boolean hasFaction(UUID uuid);

    boolean isBypassing(UUID uuid);

    void setBypassing(UUID uuid, boolean bypass);

    boolean isAutoClaiming(UUID uuid);

    void setAutoClaiming(UUID uuid, boolean autoClaim);

    void addPower(UUID uuid, double amount);

    void removePower(UUID uuid, double amount);

    void setFlyTime(UUID uuid, long seconds);

    void setChatMode(UUID uuid, String chatMode);

    void setSpyMode(UUID uuid, boolean spy);

    void mutatePlayer(UUID uuid, Consumer<MutablePlayer> mutator);

    interface MutablePlayer {

        void setPower(double power);

        void setRole(String roleId);

        void setChatMode(String chatMode);

        void setSpyMode(boolean spy);

        void setFlyTime(long seconds);
    }
}
```

### Behaviour notes

| Method | Notes |
|--------|-------|
| `getPlayer(UUID)` / `getPlayer(String)` | Works for offline players too — CyberFactions keeps an `FPlayer` record for every player who has ever joined. Empty `Optional` for a player with no record. |
| `getAllPlayers()` | Unmodifiable list of every known account, online or not. This is the full player table; on a large server it can be tens of thousands of entries. |
| `hasAccount(UUID)` | `true` once an `FPlayer` record exists. |
| `isBypassing` / `setBypassing` | Admin claim-protection bypass. Runtime-only, not persisted across restarts. |
| `isAutoClaiming` / `setAutoClaiming` | Runtime-only auto-claim toggle. |
| `addPower` / `removePower` | Clamped by the configured min/max power. Persists immediately. |
| `setFlyTime(UUID, long)` | Seconds of faction-fly remaining. Does not itself start or stop flight. |
| `setChatMode(UUID, String)` | The chat mode id as a raw string (e.g. `"faction"`, `"ally"`, `"public"` depending on your config). Not validated. |
| `mutatePlayer(UUID, Consumer)` | Same batching benefit as `mutateFaction`. No-op for an unknown UUID. |

::: warning No events on writes
None of `addPower`, `removePower`, `setChatMode`, `setSpyMode`, `setFlyTime` or `mutatePlayer` fires the corresponding Bukkit event (`PowerRegenEvent`, `FPlayerSwitchChatEvent`, `FPlayerSpyChatStateChangeEvent`). Changes made through the API are invisible to other listeners, including other addons.
:::

## ClaimService

```java
package fr.billyrosty.factions.api.service;

public interface ClaimService {

    boolean isClaimed(String server, String world, int x, int z);

    boolean isClaimed(Chunk chunk);

    boolean isClaimed(Location location);

    Optional<ClaimSnapshot> getClaimAt(String server, String world, int x, int z);

    Optional<ClaimSnapshot> getClaimAt(Location location);

    int getFactionIdAt(String server, String world, int x, int z);

    int getFactionIdAt(Location location);

    Collection<ClaimSnapshot> getClaims(int factionId);

    int getClaimCount(int factionId);

    void claim(int factionId, String server, String world, int x, int z);

    void claim(int factionId, Chunk chunk);

    void unclaim(String server, String world, int x, int z);

    void unclaim(Chunk chunk);

    void unclaimAll(int factionId);

    boolean isInOwnTerritory(java.util.UUID player);
}
```

### Behaviour notes

- The `Chunk` and `Location` overloads always use **this** server's name (`general.yml` → `server_name`). To address a chunk on another server in a Redis network, use the explicit `String server` overloads.
- `x` and `z` are **chunk** coordinates, not block coordinates. The `Location` overloads do the `>> 4` shift for you.
- `getFactionIdAt(...)` returns `0` for unclaimed land — the Wilderness id. There is no separate "not found" value; use `getClaimAt(...)` when you need to distinguish.
- `claim(...)` overwrites an existing claim (overclaim) without any power, limit, adjacency or permission check. It also clears the previous owner's home if the home was in that chunk. It does **not** fire `FactionClaimEvent`.
- `unclaim(...)` calls the manager with `force = false`, so the previous owner's home is cleared if it stood there. It does **not** fire `FactionUnClaimEvent`.
- `unclaimAll(int)` is a no-op for an unknown faction id.
- `getClaims(int)` and `getClaimCount(int)` both stream the whole claim table. On a server with hundreds of thousands of claims, cache the result rather than calling per tick.
- `isInOwnTerritory(UUID)` reads the player's *last known* chunk, which is updated by the movement listener — it is not a live position read.

## EconomyService

```java
package fr.billyrosty.factions.api.service;

public interface EconomyService {

    double getBalance(int factionId);

    void setBalance(int factionId, double amount);

    void deposit(int factionId, double amount);

    void withdraw(int factionId, double amount);

    double getBankLimit(int factionId);

    boolean hasEnough(int factionId, double amount);
}
```

### Behaviour notes

- This is the **faction bank**, not Vault. Player balances are not touched.
- `getBalance` returns `0` for an unknown faction id — indistinguishable from a genuinely empty bank.
- `deposit` does **not** enforce `getBankLimit()`. Check it yourself if the cap matters:
  ```java
  double limit = economy.getBankLimit(id);
  if (economy.getBalance(id) + amount <= limit) economy.deposit(id, amount);
  ```
- `withdraw` clamps at `0` — the bank never goes negative, and the call silently succeeds even when the faction could not afford it. Guard with `hasEnough(id, amount)` first.
- `getBankLimit` reads the `bankLimit` upgrade property of the faction's current level, returning `0` when the property is absent or non-numeric.
- Neither `deposit` nor `withdraw` fires `FPlayerDepositEvent` / `FPlayerWithdrawEvent`.

## RelationService

```java
package fr.billyrosty.factions.api.service;

public interface RelationService {

    Collection<RelationSnapshot> getRegisteredRelations();

    Optional<RelationSnapshot> getRelation(String id);

    String getRelationBetween(int factionId1, int factionId2);

    boolean areAllied(int factionId1, int factionId2);

    boolean areEnemies(int factionId1, int factionId2);

    boolean areNeutral(int factionId1, int factionId2);

    void setRelation(int factionId1, int factionId2, String relationId);

    void clearRelation(int factionId1, int factionId2);

    List<Integer> getFactionsWithRelation(int factionId, String relationId);

    boolean isPvpAllowed(int factionId1, int factionId2);
}
```

### Behaviour notes

- Relation ids come from `relations.yml`. They are arbitrary strings, not an enum.
- `getRelationBetween` returns the string `"default"` when `factionId1` is unknown.
- `areAllied` / `areEnemies` hardcode the ids `"ally"` and `"enemy"`. If you renamed those relations in `relations.yml`, these two methods will always return `false` — use `getRelationBetween(...)` and compare yourself.
- `setRelation` writes the relation **symmetrically** on both factions and persists both. It bypasses the request/acceptance flow (`needsRequest`), any relation limit from the upgrade properties, and does not fire `FactionRelationChangeEvent`.
- `clearRelation` sets both sides back to neutral.
- `isPvpAllowed` returns `true` when the relation id is unknown to the config (fail-open).

## TeleportationService

```java
package fr.billyrosty.factions.api.service;

public interface TeleportationService {

    void teleportToHome(Player player);

    void teleportToHome(Player player, boolean bypassWarmup);

    void teleport(Player player, Location location, boolean bypassWarmup);

    void teleport(Player player, String server, Location location, boolean bypassWarmup);

    boolean hasPendingTeleportation(Player player);

    void cancelPendingTeleportation(Player player);

    int getWarmupDuration();
}
```

### Behaviour notes

- Every method here takes a live Bukkit `Player` and goes through the teleportation manager, which schedules tasks, sends messages and moves entities. **Main thread only.**
- `teleportToHome(Player)` delegates to `teleportToHome(player, false)`. It is a silent no-op when the player has no account, no faction, or the faction has no home.
- `bypassWarmup = true` skips the countdown *and* the movement-cancels-teleport rule.
- The `String server` overload targets a cross-server teleport in a Redis network; the player is queued and sent on arrival at the target server.
- `getWarmupDuration()` returns the configured `/f home` warmup in seconds (`teleportation.yml`), not the remaining warmup of a pending teleport.

## RoleService

```java
package fr.billyrosty.factions.api.service;

public interface RoleService {

    Collection<RoleSnapshot> getRegisteredRoles();

    Optional<RoleSnapshot> getRole(String id);

    Optional<RoleSnapshot> getRoleByPlayer(UUID player);

    String getServerName();
}
```

### Behaviour notes

| Method | Notes |
|--------|-------|
| `getRegisteredRoles()` | Returns all roles defined in `roles.yml`. Allocates a fresh snapshot per role. |
| `getRole(String)` | The id is the key from `roles.yml` (e.g. `"recruit"`, `"member"`, `"leader"`). Case-sensitive. |
| `getRoleByPlayer(UUID)` | Resolves the player's current role id from their `FPlayer` record, then looks up the role. Empty when the player has no account or an unknown role id. |
| `getServerName()` | Returns the `server_name` value from `general.yml`. Use this with the explicit `String server` overloads in `ClaimService`. |
