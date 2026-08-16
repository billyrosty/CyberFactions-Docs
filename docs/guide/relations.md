# Relations

Diplomacy defines faction gameplay. CyberFactions gives server owners a fully extensible relation system where alliances are strategic, enemies are dangerous, and every relationship type carries real mechanical weight. Create the political landscape your server deserves.

## Built-In Relation Types

Four relation types ship out of the box, each with distinct behaviors:

### Neutral (Default)

The baseline relation between all factions. No special trust, no special hostility.

- PvP: **Enabled**
- Territory permissions: Break denied, Place denied, Interact denied
- Color: White
- Request required: Yes (mutual agreement)

### Enemy

Declare war without asking permission. Enemies get restricted commands and zero territory access.

- PvP: **Enabled**
- Territory permissions: All denied
- Color: Red
- Request required: **No** (unilateral declaration)
- Denied commands: `tpahere`, `home`, `sethome` (configurable)

::: warning Unilateral Declaration
Enemy relations do not require consent from the target faction. One faction can declare another their enemy at any time — just like real conflict.
:::

### Ally

Your closest partners. Allies share territory access and cannot harm each other.

- PvP: **Disabled**
- Territory permissions: Break allowed, Place allowed, Interact allowed
- Color: Purple
- Request required: Yes (mutual agreement)

### Truce

A ceasefire agreement. No combat, limited territory access.

- PvP: **Disabled**
- Territory permissions: Break denied, Place denied, Interact allowed
- Color: Light Purple
- Request required: Yes (mutual agreement)

![Relations overview in /f show](./images/relations-show.png)
<!-- SCREENSHOT: Run /f show on a faction that has multiple relations set - at least one enemy (red), one ally (purple), and one truce (pink). Capture the /f show output where relations are listed with their colored names. The faction should have enough data to fill a convincing info display. -->

## Setting Relations

```
/f relation <type> <faction>
```

Or use any configured alias:

```
/f relation enemy RivalClan
/f relation ally FriendlyFaction
/f relation neutral FormerEnemy
```

### Request System

Relations that require mutual agreement (ally, truce, neutral) send a request to the target faction. The request expires after a configurable timeout (default: 60 minutes). Both factions must send the same relation request for it to take effect.

Relations that do not require consent (enemy) apply immediately upon declaration.

## Relation Limits

Prevent diplomatic sprawl with per-type limits that scale with faction level:

```yaml
RELATIONS_LIMIT:
  ENEMY: 3    # Level 1: max 3 enemies
  ALLY: 1     # Level 1: max 1 ally
```

At higher upgrade levels, these limits increase — allowing established factions to maintain larger diplomatic networks while keeping new factions focused.

## Custom Relation Types

Want more than four relation types? Add your own. Every relation is defined in `social/relations.yml` with full control over behavior:

```yaml
custom_relations:
  vassal:
    name:
      singular: "Vassal"
      plural: "Vassals"
    aliases:
      - "tributary"
    color: "<AQUA>"
    pvp_enabled_between: false
    request:
      needed: true
      timeout: 120
    default_permissions:
      - "PLACE:ALLOWED"
      - "BREAK:DENIED"
      - "INTERACT:ALLOWED"
    denied_commands: []
    gui_item:
      material: CYAN_WOOL
      custom_model_data: 0
      slots: [13]
      page: 1
```

::: tip Infinite Possibilities
Create "Vassal", "Trade Partner", "Non-Aggression Pact", "Coalition" — whatever fits your server's political meta. Each custom relation inherits the full feature set: PvP control, territory permissions, command restrictions, and GUI integration.
:::

## Territory Permissions Per Relation

Each relation type defines default territory permissions that apply when members of that faction enter your territory:

| Relation | Break | Place | Interact |
|----------|-------|-------|----------|
| Neutral | Denied | Denied | Denied |
| Enemy | Denied | Denied | Denied |
| Ally | Allowed | Allowed | Allowed |
| Truce | Denied | Denied | Allowed |

These are the **defaults**. Individual factions can override them through the in-game permissions GUI (`/f permissions <relation>`).

## Denied Commands

Block specific commands from being used in your territory by enemies or other relations:

```yaml
denied_commands:
  - "tpahere"
  - "home"
  - "sethome"
```

This prevents enemies from teleporting reinforcements directly into your territory or setting bypass points near your base.

## Relation Colors

Every relation has a color that appears in:

- The in-game map (`/f map`)
- Chat formatting and placeholders
- Claim border particles
- Faction info displays
- Web map overlays

Colors use MiniMessage format and support any color code, hex value, or named color.

![Faction map showing relation colors](./images/relations-map.png)
<!-- SCREENSHOT: Run /f map in an area where your faction borders multiple other factions with different relations. The map should clearly show green (self), red (enemy), purple (ally), pink (truce), and white (neutral) squares forming a political landscape. Include the legend or hover text showing a faction name with its relation color. -->

## Relation Chat

Dedicated chat channels for each relation type allow private communication between allied or truce factions:

```
/f chat ally     — Speak to all allied factions
/f chat truce    — Speak to all truce factions
/f chat faction  — Speak only to your faction
```

Each channel has its own format and spy format (for admin monitoring).

## Relation Effects

At higher upgrade levels, factions unlock potion effects that apply based on relation:

- **Self territory** — Regeneration, Speed, Strength, Jump Boost, Resistance, Haste
- **Enemy territory** — Poison, Blindness (applied to enemies entering your land)
- **Ally territory** — Speed, Regeneration (bonus for allies visiting)

Effects are configurable per upgrade level — higher-level factions project more power in their territory.

## Viewing Relations

```
/f relations          — List all current faction relations
/f show <faction>     — See another faction's relation to you
```

## GUI Integration

Each relation type has a configurable GUI item for the permissions and relations interface. Custom model data support means you can use resource pack textures for a polished look.

## Configuration

All relation settings live in `social/relations.yml`. Chat formats are in `general.yml`. Hot-reload with `/f reload`.
