# relations.yml

Defines all faction relation types -- how factions interact with each other. Relations control PvP behavior, default permissions in territory, command restrictions, and GUI display. The system is fully customizable: you can add new relation types or modify existing ones.

**Location:** `configurations/social/relations.yml`

## Full Configuration

```yaml
relations:
  self:
    name: "Your faction"
    color: "<GREEN>"
    pvp_enabled_between: false
  default:
    name:
      singular: "Neutral"
      plural: "Neutrals"
    aliases:
      - "neutral"
    color: "<WHITE>"
    pvp_enabled_between: true
    request:
      needed: true
      timeout: 60
    default_permissions:
      - "PLACE:DENIED"
      - "BREAK:DENIED"
      - "INTERACT:DENIED"
    denied_commands: []
    gui_item:
      material: WHITE_WOOL
      custom_model_data: 0
      slots: [ 9 ]
      page: 1
  custom_relations:
    enemy:
      name:
        singular: "Enemy"
        plural: "Enemies"
      aliases: []
      color: "<RED>"
      pvp_enabled_between: true
      request:
        needed: false
        timeout: 60
      default_permissions:
        - "PLACE:DENIED"
        - "BREAK:DENIED"
        - "INTERACT:DENIED"
      denied_commands:
        - "tpahere"
        - "home"
        - "sethome"
      gui_item:
        material: RED_WOOL
        custom_model_data: 0
        slots: [ 10 ]
        page: 1
    ally:
      name:
        singular: "Ally"
        plural: "Allies"
      aliases: []
      color: "<DARK_PURPLE>"
      pvp_enabled_between: false
      request:
        needed: true
        timeout: 60
      default_permissions:
        - "PLACE:ALLOWED"
        - "BREAK:ALLOWED"
        - "INTERACT:ALLOWED"
      denied_commands: []
      gui_item:
        material: MAGENTA_WOOL
        custom_model_data: 0
        slots: [ 11 ]
        page: 1
    truce:
      name:
        singular: "Truce"
        plural: "Truces"
      aliases: []
      color: "<LIGHT_PURPLE>"
      pvp_enabled_between: false
      request:
        needed: true
        timeout: 60
      default_permissions:
        - "PLACE:DENIED"
        - "BREAK:DENIED"
        - "INTERACT:ALLOWED"
      denied_commands: []
      gui_item:
        material: PINK_WOOL
        custom_model_data: 0
        slots: [ 12 ]
        page: 1
```

## Configuration Reference

### Self Relation

The "self" relation defines how a faction views its own members.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `self.name` | string | `"Your faction"` | Display name for the self relation. |
| `self.color` | string | `"<GREEN>"` | MiniMessage color used when displaying faction names to their own members. |
| `self.pvp_enabled_between` | boolean | `false` | Whether PvP is allowed between members of the same faction. |

### Default Relation

The "default" relation applies to all factions that have no explicit relation set. This is the neutral state.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `default.name.singular` | string | `"Neutral"` | Singular name for the relation. |
| `default.name.plural` | string | `"Neutrals"` | Plural name (used in lists). |
| `default.aliases` | list | `["neutral"]` | Command aliases players can use to set this relation. |
| `default.color` | string | `"<WHITE>"` | Display color for faction names in this relation. |
| `default.pvp_enabled_between` | boolean | `true` | Whether PvP is enabled between neutrally-related factions. |
| `default.request.needed` | boolean | `true` | Whether becoming neutral requires mutual agreement. |
| `default.request.timeout` | integer | `60` | Minutes before a relation request expires. |
| `default.default_permissions` | list | (see above) | Default territory permissions for this relation. Format: `"PERMISSION:STATE"`. |
| `default.denied_commands` | list | `[]` | Commands blocked while in territory of factions with this relation. |
| `default.gui_item` | object | (see above) | Item appearance in the permissions GUI. |

### Custom Relations

Custom relations are defined under `custom_relations`. Each follows the same structure as the default relation.

#### Enemy

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enemy.name.singular` | string | `"Enemy"` | Singular display name. |
| `enemy.name.plural` | string | `"Enemies"` | Plural display name. |
| `enemy.color` | string | `"<RED>"` | Display color for enemy faction names. |
| `enemy.pvp_enabled_between` | boolean | `true` | PvP enabled between enemies. |
| `enemy.request.needed` | boolean | `false` | No mutual agreement needed -- a faction can declare another as enemy unilaterally. |
| `enemy.denied_commands` | list | `["tpahere", "home", "sethome"]` | Commands blocked in enemy territory. |

#### Ally

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `ally.name.singular` | string | `"Ally"` | Singular display name. |
| `ally.name.plural` | string | `"Allies"` | Plural display name. |
| `ally.color` | string | `"<DARK_PURPLE>"` | Display color for allied faction names. |
| `ally.pvp_enabled_between` | boolean | `false` | PvP disabled between allies. |
| `ally.request.needed` | boolean | `true` | Both factions must agree to become allies. |
| `ally.default_permissions` | list | All `ALLOWED` | Allies get full build/interact access by default. |

#### Truce

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `truce.name.singular` | string | `"Truce"` | Singular display name. |
| `truce.name.plural` | string | `"Truces"` | Plural display name. |
| `truce.color` | string | `"<LIGHT_PURPLE>"` | Display color for truce faction names. |
| `truce.pvp_enabled_between` | boolean | `false` | PvP disabled between truced factions. |
| `truce.request.needed` | boolean | `true` | Both factions must agree. |
| `truce.default_permissions` | list | Interact `ALLOWED`, others `DENIED` | Truced factions can interact but not build. |

### Default Permissions Format

Permissions are specified as `"PERMISSION_NAME:STATE"` where state is one of:
- `ALLOWED` -- Permission is granted
- `DENIED` -- Permission is explicitly blocked

Available permission names: `BREAK`, `PLACE`, `INTERACT` (for relations).

### GUI Item Properties

| Key | Type | Description |
|-----|------|-------------|
| `material` | string | Item material shown in the permissions menu. |
| `custom_model_data` | integer | Custom model data for resource packs. |
| `slots` | list | Slot positions in the permissions GUI. |
| `page` | integer | Page number where this relation appears. |

::: tip Adding Custom Relations
You can add new relations by creating new entries under `custom_relations`. For example, to add a "vassal" relation:
```yaml
custom_relations:
  vassal:
    name:
      singular: "Vassal"
      plural: "Vassals"
    aliases: ["vassal"]
    color: "<GOLD>"
    pvp_enabled_between: false
    request:
      needed: true
      timeout: 60
    default_permissions:
      - "PLACE:ALLOWED"
      - "BREAK:ALLOWED"
      - "INTERACT:ALLOWED"
    denied_commands: []
    gui_item:
      material: GOLD_BLOCK
      custom_model_data: 0
      slots: [13]
      page: 1
```
The new relation will automatically be available via `/f relation vassal <faction>`.
:::

::: warning Default Relation Cannot Be Deleted
The `default` relation serves as the baseline state for all factions. You can rename it and change its properties, but you cannot remove it. All factions without an explicit relation are treated as the default.
:::

::: tip Enemy Relation and Unilateral Declaration
The enemy relation has `request.needed: false` by default, meaning any faction can declare another as an enemy without their consent. This is by design for PvP servers -- it prevents factions from being "unkillable" by refusing enemy requests.
:::
