# core.yml

Configures the faction Core system -- a destructible entity placed in faction territory that serves as a strategic objective. When destroyed, the faction suffers penalties such as bank robbery. Cores regenerate over time and can be protected by upgrades.

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
      - "<light_purple>Core of <yellow><bold>%faction%"
      - ""
      - "<gray>Health: <red>%cfac_faction_core_health_{faction_id}%"
    dead:
      - "<light_purple>Core of <yellow><bold>%faction%"
      - ""
      - "<gray>Destroyed"
    height_adjustment: 4.2
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
  discord:
    embed:
      attack:
        enabled: true
        title: "Core Attacked"
        thumbnail: "https://i.imgur.com/1Q7Q8Q6.png"
        description: "The core of your faction is **currently attacked** by **%faction%** \n\n**Core Health:** %health%"
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
| `core.type` | string | `"ENTITY"` | Core display type. `ENTITY` uses a Minecraft mob entity. `MODEL_ENGINE` uses ModelEngine custom models (requires ModelEngine plugin). |
| `core.values` | map | (see above) | Available core skins. Keys are skin IDs, values are entity types (for `ENTITY` mode) or ModelEngine model IDs (for `MODEL_ENGINE` mode). |
| `core.protection_radius` | integer | `4` | Radius in blocks around the core where special protection rules apply. |
| `core.move_delay` | integer | `3600` | Cooldown in seconds before a faction can relocate their core. |

### Core Skins

The `values` map defines available core appearances:

```yaml
values:
  default: "ZOMBIE"     # Default skin - Zombie entity
  sheep: "SHEEP"        # Sheep entity
  pig: "PIG"            # Pig entity
  end_crystal: "END_CRYSTAL"  # End Crystal entity
```

::: tip Custom Models
When `type` is set to `MODEL_ENGINE`, the values should reference ModelEngine model IDs instead of entity types. This allows fully custom 3D models for faction cores.
:::

### Notification Messages

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `messages.attack.enabled` | boolean | `true` | Notify faction members when their core is under attack. |
| `messages.attack.interval` | integer | `60` | Minimum seconds between attack notifications (prevents spam). |
| `messages.destroy.enabled` | boolean | `true` | Notify faction members when their core is destroyed. |
| `messages.regen.enabled` | boolean | `true` | Notify faction members when their core fully regenerates. |

### Hologram Display

Requires the DecentHolograms plugin to be installed.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `hologram.enabled` | boolean | `true` | Display a hologram above the core showing its status. |
| `hologram.alive` | list | (see above) | Hologram lines shown when the core is alive. Supports placeholders. |
| `hologram.dead` | list | (see above) | Hologram lines shown when the core is destroyed. |
| `hologram.height_adjustment` | double | `4.2` | Vertical offset of the hologram above the core entity. |

### Regeneration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `regen.enabled` | boolean | `true` | Enable automatic core health regeneration. |
| `regen.delay` | integer | `1200` | Ticks between each regeneration tick (1200 ticks = 60 seconds). |
| `regen.amount` | integer | `5` | Health points regenerated per tick. |
| `regen.per_kill` | integer | `5` | Bonus health regenerated when a faction member gets a kill. |
| `regen.per_death` | integer | `-5` | Health lost when a faction member dies (use negative values). |

### Destruction

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `destroy.duration` | integer | `60` | Seconds the core remains in "destroyed" state before it can be rebuilt. During this time, the faction's bank can be robbed and territory is vulnerable. |

### Damage Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `damage.enabled` | boolean | `true` | Enable core damage mechanics. |
| `damage.type` | string | `"CUSTOM"` | Damage calculation mode. `CUSTOM` uses the fixed `custom_damage` value. `NORMAL` uses the attacker's weapon damage. |
| `damage.custom_damage` | integer | `1` | Fixed damage dealt to the core per hit (only used when `type` is `CUSTOM`). |
| `damage.relations_that_can_damage` | list | `["ENEMY", "NEUTRAL"]` | Which relations are allowed to damage the core. Valid values match your relation IDs from `relations.yml`. |

### Discord Integration

Sends embedded messages to your Discord server via DiscordSRV when core events occur.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `discord.embed.attack.enabled` | boolean | `true` | Send Discord notification when core is attacked. |
| `discord.embed.attack.title` | string | `"Core Attacked"` | Embed title. |
| `discord.embed.attack.description` | string | (see above) | Embed body. Supports `%faction%` and `%health%` placeholders. |
| `discord.embed.attack.color` | string | `"0xff0000"` | Embed sidebar color in hex. |
| `discord.embed.destroy.enabled` | boolean | `true` | Send Discord notification when core is destroyed. |
| `discord.embed.destroy.title` | string | `"Core Destroyed"` | Embed title. |
| `discord.embed.destroy.description` | string | (see above) | Embed body. Supports `%faction%` placeholder. |

::: warning Core Health and Upgrades
The core's maximum health is defined in `upgrades.yml` under the `CORE_HEALTH` property. The default level gives 1000 HP. Ensure your `regen.amount` and `destroy.duration` are balanced relative to the core's max health.
:::

::: tip Strategic Gameplay
The core system creates a strategic objective for faction raids:
- Attackers must locate and destroy the enemy core to rob their bank
- Defenders are notified and can respond
- The `protection_radius` creates a defensible area around the core
- Discord notifications allow offline members to be alerted
:::
