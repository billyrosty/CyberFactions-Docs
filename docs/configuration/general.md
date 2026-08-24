# general.yml

The main configuration file for CyberFactions. Controls plugin-wide settings including command registration, data saving, custom help pages, faction chat channels, the disband wand, and the custom crop growth system.

**Location:** `plugins/CyberFactions/configurations/general.yml`

## Full Configuration

```yaml
general:
  debug: true
  master: true
  server_name: "faction01"
  command:
    name: "f"
    aliases:
      - "cf"
      - "cyberfaction"
      - "cyberfac"
    permissions_prefix: "cyberfactions."
  territory_detection:
    mode: EVENTS
    scheduler_interval: 10
  command_cooldowns:
    list: 3000
    map: 5000
    show: 2000
    top: 5000
  save:
    interval: 5
  help:
    commands_per_page: 15
    custom: false
    pages:
      1:
        - "<dark_gray>..."
      2:
        - "<dark_gray>..."
  chat:
    formats:
      faction:
        format: "<green>[<yellow>%faction_name%<green>] ..."
        spy: "<gray>[<yellow>%faction_name%<gray>] ..."
      ally:
        format: "<dark_purple>[<yellow>%faction_name%<dark_purple>] ..."
        spy: "<gray>[<yellow>%faction_name% - Allies<gray>] ..."
      truce:
        format: "<light_purple>[<yellow>%faction_name%<light_purple>] ..."
        spy: "<gray>[<yellow>%faction_name% - Truces<gray>] ..."
  wand:
    material: "STICK"
    name: "<dark_red><bold>Cancel"
    lore:
      - ""
      - "<gray>┃ Click to cancel the"
      - "<gray>┃ deletion of your faction"
    custom_model_data: 0
    glowing: true
  growing:
    enabled: true
    interval: 600
    chance: 80
    update_interval: 5
    update_amount: 2000
    managed_territories:
      - "faction"
    max_queue_size: 50000
    ignored_crops:
      - NETHER_WART
    sugar_cane_max_height: 8
    cactus_max_height: 5
    blacklisted_worlds:
      - "world_nether"
      - "world_the_end"
    blacklisted_wg_regions:
      - "spawn"
      - "pvp"
    blacklisted_factions:
      - 0
```

## Configuration Reference

### Root Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `general.debug` | boolean | `true` | Enables debug messages in the server console. Set to `false` in production. |
| `general.master` | boolean | `true` | Whether this server is the master faction server. Only the master runs persistent save schedulers. Only relevant in multi-server setups. |
| `general.server_name` | string | `"faction01"` | Unique identifier for this server instance. Must be different on each server in a multi-server network. Used for Redis pub/sub message filtering. |

### Command Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `command.name` | string | `"f"` | The base command name (e.g., `/f create`). |
| `command.aliases` | list | `["cf", "cyberfaction", "cyberfac"]` | Alternative command names that players can use. |
| `command.permissions_prefix` | string | `"cyberfactions."` | Prefix for all permission nodes. For example, the `create` subcommand requires `cyberfactions.create`. |

### Territory Detection

How the plugin notices a player entering or leaving a territory. This drives the territory notification (chat, actionbar, title, sound) and the relation potion effects from `RELATIONS_EFFECTS`.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `territory_detection.mode` | string | `EVENTS` | `EVENTS` or `SCHEDULER`. See below. |
| `territory_detection.scheduler_interval` | integer | `10` | `SCHEDULER` mode only. Ticks between position samples. Lower is more accurate and more costly. |

**`EVENTS` (recommended)** reacts to `PlayerMoveEvent`, `VehicleMoveEvent` (a mounted player generates no move event of their own), `PlayerTeleportEvent` and `PlayerRespawnEvent`. Nothing runs for players standing still, and no territory change can be missed. The listeners exit on three integer comparisons when the player has not changed chunk, so look-only movement costs nothing measurable.

**`SCHEDULER`** samples every online player's position on a timer instead. It is simpler to reason about, but it cannot see a chunk that was crossed between two samples: at the default 10 ticks, a player on an elytra covers almost two chunks per sample and can pass straight through a claim without triggering its notification or its relation effects. It also does constant work for idle players.

::: warning Only switch to SCHEDULER if EVENTS is measurably costing you
`SCHEDULER` trades correctness for a fixed, predictable cost. It is kept as an escape hatch, not as an equivalent alternative.
:::

::: tip Claims that change under a standing player
Neither mode is involved when the ground changes owner beneath a player who has not moved — a claim, an unclaim or an overclaim. That case is handled separately and always applies, in both modes.
:::

### Command Cooldowns

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `command_cooldowns.<subcommand>` | integer | (see above) | Milliseconds a player must wait between two uses of that subcommand. `0` or absent means no cooldown. The key is the subcommand name in lowercase. |

Holders of `cyberfactions.bypass.cooldown` are exempt. That node is **not** granted to operators — see [Permissions](/guide/permissions).

### Save Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `save.interval` | integer | `5` | Minutes between each automatic data save to the database. Lower values reduce data loss risk but increase database load. |

### Help Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `help.commands_per_page` | integer | `15` | Number of commands shown per help page when using auto-generated help. |
| `help.custom` | boolean | `false` | When `true`, uses the manually defined `pages` section instead of auto-generated help. |
| `help.pages` | map | (see above) | Custom help pages using MiniMessage format. Each page is a numbered key containing a list of formatted lines. Supports hover text, click events, and gradients. |

### Chat Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `chat.formats.faction.format` | string | (see above) | Message format seen by faction members in faction chat. |
| `chat.formats.faction.spy` | string | (see above) | Message format seen by admins who are spying on faction chat. |
| `chat.formats.ally.format` | string | (see above) | Message format for ally chat channel. |
| `chat.formats.truce.format` | string | (see above) | Message format for truce chat channel. |

::: tip Custom Chat Channels
You can create additional chat channels by adding new entries under `chat.formats` using any relation ID defined in `relations.yml`. Delete the `faction` entry to disable faction-only chat entirely.
:::

### Wand Settings

The "wand" is the item given to the faction leader during the disband confirmation process.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `wand.material` | string | `"STICK"` | Material type for the cancel wand item. |
| `wand.name` | string | `"<dark_red><bold>Cancel"` | Display name (MiniMessage format). |
| `wand.lore` | list | (see above) | Lore lines displayed on the item. |
| `wand.custom_model_data` | integer | `0` | Custom model data for resource packs. `0` means no custom model. |
| `wand.glowing` | boolean | `true` | Whether the item has an enchantment glow effect. |

### Growing (Custom Crop System)

CyberFactions includes a custom crop growth system that replaces vanilla random tick behavior with a controlled, schedulable growth mechanic.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `growing.enabled` | boolean | `true` | Enable the custom plant growth system. When disabled, vanilla growth applies. |
| `growing.interval` | integer | `600` | Ticks between each growth check cycle (600 ticks = 30 seconds). |
| `growing.chance` | integer | `80` | Percentage chance (0-100) that a plant advances one growth stage per check. |
| `growing.update_interval` | integer | `5` | Ticks between each batch of crop updates within a single growth cycle. |
| `growing.update_amount` | integer | `2000` | Number of plants processed per update batch. Higher values may cause lag spikes. |
| `growing.managed_territories` | list | `["faction"]` | Territories where the custom grow system replaces vanilla. Available: `faction` (player-claimed chunks), `wilderness` (unclaimed), `admin` (safezone/warzone). Vanilla growth is only cancelled inside these territories; everywhere else plants keep growing normally. Warning: only claimed chunks are scanned, so listing `"wilderness"` stops vanilla growth without replacing it. |
| `growing.max_queue_size` | integer | `50000` | Maximum plants waiting to be updated. Above this limit new plants are dropped instead of being queued, protecting memory on big servers. `-1` = no limit. |
| `growing.ignored_crops` | list | `["NETHER_WART"]` | Crops excluded from the custom system (use vanilla growth instead). Valid values: `WHEAT`, `CARROTS`, `POTATOES`, `BEETROOTS`, `SWEET_BERRY_BUSH`, `NETHER_WART`, `COCOA`, `PUMPKIN_STEM`, `MELON_STEM`, `SUGAR_CANE`, `CACTUS`. |
| `growing.sugar_cane_max_height` | integer | `8` | Maximum height sugar cane can grow to. Set to `-1` for no limit. |
| `growing.cactus_max_height` | integer | `5` | Maximum height cactus can grow to. Set to `-1` for no limit. |
| `growing.blacklisted_worlds` | list | `["world_nether", "world_the_end"]` | Worlds where the custom growth system is disabled. |
| `growing.blacklisted_wg_regions` | list | `["spawn", "pvp"]` | WorldGuard regions where crops will not grow. |
| `growing.blacklisted_factions` | list | `[0]` | Faction IDs where crops will not grow (`0` = Wilderness, `1` = Safezone, `2` = Warzone). |

::: warning Performance Considerations
Setting `update_amount` too high or `update_interval` too low can cause server lag. For servers with many farms, increase `interval` and reduce `update_amount`. A good starting point for large servers is `interval: 1200` and `update_amount: 1000`.
:::

::: tip Multi-Server Setup
When running CyberFactions across multiple servers with Redis, ensure only one server has `master: true`. The master server handles scheduled saves and persistent operations. All other servers should set `master: false`.
:::
