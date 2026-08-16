# Web Map Integration

Your players want to see the political landscape at a glance. CyberFactions integrates natively with all three major web map plugins — painting faction territory directly onto your server's live map. Claim borders, faction colors, power data, and member counts are all visible from a browser, turning your web map into a strategic intelligence tool.

## Supported Map Plugins

CyberFactions supports **all three** major web mapping solutions simultaneously:

| Plugin | Status |
|--------|--------|
| **Dynmap** | Full support |
| **BlueMap** | Full support |
| **Pl3xMap** | Full support |

Each provider can be independently enabled or disabled. Running multiple map plugins? CyberFactions renders claims on all of them.

```yaml
dynmap:
  enabled: true
bluemap:
  enabled: true
pl3xmap:
  enabled: true
```

::: tip Zero Configuration
If any supported map plugin is detected, CyberFactions automatically registers its layer. No manual setup beyond toggling `enabled: true`.
:::

## What Gets Rendered

Every claimed chunk appears as a colored polygon on the web map:

- **Faction territory** — Colored by the faction's configured color
- **Safezone** — Green overlay
- **Warzone** — Red overlay
- **Borders** — Visible stroke around each claim group
- **Popup info** — Click any territory to see faction details

![Web map with faction claims](./images/webmap-overview.png)
<!-- SCREENSHOT: Open the Dynmap or BlueMap web interface in a browser. Show a world view with multiple faction territories visible as colored overlays - different colors for different factions. Include at least 3-4 distinct faction territories of varying sizes. The map should show the layer controls with "Factions" visible as a toggleable layer. Zoom level should show the overall political landscape. -->

## Popup Information

Clicking on any faction territory displays a configurable popup with faction details:

```yaml
popup_format: "<b>%name%</b><br>%description%<br>Power: %power%<br>Territory: %claims% chunks<br>Members: %members%"
```

### Available Placeholders

| Placeholder | Description |
|-------------|-------------|
| `%name%` | Faction name |
| `%description%` | Faction description |
| `%power%` | Total faction power |
| `%claims%` | Number of claimed chunks |
| `%members%` | Member count |

The popup supports HTML formatting — bold text, line breaks, and custom styling.

![Faction popup on web map](./images/webmap-popup.png)
<!-- SCREENSHOT: Click on a faction's territory on the web map to open the popup/tooltip. Show the popup displaying the faction name in bold, description, power value, territory count, and member count. The popup should be overlaid on the colored territory with other factions visible in the background. -->

## Visual Configuration

Fine-tune how claims appear on the map:

| Setting | Default | Description |
|---------|---------|-------------|
| `fill_opacity` | 0.35 | Territory fill transparency (0.0 - 1.0) |
| `stroke_opacity` | 0.8 | Border line transparency |
| `stroke_weight` | 2 | Border line thickness in pixels |
| `min_zoom` | 0 | Minimum zoom level to show claims |
| `layer_priority` | 10 | Layer stacking order (higher = on top) |

### Colors

```yaml
default_color: "3388FF"    # Factions without a custom color
safezone_color: "00FF00"   # Safezone claims
warzone_color: "FF0000"    # Warzone claims
```

Colors are hex values without the `#` prefix. Each faction can have its own color — the default is used as a fallback.

## Layer Settings

The faction layer appears in the map's layer controls:

```yaml
layer_name: "Factions"
layer_priority: 10
```

Players can toggle faction territory visibility directly from the map interface.

## Performance

### Debounced Updates

When claims change rapidly (bulk claiming, radius claims), updates are debounced:

```yaml
update_delay: 20  # Ticks after last claim change before updating the map
```

This prevents map recalculation spam during radius claims or auto-claim sessions.

### Efficient Rendering

- Claims are grouped by faction for polygon optimization
- Only changed regions are re-rendered
- Update runs asynchronously — zero tick impact

::: info Server Performance
Web map integration runs entirely asynchronously. Even during mass claim operations, your server TPS is unaffected. The 20-tick debounce ensures efficient batching of updates.
:::

## Admin Factions

Safezone and Warzone claims are optionally displayed on the map:

```yaml
show_admin_factions: true
```

When enabled, admin territories appear with their configured colors (green for Safezone, red for Warzone), giving players a complete picture of protected and dangerous areas.

## Multi-Server Considerations

On multi-server setups with shared web maps, CyberFactions syncs claim data through Redis. All servers contribute to the same map layer, showing the complete political landscape regardless of which server made the claim.

![Web map zoomed in on borders](./images/webmap-borders.png)
<!-- SCREENSHOT: Zoom into an area on the web map where two or more factions share a border. Show the distinct colors meeting at chunk boundaries, with clear stroke lines separating territories. The contrast between faction colors should be visible, and the chunk-level granularity should be apparent at this zoom level. -->

## Setup Guide

1. Install your preferred web map plugin (Dynmap, BlueMap, or Pl3xMap)
2. Set `enabled: true` in `gameplay/webmap.yml`
3. Enable the provider(s) you want under `dynmap:`, `bluemap:`, `pl3xmap:`
4. Reload with `/f reload`
5. Claims appear on the map immediately

No additional plugin bridges or third-party addons required.

## Configuration

All web map settings live in `gameplay/webmap.yml`. Hot-reload with `/f reload`. Changes to visual settings (opacity, colors, weight) apply on the next claim update.
