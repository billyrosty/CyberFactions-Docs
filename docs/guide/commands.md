# Commands

The main command is `/f` (configurable in `general.yml`). All 48 subcommands are listed below, grouped by category.

## Player Commands

Core faction management commands available to all players.

| Command | Description |
|---------|-------------|
| `/f create <name>` | Create a new faction |
| `/f disband` | Disband your faction (opens confirmation menu, owner only) |
| `/f join <faction>` | Join a faction (by name or player name) |
| `/f leave` | Leave your current faction |
| `/f invite <player>` | Invite a player to your faction |
| `/f kick <player>` | Kick a member from your faction |
| `/f promote <player>` | Promote a member to the next role |
| `/f demote <player>` | Demote a member to the previous role |
| `/f show [faction]` | Show faction info (yours if no argument) |
| `/f list [page]` | List all factions sorted by online members |
| `/f members` | Open the faction members GUI |
| `/f desc [text]` | View (no args) or set faction description |
| `/f rename <name>` | Rename your faction |
| `/f power` | View your personal and faction power |
| `/f permissions` | Open the faction permissions editor GUI |

## Territory Commands

Claiming, unclaiming, homes, warps, and territory access.

| Command | Description |
|---------|-------------|
| `/f claim` | Claim the chunk you are standing on |
| `/f claim radius <n>` | Claim chunks in a square radius around you |
| `/f claim line <n>` | Claim chunks in a line in the direction you face |
| `/f claim show` | Toggle claim border particle display |
| `/f unclaim` | Unclaim the chunk you are standing on |
| `/f unclaimall` | Unclaim all of your faction's territory |
| `/f map` | Display the faction chunk map |
| `/f access <grant\|revoke\|list> [player]` | Manage territory access for external players |
| `/f sethome` | Set faction home at your location (must be in own territory) |
| `/f delhome` | Delete faction home |
| `/f home` | Teleport to faction home |
| `/f setwarp <name> [password]` | Set a faction warp (optional password protection) |
| `/f delwarp <name>` | Delete a faction warp |
| `/f warp <name> [password]` | Teleport to a faction warp |
| `/f warps` | List all faction warps |
| `/f setcore` | Set faction core at your location (must be in own territory) |
| `/f delcore` | Delete faction core |
| `/f core` | View core status (health, level, skin, effects, cooldowns) |

## Economy & Progression

Bank, upgrades, chests, taxes, and rankings.

| Command | Description |
|---------|-------------|
| `/f bank` | View faction bank balance |
| `/f bank deposit <amount>` | Deposit money into faction bank |
| `/f bank withdraw <amount>` | Withdraw money from faction bank |
| `/f upgrade` | Upgrade faction to the next level (checks requirements) |
| `/f chest [number]` | Open a faction chest (defaults to chest 1) |
| `/f chests` | List all available faction chests |
| `/f taxes` | View current tax breakdown and debt status |
| `/f top [page]` | View faction top ranking (GUI or chat) |
| `/f quests` | Open the faction quests GUI |

## Social Commands

Chat, relations, and spy mode.

| Command | Description |
|---------|-------------|
| `/f chat [mode]` | Switch chat mode (cycles through configured modes if no arg) |
| `/f spychat` | Toggle spy mode to see all faction chats |
| `/f relation <type> <faction>` | Set or request a relation with another faction |
| `/f relations [faction]` | View relations list (yours if no argument) |

## Defense Commands

Fly and shield management.

| Command | Description |
|---------|-------------|
| `/f fly` | Toggle faction fly on/off |
| `/f fly time` | View remaining fly time |
| `/f shield set <slot>` | Set your faction's shield time slot (owner only) |
| `/f shield info` | View shield status and schedule |
| `/f shield remove` | Remove your faction's shield slot (owner only) |

## Admin Commands

Requires permission: `cyberfactions.admin`

| Command | Description |
|---------|-------------|
| `/f admin bypass` | Toggle admin bypass mode |
| `/f admin claim <faction>` | Force claim current chunk for a faction |
| `/f admin unclaim` | Force unclaim current chunk |
| `/f admin autoclaim [faction]` | Toggle admin auto-claim (no arg to disable) |
| `/f admin weclaim <faction>` | Claim WorldEdit selection for a faction |
| `/f admin quests <faction> check` | Force check faction quests |
| `/f admin taxes <faction> reset` | Reset tax debt for a faction |
| `/f admin taxes collect` | Force an immediate tax collection server-wide, ignoring the once-a-day lock |
| `/f admin core <faction> refresh` | Force-refresh a faction's core entity (respawn + re-dig sphere) |
| `/f admin shield give <faction> <hours>` | Give temporary shield to a faction |
| `/f admin status` | Display full plugin diagnostics |
| `/f admin inspect <faction/player> <name>` | Show what memory, the Redis cache and MySQL each hold |
| `/f admin sync <faction/player> <name>` | Push MySQL back over the cache and the other servers |
| `/f admin sync all` | Same, for every faction and player |
| `/f afly <give\|take\|set> <player> <amount>` | Manage a player's fly time balance |
| `/f points <give\|take\|set> <faction> <amount>` | Manage manual ranking points for a faction |
| `/f reload` | Reload all configuration files |

### Stress Testing

Requires permission: `cyberfactions.admin.stress`

| Command | Description |
|---------|-------------|
| `/f stress factions <n>` | Create n fake factions |
| `/f stress players <n>` | Create n fake players |
| `/f stress claims <n>` | Create n fake claims around you |
| `/f stress lookup <n>` | Perform n chunk lookups (performance test) |
| `/f stress redis <n>` | Send n Redis messages (throughput test) |
| `/f stress mutate <n>` | Run n CAS mutations (contention test) |
| `/f stress save` | Force save all data and measure time |
| `/f stress reload` | Reload all configs and measure time |
| `/f stress clear` | Remove all stress-generated test data |
| `/f stress check` | Run data integrity check |
| `/f stress status` | Show current memory/data stats |

## Permissions

All permissions use the prefix configured in `general.yml` (default: `cyberfactions.`).

| Permission | Description |
|------------|-------------|
| `cyberfactions.create` | Create a faction |
| `cyberfactions.claim` | Claim territory |
| `cyberfactions.fly` | Use faction fly |
| `cyberfactions.top` | View faction top |
| `cyberfactions.admin` | Access admin commands |
| `cyberfactions.admin.stress` | Access stress test commands |
| `cyberfactions.bypass.warmup` | Skip teleportation warmup |

::: tip
Individual commands can be toggled per-role in `roles.yml` and per-relation in `permissions.yml`.
:::
