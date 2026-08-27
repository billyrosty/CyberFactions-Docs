# Configuration Overview

CyberFactions uses 18 YAML configuration files, organized into folders by category.

## File Structure

```
plugins/CyberFactions/configurations/
├── general.yml          # Core settings, server identity, command config
├── databases.yml        # Storage backends (SQLite, MySQL, Redis)
├── factions.yml         # Faction features (create, invite, fly, power, etc.)
├── lang.yml             # All player-facing messages
├── translations/        # Ready-made translations (FR, DE, ES, PT-BR)
├── gameplay/
│   ├── claims.yml       # Claim costs, radius, borders
│   ├── combat.yml       # Combat tagging, borders
│   ├── core.yml         # Faction core settings
│   ├── map.yml          # /f map display settings
│   ├── quests.yml       # Quest definitions
│   ├── shield.yml       # Shield system
│   ├── taxes.yml        # Tax collection settings
│   ├── teleportation.yml # Home/warp teleportation
│   ├── upgrades.yml     # Faction upgrades
│   └── webmap.yml       # Dynmap/BlueMap/Pl3xMap integration
└── social/
    ├── menus.yml        # GUI menu items and layout
    ├── permissions.yml  # Per-relation permissions
    ├── relations.yml    # Relation types and colors
    ├── roles.yml        # Faction role hierarchy
    └── top.yml          # Faction top rankings
```

## Hot Reload

All configs support hot-reload via `/f reload`. No server restart needed.

## Format

CyberFactions uses [MiniMessage](https://docs.advntr.dev/minimessage/format.html) for all text formatting:

```yaml
# Colors
message: "<green>Success! <yellow>%player%</yellow> joined."

# Gradients
title: "<gradient:#89E0FB:#B41AFD>CyberFactions</gradient>"

# Hover/Click
clickable: "<click:run_command:/f home><hover:show_text:'Click to teleport'>Go Home</hover></click>"
```

## Placeholders

Config values support placeholders that are resolved at runtime:

| Placeholder | Context |
|-------------|---------|
| `%player%` / `%player_name%` | Player name |
| `%faction_name%` | Faction name |
| `%command%` | Configured command name |
| `%amount%` | Numeric values |

## Tips

::: tip
Start with the defaults and only change what you need. The default config is production-ready.
:::

::: warning
When editing YAML, watch your indentation. Use spaces, never tabs.
:::
