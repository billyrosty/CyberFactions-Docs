# roles.yml

Defines the faction role hierarchy. Roles determine a member's rank within their faction and what permissions they have by default. The system supports unlimited custom roles with configurable power levels, prefixes, and default permissions.

**Location:** `configurations/social/roles.yml`

## Full Configuration

```yaml
roles:
  leader:
    display_name: "<red>Leader"
    prefix: "**"
    suffix: ""
    gui_item:
      material: NETHERITE_SWORD
      custom_model_data: 0
      slots: [ 0 ]
      page: 1
  co-leader:
    display_name: "<blue>Co-Leader"
    prefix: "*"
    suffix: ""
    power: 5
    permissions:
      - "INVITE:ALLOWED"
      - "KICK:ALLOWED"
      - "SETDESCRIPTION:ALLOWED"
      - "EDITPERMISSION:ALLOWED"
      - "RELATION:ALLOWED"
      - "SETHOME:ALLOWED"
    gui_item:
      material: DIAMOND_SWORD
      custom_model_data: 0
      slots: [ 1 ]
      page: 1
  officer:
    display_name: "<green>Officier"
    prefix: "+"
    suffix: ""
    power: 3
    permissions:
      - "SETROLE:ALLOWED"
      - "CLAIM:ALLOWED"
      - "UNCLAIM:ALLOWED"
    gui_item:
      material: GOLDEN_SWORD
      custom_model_data: 0
      slots: [ 2 ]
      page: 1
  member:
    display_name: "<gold>Member"
    prefix: "-"
    suffix: ""
    power: 2
    permissions:
      - "BREAK:ALLOWED"
      - "PLACE:ALLOWED"
      - "INTERACT:ALLOWED"
      - "HOME:ALLOWED"
    gui_item:
      material: IRON_SWORD
      custom_model_data: 0
      slots: [ 3 ]
      page: 1
  recruit:
    display_name: "<yellow>Recruit"
    prefix: "--"
    suffix: ""
    power: 0
    permissions: []
    gui_item:
      material: WOODEN_SWORD
      custom_model_data: 0
      slots: [ 4 ]
      page: 1
```

## Configuration Reference

### Role Properties

Each role (except leader) has the following properties:

| Key | Type | Description |
|-----|------|-------------|
| `display_name` | string | MiniMessage-formatted display name shown in chat and GUIs. |
| `prefix` | string | Text prefix prepended to member names (e.g., in chat or tab). |
| `suffix` | string | Text suffix appended to member names. |
| `power` | integer | Hierarchy power level. Higher values = higher rank. Determines who can promote/demote whom. |
| `permissions` | list | Default permissions for this role. Format: `"PERMISSION:STATE"`. |
| `gui_item.material` | string | Item material shown in the permissions GUI. |
| `gui_item.custom_model_data` | integer | Custom model data for resource packs. |
| `gui_item.slots` | list | GUI slot positions for this role in the permissions menu. |
| `gui_item.page` | integer | Page number in the permissions GUI. |

### Default Role Hierarchy

| Role | Power | Prefix | Default Permissions |
|------|-------|--------|-------------------|
| Leader | (highest) | `**` | All permissions (hardcoded, cannot be restricted) |
| Co-Leader | 5 | `*` | Invite, Kick, Set Description, Edit Permissions, Relations, Set Home |
| Officer | 3 | `+` | Set Roles, Claim, Unclaim |
| Member | 2 | `-` | Break, Place, Interact, Home |
| Recruit | 0 | `--` | None (inherits from lowest role) |

### The Leader Role

The `leader` role is special:

- It does **not** have a `power` field (it is always the highest)
- It does **not** have a `permissions` field (all permissions are granted implicitly)
- It **cannot** be deleted or edited by players in-game
- There is always exactly one leader per faction

### Permission Format

Permissions follow the `"PERMISSION_NAME:STATE"` format:

- `ALLOWED` -- The permission is explicitly granted
- `DENIED` -- The permission is explicitly denied
- If a permission is not listed, it is "undefined" and inherits from the lowest-power role

Available permissions:
`BREAK`, `PLACE`, `INTERACT`, `INVITE`, `KICK`, `CLAIM`, `UNCLAIM`, `UNCLAIMALL`, `SETHOME`, `HOME`, `SETWARP`, `WARP`, `DELWARP`, `SETROLE`, `EDITPERMISSION`, `SETDESCRIPTION`, `SETNAME`, `RELATION`, `BANK_DEPOSIT`, `BANK_WITHDRAW`, `UPGRADE`, `SETCORE`, `DELCORE`, `OPEN_FCHEST`, `CREATE_GARDEN`, `TELEPORT_GARDEN`, `SKIP_QUEST`

::: tip Permission Inheritance
Permissions that are not explicitly defined for a role inherit from the role with the lowest power value. In the default configuration, that is the `recruit` role (power 0). Since recruits have no permissions set, undefined permissions default to denied behavior.
:::

::: tip Adding Custom Roles
You can add as many roles as needed. Simply add a new entry with a unique key name:
```yaml
roles:
  # ... existing roles ...
  elite:
    display_name: "<aqua>Elite"
    prefix: "~"
    suffix: ""
    power: 4
    permissions:
      - "BREAK:ALLOWED"
      - "PLACE:ALLOWED"
      - "INTERACT:ALLOWED"
      - "HOME:ALLOWED"
      - "CLAIM:ALLOWED"
    gui_item:
      material: DIAMOND_AXE
      custom_model_data: 0
      slots: [5]
      page: 1
```
Ensure the `power` value places it correctly in the hierarchy relative to other roles.
:::

::: warning Deleting Roles
If you remove a role from the configuration, all members who held that role will be automatically moved to the role with the lowest power level. Always plan role restructuring carefully to avoid unintentional demotions.
:::

::: warning Minimum Requirements
- The `leader` role is mandatory and cannot be removed.
- You must have at least two roles defined (leader + one other).
- Power values must be unique across non-leader roles to establish a clear hierarchy.
:::
