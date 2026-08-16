# top.yml

Configures the Faction Top (FTop) ranking system. Calculates faction wealth based on placed blocks, spawners, bank balance, and other factors. Includes anti-abuse protection, value decay for inactive factions, seasonal resets, and integrations with DecentHolograms and DiscordSRV.

**Location:** `configurations/social/top.yml`

## Full Configuration

```yaml
config-version: 1

top:
  enabled: true
  calculation-interval: 300

  categories:
    blocks:
      enabled: true
    spawners:
      enabled: true
    bank:
      enabled: true
      ratio: 1.0
    claims:
      enabled: false
      price-per-claim: 1000
    members:
      enabled: false
      price-per-member: 500
    core:
      enabled: false
      bonus-if-placed: 5000
    kills:
      enabled: false
      price-per-kill: 100
    deaths:
      enabled: false
      price-per-death: -50
    manual:
      enabled: true

  block-prices:
    DIAMOND_BLOCK: 500
    EMERALD_BLOCK: 600
    NETHERITE_BLOCK: 2000
    GOLD_BLOCK: 300
    IRON_BLOCK: 100
    LAPIS_BLOCK: 80
    REDSTONE_BLOCK: 50
    COAL_BLOCK: 20
    COPPER_BLOCK: 30
    AMETHYST_BLOCK: 150
    QUARTZ_BLOCK: 40
    OBSIDIAN: 60

  spawner-prices:
    IRON_GOLEM: 50000
    BLAZE: 20000
    ZOMBIE_PIGLIN: 15000
    SKELETON: 10000
    CREEPER: 8000
    SPIDER: 5000
    ZOMBIE: 3000
    ENDERMAN: 12000
    WITCH: 18000
    CAVE_SPIDER: 6000
    SILVERFISH: 2000
    GUARDIAN: 25000
    MAGMA_CUBE: 7000
    SLIME: 7000
    PIG: 1000
    COW: 1000
    SHEEP: 1000
    CHICKEN: 800
    RABBIT: 800
    VILLAGER: 15000

  anti-abuse:
    enabled: true
    max-per-player-per-hour: 500
    velocity-threshold: 30
    velocity-window-seconds: 10
    velocity-action: BOTH

  decay:
    enabled: false
    inactivity-hours: 48
    percentage-per-day: 2.0
    minimum-value: 0

  seasons:
    enabled: false
    type: MONTHLY
    custom-days: 30
    rewards:
      enabled: false
      top-count: 3
      commands:
        1:
          - "eco give %faction_owner% 10000"
          - "broadcast &6[FTop] &e%faction% won season #1!"
        2:
          - "eco give %faction_owner% 5000"
        3:
          - "eco give %faction_owner% 2500"

  display:
    gui:
      enabled: true
      title: "<gradient:#89E0FB:#B41AFD>Faction Top</gradient>"
      size: 54
      factions-per-page: 10
    chat:
      header: "<gray><st>                    </st> <gradient:#89E0FB:#B41AFD><bold>Faction Top</bold></gradient> <gray><st>                    </st>"
      entry: "<gray>%rank%. %relation_color%%faction% <dark_gray>- <white>%value%$"
      footer: "<gray><st>                                                            </st>"
      self: "<newline><gray>Your faction: <white>#%self_rank% <dark_gray>- <white>%self_value%$"
      factions-per-page: 10
    show-rank-change: true

  hologram:
    enabled: false
    location:
      world: "world"
      x: 0.5
      y: 70.0
      z: 0.5
    lines:
      - "<gradient:#89E0FB:#B41AFD><bold>★ Faction Top ★</bold></gradient>"
      - ""
      - "<gold>#1 <white>%top_1_name% <gray>- <green>%top_1_value%$"
      - "<silver>#2 <white>%top_2_name% <gray>- <green>%top_2_value%$"
      - "<#cd7f32>#3 <white>%top_3_name% <gray>- <green>%top_3_value%$"
      - "<gray>#4 <white>%top_4_name% <gray>- <green>%top_4_value%$"
      - "<gray>#5 <white>%top_5_name% <gray>- <green>%top_5_value%$"
    update-interval: 300

  discord:
    enabled: false
    channel-id: "000000000000000000"
    update-interval: 600
    embed-color: "#89E0FB"
    top-count: 10
```

## Configuration Reference

### General

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `top.enabled` | boolean | `true` | Enable or disable the FTop system. |
| `top.calculation-interval` | integer | `300` | Seconds between recalculations of faction values. Lower = more real-time but higher CPU usage. |

### Categories

Each category contributes to the total faction value and can be independently toggled.

| Category | Default | Description |
|----------|---------|-------------|
| `blocks` | enabled | Value of placed blocks in claimed territory. |
| `spawners` | enabled | Value of spawners placed in territory. |
| `bank` | enabled | Faction bank balance (multiplied by `ratio`). |
| `claims` | disabled | Value per claimed chunk. |
| `members` | disabled | Value per faction member. |
| `core` | disabled | Bonus value if faction has a placed core. |
| `kills` | disabled | Value per faction kill. |
| `deaths` | disabled | Negative value per faction death. |
| `manual` | enabled | Manually assigned values (via admin commands or API). |

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `categories.bank.ratio` | double | `1.0` | Multiplier for bank balance contribution. Set to `0.5` to count only half. |
| `categories.claims.price-per-claim` | integer | `1000` | Value added per claimed chunk. |
| `categories.members.price-per-member` | integer | `500` | Value added per member. |
| `categories.core.bonus-if-placed` | integer | `5000` | Flat bonus if the faction has a core placed. |
| `categories.kills.price-per-kill` | integer | `100` | Value added per kill. |
| `categories.deaths.price-per-death` | integer | `-50` | Value subtracted per death (use negative). |

### Block Prices

Map of material names to their value. Only blocks placed in claimed territory are counted.

| Block | Default Value |
|-------|--------------|
| `DIAMOND_BLOCK` | $500 |
| `EMERALD_BLOCK` | $600 |
| `NETHERITE_BLOCK` | $2,000 |
| `GOLD_BLOCK` | $300 |
| `IRON_BLOCK` | $100 |
| `LAPIS_BLOCK` | $80 |
| `REDSTONE_BLOCK` | $50 |
| `COAL_BLOCK` | $20 |
| `COPPER_BLOCK` | $30 |
| `AMETHYST_BLOCK` | $150 |
| `QUARTZ_BLOCK` | $40 |
| `OBSIDIAN` | $60 |

### Spawner Prices

Map of entity types to their spawner value.

| Entity Type | Default Value |
|-------------|--------------|
| `IRON_GOLEM` | $50,000 |
| `GUARDIAN` | $25,000 |
| `BLAZE` | $20,000 |
| `WITCH` | $18,000 |
| `ZOMBIE_PIGLIN` | $15,000 |
| `VILLAGER` | $15,000 |
| `ENDERMAN` | $12,000 |
| `SKELETON` | $10,000 |
| `CREEPER` | $8,000 |
| `MAGMA_CUBE` | $7,000 |
| `SLIME` | $7,000 |
| `CAVE_SPIDER` | $6,000 |
| `SPIDER` | $5,000 |
| `ZOMBIE` | $3,000 |
| `SILVERFISH` | $2,000 |
| `PIG` / `COW` / `SHEEP` | $1,000 |
| `CHICKEN` / `RABBIT` | $800 |

### Anti-Abuse System

Prevents players from rapidly placing/breaking blocks to manipulate FTop value.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `anti-abuse.enabled` | boolean | `true` | Enable anti-abuse detection. |
| `anti-abuse.max-per-player-per-hour` | integer | `500` | Maximum blocks of a single material type a player can place per hour before being flagged. `0` = disabled. |
| `anti-abuse.velocity-threshold` | integer | `30` | Number of same-block place/break actions within the time window that triggers a flag. |
| `anti-abuse.velocity-window-seconds` | integer | `10` | Time window in seconds for velocity detection. |
| `anti-abuse.velocity-action` | string | `"BOTH"` | Action when flagged. `WARN` = notify admins, `BLOCK` = prevent the action, `BOTH` = both. |

### Value Decay

Reduces faction value over time when no members are active.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `decay.enabled` | boolean | `false` | Enable value decay for inactive factions. |
| `decay.inactivity-hours` | integer | `48` | Hours with no member online before decay begins. |
| `decay.percentage-per-day` | double | `2.0` | Percentage of total value lost per day of inactivity. |
| `decay.minimum-value` | integer | `0` | Floor value -- decay stops when the faction reaches this. |

### Seasonal Resets

Periodically resets FTop values and optionally rewards top factions.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `seasons.enabled` | boolean | `false` | Enable seasonal resets. |
| `seasons.type` | string | `"MONTHLY"` | Reset interval. Options: `WEEKLY`, `MONTHLY`, `CUSTOM`. |
| `seasons.custom-days` | integer | `30` | Days between resets (only used when `type: CUSTOM`). |
| `seasons.rewards.enabled` | boolean | `false` | Give rewards to top factions on reset. |
| `seasons.rewards.top-count` | integer | `3` | Number of top factions that receive rewards. |
| `seasons.rewards.commands` | map | (see above) | Commands executed per rank. Supports `%faction%`, `%faction_owner%`, `%rank%`, `%value%`. |

### Display Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `display.gui.enabled` | boolean | `true` | Show FTop as a GUI menu (via `/f top`). |
| `display.gui.title` | string | (gradient) | GUI title in MiniMessage format. |
| `display.gui.size` | integer | `54` | GUI inventory size (must be multiple of 9). |
| `display.gui.factions-per-page` | integer | `10` | Factions shown per page. |
| `display.chat.factions-per-page` | integer | `10` | Factions shown per page in chat fallback. |
| `display.show-rank-change` | boolean | `true` | Show arrows indicating rank movement since last calculation. |

### Hologram Integration

Requires DecentHolograms plugin.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `hologram.enabled` | boolean | `false` | Enable FTop hologram in the world. |
| `hologram.location` | object | (see above) | World and coordinates for the hologram. |
| `hologram.lines` | list | (see above) | Hologram text lines. Supports `%top_N_name%` and `%top_N_value%` placeholders. |
| `hologram.update-interval` | integer | `300` | Seconds between hologram updates. |

### Discord Integration

Requires DiscordSRV plugin.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `discord.enabled` | boolean | `false` | Post FTop leaderboard to a Discord channel. |
| `discord.channel-id` | string | `"000..."` | Discord channel ID to post in. |
| `discord.update-interval` | integer | `600` | Seconds between Discord post updates. |
| `discord.embed-color` | string | `"#89E0FB"` | Embed sidebar color (hex). |
| `discord.top-count` | integer | `10` | Number of factions to display. |

::: tip Adding Custom Block Prices
To add a new block to the value calculation, simply add a new entry to `block-prices`:
```yaml
block-prices:
  ANCIENT_DEBRIS: 3000
  BEACON: 10000
```
Only blocks placed in claimed faction territory are counted.
:::

::: warning Anti-Abuse Tuning
The default `velocity-threshold: 30` in `velocity-window-seconds: 10` means a player placing more than 30 of the same block type in 10 seconds gets flagged. If you have players with fast-place plugins or permissions, you may need to increase the threshold.
:::
