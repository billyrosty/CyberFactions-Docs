# Roles & Hierarchy

Every great faction needs structure. CyberFactions delivers a fully customizable role hierarchy that gives leaders precise control over who can do what — from the newest recruit to the most trusted officer. No hardcoded limits, no arbitrary restrictions.

## Default Role Structure

Out of the box, CyberFactions ships with five roles arranged in a clear power hierarchy:

| Role | Power | Prefix | Permissions |
|------|-------|--------|-------------|
| **Leader** | Maximum | `**` | All permissions (always) |
| **Co-Leader** | 5 | `*` | Invite, Kick, Description, Permissions, Relations, SetHome |
| **Officer** | 3 | `+` | SetRole, Claim, Unclaim |
| **Member** | 2 | `-` | Break, Place, Interact, Home |
| **Recruit** | 0 | `--` | None (inherits lowest) |

::: tip Unlimited Custom Roles
This is just the default. You can create as many roles as your server needs — add "General", "Builder", "Spy", "Diplomat", or anything else. The only requirement is one Leader role and at least one other role.
:::

## How the Hierarchy Works

Roles are ranked by their **power value**. Higher power means higher authority. This affects:

- **Promotion/Demotion** — You can only promote to roles below yours and demote those ranked lower
- **Kicking** — You can only kick members with a lower role power
- **Permission editing** — Role-based permissions cascade downward

The Leader role has no power value — it is always the highest rank and cannot be demoted, kicked, or restricted.

## Creating Custom Roles

Add any role by inserting a new entry in `social/roles.yml`:

```yaml
roles:
  general:
    display_name: "<dark_aqua>General"
    prefix: "+++"
    suffix: " [GEN]"
    power: 4
    permissions:
      - "CLAIM:ALLOWED"
      - "UNCLAIM:ALLOWED"
      - "INVITE:ALLOWED"
      - "SETHOME:ALLOWED"
    gui_item:
      material: DIAMOND_AXE
      custom_model_data: 0
      slots: [2]
      page: 1
```

That is all it takes. The new role is immediately available for promotion and appears in the permissions GUI.

![Permissions GUI showing roles](./images/roles-permissions-gui.png)
<!-- SCREENSHOT: Open /f permissions and show the role selection screen. Each role should be visible as its configured item (Netherite Sword for Leader, Diamond Sword for Co-Leader, etc). Show the GUI with the custom items and colored role names visible in the item names/lore. -->

## Role Display

### Prefixes & Suffixes

Every role has a configurable prefix and suffix that appear in:

- Faction chat messages
- PlaceholderAPI placeholders (`%cyberfactions_role_prefix%`)
- Member lists and faction info displays
- Scoreboard integrations

### MiniMessage Formatting

Display names support full MiniMessage syntax — gradients, hex colors, bold, italic, everything:

```yaml
display_name: "<gradient:#FF6B6B:#4ECDC4>Elite Guard</gradient>"
prefix: "<bold>!</bold>"
```

## Promoting & Demoting

```
/f promote <player>
/f demote <player>
```

Promotion moves a player up one rank in the hierarchy. Demotion moves them down one. Both commands respect hierarchy — you cannot promote someone to your own rank or above.

![Promotion success message](./images/roles-promote.png)
<!-- SCREENSHOT: Run /f promote on a recruit. Capture the success message showing the player being promoted from Recruit to Member, with the role colors visible in the chat message. Have the faction chat visible showing the announcement to all members. -->

## Permission System

CyberFactions features a granular permission system with **25+ individual permissions** that can be configured per-role and per-relation.

### Available Permissions

| Permission | Controls |
|------------|----------|
| `BREAK` | Breaking blocks in territory |
| `PLACE` | Placing blocks in territory |
| `INTERACT` | Interacting with blocks (doors, levers, etc.) |
| `INVITE` | Inviting new members |
| `KICK` | Removing members |
| `CLAIM` | Claiming territory |
| `UNCLAIM` | Unclaiming territory |
| `UNCLAIMALL` | Unclaiming all territory at once |
| `SETHOME` | Setting faction home |
| `HOME` | Teleporting to faction home |
| `SETWARP` | Creating faction warps |
| `WARP` | Using faction warps |
| `DELWARP` | Deleting faction warps |
| `SETROLE` | Changing member roles |
| `EDITPERMISSION` | Modifying permission settings |
| `SETDESCRIPTION` | Changing faction description |
| `SETNAME` | Renaming the faction |
| `RELATION` | Managing faction relations |
| `BANK_DEPOSIT` | Depositing into faction bank |
| `BANK_WITHDRAW` | Withdrawing from faction bank |
| `UPGRADE` | Upgrading the faction |
| `SETCORE` | Placing the faction core |
| `DELCORE` | Removing the faction core |
| `OPEN_FCHEST` | Accessing faction chests |
| `CREATE_GARDEN` | Creating faction gardens |
| `TELEPORT_GARDEN` | Teleporting to gardens |
| `SKIP_QUEST` | Skipping faction quests |

### Permission States

Each permission has three possible states:

- **Allowed** — Explicitly granted
- **Denied** — Explicitly blocked
- **Undefined** — Inherits from the lowest-power role

::: info In-Game Editing
Faction leaders can modify permissions live through the GUI (`/f permissions`). The config file sets defaults — players customize from there. Click-based interface: left-click to allow, middle-click to undefine, right-click to deny.
:::

### Relation Permissions

The same permission system applies to relations. Control what allies, truces, and enemies can do in your territory independently:

```
/f permissions <relation>
```

For example, allow allies to build but deny enemies interaction access — all configurable per-faction through the GUI.

## Permission Inheritance

If a permission is not explicitly set for a role, it inherits from the lowest-power role. This means you only need to configure permissions that differ from the baseline — everything else cascades automatically.

## GUI Configuration

Each role has a GUI item configuration for the permissions interface:

```yaml
gui_item:
  material: DIAMOND_SWORD
  custom_model_data: 0
  slots: [1]
  page: 1
```

Custom model data support means you can use resource pack items for a premium look.

## Configuration

All role settings live in `social/roles.yml`. Permission GUI layout is in `social/permissions.yml`. Hot-reload with `/f reload`.
