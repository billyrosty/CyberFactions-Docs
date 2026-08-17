# Faction Cores

The core is the heart of your faction — a physical entity placed in your territory that represents your faction's strength. Protect it at all costs. When the core falls, your faction enters a vulnerability window where enemies can overclaim, loot, and dominate you. This is what turns faction warfare from abstract power numbers into visceral, location-based combat.

## What Is a Core?

A faction core is a living entity spawned in your territory. It has health, a protection radius, regeneration, and can be attacked by enemies. Think of it as your faction's flag — a target that gives raids a clear objective and defenders a clear priority.

::: tip Gameplay Changer
Cores transform faction warfare. Instead of grinding power through kills, enemies have a physical target to assault. Defenders rally around a known location. Raids become events, not just numbers games.
:::

## Placing Your Core

```
/f setcore
```

Place the core at your current position. The location must be within your claimed territory. The plugin will clear a sphere of blocks around the core to ensure it is always reachable.

### Placement Rules

- Must be in faction-claimed territory
- Cooldown between relocations (default: 1 hour)
- Cannot relocate while under siege or recently attacked
- Only members with the `SETCORE` permission can place
- Relocating removes the old core before spawning the new one

## Core Types

CyberFactions supports two core display modes:

### Entity Mode (Default)

The core appears as a Minecraft entity. Configure which entity type to use per skin:

```yaml
core:
  type: ENTITY
  values:
    default: "ZOMBIE"
    sheep: "SHEEP"
    pig: "PIG"
    end_crystal: "END_CRYSTAL"
```

### ModelEngine Mode

For servers using ModelEngine, cores can be custom 3D models — giving you complete visual control over the core's appearance:

```yaml
core:
  type: MODEL_ENGINE
  values:
    default: "core_model_basic"
    epic: "core_model_epic"
```

::: info Soft Dependency
ModelEngine is optional. If `MODEL_ENGINE` is set in the config but the plugin is not installed, cores gracefully fall back to a plain entity. No crash, no errors.
:::

### Skins by Level

Core appearance is decided by the faction's level — there is no manual skin selection. The `skins_by_level` map ties each skin to a level threshold. A faction inherits the closest skin at or below its level:

```yaml
skins_by_level:
  1: "default"
  5: "sheep"
  10: "end_crystal"
```

A level 7 faction gets the "sheep" skin. A level 12 faction gets "end_crystal". When a faction upgrades and crosses a threshold, the core automatically updates its appearance.

## Core Health

The core has a health pool that scales with faction upgrade level:

| Level | Default Health |
|-------|---------------|
| 1 | 1,000 HP |
| 2+ | Scales via `CORE_HEALTH` property in upgrades.yml |

When health reaches zero, the core is **destroyed** and the faction enters a vulnerability window.

## Siege System

When an enemy damages your core, a **siege** begins. Both sides are aware of the assault — no more stealth raids without consequences.

### What Happens During a Siege

- A bossbar appears for all nearby players showing real-time core health
- The defending faction is alerted (sound + message)
- `/f setcore` and `/f delcore` are blocked — you cannot run from a fight
- The siege ends automatically after a configurable idle period (no damage received)

### Rate Limiting

Damage is paced by a 3-layer rate limiter to prevent burst destruction:

| Layer | Default | Purpose |
|-------|---------|---------|
| Core hits/sec | 1 | Hard floor on TTK — 20 attackers hit no faster than 1 |
| Player hits/sec | 2 | Stops macro/autoclicker abuse |
| Faction damage/sec | 20 | Caps a whole faction's total output |

A hit must pass **all three layers** to count. Setting any layer to 0 disables it.

::: tip TTK Design
With `core_hits_per_second: 1` and `custom_damage: 1`, a 1000 HP core takes exactly 1000 seconds (~17 minutes) regardless of attacker count. This is intentional — raids should be events, not 5-second zergs.
:::

### ATTACK_CORE Permission

The `ATTACK_CORE` faction permission controls which roles **in the attacker's own faction** are allowed to damage an enemy core. This lets faction leaders restrict siege participation to officers and above, while recruits handle other combat roles.

By default, `ATTACK_CORE` is set to **ALLOWED** for all roles — every member can participate in raids unless the faction leader restricts it.

## Damage System

Enemies attack the core to reduce its health. Two damage modes are available:

### Custom Damage Mode

Fixed damage per hit, independent of weapon or enchantments:

```yaml
damage:
  type: "CUSTOM"
  custom_damage: 1
```

This standardizes raiding — no one-shots from overpowered weapons.

### Normal Damage Mode

Standard Minecraft damage calculation applies. Weapon strength, enchantments, and critical hits all factor in.

```yaml
damage:
  type: "NORMAL"
```

### Who Can Damage

Configure which relations can attack the core:

```yaml
relations_that_can_damage:
  - "ENEMY"
  - "NEUTRAL"
```

::: warning Strategic Implications
If neutrals can damage cores, unaffiliated players become potential raiders. Restrict to enemies only for a more structured warfare meta.
:::

### Damage Batching

By default, core hits are accumulated in memory and flushed periodically (every 10 ticks) rather than writing to storage on every swing. This prevents database thrashing during sustained assaults while keeping all servers in sync.

## Regeneration

Cores heal over time and through faction activity:

| Source | Default | Description |
|--------|---------|-------------|
| Passive regen | +5 HP | Every 1200 ticks (1 minute) |
| Per kill | +5 HP | Faction member kills an enemy |
| Per death | -5 HP | Faction member dies |

::: tip Active Recovery
The kill-based regeneration rewards aggressive defense. Factions that fight back heal their core faster than those who hide.
:::

Regeneration is paused while the faction is under active siege, preventing healing mid-assault.

## Protection Radius

The core clears and maintains a spherical zone around itself (default: 4 blocks, scales with level via `CORE_RADIUS` upgrade). This zone is **absolute** — nothing can be placed inside it by any means:

- Block placement by hand
- Pistons extending into the zone
- Flowing water/lava
- Block growth (trees, mushrooms, crops)
- Structure growth (saplings, chorus)
- Dispenser bucket placement
- Falling blocks (sand, gravel)
- Fire spread and ice formation

This prevents the meta of burying a core behind obsidian — the core must always be reachable.

## Core Effects

The `CORE_EFFECTS` upgrade property (configured in `upgrades.yml`) lets cores radiate effects over their protection radius. Effects are relation-targeted: a core can strengthen its own faction while debuffing enemies.

### Available Effects

| Effect | Type | Description |
|--------|------|-------------|
| `PROJECTION` | Ticked | Particle ring drawn around the core perimeter |
| `GLOWING` | Ticked | Applies Glowing to targeted players inside the radius |
| `FORCE_BOOST` | Ticked | Applies Strength to targeted players inside the radius |
| `REVERT` | Event-driven | Restores blocks destroyed by explosions inside the radius |

### Example Configuration (in upgrades.yml)

```yaml
CORE_EFFECTS:
  enemy:
    - "GLOWING:1"
  self:
    - "FORCE_BOOST:2"
```

This makes enemies glow when inside the core radius (giving defenders vision) while faction members get Strength II (home advantage).

### Block Revert

When `REVERT` is active, blocks destroyed by explosions inside the core radius are restored after a configurable delay. Containers come back **empty** — their contents already dropped on the ground, preventing item duplication.

## Vulnerability Window

When a core is destroyed, the faction enters a **vulnerability window** (default: 30 minutes). This is the payoff for a successful raid — a time-limited window where the defending faction is weakened.

### Effects During Vulnerability

| Effect | Default | Description |
|--------|---------|-------------|
| Free overclaim | Enabled | Enemies can overclaim regardless of power |
| Power loss multiplier | 2.0x | Deaths cost double power |
| Enemy chest access | Disabled | Enemies can open /f chest in your territory |
| Block regen | Disabled | Core cannot regenerate during the window |

A bossbar tracks the remaining vulnerability time for both sides.

::: warning Maximum Impact
The vulnerability window turns a core kill into real consequences. Combine `free_overclaim` with `power_loss_multiplier: 2.0` and a well-organized attacking faction can carve out significant territory before the window closes.
:::

## Core Destruction

When a core reaches 0 HP, it is destroyed. Consequences:

- **Bank robbery** — A percentage of the faction bank is transferred to the attacker (configurable per level)
- **Bank cap** — Maximum robbery is limited (via `CORE_BANK_LOSS_LIMIT` upgrade property)
- **Vulnerability window opens** — See above
- **Destruction announcement** — All faction members are notified
- **Death timer** — The core remains "dead" for a configured duration before it can regenerate

## Entity Safety

Core entities are protected against accidental removal:

- **ClearLag immunity** — The plugin's entity cleaner skips core entities
- **Auto-respawn** — If a core entity disappears (killed by `/kill @e`, world edit, crash), the scheduler detects the missing entity and respawns it automatically
- **Persistent tag** — Core entities carry a PersistentDataContainer tag (`cyberfactions:core_entity`) so they survive server restarts

::: tip Unraidable Prevention
Without entity safety, a faction member could `/kill` their own core entity, leaving the core with full health but nothing to hit — making the faction permanently unraidable. The auto-respawn system closes this exploit.
:::

## Hologram Display

A TextDisplay entity floats above the core showing real-time status:

**While alive:**
```
FactionName
❤ 850
```

**When destroyed:**
```
FactionName
💀 Destroyed
```

Fully configurable: background color, shadow, billboard mode, scale, and line width.

## Move Restrictions

A core cannot be relocated while:

1. **Under siege** — `/f setcore` is blocked entirely
2. **Recently attacked** — Cooldown resets every time the core takes damage
3. **Recently placed** — Standard move cooldown (default: 1 hour)

This prevents the exploit of moving a core mid-fight to reset the siege.

## Viewing Core Status

```
/f core
```

Shows core health, level, skin, radius, active effects, and move cooldown status.

## Attack Notifications

When the core takes damage, the faction is alerted:

- In-game messages (throttled to prevent spam)
- Discord notifications via DiscordSRV (when configured)

## Removing the Core

```
/f delcore
```

Voluntarily remove your core. Requires the `DELCORE` permission. Blocked during an active siege.

## Multi-Server Sync

Core placement, damage, sieges, and removal sync across all connected servers via Redis pub/sub. Place a core on one server, see it on all servers — instantly.

## Configuration

All core settings live in `gameplay/core.yml`. Hot-reload with `/f reload`. See the [configuration reference](/configuration/core) for the full breakdown.
