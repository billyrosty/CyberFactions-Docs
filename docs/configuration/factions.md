# factions.yml

The core gameplay configuration for factions. Controls faction creation/disbanding behavior, naming rules, the power system, banking, warps, fly mode, PvP settings, AFK management, territory notifications, and more.

**Location:** `configurations/factions.yml`

## Full Configuration

```yaml
factions:
  list:
    faction_per_page: 10
    gui: true
  create:
    delay: 60
    broadcast: true
  disband:
    delay: 60
    broadcast: true
  invite:
    timeout: 60
  name:
    max_length: 16
    min_length: 3
    alphanumeric: true
    force_uppercase: false
    blacklisted_name:
      - "examplehere"
    broadcast: true
  description:
    default: "Aucune description"
    max_length: 64
    min_length: 3
  power:
    start: 2
    min: -10
    max: 10
    per_hour: 100
    per_kill: 0.25
    per_death: -1
    loss_per_day_when_offline: 0.0
    loss_when_offline_limit: 0.0
    worlds_where_power_is_not_lost_when_die:
      - "world"
  bank:
    enabled: true
  upgrade:
    broadcast: true
  warps:
    must_be_in_territory: true
    warmup: 5
  fly:
    enabled: true
    start: 360
    blacklisted_worlds:
      - "world_nether"
      - "world_the_end"
    blacklisted_worldguard_regions:
      - "spawn"
  pvp:
    disabled_worlds:
      - "world_nether"
      - "world_the_end"
  afk:
    auto_leave_enabled: true
    auto_leave_after: 60
    auto_leave_scheduler_interval: 60
    auto_leave_clear_data: true
  garden:
    cost: 1000
  notifications:
    chat:
      enabled: true
      format: "<gray>Entering %faction_name% <gray>- <white>%faction_description%"
    actionbar:
      enabled: true
      format: "<white>%faction_name% <white>- <white>%faction_description%"
    title:
      enabled: true
      title_format: "<white>%faction_name%"
      subtitle_format: "<white>%faction_description%"
    sound:
      enabled: true
      vanilla_sound: "entity.player.attack.nodamage"
      custom_sound:
        namespace: ""
        sound: "custom_sound"
```

## Configuration Reference

### Faction List

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `list.faction_per_page` | integer | `10` | Number of factions displayed per page in `/f list`. |
| `list.gui` | boolean | `true` | If `true`, `/f list` opens a GUI menu instead of sending chat messages. |

### Creation and Disbanding

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `create.delay` | integer | `60` | Cooldown in seconds before a player can create another faction after creating or leaving one. |
| `create.broadcast` | boolean | `true` | Broadcast a server-wide message when a faction is created. |
| `disband.delay` | integer | `60` | Cooldown in seconds before a player can disband their faction (prevents accidental disbands). |
| `disband.broadcast` | boolean | `true` | Broadcast a server-wide message when a faction is disbanded. |

### Invitations

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `invite.timeout` | integer | `60` | Minutes before a faction invitation expires. |

### Faction Naming Rules

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `name.max_length` | integer | `16` | Maximum characters allowed in a faction name. |
| `name.min_length` | integer | `3` | Minimum characters required for a faction name. |
| `name.alphanumeric` | boolean | `true` | If `true`, names may contain letters and numbers. If `false`, only alphabetic characters are allowed. |
| `name.force_uppercase` | boolean | `false` | If `true`, all faction names are forced to uppercase. |
| `name.blacklisted_name` | list | `["examplehere"]` | Names that cannot be used for factions (case-insensitive). |
| `name.broadcast` | boolean | `true` | Broadcast a server-wide message when a faction is renamed. |

### Description

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `description.default` | string | `"Aucune description"` | Default description assigned to newly created factions. |
| `description.max_length` | integer | `64` | Maximum characters for a faction description. |
| `description.min_length` | integer | `3` | Minimum characters required for a faction description. |

### Power System

Power determines how many chunks a faction can claim. Each player contributes their personal power to the faction total.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `power.start` | integer | `2` | Power assigned to a player when they first join the server. |
| `power.min` | integer | `-10` | Minimum power a player can have (can go negative). |
| `power.max` | integer | `10` | Maximum power a player can accumulate. |
| `power.per_hour` | integer | `100` | Power regenerated per hour of online time. |
| `power.per_kill` | double | `0.25` | Power gained per player kill. |
| `power.per_death` | double | `-1` | Power lost per death (use negative values). |
| `power.loss_per_day_when_offline` | double | `0.0` | Power lost per day while the player is offline. Set to `0.0` to disable. |
| `power.loss_when_offline_limit` | double | `0.0` | Maximum total power that can be lost from offline decay. `0.0` means no limit. |
| `power.worlds_where_power_is_not_lost_when_die` | list | `["world"]` | Worlds where dying does not cause power loss. |

::: tip Power Economy
The power system is the backbone of territory control. If a faction's total power drops below its number of claimed chunks, enemies can overclaim their territory. Tune `per_kill`, `per_death`, and `per_hour` to match your server's playstyle.
:::

### Bank

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `bank.enabled` | boolean | `true` | Enable the faction bank system. Players can deposit/withdraw money. |

### Upgrades

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `upgrade.broadcast` | boolean | `true` | Broadcast a message when a faction upgrades to a new level. |

### Warps

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `warps.must_be_in_territory` | boolean | `true` | Players must stand in their faction's territory to set a warp. |
| `warps.warmup` | integer | `5` | Seconds of warmup before teleporting to a warp. Moving cancels the teleport. |

### Fly System

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `fly.enabled` | boolean | `true` | Enable the `/f fly` command. |
| `fly.start` | integer | `360` | Default fly time in seconds given to new players. |
| `fly.blacklisted_worlds` | list | `["world_nether", "world_the_end"]` | Worlds where faction fly is disabled. |
| `fly.blacklisted_worldguard_regions` | list | `["spawn"]` | WorldGuard regions where faction fly is disabled. |

::: tip Fly Time
Fly time is consumed in real-time while a player is flying. Admins can add fly time using `/f afly give <player> <seconds>`. The `ALLOWED_FLY` property in upgrades controls which relation territories a player may fly in.
:::

### PvP Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `pvp.disabled_worlds` | list | `["world_nether", "world_the_end"]` | Worlds where all PvP is disabled regardless of faction relations. |

### AFK / Inactivity System

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `afk.auto_leave_enabled` | boolean | `true` | Automatically remove inactive players from their faction. |
| `afk.auto_leave_after` | integer | `60` | Days of inactivity before a player is removed. |
| `afk.auto_leave_scheduler_interval` | integer | `60` | Minutes between each inactivity check. |
| `afk.auto_leave_clear_data` | boolean | `true` | If `true`, also clears the player's faction data from the database upon auto-leave. |

### Garden

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `garden.cost` | integer | `1000` | Cost (from faction bank) to create a faction garden. |

### Territory Notifications

Controls what players see when entering a faction's territory.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `notifications.chat.enabled` | boolean | `true` | Send a chat message when entering territory. |
| `notifications.chat.format` | string | (see above) | Chat message format. Supports `%faction_name%` and `%faction_description%`. |
| `notifications.actionbar.enabled` | boolean | `true` | Show an action bar message when entering territory. |
| `notifications.actionbar.format` | string | (see above) | Action bar format. |
| `notifications.title.enabled` | boolean | `true` | Show a title/subtitle when entering territory. |
| `notifications.title.title_format` | string | `"%faction_name%"` | Title text format. |
| `notifications.title.subtitle_format` | string | `"%faction_description%"` | Subtitle text format. |
| `notifications.sound.enabled` | boolean | `true` | Play a sound when entering territory. |
| `notifications.sound.vanilla_sound` | string | `"entity.player.attack.nodamage"` | Vanilla Minecraft sound to play. Leave blank to disable. |
| `notifications.sound.custom_sound.namespace` | string | `""` | Resource pack sound namespace. Leave blank to disable custom sounds. |
| `notifications.sound.custom_sound.sound` | string | `"custom_sound"` | Resource pack sound key. |

::: warning Notification Spam
If you enable all notification types simultaneously (chat, actionbar, title, sound), players may find it overwhelming when moving between territories. Consider enabling only one or two notification methods.
:::
