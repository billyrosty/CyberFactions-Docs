# claims.yml

Controls the territory claiming system -- limits, costs, overclaim mechanics, special zone rules, chunk borders visualization, explosion control, claim decay, and radius claiming.

**Location:** `configurations/gameplay/claims.yml`

## Full Configuration

```yaml
claims:
  limit: 10
  blacklisted_worlds:
    - "world_nether"
    - "world_the_end"
  blacklisted_worldguard_regions:
    - "spawn"
  must_be_connected: true
  min_members_to_claim: 1

  interact_whitelist: []

  overclaim:
    power_multiplier: 1.0
    notify_defenders: true
    warmup: 0

  safezone:
    pvp: false
    build: false
    interact: false
    explosions_protection: true
    power_loss: false
  warzone:
    pvp: true
    build: false
    interact: false
    explosions_protection: true
    power_loss: false
  wilderness:
    pvp: true
    build: true
    interact: true
    explosions_protection: false
    power_loss: true

  cost:
    enabled: false
    amount: 100.0
    increase_per_claim: 25.0
    refund_percentage: 50.0
    from_bank: true

  radius:
    max_radius: 5
    max_line: 10

  explosions:
    max_per_chunk_per_minute: 30
    core_damage_per_explosion: 0
    protection_per_relation:
      self: true
      ally: true
      truce: true
      default: false
      enemy: false

  borders:
    enabled: true
    particle: REDSTONE
    interval: 20
    view_distance: 48
    height_offset: 1.5
    density: 2

  decay:
    enabled: false
    inactivity_days: 14
    notify_owner: true
    check_interval_minutes: 60

  grace_period:
    enabled: false
    hours: 24

  # world_limits:
  #   world: 50
  #   resource_world: 10
```

## Configuration Reference

### General Claim Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `claims.limit` | integer | `10` | Default maximum number of claims a faction can have. Can be overridden by upgrade levels. |
| `claims.blacklisted_worlds` | list | `["world_nether", "world_the_end"]` | Worlds where claiming is completely disabled. |
| `claims.blacklisted_worldguard_regions` | list | `["spawn"]` | WorldGuard regions where claiming is blocked. |
| `claims.must_be_connected` | boolean | `true` | If `true`, new claims must be adjacent to existing faction territory (no isolated claims). |
| `claims.min_members_to_claim` | integer | `1` | Minimum number of faction members required before the faction can claim territory. |

### Interact Whitelist

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `claims.interact_whitelist` | list | `[]` | Materials that anyone can right-click inside any claim, regardless of INTERACT and CONTAINER permissions. Only affects right-click interactions, not breaking or placing. |

::: tip Selective Access
A claim protects everything by default. Every entry in this list is a deliberate hole — add materials only when you want them public, for example:
```yaml
interact_whitelist:
  - "STONE_BUTTON"
  - "LEVER"
  - "OAK_PRESSURE_PLATE"
  - "END_PORTAL_FRAME"
```
:::

### Overclaim Settings

Overclaiming allows factions to steal territory from others when the defending faction's power is below their claim count.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `overclaim.power_multiplier` | double | `1.0` | Multiplier for the power requirement to overclaim. `1.0` = need more power than defending faction's claims. `1.5` = need 50% more. |
| `overclaim.notify_defenders` | boolean | `true` | Send a notification to the defending faction when their territory is being overclaimed. |
| `overclaim.warmup` | integer | `0` | Seconds of delay before an overclaim completes. `0` = instant overclaim. |

::: tip Overclaim Balance
Setting `power_multiplier` to `1.5` or `2.0` makes overclaiming harder, giving defenders more time to react. Combined with a `warmup` of 10-30 seconds, this creates a more strategic PvP experience.
:::

### Special Zone Rules

These sections define behavior within admin-controlled zones (Safezone, Warzone) and unclaimed territory (Wilderness).

| Key | Type | Default (Safe/War/Wild) | Description |
|-----|------|-------------------------|-------------|
| `pvp` | boolean | `false` / `true` / `true` | Whether PvP is allowed in this zone. |
| `build` | boolean | `false` / `false` / `true` | Whether block placement/breaking is allowed. |
| `interact` | boolean | `false` / `false` / `true` | Whether block interaction (doors, levers, chests) is allowed. |
| `explosions_protection` | boolean | `true` / `true` / `false` | Whether explosions are blocked in this zone. |
| `power_loss` | boolean | `false` / `false` / `true` | Whether dying in this zone causes power loss. |

### Claim Costs (Economy Integration)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `cost.enabled` | boolean | `false` | Enable monetary cost for claiming chunks. Requires Vault. |
| `cost.amount` | double | `100.0` | Base cost per chunk claimed. |
| `cost.increase_per_claim` | double | `25.0` | Additional cost added for each chunk already owned (progressive pricing). Formula: `amount + (owned_chunks * increase_per_claim)`. |
| `cost.refund_percentage` | double | `50.0` | Percentage of the original cost refunded when unclaiming (0-100). |
| `cost.from_bank` | boolean | `true` | If `true`, cost is deducted from faction bank. If `false`, from the player's personal balance. |

::: tip Progressive Pricing Example
With default settings, claiming costs escalate:
- 1st claim: $100
- 2nd claim: $125
- 3rd claim: $150
- 10th claim: $325

This naturally limits expansion for smaller factions while allowing wealthy factions to grow.
:::

### Radius and Line Claiming

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `radius.max_radius` | integer | `5` | Maximum radius allowed for `/f claim radius <n>`. Claims chunks in a square around the player. |
| `radius.max_line` | integer | `10` | Maximum length for `/f claim line <n>`. Claims chunks in a line in the player's facing direction. |

### Explosion Control

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `explosions.max_per_chunk_per_minute` | integer | `30` | Rate limit on explosions per chunk per minute. Prevents lag from TNT spam. `0` = no limit. |
| `explosions.core_damage_per_explosion` | integer | `0` | Damage dealt to the faction core per explosion within core radius. `0` = disabled. |
| `explosions.protection_per_relation` | map | (see below) | Block player-sourced explosions based on the relation between the source player and the target faction. Only applies to player-triggered explosions (TNT lit by a player, etc.). |

Default relation protection:

| Relation | Protected | Description |
|----------|-----------|-------------|
| `self` | `true` | Own faction territory is protected from self-explosions |
| `ally` | `true` | Allied territory is protected |
| `truce` | `true` | Truce territory is protected |
| `default` | `false` | Neutral territory is NOT protected |
| `enemy` | `false` | Enemy territory is NOT protected |

::: tip Explosion Strategy
With default settings, players cannot blow up their own or allied territory, but can use explosions against neutral and enemy factions. Set `enemy: true` to disable all player-sourced explosions (TNT cannons become useless against claims).
:::

### Chunk Border Visualization

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `borders.enabled` | boolean | `true` | Show particle borders at the edges of faction territories. |
| `borders.particle` | string | `"REDSTONE"` | Particle type used for borders. Common options: `REDSTONE`, `FLAME`, `SOUL_FIRE_FLAME`, `END_ROD`. |
| `borders.interval` | integer | `20` | Ticks between each particle update (20 ticks = 1 second). |
| `borders.view_distance` | integer | `48` | Blocks from the player within which borders are rendered. Higher values increase client-side load. |
| `borders.height_offset` | double | `1.5` | Height above ground level where particles spawn. |
| `borders.density` | integer | `2` | Number of particles per block along the border line. Higher = more visible but more resource-intensive. |

::: warning Performance Impact
Chunk borders with high `density` and `view_distance` values can cause client-side lag on lower-end machines. For large servers, consider `view_distance: 32` and `density: 1`.
:::

### Claim Decay

Automatically unclaims territory from inactive factions to keep the map fresh and prevent abandoned claims from blocking active players.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `decay.enabled` | boolean | `false` | Enable automatic claim removal for inactive factions. |
| `decay.inactivity_days` | integer | `14` | Days of total inactivity (all members offline) before claims are removed. |
| `decay.notify_owner` | boolean | `true` | Notify the faction owner when their claims are decayed. |
| `decay.check_interval_minutes` | integer | `60` | Minutes between each inactivity check. |

::: tip Map Maintenance
Enable claim decay on servers where faction turnover is high. A 14-day inactivity window is generous enough that vacationing players won't lose territory, but short enough to keep the map clean.
:::

### New Faction Grace Period

Protects newly created factions from being overclaimed immediately after formation, giving them time to establish themselves.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `grace_period.enabled` | boolean | `false` | Grant overclaim immunity to newly created factions. |
| `grace_period.hours` | integer | `24` | Hours of overclaim immunity after faction creation. |

### Per-World Claim Limits

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `world_limits` | map | (none) | Per-world claim limits that override the global `limit`. Commented out by default. |

```yaml
world_limits:
  world: 50
  resource_world: 10
```

::: tip Resource Worlds
Use per-world limits to restrict claims in resource or event worlds while allowing full expansion in the main world.
:::
