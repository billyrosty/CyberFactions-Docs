# shield.yml

Configures the faction shield system -- a protection mechanism that prevents raids during specified time windows. Factions can select a scheduled shield slot (e.g., nighttime protection) and can also receive temporary shields from admins.

**Location:** `configurations/gameplay/shield.yml`

## Full Configuration

```yaml
shield:
  enabled: true

  slots:
    - "22:00-06:00"
    - "00:00-08:00"
    - "02:00-10:00"
    - "08:00-16:00"
    - "14:00-22:00"

  schedule:
    max_hours_per_day: 16
    change_cooldown_hours: 48

  temporary:
    pause_during_schedule: true
    max_duration_hours: 72

  protections:
    block_overclaim: true
    protect_core: true
    block_explosions: true
    freeze_power_loss: false

  display:
    bossbar:
      enabled: true
      color: GREEN
      style: SOLID
      format: "<green>Shield Active (%type%) — %remaining% remaining"
    show_in_fshow: true

  bypass_permission: "cyberfactions.shield.bypass"
```

## Configuration Reference

### General

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `shield.enabled` | boolean | `true` | Enable or disable the entire shield system. |
| `shield.bypass_permission` | string | `"cyberfactions.shield.bypass"` | Permission node that allows a player to bypass shield protections (useful for admins). |

### Time Slots

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `shield.slots` | list | (see above) | Available time windows factions can choose for scheduled protection. Format: `"HH:mm-HH:mm"` in 24-hour notation. |

Time slots can cross midnight (e.g., `"22:00-06:00"` means from 10 PM to 6 AM). Each faction chooses one slot from the available options.

### Schedule Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `schedule.max_hours_per_day` | integer | `16` | Maximum hours of scheduled shield protection per day. Set to `0` for unlimited. |
| `schedule.change_cooldown_hours` | integer | `48` | Hours a faction must wait before changing their selected time slot. Prevents abuse of slot switching to cover all hours. |

### Temporary Shield

Temporary shields are granted by admins via `/f admin shield give <faction> <hours>`.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `temporary.pause_during_schedule` | boolean | `true` | If `true`, the temporary shield timer pauses while the scheduled shield is also active (more generous). If `false`, it always counts down. |
| `temporary.max_duration_hours` | integer | `72` | Maximum duration of temporary shields. Prevents admins from accidentally granting extremely long shields. |

### Protections

What the shield actually prevents:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `protections.block_overclaim` | boolean | `true` | Prevent enemies from overclaiming territory while shield is active. |
| `protections.protect_core` | boolean | `true` | Make the faction core invulnerable during shield. |
| `protections.block_explosions` | boolean | `true` | Cancel all explosions in faction territory during shield. |
| `protections.freeze_power_loss` | boolean | `false` | Prevent power loss for faction members during shield. Disabled by default as it could be exploited. |

### Display

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `display.bossbar.enabled` | boolean | `true` | Show a boss bar to faction members when their shield is active. |
| `display.bossbar.color` | string | `"GREEN"` | Boss bar color. Options: `BLUE`, `GREEN`, `PINK`, `PURPLE`, `RED`, `WHITE`, `YELLOW`. |
| `display.bossbar.style` | string | `"SOLID"` | Boss bar style. Options: `SOLID`, `SEGMENTED_6`, `SEGMENTED_10`, `SEGMENTED_12`, `SEGMENTED_20`. |
| `display.bossbar.format` | string | (see above) | Format string. `%type%` = "Schedule" or "Temporary", `%remaining%` = time remaining. |
| `display.show_in_fshow` | boolean | `true` | Display shield status in `/f show` output. |

::: tip Slot Design Strategy
Design time slots to cover different player timezones and schedules:
- `"22:00-06:00"` -- Night owls and overnight protection
- `"08:00-16:00"` -- Daytime protection (for players who work/study during the day)
- `"14:00-22:00"` -- Afternoon/evening coverage

With `max_hours_per_day: 16`, factions get 16 hours of protection but are always vulnerable for at least 8 hours.
:::

::: warning Slot Change Cooldown
The `change_cooldown_hours: 48` prevents factions from constantly swapping slots to avoid raids. This forces factions to commit to a schedule and creates predictable vulnerability windows that enemies can plan around.
:::

::: tip Balancing Shields for Competitive Servers
For hardcore PvP servers, consider:
- Fewer/shorter time slots (e.g., 6-8 hour windows only)
- `max_hours_per_day: 8` for more vulnerability
- `freeze_power_loss: false` to keep power dynamics active
- Higher `change_cooldown_hours` (72+) to prevent slot abuse
:::
