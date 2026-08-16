# Permissions

CyberFactions uses a permission-based system to control access to commands. All permissions use a configurable prefix set in `general.yml` (default: `cyberfactions.`).

The pattern is: `<prefix><command_name>` — e.g. `cyberfactions.claim`, `cyberfactions.fly`.

## Player Commands

| Permission | Command | Description |
|------------|---------|-------------|
| `cyberfactions.create` | `/f create` | Create a faction |
| `cyberfactions.disband` | `/f disband` | Disband your faction |
| `cyberfactions.join` | `/f join` | Join a faction |
| `cyberfactions.leave` | `/f leave` | Leave a faction |
| `cyberfactions.invite` | `/f invite` | Invite a player |
| `cyberfactions.kick` | `/f kick` | Kick a member |
| `cyberfactions.promote` | `/f promote` | Promote a member |
| `cyberfactions.demote` | `/f demote` | Demote a member |
| `cyberfactions.claim` | `/f claim` | Claim territory |
| `cyberfactions.unclaim` | `/f unclaim` | Unclaim current chunk |
| `cyberfactions.unclaimall` | `/f unclaimall` | Unclaim all territory |
| `cyberfactions.home` | `/f home` | Teleport to faction home |
| `cyberfactions.sethome` | `/f sethome` | Set faction home |
| `cyberfactions.delhome` | `/f delhome` | Delete faction home |
| `cyberfactions.warp` | `/f warp` | Teleport to a warp |
| `cyberfactions.setwarp` | `/f setwarp` | Set a faction warp |
| `cyberfactions.delwarp` | `/f delwarp` | Delete a faction warp |
| `cyberfactions.warps` | `/f warps` | List faction warps |
| `cyberfactions.show` | `/f show` | View faction info |
| `cyberfactions.list` | `/f list` | List all factions |
| `cyberfactions.top` | `/f top` | View faction rankings |
| `cyberfactions.map` | `/f map` | Display faction map |
| `cyberfactions.power` | `/f power` | View power info |
| `cyberfactions.chat` | `/f chat` | Switch chat mode |
| `cyberfactions.spychat` | `/f spychat` | Spy on faction chats |
| `cyberfactions.desc` | `/f desc` | Set faction description |
| `cyberfactions.rename` | `/f rename` | Rename faction |
| `cyberfactions.relation` | `/f relation` | Set relation with a faction |
| `cyberfactions.relations` | `/f relations` | View all relations |
| `cyberfactions.bank` | `/f bank` | Access faction bank |
| `cyberfactions.bank.deposit` | `/f bank deposit` | Deposit into bank |
| `cyberfactions.bank.withdraw` | `/f bank withdraw` | Withdraw from bank |
| `cyberfactions.fly` | `/f fly` | Toggle faction fly |
| `cyberfactions.chest` | `/f chest` | Open a faction chest |
| `cyberfactions.chests` | `/f chests` | List faction chests |
| `cyberfactions.access` | `/f access` | Manage chunk access |
| `cyberfactions.shield` | `/f shield` | Manage faction shield |
| `cyberfactions.setcore` | `/f setcore` | Place faction core |
| `cyberfactions.delcore` | `/f delcore` | Remove faction core |
| `cyberfactions.quests` | `/f quests` | View faction quests |
| `cyberfactions.upgrade` | `/f upgrade` | Faction upgrades |
| `cyberfactions.members` | `/f members` | View faction members |
| `cyberfactions.permissions` | `/f permissions` | Manage faction permissions |

## Admin Commands

| Permission | Command | Description |
|------------|---------|-------------|
| `cyberfactions.admin` | `/f admin` | All admin sub-commands |
| `cyberfactions.admin` | `/f points` | Give/take faction points |
| `cyberfactions.admin.stress` | `/f stress` | Stress testing commands |
| `cyberfactions.reload` | `/f reload` | Reload all configurations |

## Special Permissions

| Permission | Description |
|------------|-------------|
| `cyberfactions.bypass.warmup` | Skip teleportation warmup (home, warp) |

## Commands Without Permission Check

These commands are accessible to anyone or gated internally:

| Command | Access |
|---------|--------|
| `/f afly` | Admin fly (internal admin check) |
| `/f taxes` | View own faction tax info (faction member only) |
| `/f admin status` | Uses `cyberfactions.admin` permission |

## Faction Role Permissions

Inside a faction, actions are also gated by **role permissions** configured in `permissions.yml`. These control what members of each role can do within their faction (invite, kick, claim, bank withdraw, etc.).

See the [permissions.yml reference](/configuration/permissions) for the full role permission matrix.

## Relation Permissions

Actions that other factions can perform in your territory (build, break, interact, open containers) are controlled per-relation type in `permissions.yml`.

## Setting Up Permissions

Use any permissions plugin (LuckPerms recommended):

```bash
# Give all basic faction commands to default group
lp group default permission set cyberfactions.create true
lp group default permission set cyberfactions.join true
lp group default permission set cyberfactions.claim true
lp group default permission set cyberfactions.home true
lp group default permission set cyberfactions.fly true

# Admin access
lp group admin permission set cyberfactions.admin true

# Wildcard (all permissions)
lp group admin permission set cyberfactions.* true
```

::: warning
The permission prefix is configurable in `general.yml` under `command.permission_prefix`. If you change it from `cyberfactions.` to something else, all permission nodes change accordingly.
:::

::: tip
By default, OPs have all permissions. For production servers, use a permission plugin and assign permissions explicitly.
:::
