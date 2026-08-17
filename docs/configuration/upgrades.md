# upgrades.yml

Configures the faction upgrade/leveling system. Factions start at level 1 and can upgrade by meeting requirements (money, members, power, etc.). Each level unlocks new properties like increased claim limits, member capacity, potion effects, custom mob drops, and more.

**Location:** `configurations/gameplay/upgrades.yml`

## Full Configuration

```yaml
upgrades:
  upgradable_by_command: true
  scheduler_delay: 2400
  default_settings:
    properties:
      LEVEL_NAME: "1"
      CHESTS: 5
      CHESTS_ROWS: 3
      CORE_HEALTH: 1000
      CORE_RADIUS: 10
      CORE_EFFECTS:
        ENEMY:
          - "PROJECTION:4"
          - "REVERT"
          - "GLOWING"
        SELF:
          - "FORCE_BOOST:2"
      CORE_BANK_LOSS_PERCENTAGE: 20
      CORE_BANK_LOSS_LIMIT: 5000
      CLAIMS_LIMIT: 5
      MEMBERS_LIMIT: 5
      POWER_BOOST: 1.0
      RELATIONS_LIMIT:
        ENEMY: 3
        ALLY: 1
      BANK_LIMIT: 100000
      GROWTH_RATE: 1.0
      SPAWNERS_RATE: 1.0
      QUEST_REWARD_BOOST: 1.0
      RELATIONS_EFFECTS:
        SELF:
          - "REGENERATION:1:true"
          - "SPEED:1:false"
          - "INCREASE_DAMAGE:1:true"
          - "JUMP:1:false"
          - "DAMAGE_RESISTANCE:1:true"
          - "FAST_DIGGING:1:false"
        ENEMY:
          - "POISON:1:false"
          - "BLINDNESS:1:true"
        ALLY:
          - "SPEED:1:false"
          - "REGENERATION:1:true"
      BLOCKS_LIMIT:
        - "SAND:50"
        - "OBSIDIAN:50"
      BLOCKS_RESISTANCE:
        - "SAND:2"
        - "OBSIDIAN:3"
        - "CRYING_OBSIDIAN:4"
        - "BEDROCK:5"
      MOBS_DROPS:
        ZOMBIE:
          - "DIAMOND:1:20"
          - "GOLD_INGOT:1:50"
        COW:
          - "MILK_BUCKET:1:60"
      CANCELLED_DAMAGES:
        - "FALL"
      ALLOWED_FLY:
        - "ENEMY"
        - "ALLY"
        - "TRUCE"
        - "DEFAULT"
  levels:
    2:
      requirements:
        first_requirement:
          type: "PLACEHOLDER"
          value: 100000
        second_requirement:
          type: "MEMBER_COUNT"
          value: 2
      properties:
        LEVEL_NAME: "2"
        GARDEN: true
        GARDEN_MINE:
          - "STONE:80"
          - "DIAMOND_ORE:2"
          - "GOLD_ORE:5"
          - "IRON_ORE:10"
          - "COAL_ORE:15"
        CLAIMS_LIMIT: 10
        MEMBERS_LIMIT: 15
        RELATIONS_LIMIT:
          ENEMY: 10
          ALLY: 5
        BANK_LIMIT: 250000
        GROWTH_RATE: 2.0
        SPAWNERS_RATE: 2.0
        QUEST_REWARD_BOOST: 1.25
        BLOCKS_LIMIT:
          - "SAND:15"
          - "OBSIDIAN:25"
      upgrade_commands:
        - "eco take %player_name% 1000"

requirements:
  GROUP:
    name: "Group"
    description: "The player must have a specific rank on the server"
  PERMISSION:
    name: "Permission"
    description: "The player must have a specific permission"
  PLAYER_MONEY:
    name: "Player Money"
    description: "The player must have a specific amount of money"
  FACTION_MONEY:
    name: "Faction Money"
    description: "The faction must have a specific amount of money in the bank"
  LEVEL:
    name: "Faction Level"
    description: "The faction must have a specific level"
  MEMBER_COUNT:
    name: "Member Count"
    description: "The faction must have a specific amount of members"
  CLAIMS_COUNT:
    name: "Claims Count"
    description: "The faction must have a specific amount of claims"
  POWER:
    name: "Power"
    description: "The faction must have a specific amount of power"
  QUEST:
    name: "Quest"
    description: "The player must have completed a specific quest"
  PLACEHOLDER:
    name: "Placeholder"
    description: "The player must have a specific placeholder value"
```

## Configuration Reference

### General Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `upgrades.upgradable_by_command` | boolean | `true` | Allow upgrading via the `/f upgrade` command. If `false`, upgrades can only be triggered by admin commands or API. |
| `upgrades.scheduler_delay` | integer | `2400` | Ticks between property effect applications (e.g., potion effects refresh). 2400 ticks = 2 minutes. |

### Default Settings (Level 1)

The `default_settings` section defines what all factions start with at level 1. Properties here apply immediately upon faction creation.

### Properties Reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `LEVEL_NAME` | string | `"1"` | Display name for this level. |
| `CHESTS` | integer | `5` | Number of faction chests available. |
| `CHESTS_ROWS` | integer | `3` | Rows per faction chest (max 6 = 54 slots). |
| `CORE_HEALTH` | integer | `1000` | Maximum health points for the faction core. |
| `CORE_RADIUS` | integer | `10` | Protection radius around the core in blocks. |
| `CORE_EFFECTS` | map | (see above) | Effects applied near the core. Keyed by relation. |
| `CORE_BANK_LOSS_PERCENTAGE` | integer | `20` | Percentage of bank money lost when core is destroyed. |
| `CORE_BANK_LOSS_LIMIT` | integer | `5000` | Maximum money that can be stolen on core destruction. |
| `CLAIMS_LIMIT` | integer | `5` | Maximum territory claims for this level. |
| `MEMBERS_LIMIT` | integer | `5` | Maximum faction members for this level. |
| `POWER_BOOST` | double | `1.0` | Power regeneration multiplier. |
| `RELATIONS_LIMIT` | map | `{ENEMY:3, ALLY:1}` | Maximum number of each relation type. |
| `BANK_LIMIT` | integer | `100000` | Maximum money the faction bank can hold. |
| `GROWTH_RATE` | double | `1.0` | Crop growth speed multiplier in faction territory. |
| `SPAWNERS_RATE` | double | `1.0` | Spawner speed multiplier in faction territory. |
| `QUEST_REWARD_BOOST` | double | `1.0` | Multiplier applied to numeric quest rewards (money, faction_bank, power, points). Items and commands are not affected. |
| `RELATIONS_EFFECTS` | map | (see above) | Potion effects applied to players in territory based on relation. |
| `BLOCKS_LIMIT` | list | (see above) | Maximum number of specific blocks that can be placed in territory. Format: `"MATERIAL:limit"`. |
| `BLOCKS_RESISTANCE` | list | (see above) | Number of hits required to break specific blocks (block reinforcement). Format: `"MATERIAL:hits"`. |
| `MOBS_DROPS` | map | (see above) | Custom mob drops in territory. Format: `"ITEM:amount:chance_percent"`. |
| `CANCELLED_DAMAGES` | list | `["FALL"]` | Damage types cancelled in own territory. |
| `ALLOWED_FLY` | list | (see above) | Relations in whose territory faction members can fly. |
| `GARDEN` | boolean | (per level) | Whether the faction can create a garden at this level. |
| `GARDEN_MINE` | list | (per level) | Block composition for the garden mine. Format: `"MATERIAL:weight"`. |

### Effect Formats

**Relations Effects:** `"EFFECT_NAME:amplifier:ambient"`
- `EFFECT_NAME` -- Bukkit PotionEffectType name (e.g., `REGENERATION`, `SPEED`, `POISON`)
- `amplifier` -- Effect level (1 = level I, 2 = level II, etc.)
- `ambient` -- `true` for subtle particles, `false` for full particles

**Core Effects:** `"EFFECT_NAME:parameter"` or single keyword
- `PROJECTION:4` -- Knock back enemies 4 blocks
- `REVERT` -- Revert enemy actions in core radius
- `GLOWING` -- Apply glowing effect to enemies near core
- `FORCE_BOOST:2` -- Boost faction members near core

### Level Definitions

Each level under `levels` defines requirements to reach it and new properties gained.

```yaml
levels:
  2:
    requirements:
      requirement_name:
        type: "REQUIREMENT_TYPE"
        value: <number>
    properties:
      # Only include properties that CHANGE from previous level
      CLAIMS_LIMIT: 10
    upgrade_commands:
      - "command to execute on upgrade"
```

| Key | Type | Description |
|-----|------|-------------|
| `requirements` | map | Named requirements that must all be met to upgrade. |
| `properties` | map | Properties that override default values at this level. Only changed properties need to be listed. |
| `upgrade_commands` | list | Console commands executed when a faction upgrades to this level. Supports `%player_name%`, `%faction_name%`. |

### Requirement Types

| Type | Description | Value Meaning |
|------|-------------|---------------|
| `GROUP` | Player must have a permission group/rank | Group name |
| `PERMISSION` | Player must have a specific permission node | Permission string |
| `PLAYER_MONEY` | Player must have this much money | Dollar amount |
| `FACTION_MONEY` | Faction bank must contain this much | Dollar amount |
| `LEVEL` | Faction must be at a specific level | Level number |
| `MEMBER_COUNT` | Faction needs this many members | Member count |
| `CLAIMS_COUNT` | Faction needs this many claims | Claim count |
| `POWER` | Faction needs this much total power | Power amount |
| `QUEST` | Specific quest must be completed | Quest ID |
| `PLACEHOLDER` | PlaceholderAPI placeholder must return this value | Numeric value |

::: tip Upgrade Progression Design
Design levels with increasing difficulty that unlocks meaningful benefits:
- **Level 1** (default): Small faction, limited claims and members
- **Level 2**: Doubled capacity, garden access, better growth rates
- **Level 3**: Large faction, powerful effects, high bank limits
- **Level 4+**: End-game faction, maximum territory control

Only properties that change need to be listed in each level -- unchanged properties carry forward from the previous level.
:::

::: tip Block Resistance
The `BLOCKS_RESISTANCE` property creates a reinforcement system where blocks require multiple hits to break:
```yaml
BLOCKS_RESISTANCE:
  - "OBSIDIAN:3"    # 3 hits to break obsidian
  - "BEDROCK:5"     # 5 hits to break bedrock (if breakable)
```
This adds strategic depth to base defense.
:::

::: warning Performance with Effects
Having many `RELATIONS_EFFECTS` with short `scheduler_delay` can impact performance on servers with many factions. Keep the effect list concise and use a delay of at least 1200 ticks (1 minute) for large servers.
:::
