# permissions.yml

Defines all faction permissions that can be assigned to roles and relations. Each permission controls a specific action within faction territory, and faction leaders can toggle them through the in-game GUI.

**Location:** `configurations/social/permissions.yml`

## Overview

The permissions system has three components:

1. **Status display** -- How permission states (allowed/denied/undefined) are shown in the GUI
2. **Relation permissions** -- Permissions that apply to members of other factions based on their relation
3. **Role permissions** -- Permissions that apply to members within the faction based on their role

## Full Configuration (Abbreviated)

```yaml
permissions:
  status:
    allowed:
      color: "<green>"
      text: "✔ Allowed"
    denied:
      color: "<red>"
      text: "❌ Denied"
    undefined:
      color: "<gray>"
      text: "✎ Undefined"
  relations:
    BREAK: { ... }
    PLACE: { ... }
    INTERACT: { ... }
  roles:
    BREAK: { ... }
    PLACE: { ... }
    INTERACT: { ... }
    INVITE: { ... }
    KICK: { ... }
    CLAIM: { ... }
    UNCLAIM: { ... }
    UNCLAIMALL: { ... }
    SETHOME: { ... }
    HOME: { ... }
    SETWARP: { ... }
    WARP: { ... }
    DELWARP: { ... }
    SETROLE: { ... }
    EDITPERMISSION: { ... }
    SETDESCRIPTION: { ... }
    SETNAME: { ... }
    RELATION: { ... }
    BANK_DEPOSIT: { ... }
    BANK_WITHDRAW: { ... }
    UPGRADE: { ... }
    SETCORE: { ... }
    DELCORE: { ... }
    OPEN_FCHEST: { ... }
    CREATE_GARDEN: { ... }
    TELEPORT_GARDEN: { ... }
    SKIP_QUEST: { ... }
    ATTACK_CORE: { ... }
```

## Permission Status Display

Controls how the three permission states appear in the GUI.

| Status | Color | Text | Description |
|--------|-------|------|-------------|
| `allowed` | `<green>` | `"✔ Allowed"` | Permission is explicitly granted. |
| `denied` | `<red>` | `"❌ Denied"` | Permission is explicitly denied. |
| `undefined` | `<gray>` | `"✎ Undefined"` | Permission inherits from the lowest-power role. |

## Relation Permissions

These permissions control what players from other factions can do in your territory, based on their faction's relation to yours.

| Permission | Description | Material | GUI Slot |
|------------|-------------|----------|----------|
| `BREAK` | Break blocks in faction territory | `STONE_PICKAXE` | 12 |
| `PLACE` | Place blocks in faction territory | `COBBLESTONE` | 13 |
| `INTERACT` | Interact with blocks (doors, levers, chests) in faction territory | `LEVER` | 14 |

## Role Permissions

These permissions control what members of specific roles can do within the faction.

### Territory Permissions (Page 1)

| Permission | Description | Material | GUI Slot |
|------------|-------------|----------|----------|
| `BREAK` | Break blocks in faction territory | `STONE_PICKAXE` | 12 |
| `PLACE` | Place blocks in faction territory | `COBBLESTONE` | 13 |
| `INTERACT` | Interact with blocks in territory | `LEVER` | 14 |

### Management Permissions (Page 1)

| Permission | Description | Material | GUI Slot |
|------------|-------------|----------|----------|
| `INVITE` | Invite players to the faction | `POPPY` | 20 |
| `KICK` | Kick members from the faction | `OAK_DOOR` | 21 |
| `CLAIM` | Claim territory | `GREEN_BANNER` | 22 |
| `UNCLAIM` | Unclaim individual territories | `RED_BANNER` | 23 |
| `UNCLAIMALL` | Unclaim all territories at once | `RED_BANNER` | 23 |
| `SETHOME` | Set the faction home location | `LIME_BED` | 24 |
| `HOME` | Teleport to faction home | `RED_BED` | 29 |
| `SETWARP` | Create faction warps | `SLIME_BLOCK` | 30 |
| `WARP` | Teleport to faction warps | `HONEY_BLOCK` | 31 |
| `DELWARP` | Delete faction warps | `REDSTONE_BLOCK` | 32 |
| `SETROLE` | Assign roles to members | `ENDER_EYE` | 33 |

### Advanced Permissions (Page 1 continued)

| Permission | Description | Material | GUI Slot |
|------------|-------------|----------|----------|
| `EDITPERMISSION` | Edit permission settings for roles | `NETHER_STAR` | 38 |
| `SETDESCRIPTION` | Change the faction description | `BOOK` | 39 |
| `SETNAME` | Rename the faction | `NAME_TAG` | 40 |
| `RELATION` | Request or declare faction relations | `IRON_SWORD` | 41 |
| `BANK_DEPOSIT` | Deposit money into the faction bank | `GOLD_NUGGET` | 42 |

### Extended Permissions (Page 2)

| Permission | Description | Material | GUI Slot |
|------------|-------------|----------|----------|
| `BANK_WITHDRAW` | Withdraw money from the faction bank | `GOLD_INGOT` | 12 |
| `UPGRADE` | Upgrade the faction level | `EXPERIENCE_BOTTLE` | 13 |
| `SETCORE` | Set the faction core location | `END_CRYSTAL` | 14 |
| `DELCORE` | Delete the faction core | `END_CRYSTAL` | 20 |
| `OPEN_FCHEST` | Open faction chests | `CHEST` | 21 |
| `CREATE_GARDEN` | Create a faction garden | `GRASS_BLOCK` | 22 |
| `TELEPORT_GARDEN` | Teleport to the faction garden | `GRASS_BLOCK` | 23 |
| `SKIP_QUEST` | Skip faction quests (costs money) | `BOOK` | 24 |
| `ATTACK_CORE` | Participate in raids on enemy cores | `NETHERITE_SWORD` | 29 |

## Permission Item Structure

Each permission entry follows this structure:

```yaml
PERMISSION_NAME:
  name: "Display Name"
  material: MATERIAL_TYPE
  model_data: 0
  slots: [slot_number]
  page: 1
  description:
    - ""
    - "<white>Description of what this permission does"
    - ""
    - "<white>Status: %status%"
    - ""
    - "<gray>• Left-Click : <green>Allow"
    - "<gray>• Middle-Click : <white>Undefined"
    - "<gray>• Right-Click : <red>Disallow"
```

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Display name shown in the GUI. |
| `material` | string | Item material displayed. |
| `model_data` | integer | Custom model data for resource packs. |
| `slots` | list | GUI slot positions for this permission item. |
| `page` | integer | Which page this permission appears on (for pagination). |
| `description` | list | Lore lines explaining the permission and showing interaction hints. |

::: tip Permission Inheritance
If a permission is set to "Undefined" for a role, it inherits the value from the role with the lowest power level. This means you only need to explicitly set permissions for roles that differ from the base.
:::

::: info ATTACK_CORE Default
Unlike all other permissions, `ATTACK_CORE` defaults to **ALLOWED** for every role. This means all faction members can participate in raids out of the box. If a faction leader wants to restrict siege participation to officers+, they deny it for lower roles through the permissions GUI. This permission is checked on the **attacker's own faction**, not on the defending faction.
:::

::: tip Adding Custom Permissions
You can add new permission entries to both the `relations` and `roles` sections. The permission ID (key name) must match a permission type recognized by the plugin's code. Refer to the wiki for a full list of available permission types.
:::

::: warning Leader Role
The leader role has all permissions by default and cannot be edited. The `leader_lore` in the menus config is shown when attempting to view leader permissions.
:::
