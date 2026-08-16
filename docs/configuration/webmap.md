# webmap.yml

Configures web map integration for displaying faction claims on Dynmap, BlueMap, and Pl3xMap. Shows faction territories as colored polygons with popups containing faction information.

**Location:** `configurations/gameplay/webmap.yml`

## Full Configuration

```yaml
webmap:
  enabled: false
  update_delay: 20
  layer_name: "Factions"
  layer_priority: 10
  min_zoom: 0
  fill_opacity: 0.35
  stroke_opacity: 0.8
  stroke_weight: 2
  show_admin_factions: true
  default_color: "3388FF"
  safezone_color: "00FF00"
  warzone_color: "FF0000"
  popup_format: "<b>%name%</b><br>%description%<br>Power: %power%<br>Territory: %claims% chunks<br>Members: %members%"
  dynmap:
    enabled: true
  bluemap:
    enabled: true
  pl3xmap:
    enabled: true
```

## Configuration Reference

### General Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `webmap.enabled` | boolean | `false` | Enable web map integration globally. Requires at least one map plugin (Dynmap, BlueMap, or Pl3xMap) to be installed. |
| `webmap.update_delay` | integer | `20` | Ticks to wait after a claim change before updating the map. Acts as a debounce when multiple claims happen in quick succession (e.g., radius claim). |
| `webmap.layer_name` | string | `"Factions"` | Name of the layer displayed in the map's layer control panel. |
| `webmap.layer_priority` | integer | `10` | Layer rendering priority. Higher values render on top of lower-priority layers. |
| `webmap.min_zoom` | integer | `0` | Minimum zoom level at which faction claims become visible. `0` = always visible. Higher values hide claims when zoomed out. |

### Visual Styling

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `webmap.fill_opacity` | double | `0.35` | Opacity of the filled polygon area (0.0 = transparent, 1.0 = solid). |
| `webmap.stroke_opacity` | double | `0.8` | Opacity of the polygon border line. |
| `webmap.stroke_weight` | integer | `2` | Border line thickness in pixels. |

### Colors

Colors are specified as hex values without the `#` prefix.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `webmap.default_color` | string | `"3388FF"` | Default polygon color for factions that have no custom color set. |
| `webmap.safezone_color` | string | `"00FF00"` | Color for Safezone claims (green). |
| `webmap.warzone_color` | string | `"FF0000"` | Color for Warzone claims (red). |

### Content

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `webmap.show_admin_factions` | boolean | `true` | Whether to display admin faction territories (Safezone, Warzone) on the map. |
| `webmap.popup_format` | string | (see above) | HTML content shown in the popup when clicking a faction's territory. Supports HTML tags for formatting. |

**Popup Placeholders:**

| Placeholder | Description |
|-------------|-------------|
| `%name%` | Faction name |
| `%description%` | Faction description |
| `%power%` | Current faction power |
| `%claims%` | Number of claimed chunks |
| `%members%` | Number of faction members |

### Map Provider Settings

Each map provider can be independently enabled or disabled. You can run multiple providers simultaneously.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `webmap.dynmap.enabled` | boolean | `true` | Enable Dynmap integration. Requires the Dynmap plugin. |
| `webmap.bluemap.enabled` | boolean | `true` | Enable BlueMap integration. Requires the BlueMap plugin. |
| `webmap.pl3xmap.enabled` | boolean | `true` | Enable Pl3xMap integration. Requires the Pl3xMap plugin. |

::: tip Enabling Web Map
To use this feature:
1. Install at least one supported map plugin (Dynmap, BlueMap, or Pl3xMap)
2. Set `webmap.enabled: true`
3. Enable the specific provider under `dynmap`, `bluemap`, or `pl3xmap`
4. Restart the server

Claims will automatically appear on the web map after the next calculation cycle.
:::

::: tip Performance and Update Delay
The `update_delay` setting prevents map updates from firing for every single claim action. When a player uses `/f claim radius 5` (which claims 25 chunks at once), only one map update happens 1 second after the last claim, rather than 25 separate updates.
:::

::: tip Faction Colors
By default, all factions use `default_color` (blue). Faction colors are determined by their relation color defined in `relations.yml`. Admin factions use the dedicated `safezone_color` and `warzone_color` values.
:::

::: warning Plugin Requirements
The web map feature only works if a compatible map plugin is installed and running. If no map plugin is detected, enabling this feature has no effect (and does not cause errors). Each provider is checked independently -- you only need one.
:::
