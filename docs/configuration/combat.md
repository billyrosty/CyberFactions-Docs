# combat.yml

Configures the combat tagging system -- a comprehensive PvP management feature that tags players when they engage in combat, restricts certain actions during combat, and provides visual feedback.

**Location:** `configurations/gameplay/combat.yml`

## Full Configuration

```yaml
combat:
  enabled: true
  duration: 10
  duration_modifiers:
    enemy_territory: 1.5
    own_territory: 0.7
    warzone: 1.0
  relations:
    tag_allies: false
    tag_same_faction: false
    enemy_bonus_duration: 5
  logout:
    punishment: KILL
    npc_duration: 30
    npc_drop_inventory: true
    bonus_power_loss: 1.0
    broadcast: true
    broadcast_format: "<red>⚠ %player% disconnected while in combat!"
  blocked_commands:
    - "f home"
    - "f warp"
    - "spawn"
    - "tpa"
    - "tp"
    - "back"
    - "f fly"
  disable_fly: true
  cancel_teleport: true
  cancel_enderpearl: false
  enderpearl_cooldown: 16
  power:
    loss_only_when_tagged: false
    bonus_loss_enemy_territory: 0.5
    freeze_regen: true
  alerts:
    notify_faction: true
    format: "<red>⚔ %player% is in combat in your territory! <gray>(%x%, %y%, %z%)"
    show_coordinates: true
  display:
    actionbar:
      enabled: true
      format: "<red>⚔ Combat <yellow>%time%s"
    bossbar:
      enabled: false
      color: RED
      style: SOLID
  border:
    enabled: true
    material: RED_STAINED_GLASS
    radius: 8
    check_interval: 2
  overclaim_protection: true
  grace_period:
    enabled: true
    duration: 5
    only_own_territory: true
  bypass_permission: "cyberfactions.combat.bypass"
  disabled_worlds:
    - "world_lobby"
```

## Configuration Reference

### Core Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `combat.enabled` | boolean | `true` | Enable or disable the entire combat tag system. |
| `combat.duration` | integer | `10` | Base duration of the combat tag in seconds. |
| `combat.bypass_permission` | string | `"cyberfactions.combat.bypass"` | Permission node that allows a player to bypass combat tagging entirely. |
| `combat.disabled_worlds` | list | `["world_lobby"]` | Worlds where combat tagging is completely disabled. |

### Duration Modifiers

Territory-based multipliers applied to the base combat tag duration.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `duration_modifiers.enemy_territory` | double | `1.5` | Multiplier when the tagged player is in enemy territory. With base 10s: `10 * 1.5 = 15s`. |
| `duration_modifiers.own_territory` | double | `0.7` | Multiplier when the tagged player is in their own territory. With base 10s: `10 * 0.7 = 7s`. |
| `duration_modifiers.warzone` | double | `1.0` | Multiplier when in warzone territory. |

### Relation-Aware Tagging

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `relations.tag_allies` | boolean | `false` | Whether hitting an allied faction member applies a combat tag. |
| `relations.tag_same_faction` | boolean | `false` | Whether hitting a member of your own faction applies a combat tag. |
| `relations.enemy_bonus_duration` | integer | `5` | Extra seconds added to the combat tag when fighting an enemy faction member. |

### Combat Logout Punishment

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `logout.punishment` | string | `"KILL"` | Action taken when a player disconnects while combat tagged. Options: `KILL` (instant death), `NPC` (spawn a combat NPC), `DROP` (force drop inventory). |
| `logout.npc_duration` | integer | `30` | Seconds the NPC stays alive (only applies to `NPC` mode). |
| `logout.npc_drop_inventory` | boolean | `true` | Whether the NPC drops the player's inventory when killed. |
| `logout.bonus_power_loss` | double | `1.0` | Extra power loss added on top of normal death loss when combat logging. |
| `logout.broadcast` | boolean | `true` | Broadcast a message to the server when someone combat logs. |
| `logout.broadcast_format` | string | (see above) | The broadcast message format. Supports `%player%` placeholder. |

::: warning Combat Logging
The `KILL` punishment is the simplest and most effective deterrent. The `NPC` mode requires the Citizens plugin to be installed. The `DROP` mode forces inventory drop without killing the player (they keep their XP).
:::

### Command Restrictions

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `blocked_commands` | list | (see above) | Commands that cannot be used while combat tagged. Matches the start of the command string. |

### Movement and Item Restrictions

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `disable_fly` | boolean | `true` | Immediately disable flight when a player is combat tagged. |
| `cancel_teleport` | boolean | `true` | Cancel any ongoing teleportation warmup when tagged. |
| `cancel_enderpearl` | boolean | `false` | Completely block enderpearl usage while tagged. |
| `enderpearl_cooldown` | integer | `16` | Cooldown in seconds between enderpearl throws while tagged. Set to `0` to disable the cooldown. |

### Power System Integration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `power.loss_only_when_tagged` | boolean | `false` | If `true`, players only lose power on death if they have a combat tag (PvE deaths cause no power loss). |
| `power.bonus_loss_enemy_territory` | double | `0.5` | Extra power loss added when dying in enemy territory while tagged. |
| `power.freeze_regen` | boolean | `true` | Freeze power regeneration while the player is combat tagged. |

### Faction Alerts

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `alerts.notify_faction` | boolean | `true` | Notify faction members when a member is attacked in their territory. |
| `alerts.format` | string | (see above) | Alert message format. Supports `%player%`, `%x%`, `%y%`, `%z%`. |
| `alerts.show_coordinates` | boolean | `true` | Include coordinates in the alert message. |

### Combat Timer Display

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `display.actionbar.enabled` | boolean | `true` | Show combat timer in the action bar. |
| `display.actionbar.format` | string | (see above) | Action bar format. `%time%` = remaining seconds. |
| `display.bossbar.enabled` | boolean | `false` | Show combat timer as a boss bar. |
| `display.bossbar.color` | string | `"RED"` | Boss bar color. Options: `BLUE`, `GREEN`, `PINK`, `PURPLE`, `RED`, `WHITE`, `YELLOW`. |
| `display.bossbar.style` | string | `"SOLID"` | Boss bar style. Options: `SOLID`, `SEGMENTED_6`, `SEGMENTED_10`, `SEGMENTED_12`, `SEGMENTED_20`. |

### Safezone Border Barrier

Creates a visual fake block wall at safezone boundaries to prevent combat-tagged players from escaping into safe areas.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `border.enabled` | boolean | `true` | Enable the fake border wall for tagged players near safezones. |
| `border.material` | string | `"RED_STAINED_GLASS"` | Block material used for the visual barrier. |
| `border.radius` | integer | `8` | Radius around the player where border blocks are rendered. |
| `border.check_interval` | integer | `2` | Ticks between border position checks (2 ticks = 100ms). |

### Overclaim Protection

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `overclaim_protection` | boolean | `true` | Prevent enemies from overclaiming chunks where faction members are actively in combat. |

### Respawn Grace Period

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `grace_period.enabled` | boolean | `true` | Grant temporary invulnerability after respawning. |
| `grace_period.duration` | integer | `5` | Duration of invulnerability in seconds. |
| `grace_period.only_own_territory` | boolean | `true` | Only grant grace period when the player respawns in their own territory. |

::: tip Balanced Combat Configuration
For competitive faction servers, consider:
- `duration: 15` with `enemy_bonus_duration: 10` for longer engagement windows
- `enderpearl_cooldown: 16` to limit pearl spam
- `overclaim_protection: true` to prevent "claim rushing" during raids
- `border.enabled: true` to prevent safezone camping
:::
