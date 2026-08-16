# Quests

Give factions a reason to play together. The quest system delivers rotating objectives that reward teamwork, drive engagement, and keep players coming back. Every faction member contributes progress toward shared goals — turning your server into a cooperative experience where every kill, every block broken, and every crop harvested matters.

## How Quests Work

Each faction receives a configurable number of active quests (default: 3) drawn from your quest pool. Members contribute progress by performing the required actions during normal gameplay — no special interaction needed. When a quest completes, rewards execute and a new quest rotates in.

```
/f quests
```

Opens the quest GUI where players can view active quests, track progress, and optionally skip quests they cannot complete.

![Quest GUI overview](./images/quests-gui.png)
<!-- SCREENSHOT: Open /f quests GUI. Show 3 active quests at different progress levels - one nearly complete (80%+), one halfway, one just started. Each quest should have its icon visible (zombie head, pickaxe, etc), the progress description in lore, and the progress percentage. Make sure the colored progress indicators are visible. -->

## Quest Actions

CyberFactions supports **8 quest action types** covering all major gameplay loops:

### KILL

Hunt mobs to complete the objective. Supports every vanilla mob type plus MythicMobs integration for custom creatures.

```yaml
KILL:
  zombie_common:
    name: "Zombie Common"
    icon:
      material: "ZOMBIE_HEAD"
      custom_model_data: 0
    value: ZOMBIE
    value_name: "Zombie"
    min: 15
    max: 40
    rewards:
      - "say faction of %player% win 10 xp"
    skip_price: 100
```

### BREAK

Mine or break specific block types. Perfect for resource-gathering objectives.

### PLACE

Build with specific materials. Encourages base construction and development.

### HARVEST

Harvest mature crops. Ties directly into the agricultural gameplay loop.

### CRAFT

Craft specific items. Drives resource processing and workshop activity.

### FISH

Catch fish or treasure. Makes fishing a rewarding faction activity.

### CONSUME

Eat or drink specific items. Encourages resource preparation and cooking.

### KILL_MYTHIC_MOB

Slay custom MythicMobs creatures. Perfect for servers with custom dungeons or boss encounters.

::: tip MythicMobs Integration
If your server runs MythicMobs, quest objectives can target specific custom mob IDs. Create boss-kill quests, dungeon-clear objectives, or event-specific challenges.
:::

## Quest Configuration

Each quest definition controls:

| Field | Description |
|-------|-------------|
| `name` | Display name in the GUI |
| `icon` | Material and custom model data for the GUI item |
| `value` | The target (mob type, block type, item type) |
| `value_name` | Human-readable name shown in descriptions |
| `min` / `max` | Random amount range for the objective |
| `rewards` | List of commands executed on completion |
| `skip_price` | Economy cost to skip this quest |

### Random Objectives

The `min` and `max` fields create variety. A quest might require anywhere from 15 to 40 zombie kills — determined randomly when assigned. This keeps the system fresh even with a small quest pool.

## Rarity Tiers

Design quests at multiple difficulty levels with scaling rewards:

| Tier | Example Target | Typical Reward |
|------|---------------|----------------|
| Common | Kill 15-40 zombies | 10 faction XP |
| Rare | Kill 50-150 zombies | 50 faction XP |
| Legendary | Kill 200-500 zombies | 500 faction XP |

Higher-tier quests have higher skip prices, discouraging players from burning through difficult objectives.

## Rewards

Quest rewards execute as console commands with full placeholder support:

```yaml
rewards:
  - "eco give %player% 1000"
  - "xp set %faction_id% add 50"
  - "give %player% diamond 5"
  - "broadcast &6%faction_name% completed a legendary quest!"
```

::: info Placeholder Support
Use `%player%` for the completing player, `%faction_name%` for the faction, `%faction_id%` for the internal ID. Any PlaceholderAPI placeholder works in reward commands.
:::

## Skipping Quests

Sometimes a quest does not fit. Players with the `SKIP_QUEST` permission can pay the configured skip price to replace an active quest with a new random one.

The skip price is defined per-quest, allowing expensive skips on high-reward quests and cheap skips on common ones.

![Quest skip confirmation](./images/quests-skip.png)
<!-- SCREENSHOT: In the /f quests GUI, hover over a quest item to show the lore with progress percentage, description, and the skip price visible. The lore should show something like "Skip Price: $500" and "Click to skip". Show the tooltip clearly readable against the inventory background. -->

## Progress Tracking

Quest progress is tracked per-faction, not per-player. Every member's actions contribute to the faction's total. The GUI displays:

- Current progress vs. required amount
- Completion percentage
- Descriptive text with the target name

Progress format example: `Kill 25 Zombie - 18/25 72%`

## Faction-Wide Engagement

The shared-progress model creates natural incentives:

- New recruits contribute immediately
- Offline members' progress before logout still counts
- Larger factions complete quests faster (but quests scale for balance)
- Creates discussion about which quests to prioritize

## Configuration

All quest settings live in `gameplay/quests.yml`. Add new quests, adjust amounts, change rewards — all hot-reloadable with `/f reload`.
