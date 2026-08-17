# core.yml

Configures the faction Core system — a destructible entity placed in faction territory that serves as a strategic raid objective. When destroyed, the faction enters a vulnerability window. Cores regenerate over time, project effects, and are protected by an impenetrable sphere.

**Location:** `configurations/gameplay/core.yml`

## Full Configuration

```yaml
core:
  enabled: true
  type: ENTITY #MODEL_ENGINE
  values:
    default: "ZOMBIE"
    sheep: "SHEEP"
    pig: "PIG"
    end_crystal: "END_CRYSTAL"
  skins_by_level:
    1: "default"
  #  5: "sheep"
  #  10: "end_crystal"
  protection_radius: 4
  move_delay: 3600
  messages:
    attack:
      enabled: true
      interval: 60
    destroy:
      enabled: true
    regen:
      enabled: true
  hologram:
    enabled: true
    alive:
      - "<gradient:#89E0FB:#B41AFD><bold>%faction%</bold></gradient>"
      - "<green>❤ %health%"
    dead:
      - "<gradient:#89E0FB:#B41AFD><bold>%faction%</bold></gradient>"
      - "<red>💀 Destroyed"
    height_adjustment: 2.5
    background_color: "40000000"
    shadow: true
    billboard: CENTER
    see_through: false
    line_width: 200
    scale: 1.0
  regen:
    enabled: true
    delay: 1200
    amount: 5
    per_kill: 5
    per_death: -5
  destroy:
    duration: 60
  damage:
    enabled: true
    type: "CUSTOM"
    custom_damage: 1
    relations_that_can_damage:
      - "ENEMY"
      - "NEUTRAL"
    batching:
      enabled: true
      flush_interval: 10
  siege:
    enabled: true
    alert_radius: 64
    end_after: 60
    block_move: true
    alert_sound: "BLOCK_BELL_USE"
    bossbar:
      enabled: true
      format: "<red>Siege</red> <gray>| <white>%faction%</white> <gray>| <red>❤ %health%/%max_health%"
      color: "RED"
      style: "SEGMENTED_10"
    rate_limit:
      enabled: true
      core_hits_per_second: 1
      player_hits_per_second: 2
      faction_damage_per_second: 20
  vulnerability:
    enabled: true
    duration: 1800
    free_overclaim: true
    power_loss_multiplier: 2.0
    enemy_chest_access: false
    block_regen: false
    bossbar:
      enabled: true
      format: "<gold>Vulnerable</gold> <gray>| <white>%faction%</white> <gray>| <yellow>%remaining%"
      color: "YELLOW"
      style: "SOLID"
  effects:
    enabled: true
    interval: 100
    revert_delay: 10
    revert_max_blocks: 2000
  particles:
    enabled: true
    damage: "DAMAGE_INDICATOR"
    regen: "HEART"
    max_count: 12
  discord:
    embed:
      attack:
        enabled: true
        title: "Core Attacked"
        thumbnail: "https://i.imgur.com/1Q7Q8Q6.png"
        description: "The core of your faction is **currently attacked** by **%faction%** \n\n**Core Health:** %health% ❤️"
        footer: "Come on and defend !"
        footer_icon: "https://i.imgur.com/1Q7Q8Q6.png"
        color: "0xff0000"
      destroy:
        enabled: true
        title: "Core Destroyed"
        thumbnail: "https://i.imgur.com/1Q7Q8Q6.png"
        description: "The core of your faction has been destroyed by %faction%"
        footer: "Come on and rebuild !"
        footer_icon: "https://i.imgur.com/1Q7Q8Q6.png"
        color: "0xff0000"
```

## Configuration Reference

### General Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `core.enabled` | boolean | `true` | Enable or disable the core system globally. |
| `core.type` | string | `"ENTITY"` | Core display type. `ENTITY` uses a Minecraft mob. `MODEL_ENGINE` uses ModelEngine custom models (soft dependency — falls back to entity if ME is absent). |
| `core.values` | map | (see above) | Available core skins. Keys are skin IDs, values are entity types (for `ENTITY` mode) or ModelEngine model IDs (for `MODEL_ENGINE` mode). |
| `core.protection_radius` | integer | `4` | Default radius in blocks of the sphere kept clear around the core. Overridden by the `CORE_RADIUS` upgrade property when defined. Nothing can be placed inside this sphere. |
| `core.move_delay` | integer | `3600` | Cooldown in seconds before a core can be relocated. Also resets when the core is attacked. |

### Skins by Level

The `skins_by_level` map ties core appearance to faction level. A faction inherits the closest skin at or below its level.

```yaml
skins_by_level:
  1: "default"    # Levels 1-4 use "default"
  5: "sheep"      # Levels 5-9 use "sheep"
  10: "end_crystal" # Level 10+ use "end_crystal"
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `skins_by_level` | map (int → string) | `{1: "default"}` | Maps faction level thresholds to skin IDs from `values`. The closest key ≤ faction level is used. Levels below the first entry fall back to `"default"`. |

::: tip Level-Driven Cosmetics
Skins are a reward for progression. A level 1 faction gets the basic zombie; reaching level 10 earns a flashy end crystal (or custom ModelEngine model). This cannot be overridden manually — the level decides.
:::

### Notification Messages

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `messages.attack.enabled` | boolean | `true` | Notify faction members when their core is under attack. |
| `messages.attack.interval` | integer | `60` | Minimum seconds between attack notifications (prevents spam). |
| `messages.destroy.enabled` | boolean | `true` | Notify faction members when their core is destroyed. |
| `messages.regen.enabled` | boolean | `true` | Notify faction members when their core fully regenerates. |

### Hologram Display

Uses a TextDisplay entity (no external plugin required).

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `hologram.enabled` | boolean | `true` | Display a TextDisplay above the core showing status. |
| `hologram.alive` | list | (see above) | Lines shown when the core is alive. Supports `%faction%` and `%health%` placeholders. MiniMessage format. |
| `hologram.dead` | list | (see above) | Lines shown when the core is destroyed. |
| `hologram.height_adjustment` | double | `2.5` | Vertical offset above the core entity. |
| `hologram.background_color` | string | `"40000000"` | ARGB hex background color for the text display. |
| `hologram.shadow` | boolean | `true` | Whether text has a shadow. |
| `hologram.billboard` | string | `"CENTER"` | Billboard mode: `CENTER`, `FIXED`, `HORIZONTAL`, `VERTICAL`. |
| `hologram.see_through` | boolean | `false` | Whether the text is visible through blocks. |
| `hologram.line_width` | integer | `200` | Maximum line width in pixels before wrapping. |
| `hologram.scale` | double | `1.0` | Scale multiplier for the text display. |

### Regeneration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `regen.enabled` | boolean | `true` | Enable automatic core health regeneration. |
| `regen.delay` | integer | `1200` | Ticks between each regeneration tick (1200 = 60 seconds). |
| `regen.amount` | integer | `5` | Health points regenerated per tick. |
| `regen.per_kill` | integer | `5` | Bonus health when a faction member kills an enemy. |
| `regen.per_death` | integer | `-5` | Health lost when a faction member dies (negative = loss). |

::: info Siege Blocking
Regeneration is paused while the faction is under active siege. The core cannot heal mid-fight.
:::

### Destruction

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `destroy.duration` | integer | `60` | Seconds the core remains in "dead" state before passive regen can revive it. |

### Damage Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `damage.enabled` | boolean | `true` | Enable core damage mechanics. |
| `damage.type` | string | `"CUSTOM"` | Damage calculation mode. `CUSTOM` uses the fixed value. `NORMAL` uses weapon damage. |
| `damage.custom_damage` | integer | `1` | Fixed damage per hit (only when `type` is `CUSTOM`). |
| `damage.relations_that_can_damage` | list | `["ENEMY", "NEUTRAL"]` | Relations allowed to damage the core. Must match relation IDs from `relations.yml`. |

#### Damage Batching

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `damage.batching.enabled` | boolean | `true` | Accumulate hits in memory, flush periodically. Reduces storage writes during assaults. |
| `damage.batching.flush_interval` | integer | `10` | Ticks between flushes to storage. Lower = more consistent cross-server sync. Higher = less DB load. |

### Siege

The siege system tracks active assaults, provides real-time feedback to both sides, and rate-limits damage to prevent instant destruction.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `siege.enabled` | boolean | `true` | Enable the siege system. When disabled, damage still works but without bossbar/alerts/rate-limit. |
| `siege.alert_radius` | integer | `64` | Players within this distance of the core see the siege bossbar. `0` = faction members only. |
| `siege.end_after` | integer | `60` | Seconds without damage before the siege ends. |
| `siege.block_move` | boolean | `true` | Block `/f setcore` and `/f delcore` during siege. |
| `siege.alert_sound` | string | `"BLOCK_BELL_USE"` | Sound played to defenders when the siege begins. Empty string disables. |

#### Siege Bossbar

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `siege.bossbar.enabled` | boolean | `true` | Show a bossbar during the siege. |
| `siege.bossbar.format` | string | (see above) | Bossbar text. Supports `%faction%`, `%health%`, `%max_health%`. MiniMessage format. |
| `siege.bossbar.color` | string | `"RED"` | Bossbar color: `BLUE`, `GREEN`, `PINK`, `PURPLE`, `RED`, `WHITE`, `YELLOW`. |
| `siege.bossbar.style` | string | `"SEGMENTED_10"` | Bossbar style: `SOLID`, `SEGMENTED_6`, `SEGMENTED_10`, `SEGMENTED_12`, `SEGMENTED_20`. |

#### Rate Limiting

Three independent layers. A hit must clear **all three** to count. Setting any value to `0` disables that layer.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `siege.rate_limit.enabled` | boolean | `true` | Enable rate limiting. |
| `siege.rate_limit.core_hits_per_second` | integer | `1` | Total hits the core accepts per second, regardless of source. This is the hard floor on time-to-kill. Set to `1` to make attacker count irrelevant. |
| `siege.rate_limit.player_hits_per_second` | integer | `2` | Maximum hits a single player can land per second. Stops macro abuse. |
| `siege.rate_limit.faction_damage_per_second` | integer | `20` | Total damage one attacking faction may deal per second. Caps the damage of a whole faction. |

::: tip TTK Formula
With `core_hits_per_second: 1` and `custom_damage: 1`:
- **Time to kill** = `CORE_HEALTH` seconds (1000 HP = ~17 minutes)
- Raising `core_hits_per_second` lets numbers matter again
- `faction_damage_per_second` caps how fast a zerg can burn through HP
:::

### Vulnerability

The raid window that opens when a core is destroyed. Every effect is an independent toggle.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `vulnerability.enabled` | boolean | `true` | Enable the vulnerability window. |
| `vulnerability.duration` | integer | `1800` | Window duration in seconds (1800 = 30 minutes). |
| `vulnerability.free_overclaim` | boolean | `true` | Enemies can overclaim regardless of the defender's power. |
| `vulnerability.power_loss_multiplier` | double | `2.0` | Multiplier on power lost per death. `1.0` disables. |
| `vulnerability.enemy_chest_access` | boolean | `false` | Enemies in faction territory can open `/f chest`. |
| `vulnerability.block_regen` | boolean | `false` | Core cannot regenerate during the window. |

#### Vulnerability Bossbar

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `vulnerability.bossbar.enabled` | boolean | `true` | Show a bossbar during the vulnerability window. |
| `vulnerability.bossbar.format` | string | (see above) | Bossbar text. Supports `%faction%`, `%remaining%`. |
| `vulnerability.bossbar.color` | string | `"YELLOW"` | Bossbar color. |
| `vulnerability.bossbar.style` | string | `"SOLID"` | Bossbar style. |

### Core Effects

Drives the `CORE_EFFECTS` upgrade property defined in `upgrades.yml`. Effects are configured per-relation (e.g., `enemy: [GLOWING:1]`, `self: [FORCE_BOOST:2]`).

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `effects.enabled` | boolean | `true` | Enable the core effects system. |
| `effects.interval` | integer | `100` | Ticks between effect application (for ticked effects like GLOWING, FORCE_BOOST, PROJECTION). |
| `effects.revert_delay` | integer | `10` | Seconds before an exploded block inside the radius is restored (for REVERT effect). |
| `effects.revert_max_blocks` | integer | `2000` | Maximum pending blocks in the revert queue. Prevents memory issues from cannon barrages. |

#### Available Effect Types

| Type | Ticked | Description |
|------|--------|-------------|
| `PROJECTION` | Yes | Particle ring around the core. Value = radius. |
| `GLOWING` | Yes | Applies Glowing to targets in the radius. Value = amplifier. |
| `FORCE_BOOST` | Yes | Applies Strength to targets in the radius. Value = amplifier. |
| `REVERT` | No | Restores exploded blocks after a delay. Value = delay override (seconds). |

### Particles

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `particles.enabled` | boolean | `true` | Enable particles on core damage and regen. |
| `particles.damage` | string | `"DAMAGE_INDICATOR"` | Particle type spawned when the core takes damage. Must be a valid `Particle` enum name. |
| `particles.regen` | string | `"HEART"` | Particle type spawned when the core regenerates. |
| `particles.max_count` | integer | `12` | Maximum particle count per event. |

### Discord Integration

Sends embedded messages to your Discord server via DiscordSRV when core events occur.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `discord.embed.attack.enabled` | boolean | `true` | Send Discord notification when core is attacked. |
| `discord.embed.attack.title` | string | `"Core Attacked"` | Embed title. |
| `discord.embed.attack.description` | string | (see above) | Embed body. Supports `%faction%` and `%health%`. |
| `discord.embed.attack.color` | string | `"0xff0000"` | Embed sidebar color in hex. |
| `discord.embed.destroy.enabled` | boolean | `true` | Send Discord notification when core is destroyed. |
| `discord.embed.destroy.title` | string | `"Core Destroyed"` | Embed title. |
| `discord.embed.destroy.description` | string | (see above) | Embed body. Supports `%faction%`. |

::: warning Core Health and Upgrades
The core's maximum health is defined in `upgrades.yml` under the `CORE_HEALTH` property. Ensure your `regen.amount`, `destroy.duration`, and `rate_limit` values are balanced relative to the core's max health and the siege experience you want.
:::

::: tip Strategic Balance
The core system creates layered strategic gameplay:
1. **Siege** — Real-time assault with feedback for both sides
2. **Rate limiting** — Prevents zerging; rewards sustained commitment
3. **Vulnerability** — Payoff for attackers, consequences for defenders
4. **Effects** — Home advantage for defenders standing near their core
5. **Protection sphere** — Cores cannot be buried or blocked off
:::
