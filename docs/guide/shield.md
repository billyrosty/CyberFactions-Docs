# Protection Shield

Not every faction can defend 24/7. The shield system ensures that real-life obligations never cost you your empire. Factions choose protected time windows where their territory is invulnerable — creating predictable raid windows that promote healthy competition and prevent burnout.

## How Shields Work

When a shield is active, the faction's territory gains comprehensive protection:

- **Overclaiming blocked** — No one can take your chunks
- **Core invulnerable** — The core cannot be damaged
- **Explosions cancelled** — No TNT, no creepers, no damage
- **Power loss frozen** (optional) — Deaths do not drain power

::: tip Healthy PvP Meta
Shields create predictable windows for both attackers and defenders. Raiders know when to strike. Defenders know when they need to be online. This eliminates the 3 AM raids that kill server communities.
:::

## Shield Types

### Scheduled Shield

Factions choose a daily time slot from admin-defined options. During that window, the shield activates automatically every day.

```
/f shield set <slot>
```

Available slots are configured by the server owner:

```yaml
slots:
  - "22:00-06:00"
  - "00:00-08:00"
  - "02:00-10:00"
  - "08:00-16:00"
  - "14:00-22:00"
```

::: info Crossing Midnight
Slots can span midnight (e.g., "22:00-06:00") for overnight protection. The system handles day boundaries automatically.
:::

### Temporary Shield

Admins can grant temporary shields for events, compensation, or new-faction protection. Temporary shields stack with scheduled shields and have their own duration timer.

- Maximum duration configurable (default: 72 hours)
- Timer pauses during scheduled shield (optional)
- Ticks down continuously when no schedule is active

## Managing Your Shield

### Set a Slot

```
/f shield set <slot>
```

Only the faction owner can set or change the shield slot. Lists available slots if no slot is specified.

### View Shield Status

```
/f shield info
```

Displays:
- Current schedule slot
- Whether the schedule is currently active
- Temporary shield remaining time
- Overall protection status

![Shield info display](./images/shield-info.png)
<!-- SCREENSHOT: Run /f shield info when both a scheduled shield is active and a temporary shield has time remaining. Capture the full output showing the slot (e.g., "22:00-06:00"), schedule status as "Yes" in green, temp shield remaining time, and "Protected: Yes" in green. Show the BossBar at the top of the screen with "Shield Active (Schedule) - 4h 32m remaining" in green. -->

### Remove Shield Schedule

```
/f shield remove
```

Clears the shield slot. Only the faction owner can do this.

## Schedule Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `max_hours_per_day` | 16 | Maximum protected hours per day |
| `change_cooldown_hours` | 48 | Hours before slot can be changed |

The change cooldown prevents factions from dynamically shifting their protection window to block specific raids. Once set, you commit for at least 48 hours.

::: warning Strategic Commitment
The 48-hour cooldown makes shield slot selection a strategic decision. Choose the window that covers your weakest hours — you cannot change it on short notice.
:::

## Temporary Shield Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `pause_during_schedule` | true | Temp timer pauses while schedule is active |
| `max_duration_hours` | 72 | Maximum temp shield duration |

When `pause_during_schedule` is enabled, temporary shields are more generous — they only tick down during vulnerable hours.

## Protection Details

| Protection | Default | Description |
|------------|---------|-------------|
| Block overclaim | Yes | Cannot claim shielded territory |
| Protect core | Yes | Core takes no damage |
| Block explosions | Yes | All explosions cancelled in territory |
| Freeze power loss | No | Deaths still cost power (configurable) |

## BossBar Display

When the shield is active, a BossBar appears for all faction members showing:

- Shield type (Schedule or Temporary)
- Time remaining
- Green color with solid style

```yaml
display:
  bossbar:
    enabled: true
    color: GREEN
    style: SOLID
    format: "<green>Shield Active (%type%) — %remaining% remaining"
```

![Shield BossBar active](./images/shield-bossbar.png)
<!-- SCREENSHOT: Capture a player's screen while the shield is active showing the green BossBar at the top with the formatted text "Shield Active (Schedule) - 5h 12m remaining". The player should be standing in their faction territory with some builds visible below the BossBar. -->

## Faction Show Integration

Shield status appears in `/f show` output when `show_in_fshow` is enabled, letting other factions see:

- Whether a faction has a shield active
- What time slot they have chosen (public information)

This transparency helps raiders plan and prevents confusion about why claims cannot be taken.

## Bypass Permission

Admins with `cyberfactions.shield.bypass` can overclaim shielded territory. This is intended for administrative actions only.

## Anti-Abuse Design

The shield system includes several anti-abuse measures:

1. **Slot cooldown** — Cannot swap windows to reactively block raids
2. **Max duration cap** — Temp shields cannot provide indefinite protection
3. **Public visibility** — Everyone can see when you are protected
4. **Limited hours** — Maximum daily coverage ensures a vulnerability window exists

## Use Cases

| Scenario | Solution |
|----------|----------|
| European faction, raids happen at 3 AM | Set shield to "22:00-06:00" |
| New faction needs time to build | Admin grants 48h temp shield |
| Weekend warriors, vulnerable on weekdays | Set shield covering work hours |
| Event compensation after server issues | Admin grants temp shield to affected factions |

## Configuration

All shield settings live in `gameplay/shield.yml`. Hot-reload with `/f reload`.
