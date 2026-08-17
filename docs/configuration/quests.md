# quests.yml

Configures the faction quest system. Quests are randomized objectives assigned to factions that members can complete for rewards. The system supports multiple action types (killing mobs, breaking/placing blocks, crafting, etc.) with configurable difficulty tiers and a structured reward system.

**Location:** `configurations/gameplay/quests.yml`

## Full Configuration

```yaml
quests:
  quests_per_faction: 3

actions:
  KILL:
    name: "Kill"
    description: "Kill %amount% %name% - %progress%/%amount% %percent%%"
    lore:
      - "<gray>Kill <white>%amount% %value_name%"
      - "<gray>Progress: <white>%progress%/%amount% <gray>(%percent%%)"
      - ""
      - "<yellow>Click to skip <gold>(%skip_price%$)"
    quests:
      zombie_common:
        name: "Zombie Hunter"
        icon:
          material: "ZOMBIE_HEAD"
          custom_model_data: 0
        value: ZOMBIE
        value_name: "Zombie"
        min: 15
        max: 40
        rewards:
          money: 200
          faction_bank: 500
          points: 10
        skip_price: 100
      zombie_rare:
        name: "Zombie Slayer"
        icon:
          material: "ZOMBIE_HEAD"
          custom_model_data: 0
        value: ZOMBIE
        value_name: "Zombie"
        min: 50
        max: 150
        rewards:
          money: 750
          faction_bank: 1500
          points: 30
        skip_price: 500
      zombie_legendary:
        name: "Zombie Exterminator"
        icon:
          material: "ZOMBIE_HEAD"
          custom_model_data: 0
        value: ZOMBIE
        value_name: "Zombie"
        min: 200
        max: 500
        rewards:
          money: 3000
          faction_bank: 5000
          points: 100
          power: 5
        skip_price: 5000
      skeleton_common:
        name: "Skeleton Hunter"
        icon:
          material: "SKELETON_SKULL"
          custom_model_data: 0
        value: SKELETON
        value_name: "Skeleton"
        min: 15
        max: 40
        rewards:
          money: 250
          faction_bank: 500
          points: 10
        skip_price: 150
      creeper_rare:
        name: "Creeper Wrangler"
        icon:
          material: "CREEPER_HEAD"
          custom_model_data: 0
        value: CREEPER
        value_name: "Creeper"
        min: 30
        max: 80
        rewards:
          money: 600
          faction_bank: 1200
          points: 25
          items:
            0:
              material: GUNPOWDER
              amount: 16
        skip_price: 400
      enderman_legendary:
        name: "Void Walker"
        icon:
          material: "ENDER_PEARL"
          custom_model_data: 0
        value: ENDERMAN
        value_name: "Enderman"
        min: 50
        max: 150
        rewards:
          money: 2500
          faction_bank: 4000
          points: 80
          power: 3
          items:
            0:
              material: ENDER_PEARL
              amount: 8
        skip_price: 3000
  BREAK:
    name: "Mine"
    description: "Mine %amount% %name% - %progress%/%amount% %percent%%"
    lore:
      - "<gray>Mine <white>%amount% %value_name%"
      - "<gray>Progress: <white>%progress%/%amount% <gray>(%percent%%)"
      - ""
      - "<yellow>Click to skip <gold>(%skip_price%$)"
    quests:
      diamond_ore:
        name: "Diamond Miner"
        icon:
          material: "DIAMOND_ORE"
          custom_model_data: 0
        value: DIAMOND_ORE
        value_name: "Diamond Ore"
        min: 10
        max: 30
        rewards:
          money: 500
          faction_bank: 1000
          points: 20
        skip_price: 300
      ancient_debris:
        name: "Netherite Seeker"
        icon:
          material: "ANCIENT_DEBRIS"
          custom_model_data: 0
        value: ANCIENT_DEBRIS
        value_name: "Ancient Debris"
        min: 3
        max: 10
        rewards:
          money: 2000
          faction_bank: 3000
          points: 60
          power: 2
        skip_price: 2000
      emerald_ore:
        name: "Emerald Prospector"
        icon:
          material: "EMERALD_ORE"
          custom_model_data: 0
        value: EMERALD_ORE
        value_name: "Emerald Ore"
        min: 15
        max: 40
        rewards:
          money: 800
          faction_bank: 1500
          points: 30
        skip_price: 500
  PLACE:
    name: "Build"
    description: "Place %amount% %name% - %progress%/%amount% %percent%%"
    lore:
      - "<gray>Place <white>%amount% %value_name%"
      - "<gray>Progress: <white>%progress%/%amount% <gray>(%percent%%)"
      - ""
      - "<yellow>Click to skip <gold>(%skip_price%$)"
    quests:
      oak_log:
        name: "Lumberjack"
        icon:
          material: "OAK_LOG"
          custom_model_data: 0
        value: OAK_LOG
        value_name: "Oak Log"
        min: 50
        max: 150
        rewards:
          money: 200
          faction_bank: 400
          points: 10
        skip_price: 150
      cobblestone:
        name: "Mason"
        icon:
          material: "COBBLESTONE"
          custom_model_data: 0
        value: COBBLESTONE
        value_name: "Cobblestone"
        min: 100
        max: 300
        rewards:
          money: 300
          faction_bank: 600
          points: 15
        skip_price: 200
  HARVEST:
    name: "Harvest"
    description: "Harvest %amount% %name% - %progress%/%amount% %percent%%"
    lore:
      - "<gray>Harvest <white>%amount% %value_name%"
      - "<gray>Progress: <white>%progress%/%amount% <gray>(%percent%%)"
      - ""
      - "<yellow>Click to skip <gold>(%skip_price%$)"
    quests:
      wheat:
        name: "Wheat Farmer"
        icon:
          material: "WHEAT"
          custom_model_data: 0
        value: WHEAT
        value_name: "Wheat"
        min: 30
        max: 80
        rewards:
          money: 150
          faction_bank: 300
          points: 8
        skip_price: 100
      nether_wart:
        name: "Nether Farmer"
        icon:
          material: "NETHER_WART"
          custom_model_data: 0
        value: NETHER_WART
        value_name: "Nether Wart"
        min: 20
        max: 60
        rewards:
          money: 400
          faction_bank: 800
          points: 15
        skip_price: 250
      carrots:
        name: "Carrot Grower"
        icon:
          material: "CARROT"
          custom_model_data: 0
        value: CARROTS
        value_name: "Carrot"
        min: 25
        max: 70
        rewards:
          money: 180
          faction_bank: 350
          points: 10
        skip_price: 120
  CRAFT:
    name: "Craft"
    description: "Craft %amount% %name% - %progress%/%amount% %percent%%"
    lore:
      - "<gray>Craft <white>%amount% %value_name%"
      - "<gray>Progress: <white>%progress%/%amount% <gray>(%percent%%)"
      - ""
      - "<yellow>Click to skip <gold>(%skip_price%$)"
    quests:
      iron_sword:
        name: "Blacksmith"
        icon:
          material: "IRON_SWORD"
          custom_model_data: 0
        value: IRON_SWORD
        value_name: "Iron Sword"
        min: 5
        max: 15
        rewards:
          money: 300
          faction_bank: 500
          points: 12
        skip_price: 200
      golden_apple:
        name: "Alchemist"
        icon:
          material: "GOLDEN_APPLE"
          custom_model_data: 0
        value: GOLDEN_APPLE
        value_name: "Golden Apple"
        min: 3
        max: 8
        rewards:
          money: 1500
          faction_bank: 2500
          points: 40
          power: 1
        skip_price: 1200
  FISH:
    name: "Fish"
    description: "Fish %amount% %name% - %progress%/%amount% %percent%%"
    lore:
      - "<gray>Catch <white>%amount% %value_name%"
      - "<gray>Progress: <white>%progress%/%amount% <gray>(%percent%%)"
      - ""
      - "<yellow>Click to skip <gold>(%skip_price%$)"
    quests:
      cod:
        name: "Fisherman"
        icon:
          material: "COD"
          custom_model_data: 0
        value: COD
        value_name: "Cod"
        min: 10
        max: 30
        rewards:
          money: 200
          faction_bank: 400
          points: 10
        skip_price: 150
      salmon:
        name: "River Fisher"
        icon:
          material: "SALMON"
          custom_model_data: 0
        value: SALMON
        value_name: "Salmon"
        min: 10
        max: 25
        rewards:
          money: 250
          faction_bank: 500
          points: 12
        skip_price: 180
      pufferfish:
        name: "Exotic Fisher"
        icon:
          material: "PUFFERFISH"
          custom_model_data: 0
        value: PUFFERFISH
        value_name: "Pufferfish"
        min: 5
        max: 15
        rewards:
          money: 600
          faction_bank: 1000
          points: 25
        skip_price: 400
  CONSUME:
    name: "Consume"
    description: "Eat %amount% %name% - %progress%/%amount% %percent%%"
    lore:
      - "<gray>Consume <white>%amount% %value_name%"
      - "<gray>Progress: <white>%progress%/%amount% <gray>(%percent%%)"
      - ""
      - "<yellow>Click to skip <gold>(%skip_price%$)"
    quests:
      golden_apple_consume:
        name: "Golden Diet"
        icon:
          material: "GOLDEN_APPLE"
          custom_model_data: 0
        value: GOLDEN_APPLE
        value_name: "Golden Apple"
        min: 5
        max: 15
        rewards:
          money: 800
          faction_bank: 1500
          points: 30
        skip_price: 600
      cooked_beef:
        name: "Feast"
        icon:
          material: "COOKED_BEEF"
          custom_model_data: 0
        value: COOKED_BEEF
        value_name: "Cooked Beef"
        min: 20
        max: 50
        rewards:
          money: 150
          faction_bank: 300
          points: 8
        skip_price: 100
  KILL_MYTHIC_MOB:
    name: "Kill Mythic Mob"
    description: "Kill %amount% %name% - %progress%/%amount% %percent%%"
    lore:
      - "<gray>Kill <white>%amount% %value_name%"
      - "<gray>Progress: <white>%progress%/%amount% <gray>(%percent%%)"
      - ""
      - "<yellow>Click to skip <gold>(%skip_price%$)"
    quests:
      mythic_example:
        name: "Boss Hunter"
        icon:
          material: "WITHER_SKELETON_SKULL"
          custom_model_data: 0
        value: "SkeletonKing"
        value_name: "Skeleton King"
        min: 1
        max: 5
        rewards:
          money: 5000
          faction_bank: 10000
          points: 200
          power: 10
        skip_price: 10000
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
| `description` | string | Description format shown in the quest GUI. Supports placeholders (see below). |
| `lore` | list | Lore lines for the quest item in the GUI. Supports MiniMessage formatting and placeholders. |
| `quests` | map | Individual quest definitions within this action type. |

### Quest Definition

Each quest within an action type has these properties:

| Key | Type | Description |
|-----|------|-------------|
| `name` | string | Display name of the quest (e.g., "Zombie Hunter"). |
| `icon.material` | string | Material for the quest icon in the GUI. |
| `icon.custom_model_data` | integer | Custom model data for resource packs. |
| `value` | string | The target entity/block/item type to track. |
| `value_name` | string | Human-readable name for the target (shown in descriptions via `%value_name%`). |
| `min` | integer | Minimum amount required (random value between min and max is chosen). |
| `max` | integer | Maximum amount required. If `min > max`, values are auto-swapped with a warning. |
| `rewards` | map | Structured reward definition (see [Rewards](#rewards)). |
| `skip_price` | integer | Cost (from faction bank) to skip this quest without completing it. Requires bank to be enabled. |

### Description Placeholders

| Placeholder | Description |
|-------------|-------------|
| `%amount%` | Required amount to complete the quest |
| `%value_name%` | Name of the target (from `value_name` field) |
| `%name%` | Alias for `%value_name%` |
| `%progress%` | Current progress count |
| `%percent%` | Completion percentage |
| `%skip_price%` | Cost to skip the quest |

## Rewards

Quest rewards use a structured format that handles common reward types natively without requiring external commands. All numeric rewards (money, faction_bank, power, points) are affected by the `QUEST_REWARD_BOOST` upgrade multiplier.

### Reward Structure

```yaml
rewards:
  money: 500            # Vault deposit to the completing player
  faction_bank: 1000    # Deposit to the faction bank
  power: 5              # Player power bonus
  points: 50            # Faction points (contributes to /f top ranking)
  items:                # Direct item rewards (not affected by boost)
    0:
      material: DIAMOND
      amount: 5
      custom_model_data: 0
    1:
      material: GOLDEN_APPLE
      amount: 2
  commands:             # Console commands (not affected by boost)
    - "broadcast %player% completed a quest!"
```

### Reward Types

| Key | Type | Description | Boost Applied |
|-----|------|-------------|:---:|
| `money` | double | Money deposited to the completing player's balance via Vault. | Yes |
| `faction_bank` | double | Money deposited to the faction bank. Respects `BANK_LIMIT`. | Yes |
| `power` | integer | Power added to the completing player. Respects max power cap. | Yes |
| `points` | integer | Points added to the faction total for `/f top` ranking. | Yes |
| `items` | map | Items given directly to the player. Overflow drops on the ground. | No |
| `commands` | list | Console commands executed with `%player%` placeholder. | No |

### Item Reward Structure

| Key | Type | Description |
|-----|------|-------------|
| `material` | string | Bukkit Material name (e.g., `DIAMOND`, `GOLDEN_APPLE`). |
| `amount` | integer | Number of items to give. |
| `custom_model_data` | integer | Custom model data for resource packs. Optional, defaults to 0. |

::: tip Backward Compatibility
If `rewards` is defined as a simple list of strings (old format), it is treated as a list of console commands for backward compatibility:
```yaml
# Old format (still works)
rewards:
  - "eco give %player% 1000"
  - "give %player% diamond 5"
```
:::

::: tip QUEST_REWARD_BOOST Upgrade
The `QUEST_REWARD_BOOST` property in `upgrades.yml` multiplies all numeric quest rewards (money, faction_bank, power, points). At level 2 with a boost of 1.25, a quest giving 1000$ would give 1250$ instead. See [upgrades.yml](./upgrades.md) for configuration.
:::

::: tip Creating Quest Tiers
Design quests with increasing difficulty tiers to provide progression:
- **Common** (min: 15-40, skip: 100-200) -- Easy, quick objectives. Low money + points.
- **Rare** (min: 50-150, skip: 500-1000) -- Medium difficulty. Good rewards + items.
- **Legendary** (min: 200-500, skip: 3000-10000) -- Long-term goals. Power bonus + high money.
:::

::: tip MythicMobs Integration
The `KILL_MYTHIC_MOB` action requires the MythicMobs plugin. The `value` field should match the MythicMobs internal mob ID, not the display name. When MythicMobs is installed, vanilla kills are still tracked normally for `KILL` quests.
:::

::: info Anti-Farm Protection
The `BREAK` and `HARVEST` quest types have built-in anti-farm protection. Player-placed blocks are tagged and do not count toward quest progress, preventing place-and-break cycling.
:::
