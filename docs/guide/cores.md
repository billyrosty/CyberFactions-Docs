# Faction Cores

The core is the heart of your faction — a physical entity placed in your territory that represents your faction's strength. Protect it at all costs. When the core falls, your faction pays the price. This is what turns faction warfare from abstract power numbers into visceral, location-based combat.

## What Is a Core?

A faction core is a living entity spawned in your territory. It has health, a protection radius, regeneration, and can be attacked by enemies. Think of it as your faction's flag — a target that gives raids a clear objective and defenders a clear priority.

::: tip Gameplay Changer
Cores transform faction warfare. Instead of grinding power through kills, enemies have a physical target to assault. Defenders rally around a known location. Raids become events, not just numbers games.
:::

## Placing Your Core

```
/f setcore
```

Place the core at your current position. The location must be within your claimed territory.

### Placement Rules

- Must be in faction-claimed territory
- Cooldown between relocations (default: 1 hour)
- Only members with the `SETCORE` permission can place
- Relocating removes the old core before spawning the new one
- 3-second delay before the entity appears (prevents placement exploits)

![Core placed in faction base](./images/cores-placed.png)
<!-- SCREENSHOT: Place a faction core in a well-built faction base using /f setcore. Capture the core entity (zombie/end crystal) with its hologram floating above showing the faction name, health bar, and status. The base should look fortified around the core location. If using the END_CRYSTAL skin, capture the rotating crystal with the hologram. Best as a screenshot from a slight distance showing the full setup. -->

## Core Types

CyberFactions supports multiple core display modes:

### Entity Mode (Default)

The core appears as a Minecraft entity. Configure which entity type to use:

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

For servers using ModelEngine, cores can be custom 3D models — giving you complete visual control over the core's appearance.

```yaml
core:
  type: MODEL_ENGINE
```

### Core Skins

Factions can choose their core's appearance from the configured options. Whether it is a menacing zombie, an ethereal end crystal, or a custom model — the core is a visual statement.

## Core Health

The core has a health pool that scales with faction upgrade level:

| Level | Default Health |
|-------|---------------|
| 1 | 1,000 HP |
| 2+ | Scales via `CORE_HEALTH` property |

When health reaches zero, the core is **destroyed**.

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

## Protection Radius

The core projects a protection radius (default: 4 chunks, scales with level via `CORE_RADIUS`). Within this radius, the faction receives enhanced potion effects:

### Self Effects
Faction members near their core receive:
- Force Boost (Strength)

### Enemy Effects
Enemies entering the core radius receive:
- Projection (Knockback)
- Revert (Slowness)
- Glowing (Visibility)

These effects make the core area a fortified zone — attacking it means fighting at a disadvantage.

## Core Destruction

When a core reaches 0 HP, it is destroyed. Consequences:

- **Bank loss** — A percentage of the faction bank is lost (default: 20%)
- **Bank loss cap** — Maximum loss is limited (default: $5,000)
- **Destruction announcement** — All faction members are notified
- **Cooldown on replacement** — The faction must wait before placing a new core

```yaml
destroy:
  duration: 60  # Seconds before respawn is possible
```

## Hologram Display

A floating hologram above the core displays real-time information using DecentHolograms:

**While alive:**
```
Core of [Faction Name]

Health: 850/1000
```

**When destroyed:**
```
Core of [Faction Name]

Destroyed
```

Height adjustment is configurable for different entity types.

![Core under attack with hologram](./images/cores-attack.png)
<!-- SCREENSHOT: Have an enemy player hitting the core entity while the hologram shows reduced health (e.g., 650/1000). Capture the attack particles, the player mid-swing, and the hologram with the health value clearly visible. The scene should convey the urgency of a raid in progress. Best as a short GIF showing the attack animation and health dropping. -->

## Attack Notifications

When the core takes damage, the faction is alerted:

```yaml
messages:
  attack:
    enabled: true
    interval: 60  # Seconds between attack notifications (prevents spam)
  destroy:
    enabled: true
  regen:
    enabled: true
```

Attack notifications are throttled to prevent chat spam during sustained assaults.

## Discord Integration

Core events push notifications to Discord via DiscordSRV:

### Attack Notification
- Embedded message with attacker faction name
- Current health displayed with heart emoji
- Red color coding for urgency
- Custom thumbnail and footer

### Destruction Notification
- Embedded message announcing core loss
- Attacker faction credited
- Rally message in footer

::: info Cross-Platform Alerts
When your core is under attack, faction members get notified even if they are not online — through Discord. This drives engagement and emergency logins during raids.
:::

## Removing the Core

```
/f delcore
```

Voluntarily remove your core. Requires the `DELCORE` permission. Useful before relocating.

## Multi-Server Sync

Core placement and removal sync across all connected servers via Redis pub/sub. Place a core on one server, see it on all servers — instantly.

## Configuration

All core settings live in `gameplay/core.yml`. Hot-reload with `/f reload`.
