# quests.yml

Configures the faction quest system. Quests are randomized objectives assigned to factions that members can complete for rewards. The system supports multiple action types (killing mobs, breaking/placing blocks, crafting, etc.) with configurable difficulty tiers.

**Location:** `configurations/gameplay/quests.yml`

## Full Configuration

```yaml
quests:
  quests_per_faction: 3

actions:
  KILL:
    name: "Kill"
    description: "Kill %amount% %name% - %amount%/%progress% %percent%%"
    lore:
      - "Kill %amount% %name%"
    quests:
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
      zombie_rare:
        name: "Zombie Rare"
        icon:
          material: "ZOMBIE_HEAD"
          custom_model_data: 0
        value: ZOMBIE
        value_name: "Zombie"
        min: 50
        max: 150
        rewards:
          - "say faction of %player% win 10 xp"
        skip_price: 500
      zombie_legendary:
        name: "Zombie Legendary"
        icon:
          material: "ZOMBIE_HEAD"
          custom_model_data: 0
        value: ZOMBIE
        value_name: "Zombie"
        min: 200
        max: 500
        rewards:
          - "say faction of %player% win 10 xp"
        skip_price: 5000
  BREAK:
    name: "Break"
    description: "Break %amount% %name% %percent%"
    values:
  PLACE:
    name: "Place"
    description: "Place %amount% %name%"
    values:
  HARVEST:
    name: "Harvest"
    description: "Harvest %amount% %name%"
    values:
  CRAFT:
    name: "Craft"
    description: "Craft %amount% %name%"
    values:
  FISH:
    name: "Fish"
    description: "Fish %amount% %name%"
    values:
  CONSUME:
    name: "Consume"
    description: "Consume %amount% %name%"
    values:
  KILL_MYTHIC_MOB:
    name: "Kill Mythic Mob"
    description: "Kill %amount% %name%"
    values:
```

## Configuration Reference

### General Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `quests.quests_per_faction` | integer | `3` | Number of active quests assigned to each faction at a time. When one is completed, a new one is randomly assigned. |

### Action Types

Each action type represents a category of objectives. The plugin supports these action types:

| Action | Description | Target Value |
|--------|-------------|--------------|
| `KILL` | Kill specific entity types | Entity type (e.g., `ZOMBIE`, `SKELETON`) |
| `BREAK` | Break specific block types | Material name (e.g., `DIAMOND_ORE`) |
| `PLACE` | Place specific block types | Material name (e.g., `COBBLESTONE`) |
| `HARVEST` | Harvest specific crops | Material name (e.g., `WHEAT`) |
| `CRAFT` | Craft specific items | Material name (e.g., `DIAMOND_SWORD`) |
| `FISH` | Catch specific fish types | Material name (e.g., `COD`) |
| `CONSUME` | Consume specific items | Material name (e.g., `GOLDEN_APPLE`) |
| `KILL_MYTHIC_MOB` | Kill MythicMobs entities | MythicMobs mob ID (requires MythicMobs plugin) |

### Action Structure

Each action type has these properties:

| Key | Type | Description |
|-----|------|-------------|
| `name` | string | Display name for this action type. |
| `description` | string | Description format shown in the quest GUI. Supports `%amount%`, `%name%`, `%progress%`, `%percent%`. |
| `lore` | list | Additional lore lines for the quest item. |
| `quests` | map | Individual quest definitions within this action type. |

### Quest Definition

Each quest within an action type has these properties:

| Key | Type | Description |
|-----|------|-------------|
| `name` | string | Display name of the quest (e.g., "Zombie Common"). |
| `icon.material` | string | Material for the quest icon in the GUI. |
| `icon.custom_model_data` | integer | Custom model data for resource packs. |
| `value` | string | The target entity/block/item type to track. |
| `value_name` | string | Human-readable name for the target (shown in descriptions). |
| `min` | integer | Minimum amount required (random value between min and max is chosen). |
| `max` | integer | Maximum amount required. |
| `rewards` | list | Commands executed when the quest is completed. Supports `%player%` placeholder. |
| `skip_price` | integer | Cost (from faction bank) to skip this quest without completing it. |

### Description Placeholders

| Placeholder | Description |
|-------------|-------------|
| `%amount%` | Required amount to complete the quest |
| `%name%` | Name of the target (value_name) |
| `%progress%` | Current progress count |
| `%percent%` | Completion percentage |

::: tip Creating Quest Tiers
Design quests with increasing difficulty tiers to provide progression:
- **Common** (min: 15, max: 40, skip: 100) -- Easy, quick objectives
- **Rare** (min: 50, max: 150, skip: 500) -- Medium difficulty
- **Legendary** (min: 200, max: 500, skip: 5000) -- Long-term goals with expensive skip costs
:::

::: tip Reward Commands
Rewards are executed as console commands. Common patterns:
```yaml
rewards:
  - "eco give %player% 1000"              # Give money
  - "give %player% diamond 5"             # Give items
  - "lp user %player% permission settemp cyberfactions.fly.bonus 1h"  # Temp perms
  - "f admin shield give %faction% 2"     # Give shield hours
```
:::

::: warning Empty Action Types
Action types with empty `values` (like `BREAK`, `PLACE`, etc. in the default config) are defined but have no quests configured. Add quest entries under them following the same structure as the `KILL` action to activate them.
:::

::: tip MythicMobs Integration
The `KILL_MYTHIC_MOB` action requires the MythicMobs plugin. The `value` field should match the MythicMobs internal mob ID, not the display name.
:::
