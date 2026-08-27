# lang.yml

The language/messages configuration file. Contains all player-facing messages used by CyberFactions, formatted with MiniMessage syntax. This file allows full customization of every message players see.

**Location:** `configurations/lang.yml`

## Overview

The `lang.yml` file is organized into several sections:

1. **Root-level messages** -- Generic messages (no permission, not in faction, PvP disabled, etc.)
2. **factions** -- Display names and descriptions for system factions (Wilderness, SafeZone, WarZone) and core-related notifications
3. **commands** -- Messages for every subcommand (usage, description, success, error messages)

All messages use [MiniMessage](https://docs.advntr.dev/minimessage/format.html) formatting, supporting gradients, hex colors, hover text, click events, and more.

## Structure

```yaml
# Root-level generic messages
no_permission: "<#F7483B>..."
not_in_faction: "<#F7483B>..."
faction_not_exist: "<#F7483B>..."
player_not_found: "<#F7483B>..."
unknown_command: "<#F7483B>..."
only_in_game: "<#F7483B>..."
pvp_disabled: "<#F7483B>..."
pvp_disabled_safezone: "<#F7483B>..."
pvp_disabled_warzone: "<#F7483B>..."
pvp_disabled_wilderness: "<#F7483B>..."
pvp_disabled_relations: "<#F7483B>..."
pvp_disabled_faction: "<#F7483B>..."
cant_place_here: "<#F7483B>..."
cant_break_here: "<#F7483B>..."
cant_interact_here: "<#F7483B>..."
block_place_limit_reached: "<#F7483B>..."
power_loss: "<#FFAB2E>..."
denied_command_relations: "<#F7483B>..."
warmup_cancelled: "<#F7483B>..."
warmup_started: "<#FFAB2E>..."

# System faction display names
factions:
  wilderness:
    name: "<#03D024>Wilderness"
    description: "..."
  safezone:
    name: "<#FFC90B>SafeZone"
    description: "..."
  warzone:
    name: "<#CB0505>WarZone"
    description: "..."
  core:
    attacked: "..."
    regenerated: "..."
    destroyed: "..."
    bank_loss: "..."
    bank_gain: "..."

# Command messages (one section per subcommand)
commands:
  usage: "..."
  help: { ... }
  list: { ... }
  show: { ... }
  create: { ... }
  disband: { ... }
  invite: { ... }
  join: { ... }
  leave: { ... }
  kick: { ... }
  members: { ... }
  desc: { ... }
  rename: { ... }
  promote: { ... }
  demote: { ... }
  permissions: { ... }
  power: { ... }
  claim: { ... }
  autoclaim: { ... }
  unclaim: { ... }
  unclaimall: { ... }
  map: { ... }
  sethome: { ... }
  delhome: { ... }
  home: { ... }
  relation: { ... }
  relations: { ... }
  bank: { ... }
  upgrade: { ... }
  admin: { ... }
  chat: { ... }
  spychat: { ... }
  setcore: { ... }
  delcore: { ... }
  chest: { ... }
  chests: { ... }
  garden: { ... }
  quests: { ... }
  fly: { ... }
  afly: { ... }
  reload: { ... }
```

## The plugin prefix

`plugin_prefix` sits at the top of the file and defines the plugin's chat prefix:

```yaml
plugin_prefix: "<gradient:#89E0FB:#B41AFD><bold>CyberFactions</bold></gradient> <gray>▪</gray> <#89E0FB>"
```

**No message carries the prefix implicitly.** Every message in this file supports `%prefix%`, which resolves to the value above — add it only where you want it:

```yaml
faction_created: "%prefix%<#00D93A>✔ Your faction has been created!"
no_permission: "<#F7483B>⚠ You do not have permission!"
```

`%prefix%` is resolved for chat messages, action bars, titles, broadcasts and console output alike, because every rendering path goes through the same parser. Console logs emitted by the plugin itself (startup, storage, schedulers) keep their prefix unconditionally — it is not driven by this placeholder.

## Available Placeholders

Each message section supports context-specific placeholders. Common placeholders include:

| Placeholder | Context | Description |
|-------------|---------|-------------|
| `%faction_name%` | Most messages | The name of the relevant faction |
| `%player_name%` | Player-related messages | Target player's name |
| `%player%` | Broadcast messages | Acting player's name |
| `%power%` | Power messages | Current power value |
| `%max_power%` | Power messages | Maximum power value |
| `%money%` | Bank messages | Money amount |
| `%time%` | Cooldown messages | Remaining time in seconds |
| `%role%` | Promote/demote messages | Role display name |
| `%relation_singular%` | Relation messages | Relation name (singular) |
| `%relation_plural%` | Relation messages | Relation name (plural) |
| `%command%` | Usage messages | The base command name (e.g., `f`) |
| `%member_name%` | Claim notifications | Acting member's name |
| `%faction_desc%` | Show/desc commands | Faction description |
| `%amount%` | Core bank messages | Money amount lost/gained |
| `%prefix%` | **Every message** | The `plugin_prefix` value defined at the top of the file |

## Command Message Structure

Each command section follows a consistent pattern:

```yaml
commands:
  create:
    usage: "/%command% create <name>"        # Shown when syntax is wrong
    description: "Create a faction"           # Short desc for help pages
    long_description: "Create a faction..."   # Detailed desc (hover text)
    # Specific messages for this command:
    already_in_faction: "..."
    faction_already_exist: "..."
    faction_created: "..."
    broadcast: "..."
```

## MiniMessage Formatting

The file uses MiniMessage format throughout. Common patterns used:

```yaml
# Hex colors
"<#F7483B>Error message"

# Closing hex color tags
"<#F7483B>You lost <#FCFF74>power</#FCFF74> !"

# Hover and click events
"<hover:show_text:'<yellow>Click!'><click:run_command:'/f join %faction%'>Join</click></hover>"

# Gradients
"<gradient:#0095ff:#bb00ff><bold>CyberFactions</bold></gradient>"

# Newlines
"Line one<newline>Line two"
```

::: tip Customization
You can fully customize every message in this file. The MiniMessage format supports rich text features like hover tooltips, clickable text, gradients, and custom hex colors. Refer to the [MiniMessage documentation](https://docs.advntr.dev/minimessage/format.html) for the full format specification.
:::

::: warning Message Length
Keep messages concise. Very long messages with complex formatting (many hover/click events) can cause performance issues when sent to many players simultaneously (e.g., broadcasts).
:::

## Translations

CyberFactions ships with ready-made translations in the `configurations/translations/` folder:

| File | Language |
|------|----------|
| `lang_fr.yml` | French |
| `lang_de.yml` | German |
| `lang_es.yml` | Spanish |
| `lang_pt.yml` | Brazilian Portuguese |

### Switching language

1. Open the translation file you want (e.g. `translations/lang_fr.yml`)
2. Copy its entire content
3. Paste it into `configurations/lang.yml`, replacing the existing content
4. Run `/f reload`

That's it — every message in the plugin is now in the new language.

### Translating to another language

To translate CyberFactions into a language that is not included:

1. Make a copy of `lang.yml`
2. Translate every message value. Change only the displayed text — **keep all of the following intact:**
   - `%placeholder%` tokens (e.g. `%faction_name%`, `%player%`, `%power%`)
   - MiniMessage tags (e.g. `<#F7483B>`, `<gradient:...>`, `<hover:...>`, `<click:...>`)
   - YAML key names and indentation
   - Command argument placeholders like `<player>` inside usage strings
3. Replace the content of `lang.yml` with your translation
4. Run `/f reload`

::: warning Placeholders and tags
Removing or misspelling a `%placeholder%` will show the raw token to players. Removing a MiniMessage tag will break formatting or cause parse errors. Always test your changes in-game after editing.
:::

::: tip Contributing a translation
If you translate the plugin to a new language and want it included in future releases, share it on the Discord — community translations are welcome.
