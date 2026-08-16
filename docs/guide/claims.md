# Territory Claims

Land is power. CyberFactions delivers the most versatile claiming system available — from single-chunk precision to bulk WorldEdit operations. Whether your players are casual builders or competitive raiders, the tools they need are one command away.

## Claiming Basics

Stand in a chunk and claim it for your faction:

```
/f claim
```

That is all it takes. The chunk is instantly yours — protected from outsiders, visible on the map, and contributing to your faction's footprint.

::: info Smart Validation
Every claim is validated against power limits, upgrade-based caps, world blacklists, WorldGuard region restrictions, and connectivity rules. Invalid claims fail silently in batch mode or with clear feedback in single-claim mode.
:::

## Claim Modes

### Single Chunk

```
/f claim
/f claim <x> <z>
```

Claim where you stand, or specify exact chunk coordinates. Coordinate-based claiming works from the in-game map — click a chunk on `/f map` and it claims automatically.

### Radius Claim

```
/f claim radius <n>
```

Claim a square area centered on your position. A radius of 3 claims a 7x7 grid (49 chunks) in one command. The maximum radius is configurable (default: 5, yielding up to 121 chunks).

![Radius claim demonstration](./images/claims-radius.png)
<!-- SCREENSHOT: Run /f claim radius 3 in an open area near another faction's territory. Capture the success message showing "Claimed X chunks" and have /f map open right after to show the green square of newly claimed chunks. If possible, show neighboring enemy territory in red for contrast. -->

### Line Claim

```
/f claim line <n>
```

Claim in a straight line from your position, in the direction you are facing. Perfect for roads, walls, or connecting distant territory. Maximum configurable length (default: 10 chunks).

### Auto-Claim

Walk and claim simultaneously. Every chunk you enter gets claimed until you toggle it off — ideal for tracing natural borders.

### Map Claiming

The interactive `/f map` displays a clickable chunk grid. Hover over any wilderness chunk to see coordinates, then right-click to claim directly from the map view.

![Interactive faction map](./images/claims-map.png)
<!-- SCREENSHOT: Run /f map facing north. Capture the full map display in chat showing colored squares - green for your claims, red for enemies, purple for allies, gray for wilderness. The hover tooltip should be visible on one chunk showing coordinates and "Right-Click: Try to Claim". Make sure the directional arrow indicator is visible. -->

## Claim Borders

Real-time particle borders show exactly where territories begin and end. Players always know when they are approaching enemy lines.

```
/f claim show
```

Toggle border visibility per-player. When enabled, colored particle walls appear at territory edges within view distance.

| Setting | Default | Description |
|---------|---------|-------------|
| Particle type | REDSTONE | Customizable particle effect |
| Update interval | 20 ticks | How often borders refresh |
| View distance | 48 blocks | Maximum render distance |
| Height offset | 1.5 blocks | How high above ground |
| Density | 2 per block | Particle count per border block |

![Particle claim borders](./images/claims-borders.png)
<!-- SCREENSHOT: Stand at the edge of your faction territory looking toward enemy territory. Capture the particle borders - green/your color on your side, red on the enemy side. Best captured as a short GIF showing the particles animating/pulsing. The border should be clearly visible against the terrain with a built base in the background. -->

::: tip Performance Optimized
Borders only render within view distance and update on a configurable tick interval. Even on servers with thousands of claims, particle rendering stays smooth.
:::

## Overclaiming

When a faction's power drops below their claim count, their territory becomes vulnerable. Enemies can forcibly take chunks through overclaiming.

### How It Works

1. Target faction's power falls below their total claims
2. Attacker stands in the target's chunk and runs `/f claim`
3. If the attacker's faction has sufficient power, the chunk transfers ownership

### Configuration

| Setting | Description |
|---------|-------------|
| `power_multiplier` | Power ratio required to overclaim (1.0 = standard) |
| `notify_defenders` | Alert the defending faction when overclaimed |
| `warmup` | Delay in seconds before overclaim completes (0 = instant) |

::: warning Combat Protection
When combat protection is enabled, chunks cannot be overclaimed if defending faction members are in active combat within that chunk. Raiders must eliminate defenders first.
:::

## Connectivity Rules

Optionally require all claims to be connected — no island claiming. This forces factions to build contiguous empires and makes territorial strategy meaningful.

When enabled, each new claim must be adjacent (north, south, east, or west) to an existing faction claim. The first claim has no restriction.

## Economic Cost

Make claiming a strategic investment with progressive pricing:

| Setting | Default | Description |
|---------|---------|-------------|
| Base cost | $100 | Price for each chunk |
| Increase per claim | $25 | Additional cost per existing claim |
| Refund on unclaim | 50% | Money returned when unclaiming |
| Source | Faction bank | Take from bank or player balance |

::: info Progressive Pricing
The 10th claim costs $100 + (9 x $25) = $325. The 50th costs $1,325. This naturally limits sprawl and makes every chunk a decision.
:::

## Unclaiming

```
/f unclaim          — Unclaim current chunk
/f unclaimall       — Unclaim all territory (leadership only)
```

Unclaiming respects the same permission system as claiming. When economic cost is enabled, unclaiming refunds a configurable percentage.

## Special Zones

Admins can create protected zones with custom rulesets:

### Safezone
- No PvP
- No building/breaking
- No interaction
- Explosion protection
- No power loss on death

### Warzone
- PvP enabled
- No building/breaking
- No interaction
- Explosion protection
- No power loss on death

### Wilderness
- PvP enabled
- Building allowed
- Full interaction
- No explosion protection
- Power loss on death

## World & Region Restrictions

- **World blacklist** — Disable claiming in specific worlds (Nether, End, etc.)
- **WorldGuard blacklist** — Prevent claims in protected regions (spawn, arenas)

Both lists are fully configurable and checked on every claim attempt.

## Configuration

All claim settings live in `gameplay/claims.yml`. Hot-reload with `/f reload`.
