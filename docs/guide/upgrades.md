# Upgrades & Leveling

Progression keeps players invested. CyberFactions delivers a deep upgrade system where factions grow stronger over time — unlocking new capabilities, expanding limits, and gaining mechanical advantages that reward dedication. Every level feels meaningful because every level changes what your faction can do.

## The Upgrade System

Factions start at level 1 with baseline properties. As they meet configurable requirements, leaders can upgrade to unlock higher tiers — each granting new properties and expanded limits.

```
/f upgrade
```

::: tip Broadcast Moments
Upgrades optionally broadcast to the entire server, turning each level-up into a community event. Everyone sees when a faction reaches a new tier.
:::

## Requirements

Each upgrade level can require any combination of these conditions:

| Requirement | Description |
|-------------|-------------|
| `GROUP` | Player must hold a specific permission group (Vault) |
| `PLAYER_MONEY` | Player must have enough personal balance |
| `FACTION_MONEY` | Faction bank must hold enough funds |
| `LEVEL` | Faction must be at a specific level first |
| `MEMBER_COUNT` | Faction needs a minimum member count |
| `CLAIMS_COUNT` | Faction needs a minimum territory size |
| `POWER` | Faction needs a minimum total power |
| `QUEST` | Specific quest must be completed |
| `PLACEHOLDER` | Any PlaceholderAPI value must meet a threshold |

::: info PlaceholderAPI Integration
The `PLACEHOLDER` requirement type opens infinite possibilities. Gate upgrades behind any external statistic — total playtime, kills, votes, custom plugin values. If PlaceholderAPI can read it, CyberFactions can require it.
:::

### Example Requirements

```yaml
levels:
  2:
    requirements:
      money_requirement:
        type: "FACTION_MONEY"
        value: 100000
      member_requirement:
        type: "MEMBER_COUNT"
        value: 2
```

Level 2 requires $100,000 in the faction bank **and** at least 2 members. All requirements must be met simultaneously.

## Properties

Properties define what each level unlocks. CyberFactions ships with an extensive property system covering every aspect of faction gameplay:

### Territory & Growth

| Property | Description |
|----------|-------------|
| `CLAIMS_LIMIT` | Maximum chunks the faction can claim |
| `MEMBERS_LIMIT` | Maximum players in the faction |
| `POWER_BOOST` | Multiplier applied to power calculations |
| `GROWTH_RATE` | Crop growth speed multiplier in territory |
| `SPAWNERS_RATE` | Mob spawner speed multiplier in territory |

### Economy & Storage

| Property | Description |
|----------|-------------|
| `BANK_LIMIT` | Maximum faction bank balance |
| `CHESTS` | Number of faction chests available |
| `CHESTS_ROWS` | Rows per faction chest (3-6) |

### Core & Defense

| Property | Description |
|----------|-------------|
| `CORE_HEALTH` | Maximum health of the faction core |
| `CORE_RADIUS` | Protection radius around the core |
| `CORE_EFFECTS` | Potion effects applied near the core |
| `CORE_BANK_LOSS_PERCENTAGE` | % of bank lost when core is destroyed |
| `CORE_BANK_LOSS_LIMIT` | Maximum bank loss on core destruction |

### Diplomacy

| Property | Description |
|----------|-------------|
| `RELATIONS_LIMIT` | Max relations per type (enemy, ally, etc.) |
| `RELATIONS_EFFECTS` | Potion effects applied by relation type |

### Combat & Territory Control

| Property | Description |
|----------|-------------|
| `BLOCKS_LIMIT` | Max count of specific blocks in territory |
| `BLOCKS_RESISTANCE` | Explosion resistance for specific blocks |
| `MOBS_DROPS` | Custom mob drops in faction territory |
| `CANCELLED_DAMAGES` | Damage types cancelled in territory |
| `ALLOWED_FLY` | Relation territories where fly works |

![Upgrade requirements display](./images/upgrades-requirements.png)
<!-- SCREENSHOT: Run /f upgrade when requirements are NOT met. Capture the error message listing all requirements with their current status - showing what the faction still needs (money, members, etc). The requirements should be formatted with colored indicators showing met/unmet status. -->

## Level Progression Example

### Level 1 (Default)

```yaml
default_settings:
  properties:
    CLAIMS_LIMIT: 5
    MEMBERS_LIMIT: 5
    BANK_LIMIT: 100000
    CORE_HEALTH: 1000
    GROWTH_RATE: 1.0
```

### Level 2

```yaml
levels:
  2:
    requirements:
      type: "FACTION_MONEY"
      value: 100000
    properties:
      CLAIMS_LIMIT: 10
      MEMBERS_LIMIT: 15
      BANK_LIMIT: 250000
      GROWTH_RATE: 2.0
      SPAWNERS_RATE: 2.0
```

The jump from level 1 to 2 **doubles** claims capacity, **triples** member slots, and **doubles** growth rates. Each upgrade is a transformative moment.

## Upgrade Commands

On level-up, execute any commands as console:

```yaml
upgrade_commands:
  - "eco take %player_name% 1000"
  - "broadcast %faction_name% reached level 2!"
  - "give %player_name% diamond_block 16"
```

Use this for deducting currency, granting items, triggering events, or integrating with other plugins.

## Territory Effects

Higher-level factions project their power through potion effects:

### Self Territory Effects
Your members receive buffs while in faction land:
- Regeneration, Speed, Strength, Jump Boost, Resistance, Haste

### Enemy Territory Effects
Enemies entering your land receive debuffs:
- Poison, Blindness

### Ally Territory Effects
Allies visiting your land receive buffs:
- Speed, Regeneration

::: tip Effect Configuration
Each effect specifies level and whether it is ambient (invisible particles). Format: `"EFFECT_NAME:LEVEL:AMBIENT"`. Higher upgrade levels grant stronger effects.
:::

## Block Limits & Resistance

Control strategic block placement per-level:

```yaml
BLOCKS_LIMIT:
  - "SAND:50"
  - "OBSIDIAN:50"
BLOCKS_RESISTANCE:
  - "SAND:2"          # 2x blast resistance
  - "OBSIDIAN:3"      # 3x blast resistance
  - "CRYING_OBSIDIAN:4"
  - "BEDROCK:5"       # Virtually indestructible
```

Higher-level factions get stronger walls and more building material allowance.

## Custom Mob Drops

Reward farming in faction territory with bonus drops:

```yaml
MOBS_DROPS:
  ZOMBIE:
    - "DIAMOND:1:20"       # 20% chance for 1 diamond
    - "GOLD_INGOT:1:50"    # 50% chance for 1 gold ingot
  COW:
    - "MILK_BUCKET:1:60"   # 60% chance for milk
```

![Upgrade level comparison](./images/upgrades-levels.png)
<!-- SCREENSHOT: Run /f show on a high-level faction (level 2+). Capture the info display showing the level prominently, along with the expanded limits (higher member cap, more claims, larger bank). Then show /f show on a level 1 faction for comparison. Both displays should be visible, perhaps split in two screenshots or one long capture. -->

## Tax Integration

When the tax system is active, factions in debt cannot upgrade. The `FREEZE_UPGRADES` penalty blocks `/f upgrade` until taxes are paid — creating real economic pressure.

## Scheduler

A background scheduler runs at configurable intervals (default: 2400 ticks / 2 minutes) to apply level-dependent effects like territory buffs and growth modifiers.

## Configuration

All upgrade settings live in `gameplay/upgrades.yml`. Hot-reload with `/f reload`. Add unlimited levels, mix requirements, and tune properties to match your server's progression curve.
