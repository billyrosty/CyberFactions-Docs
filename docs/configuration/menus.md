# menus.yml

Configures all GUI menus used by CyberFactions -- members list, member editing, permissions management, faction disbanding confirmation, and quest displays. Each menu is fully customizable with configurable items, slots, materials, and lore.

**Location:** `configurations/social/menus.yml`

## Overview

The menus system provides inventory-based GUIs for managing faction operations. All menus support:

- Custom titles (including resource pack font offsets for custom backgrounds)
- Configurable item materials, display names, lore, and custom model data
- Flexible slot assignments for item placement
- Pagination for lists that exceed available slots
- Background filler items

## Structure

```yaml
general:
  click_sound:
    enabled: true
    sound: "minecraft.player.gainxp"

menus:
  members: { ... }
  edit_member: { ... }
  permissions: { ... }
  edit_permissions: { ... }
  disband: { ... }
  quests: { ... }
```

## Menu Sections

### General Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `general.click_sound.enabled` | boolean | `true` | Play a sound when clicking items in menus. |
| `general.click_sound.sound` | string | `"minecraft.player.gainxp"` | Sound ID to play on click. |

### Members Menu

Displays all members of the faction with pagination.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `members.size` | integer | `5` | Menu size in rows (1-6). |
| `members.title` | string | (custom font) | Menu title. Supports resource pack font offsets. |
| `members.member_item.material` | string | `"PLAYER_HEAD"` | Material for each member entry (uses the player's skin). |
| `members.member_item.slots` | list | `[10,11,12,...]` | Inventory slots where member items appear. |
| `members.member_item.display_name` | string | (see config) | Display name format. Supports `%cfac_member_role_name%`, `%cfac_member_name%`. |
| `members.member_item.lore` | list | (see config) | Lore lines. Supports `%cfac_member_power%` and other placeholders. |

### Edit Member Menu

Opened when clicking a member in the members list. Allows promote, demote, and kick actions.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `edit_member.size` | integer | `6` | Menu size in rows. |
| `edit_member.title` | string | `"Edit Faction Member: %member%"` | Menu title with member name placeholder. |
| `edit_member.promote.material` | string | `"LIME_STAINED_GLASS_PANE"` | Material for the promote button. |
| `edit_member.promote.slots` | list | `[12]` | Slot(s) for the promote button. |
| `edit_member.demote.material` | string | `"RED_STAINED_GLASS_PANE"` | Material for the demote button. |
| `edit_member.demote.slots` | list | `[13]` | Slot(s) for the demote button. |
| `edit_member.kick.material` | string | `"BARRIER"` | Material for the kick button. |
| `edit_member.kick.slots` | list | `[14]` | Slot(s) for the kick button. |

### Permissions Menu

Displays all roles and relations for editing their permissions.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `permissions.size` | integer | `5` | Menu size in rows. |
| `permissions.title` | string | `"Edit Roles and Relations"` | Menu title. |
| `permissions.roles.display_name` | string | (format) | Display name for role items. Supports `%role_name%`, `%role_prefix%`, `%role_suffix%`. |
| `permissions.roles.lore` | list | (see config) | Lore for editable roles. |
| `permissions.roles.leader_lore` | list | (see config) | Lore shown for the leader role (which cannot be edited). |
| `permissions.relations.display_name` | string | (format) | Display name for relation items. Supports `%relation_singular%`, `%relation_plural%`. |

### Edit Permissions Menu

The individual permission toggle interface for a specific role or relation.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `edit_permissions.size` | integer | `5` | Menu size in rows. |
| `edit_permissions.role_title` | string | (custom font) | Title when editing a role's permissions. |
| `edit_permissions.relation_title` | string | (custom font) | Title when editing a relation's permissions. |
| `edit_permissions.permission.display_name` | string | (format) | Format for each permission item. `%status_color%` and `%name%` placeholders. |

### Disband Confirmation Menu

A safety confirmation dialog before faction disbanding.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `disband.size` | integer | `3` | Menu size in rows. |
| `disband.title` | string | `"Disband your faction"` | Menu title. |
| `disband.info.material` | string | `"ENDER_EYE"` | Material for the warning/info item. |
| `disband.info.slots` | list | `[13]` | Slot for the info item. |
| `disband.confirm.material` | string | `"GREEN_STAINED_GLASS_PANE"` | Material for confirm buttons. |
| `disband.confirm.slots` | list | `[6,7,8,15,16,17,24,25,26]` | Slots for confirm area. |
| `disband.cancel.material` | string | `"RED_STAINED_GLASS_PANE"` | Material for cancel buttons. |
| `disband.cancel.slots` | list | `[0,1,2,9,10,11,18,19,20]` | Slots for cancel area. |

### Quests Menu

Displays available faction quests with pagination.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `quests.size` | integer | `5` | Menu size in rows. |
| `quests.slots` | list | `[10,11,12,...,34]` | Slots where quest items are displayed. |

## Common Item Properties

Every menu item supports these properties:

| Property | Type | Description |
|----------|------|-------------|
| `material` | string | Minecraft material name (e.g., `DIAMOND_SWORD`, `PLAYER_HEAD`). |
| `display_name` | string | Item display name in MiniMessage format. |
| `lore` | list | List of lore lines in MiniMessage format. |
| `custom_model_data` | integer | Custom model data value for resource packs. `0` = default texture. |
| `glowing` | boolean | Whether the item has an enchantment glow. |
| `slots` | list | Inventory slot positions where this item appears (0-indexed, left to right, top to bottom). |
| `command` | string | Command executed when clicked (optional). Prefix with `player:` to run as the player. |

::: tip Slot Reference
Inventory slots are numbered 0-53 for a 6-row (54-slot) inventory:
```
Row 1:  0  1  2  3  4  5  6  7  8
Row 2:  9 10 11 12 13 14 15 16 17
Row 3: 18 19 20 21 22 23 24 25 26
Row 4: 27 28 29 30 31 32 33 34 35
Row 5: 36 37 38 39 40 41 42 43 44
Row 6: 45 46 47 48 49 50 51 52 53
```
:::

::: tip Custom Menu Backgrounds
The title field supports resource pack font character offsets (e.g., `:offset_-48::5_row_border:`) to render custom background textures. This requires a compatible resource pack with negative-space font characters defined.
:::
