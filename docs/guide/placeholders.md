# Placeholders

CyberFactions provides [PlaceholderAPI](https://www.spigotmc.org/resources/placeholderapi.6245/) placeholders for use in scoreboards, holograms, tab lists, and more.

All placeholders are **cached** with a 1.5 second TTL for optimal scoreboard performance.

Prefix: `%cfac_<placeholder>%`

## Faction Info

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_name%` | Faction name |
| `%cfac_faction_name-<pattern>%` | Faction name with letter formatting pattern |
| `%cfac_faction_description%` | Faction description |
| `%cfac_faction_id%` | Faction ID (integer) |
| `%cfac_faction_owner%` | Faction owner's name |
| `%cfac_faction_age%` | Faction age (formatted duration) |
| `%cfac_has_faction%` | Whether the player has a faction (true/false) |

## Power

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_power%` | Total faction power |
| `%cfac_faction_max_power%` | Maximum faction power |
| `%cfac_player_power%` | Player's current power |
| `%cfac_player_max_power%` | Player's maximum power (from config) |
| `%cfac_member_power%` | Player's power (alias) |

## Members

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_members_count%` | Total member count |
| `%cfac_faction_total_members%` | Total member count (alias) |
| `%cfac_faction_online_members%` | Online member count |

## Economy

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_bank%` | Faction bank balance (raw number) |
| `%cfac_faction_bank_formatted%` | Faction bank balance (formatted with suffixes) |

## Territory

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_claims_count%` | Number of claimed chunks |
| `%cfac_faction_territory_count%` | Number of claimed chunks (alias) |
| `%cfac_faction_claims_max%` | Maximum claims allowed (from level property) |
| `%cfac_faction_claim_cost%` | Next claim cost (calculated with increment) |
| `%cfac_player_claim_borders%` | Whether claim borders are enabled (true/false) |

## Levels & Upgrades

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_level%` | Faction level (number) |
| `%cfac_faction_level_name%` | Faction level (number, alias) |
| `%cfac_faction_level_displayname%` | Faction level display name (from level config) |
| `%cfac_faction_property-<key>%` | Any faction level property by key |

## Warps

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_warps_count%` | Number of set warps |
| `%cfac_faction_warps_max%` | Maximum warps allowed (from level property) |

## Roles

| Placeholder | Description |
|-------------|-------------|
| `%cfac_player_role%` | Player's role display name |
| `%cfac_member_role_name%` | Player's role display name (MiniMessage) |
| `%cfac_member_role_name_plain%` | Player's role name (stripped of formatting) |
| `%cfac_member_role_name_simple_hex%` | Player's role name (legacy hex format) |
| `%cfac_member_role_prefix%` | Player's role prefix |
| `%cfac_member_role_suffix%` | Player's role suffix |
| `%cfac_role_<id>_prefix%` | Prefix for a specific role by ID |
| `%cfac_role_<id>_suffix%` | Suffix for a specific role by ID |
| `%cfac_role_<id>_display_name%` | Display name for a specific role by ID |

## Combat

| Placeholder | Description |
|-------------|-------------|
| `%cfac_player_combat_tagged%` | Whether player is combat tagged (true/false) |
| `%cfac_player_combat_remaining%` | Seconds remaining on combat tag |
| `%cfac_player_kills%` | Player's kill count |
| `%cfac_player_deaths%` | Player's death count |
| `%cfac_player_kdr%` | Player's kill/death ratio |
| `%cfac_faction_kills%` | Total faction kills (all members combined) |
| `%cfac_faction_deaths%` | Total faction deaths (all members combined) |

## Core

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_core_health%` | Your faction's core health |
| `%cfac_faction_core_health_formatted%` | Your faction's core health (formatted) |
| `%cfac_faction_core_health_<id>%` | Core health for faction by ID |

## Shield

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_shield_active%` | Whether faction has active shield (true/false) |
| `%cfac_faction_shield_type%` | Shield type: Schedule, Temporary, or None |
| `%cfac_faction_shield_remaining%` | Remaining time on temporary shield |
| `%cfac_faction_shield_slot%` | Configured shield slot name (or None) |

## Taxes

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_tax_amount%` | Current tax amount due |
| `%cfac_faction_tax_debt_days%` | Days in tax debt |
| `%cfac_faction_tax_grace_remaining%` | Grace period days remaining |

## Top / Ranking

| Placeholder | Description |
|-------------|-------------|
| `%cfac_top_name_<n>%` | Name of faction at rank N |
| `%cfac_top_value_<n>%` | Points/value of faction at rank N (formatted) |
| `%cfac_top_rank_change_<n>%` | Rank change for faction at rank N (▲2, ▼1, =) |
| `%cfac_self_position%` | Your faction's ranking position (or -) |
| `%cfac_self_value%` | Your faction's points/value (formatted) |
| `%cfac_self_rank_change%` | Your faction's rank change (▲2, ▼1, =) |

## Relations

| Placeholder | Description |
|-------------|-------------|
| `%cfac_faction_relations_<type>%` | Number of factions with given relation type |
| `%cfac_relation_color:{placeholder}%` | Relation color based on another placeholder returning a faction ID |

## Fly

| Placeholder | Description |
|-------------|-------------|
| `%cfac_player_fly%` | Whether player is flying (true/false) |
| `%cfac_player_fly_time%` | Remaining fly time (seconds) |

## Chat

| Placeholder | Description |
|-------------|-------------|
| `%cfac_player_chatmode%` | Current chat mode |
| `%cfac_player_spy%` | Whether spy mode is enabled (true/false) |
| `%cfac_member_name%` | Player's name |

## Relational Placeholders

These require two players (used in TAB, chat formats with relational support):

| Placeholder | Description |
|-------------|-------------|
| `%rel_cfac_relation_color%` | Relation color between two players (MiniMessage) |
| `%rel_cfac_relation_color_legacy%` | Relation color (legacy &x format) |
| `%rel_cfac_relation_color_simple_hex%` | Relation color (plain hex) |
| `%rel_cfac_relation_id%` | Relation type ID between two players |

## Usage Example

```yaml
lines:
  - "&7Faction: %cfac_faction_name%"
  - "&7Role: %cfac_player_role%"
  - "&7Power: %cfac_faction_power%/%cfac_faction_max_power%"
  - "&7Bank: $%cfac_faction_bank_formatted%"
  - "&7Online: %cfac_faction_online_members%/%cfac_faction_total_members%"
  - "&7Rank: #%cfac_self_position% %cfac_self_rank_change%"
```
