# Factions

Your players deserve more than a basic "create and forget" faction system. CyberFactions gives every faction a living identity — from the moment of creation through growth, diplomacy, and dominance. Every aspect of faction management is polished, intuitive, and fully configurable.

## Creating a Faction

Players create their faction with a single command. The system validates names in real-time, enforces configurable length limits, and prevents duplicates — no more "xXx" clans cluttering your server.

```
/f create <name>
```

::: tip Naming Controls
You decide the rules: minimum and maximum name length, alphanumeric-only or alphabetic, forced uppercase, and a blacklist for inappropriate names. Every constraint is defined in `factions.yml`.
:::

![Faction creation success message](./images/factions-create.png)
<!-- SCREENSHOT: Run /f create Legends in-game. Capture the success message with the gradient-colored plugin prefix. The chat should show the broadcast announcing the new faction to all online players. -->

### Creation Features

| Feature | Description |
|---------|-------------|
| **Cooldown** | Configurable delay between faction creations (prevents spam) |
| **Broadcast** | Optional server-wide announcement when a faction is born |
| **Name validation** | Length limits, character restrictions, blacklist |
| **Force uppercase** | Optionally require all-caps faction names |

## Managing Members

A faction is only as strong as its people. CyberFactions provides a complete member management toolkit that keeps leadership smooth and drama-free.

### Inviting Players

```
/f invite <player>
```

Invitations expire after a configurable timeout (default: 60 minutes), so stale invites never pile up. Players accept with `/f join <faction>`.

### Kicking Members

```
/f kick <player>
```

Role hierarchy is automatically respected — you can only kick members below your rank.

### Member Limits

Member capacity scales with your faction's upgrade level. Start small, grow big. The default cap and the upgraded limits are all defined in your upgrade configuration.

![Faction members list GUI](./images/factions-members.png)
<!-- SCREENSHOT: Open the members GUI by running /f members. Show a faction with 4-5 members at different roles (Leader with netherite sword icon, Officer with golden sword, Members with iron sword). The GUI should show player heads with role colors visible in the item names. -->

## Faction Description

Every faction tells a story. Descriptions appear when players enter your territory and in faction info displays.

```
/f desc <text>
```

- Configurable minimum and maximum length
- Default description assigned at creation
- Displayed in territory notifications (chat, actionbar, and title)

## Renaming Your Faction

Leaders can rebrand at any time. The same validation rules apply — length, characters, blacklist, and uniqueness checks all run in real-time.

```
/f rename <new name>
```

::: info Broadcast
Renaming can optionally broadcast to the entire server, so everyone knows when a faction rebrands.
:::

## Faction Information

```
/f show [faction]
```

Displays a comprehensive overview of any faction: members, power, claims, relations, bank balance, upgrade level, core status, and shield schedule — all in one clean display.

## Faction List

```
/f list
```

Browse all factions on the server with a paginated display. Choose between a chat-based list or a full GUI — configurable per-server.

![Faction list GUI](./images/factions-list.png)
<!-- SCREENSHOT: Run /f list with the GUI mode enabled. Show the inventory GUI with multiple faction entries displayed as items (player heads or banners). Each entry should show faction name, member count, and power in the lore. Fill the GUI with at least 6-8 factions for a convincing display. -->

## Power System

Power is the lifeblood of territorial control. Every player has individual power that contributes to their faction's total — and that total determines how much land you can hold.

| Setting | Default | Description |
|---------|---------|-------------|
| Starting power | 2 | Power when a player first joins |
| Minimum | -10 | Lowest possible power |
| Maximum | 10 | Highest possible power |
| Per hour | 100 | Passive power regeneration |
| Per kill | +0.25 | Reward for PvP kills |
| Per death | -1 | Penalty for dying |

::: warning Overclaiming
When a faction's total power drops below their claim count, enemies can **overclaim** their territory. Keep your power up or risk losing everything.
:::

### Offline Power Loss

Configurable daily power drain for inactive players ensures that ghost factions slowly lose their grip. Set the rate and the minimum floor — or disable it entirely.

## Faction Bank

Every faction has a shared bank account for collective wealth management.

```
/f bank deposit <amount>
/f bank withdraw <amount>
```

The bank funds claims, upgrades, and daily tax payments. Bank capacity increases with faction level, giving established factions the economic muscle to sustain larger empires.

## Faction Fly

Let your players soar over their territory with a time-limited fly system.

```
/f fly
```

- Credit-based: players start with configurable fly seconds
- Faction-territory restricted (with configurable territory types via upgrades)
- World and WorldGuard region blacklists
- Works across relation territories at higher upgrade levels

![Player flying over faction territory](./images/factions-fly.png)
<!-- SCREENSHOT: Have a player use /f fly over a built-up faction base. Capture them mid-flight with the faction territory below, ideally with particle borders visible at the edges. The player should be 10-15 blocks in the air looking down at builds. -->

## Territory Notifications

When players cross faction borders, they know it. CyberFactions supports **three simultaneous notification types** — all independently toggleable:

- **Chat message** — Colored faction name with description
- **Action bar** — Persistent bottom-of-screen display
- **Title** — Full-screen dramatic entrance
- **Sound** — Vanilla or custom resource pack sounds

::: tip Full Customization
Every notification format uses MiniMessage syntax — gradients, hex colors, hover events, click actions. Make territory entry feel premium.
:::

## AFK & Inactivity

Automated cleanup keeps your server fresh:

- Configurable inactivity threshold (default: 60 days)
- Auto-leave removes ghost players from factions
- Optional data purge for truly inactive accounts
- Scheduler interval is adjustable for performance tuning

## Configuration

Every value on this page lives in `factions.yml`. Hot-reload with `/f reload` — no restart required.
