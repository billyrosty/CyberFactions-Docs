# Models (Snapshots)

Every read through the API returns a *snapshot* interface rather than an internal data class. This keeps the plugin's internals free to change without breaking addons.

::: warning A snapshot is a live view, not a frozen copy
Despite the name, the snapshot implementations wrap the **live** internal object. Values change under you as the faction changes, and the wrapper stays alive as long as you hold it — which pins the internal object in memory.

Read what you need out of a snapshot immediately, then let it go. Do not store snapshots in long-lived fields or static maps; store the faction `int` id or the player `UUID` and re-resolve.
:::

## FactionSnapshot

```java
package fr.billyrosty.factions.api.model;

public interface FactionSnapshot {

    int getId();

    String getName();

    String getDescription();

    UUID getOwner();

    int getLevel();

    List<UUID> getMembers();

    int getMembersCount();

    int getPower();

    int getMaxPower();

    double getBank();

    Date getCreationDate();

    boolean isWilderness();

    boolean isSafeZone();

    boolean isWarZone();

    boolean isAdmin();

    boolean isSystemFaction();

    FLocationSnapshot getHome();

    CoreSnapshot getCore();

    Map<Material, Long> getBlocksCount();

    Map<Integer, String> getRelations();

    Object getLevelProperty(String property);

    List<FPlayerSnapshot> getOnlineMembers();

    List<FPlayerSnapshot> getOfflineMembers();

    String getRelation(int factionId);

    boolean isNeutral(int factionId);

    boolean hasPermission(FPlayerSnapshot player, String permission);
}
```

| Member | Nullability / notes |
|--------|---------------------|
| `getOwner()` | **nullable** — the three system factions have no owner |
| `getHome()` | **nullable** — `null` when no home is set |
| `getCore()` | **nullable** — `null` when the faction has no core, and when `core.yml` is disabled |
| `getMembers()` | unmodifiable list |
| `getBlocksCount()` | unmodifiable map, keyed by `org.bukkit.Material` |
| `getRelations()` | unmodifiable map of *other faction id* → *relation id* |
| `getLevelProperty(String)` | **nullable** `Object` — the raw upgrade property for the faction's current level. Prefer `UpgradeRegistry.getPropertyValue(id, key, Class)` for a typed read |
| `getOnlineMembers()` / `getOfflineMembers()` | always empty for a system faction or a faction with a `null` owner |
| `isSystemFaction()` | `isWilderness() \|\| isSafeZone() \|\| isWarZone()` |
| `isAdmin()` | an admin/staff faction flag, independent of the three system ids |
| `hasPermission(FPlayerSnapshot, String)` | see below |

::: warning `hasPermission` only understands built-in permissions
```java
// FactionSnapshotImpl
if (!(player instanceof FPlayerSnapshotImpl impl)) return false;
try {
    FPermissions perm = FPermissions.valueOf(permission.toUpperCase());
    return faction.hasPermission(impl.getInternal(), perm);
} catch (IllegalArgumentException e) {
    return false;
}
```
Two consequences:
1. The `permission` string must name a built-in permission (`BREAK`, `PLACE`, `CLAIM`, …). Anything else — including a `CustomPermission` you registered — returns `false`.
2. The `FPlayerSnapshot` must be one CyberFactions produced. Passing your own implementation returns `false`.

For custom permissions use `PermissionRegistry.hasPermission(factionId, uuid, permissionId)` instead — see [Registries](/api/registries).
:::

### Built-in permission ids

Accepted (case-insensitive) by `FactionSnapshot.hasPermission` and `PermissionRegistry`:

`BREAK` · `PLACE` · `INTERACT` · `INVITE` · `KICK` · `CLAIM` · `UNCLAIM` · `UNCLAIMALL` · `SETHOME` · `HOME` · `SETWARP` · `WARP` · `DELWARP` · `SETROLE` · `EDITPERMISSION` · `SETDESCRIPTION` · `SETNAME` · `RELATION` · `BANK_DEPOSIT` · `BANK_WITHDRAW` · `UPGRADE` · `SETCORE` · `DELCORE` · `OPEN_FCHEST` · `CREATE_GARDEN` · `TELEPORT_GARDEN` · `SKIP_QUEST`

## FPlayerSnapshot

```java
package fr.billyrosty.factions.api.model;

public interface FPlayerSnapshot {

    UUID getUuid();

    String getName();

    int getFactionId();

    boolean hasFaction();

    String getRole();

    double getPower();

    boolean hasMaxPower();

    boolean hasMinPower();

    String getChatMode();

    boolean isSpyMode();

    long getFlyTime();

    boolean isFlying();

    long getLastConnect();

    long getLastDisconnect();

    boolean isOnline();

    FLocationSnapshot getLastLocation();
}
```

| Member | Notes |
|--------|-------|
| `getFactionId()` | `0` when the player has no faction |
| `getRole()` | the role id as written in `roles.yml` (e.g. `"leader"`, `"member"`) |
| `getFlyTime()` | remaining faction-fly time, in **seconds** |
| `getLastConnect()` / `getLastDisconnect()` | epoch millis |
| `isOnline()` | computed as `lastConnect >= lastDisconnect` — this is a **network-wide** notion of online in a Redis setup, not `Bukkit.getPlayer(uuid) != null` |
| `getLastLocation()` | **nullable** — the last recorded position, which may be on another server |

## ClaimSnapshot

```java
package fr.billyrosty.factions.api.model;

public interface ClaimSnapshot {

    String getServer();

    String getWorld();

    int getX();

    int getZ();

    int getFactionId();
}
```

`getX()` / `getZ()` are **chunk** coordinates. Multiply by 16 for the block coordinate of the chunk's north-west corner.

## FLocationSnapshot

```java
package fr.billyrosty.factions.api.model;

public interface FLocationSnapshot {

    double getX();

    double getY();

    double getZ();

    float getYaw();

    float getPitch();

    String getWorld();

    String getServer();

    Location toBukkitLocation();
}
```

::: warning `toBukkitLocation()` across servers
`getWorld()` and `getServer()` are plain strings so a location can describe a place on another server in the network. `toBukkitLocation()` resolves the world by name on **this** server — it returns a `Location` with a `null` world if the world is not loaded here. Always compare `getServer()` against your own server name before teleporting to it, or use `TeleportationService.teleport(player, server, location, bypassWarmup)`.
:::

## CoreSnapshot

```java
package fr.billyrosty.factions.api.model;

public interface CoreSnapshot {

    FLocationSnapshot getLocation();

    String getSkin();

    UUID getEntityId();

    int getHealth();

    boolean isPlaced();

    long getLastAttack();

    long getLastDeath();
}
```

| Member | Notes |
|--------|-------|
| `getLocation()` | **nullable** when the core has never been placed |
| `getEntityId()` | UUID of the display entity backing the core; **nullable** while the core is not on the map |
| `isPlaced()` | whether the core is currently materialised in the world |
| `getLastAttack()` / `getLastDeath()` | epoch millis, `0` when it never happened |

## RelationSnapshot

```java
package fr.billyrosty.factions.api.model;

public interface RelationSnapshot {

    String getId();

    String getSingular();

    String getPlural();

    List<String> getAliases();

    String getColor();

    boolean isPvpAllowed();

    boolean needsRequest();

    int getRequestTimeout();

    List<String> getDeniedCommands();
}
```

This is a read-only view of a `relations.yml` entry, not of a relation *between* two factions. `getColor()` is a MiniMessage colour string. `getRequestTimeout()` is in seconds.

## RoleSnapshot

```java
package fr.billyrosty.factions.api.model;

public interface RoleSnapshot {

    String getId();

    String getName();

    String getPrefix();

    String getSuffix();

    int getPower();

    boolean hasPermission(String permission);
}
```

::: danger `RoleSnapshot` is not reachable
No service on `CyberFactionsAPI` returns a `RoleSnapshot`, and no implementation of it ships with the plugin. The interface exists in the API module but is currently dead — you can read a player's role id via `FPlayerSnapshot.getRole()`, but you cannot obtain the role's prefix, suffix, power or permissions through the API.
:::
