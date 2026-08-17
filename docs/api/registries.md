# Registries

Three registries let an addon extend the plugin's own data model rather than just read it: permissions, upgrade properties and addons themselves.

## PermissionRegistry

```java
package fr.billyrosty.factions.api.permission;

public interface PermissionRegistry {

    void registerPermission(CustomPermission permission);

    void unregisterPermission(String id);

    Optional<CustomPermission> getPermission(String id);

    Collection<CustomPermission> getRegisteredPermissions();

    boolean hasPermission(int factionId, java.util.UUID player, String permissionId);

    void setPermission(int factionId, String roleOrRelationId, String permissionId, PermissionState state);

    PermissionState getPermissionState(int factionId, String roleOrRelationId, String permissionId);
}
```

```java
public interface CustomPermission {

    String getId();

    String getDisplayName();

    String getDescription();

    PermissionState getDefaultState();

    PermissionType getType();
}

public enum PermissionState { ALLOWED, DENIED, UNDEFINED }

public enum PermissionType { ROLE, RELATION, BOTH }
```

### Declaring a custom permission

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.permission.CustomPermission;
import fr.billyrosty.factions.api.permission.PermissionState;
import fr.billyrosty.factions.api.permission.PermissionType;

public final class UseBountiesPermission implements CustomPermission {

    @Override
    public String getId() {
        return "use_bounties";
    }

    @Override
    public String getDisplayName() {
        return "Use bounties";
    }

    @Override
    public String getDescription() {
        return "Allows placing and claiming bounties on behalf of the faction.";
    }

    @Override
    public PermissionState getDefaultState() {
        return PermissionState.DENIED;
    }

    @Override
    public PermissionType getType() {
        return PermissionType.ROLE;
    }
}
```

```java
api.getPermissionRegistry().registerPermission(new UseBountiesPermission());
```

### How `hasPermission` resolves

`hasPermission(factionId, uuid, permissionId)` walks four steps, in order:

1. If `permissionId` (upper-cased) names a **built-in** permission, the faction's normal role/relation permission logic answers and the method returns.
2. Otherwise the player's key is resolved: their **role id** if they belong to `factionId`, else the **relation id** between the two factions.
3. The faction's stored permission list for that key is scanned for a matching entry.
4. If nothing matched, the registered `CustomPermission`'s `getDefaultState()` decides — `ALLOWED` yields `true`, anything else `false`.

Returns `false` when either the faction or the player cannot be resolved.

::: tip Custom permissions are stored per faction
`setPermission(factionId, roleOrRelationId, permissionId, state)` stores custom permission states in the faction's `customPermissions` map (persisted to SQL/Redis). `hasPermission(factionId, player, permissionId)` resolves the stored state for the player's role, falling back to the registered `CustomPermission`'s `getDefaultState()` when nothing is set.
:::

::: warning `PermissionType.BOTH` has no counterpart
The internal permission type enum only has `ROLE` and `RELATION`. `BOTH` is accepted by the API but nothing consumes it.
:::

### Reading and writing built-in permissions

This part works as documented:

```java
PermissionRegistry perms = api.getPermissionRegistry();

// Can this player break blocks in their faction's land?
boolean canBreak = perms.hasPermission(factionId, uuid, "BREAK");

// Deny claiming for the "member" role in this faction.
perms.setPermission(factionId, "member", "CLAIM", PermissionState.DENIED);

// Read it back.
PermissionState state = perms.getPermissionState(factionId, "member", "CLAIM");
```

The `roleOrRelationId` parameter takes either a role id from `roles.yml` or a relation id from `relations.yml` — the plugin stores both in the same map. See [Models](/api/models#built-in-permission-ids) for the full list of built-in permission ids.

## UpgradeRegistry

```java
package fr.billyrosty.factions.api.upgrade;

public interface UpgradeRegistry {

    void registerProperty(CustomProperty property);

    void unregisterProperty(String key);

    Optional<CustomProperty> getProperty(String key);

    Collection<CustomProperty> getRegisteredProperties();

    Object getPropertyValue(int factionId, String propertyKey);

    <T> T getPropertyValue(int factionId, String propertyKey, Class<T> type);

    int getFactionLevel(int factionId);
}
```

```java
public interface CustomProperty {

    String getKey();

    Object getDefaultValue();

    PropertyType getType();

    enum PropertyType {
        INTEGER, DOUBLE, FLOAT, BOOLEAN, STRING, STRING_LIST, MAP
    }
}
```

### Reading built-in upgrade properties

`getProperty(key)` falls back to the plugin's built-in properties, so this works out of the box:

```java
UpgradeRegistry upgrades = api.getUpgradeRegistry();

Integer claimsLimit = upgrades.getPropertyValue(factionId, "claimsLimit", Integer.class);
Double  bankLimit   = upgrades.getPropertyValue(factionId, "bankLimit", Double.class);
Integer chestRows   = upgrades.getPropertyValue(factionId, "chestsRows", Integer.class);
int     level       = upgrades.getFactionLevel(factionId);
```

Built-in property keys, as defined in `upgrades.yml`:

| Key | Default type |
|-----|--------------|
| `levelName` | `String` |
| `coreHealth` | `Integer` |
| `coreRadius` | `Integer` |
| `coreEffects` | `Map` |
| `coreBankLoss` | `Integer` |
| `coreBankLossLimit` | `Double` |
| `claimsLimit` | `Integer` |
| `membersLimit` | `Integer` |
| `chests` | `Integer` |
| `chestsRows` | `Integer` |
| `relationsLimit` | `Map` |
| `allowedFly` | `List<String>` |
| `bankLimit` | `Double` |
| `growthRate` | `Float` |
| `spawnersRate` | `Float` |
| `relationsEffects` | `Map` |
| `blocksLimit` | `Map` |
| `blocksResistance` | `Map` |
| `mobsDrops` | `Map` |
| `powerBoost` | `Float` |
| `maxWarps` | `Integer` |
| `cancelledDamages` | `List` |

::: warning Typed reads are strict and silent
`getPropertyValue(id, key, Class<T>)` returns `null` — not a default, not an exception — when the stored value is not an instance of `type`. `bankLimit` is a `Double`, so asking for `Integer.class` yields `null`. Always null-check, and match the type in the table above.
:::

::: warning `getPropertyValue` returns `null` for unknown keys
Both overloads return `null` when the key is neither a per-level property of that faction nor a registered `CustomProperty`. There is no "property does not exist" signal distinct from "value is null".
:::

### Declaring a custom property

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.upgrade.CustomProperty;

public final class MaxBountiesProperty implements CustomProperty {

    @Override
    public String getKey() {
        return "maxBounties";
    }

    @Override
    public Object getDefaultValue() {
        return 3;
    }

    @Override
    public PropertyType getType() {
        return PropertyType.INTEGER;
    }
}
```

```java
api.getUpgradeRegistry().registerProperty(new MaxBountiesProperty());

// Resolution order: the faction's per-level value first, your default second.
Integer max = api.getUpgradeRegistry()
        .getPropertyValue(factionId, "maxBounties", Integer.class);
```

::: tip Custom properties *do* read from `upgrades.yml`
Unlike custom permissions, a custom property is genuinely useful: `getPropertyValue` first asks the faction for a per-level value under that key. If a server owner adds `maxBounties: 10` to a level in `upgrades.yml`, your addon picks it up automatically, and your `getDefaultValue()` covers the levels that do not define it.

`getRegisteredProperties()` returns only the properties you registered; the built-ins are not listed, though `getProperty(key)` will find them.
:::

## AddonRegistry

```java
package fr.billyrosty.factions.api.addon;

public interface AddonRegistry {

    void registerAddon(CyberAddon addon);

    void unregisterAddon(String id);

    Optional<CyberAddon> getAddon(String id);

    Collection<CyberAddon> getRegisteredAddons();

    boolean isAddonEnabled(String id);
}
```

```java
public interface CyberAddon {

    String getId();

    String getName();

    String getVersion();

    String getAuthor();

    Plugin getOwningPlugin();

    default String getDescription() {
        return "";
    }

    void onEnable(CyberFactionsAPI api);

    void onDisable();

    default void onReload() {}
}
```

| Method | Behaviour |
|--------|-----------|
| `registerAddon` | Throws `IllegalStateException` if `getId()` is already taken. Calls `onEnable(api)` synchronously inside a try/catch: on exception the addon is removed from the registry and the trace is printed, but the server keeps running. Logs an enable line with name, version and author. |
| `unregisterAddon` | Calls `onDisable()` (exceptions caught and logged). No-op for an unknown id. |
| `getRegisteredAddons` | Unmodifiable view over a `ConcurrentHashMap`'s values. |
| `isAddonEnabled` | Just a registry-membership check — it does not consult Bukkit's plugin state. |

Lifecycle beyond your own calls:

- **`/f reload`** invokes `onReload()` on every registered addon.
- **Server shutdown** invokes `onDisable()` on every registered addon, then unregisters the API.

See [Getting Started](/api/getting-started#shape-b-registered-addon-recommended) for the full addon skeleton, including why `CyberAddon` must not be implemented directly on your `JavaPlugin` class.

### Cooperating with other addons

```java
api.getAddonRegistry().getAddon("someotheraddon").ifPresent(other ->
        getLogger().info("Found " + other.getName() + " v" + other.getVersion()
                + " by " + other.getAuthor()));

if (!api.getAddonRegistry().isAddonEnabled("someotheraddon")) {
    getLogger().info("Optional integration disabled — addon not present.");
}
```
