# teleportation.yml

Configures teleportation warmups -- the countdown displayed to players before they are teleported to faction homes or warps. Supports multiple display methods (action bar, title, chat) and sound effects.

**Location:** `configurations/gameplay/teleportation.yml`

## Full Configuration

```yaml
teleportation:
  cancel_warmup_on_damage: true
  home:
    delay: 10
  warmup:
    actionbar:
      enabled: true
      format: "<#FFAB2E>ⓘ Teleportation in <#FCFF74>%duration% seconds</#FCFF74> !"
      remaining_seconds:
        - 10
        - 9
        - 8
        - 7
        - 6
        - 5
        - 4
        - 3
        - 2
        - 1
    title:
      enabled: true
      title_format: "<#FFAB2E>ⓘ Teleportation ⓘ"
      subtitle_format: "<gray><#FCFF74>%duration% seconds</#FCFF74> remaining !"
      remaining_seconds:
        - 10
        - 9
        - 8
        - 7
        - 6
        - 5
        - 4
        - 3
        - 2
        - 1
    chat:
      enabled: true
      format: "<#FFAB2E>ⓘ Teleportation in <#FCFF74>%duration% seconds</#FCFF74> !"
      remaining_seconds:
        - 5
        - 4
        - 3
        - 2
        - 1
    sound:
      enabled: true
      vanilla_sound: "entity.player.levelup"
      custom_sound:
        namespace: ""
        sound: "custom_sound"
```

## Configuration Reference

### Warmup Cancellation

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `teleportation.cancel_warmup_on_damage` | boolean | `true` | Cancel any active warmup when the player takes damage from any source. |

### Home Delay

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `teleportation.home.delay` | integer | `10` | Warmup duration in seconds before teleporting to faction home. The player must remain still during this period; moving cancels the teleport. |

### Warmup Display -- Action Bar

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `warmup.actionbar.enabled` | boolean | `true` | Show countdown messages in the action bar. |
| `warmup.actionbar.format` | string | (see above) | Message format. `%duration%` = seconds remaining. |
| `warmup.actionbar.remaining_seconds` | list | `[10,9,8,...,1]` | Specific seconds at which the action bar message is displayed. |

### Warmup Display -- Title

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `warmup.title.enabled` | boolean | `true` | Show countdown as a title/subtitle on screen. |
| `warmup.title.title_format` | string | (see above) | Title text format (large centered text). |
| `warmup.title.subtitle_format` | string | (see above) | Subtitle text format (smaller text below title). `%duration%` = seconds remaining. |
| `warmup.title.remaining_seconds` | list | `[10,9,8,...,1]` | Specific seconds at which the title is displayed. |

### Warmup Display -- Chat

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `warmup.chat.enabled` | boolean | `true` | Send countdown messages in chat. |
| `warmup.chat.format` | string | (see above) | Chat message format. `%duration%` = seconds remaining. |
| `warmup.chat.remaining_seconds` | list | `[5,4,3,2,1]` | Specific seconds at which the chat message is sent. Note: default only sends for the last 5 seconds to avoid chat spam. |

### Warmup Sound

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `warmup.sound.enabled` | boolean | `true` | Play a sound at each warmup tick. |
| `warmup.sound.vanilla_sound` | string | `"entity.player.levelup"` | Vanilla Minecraft sound ID. Leave blank to disable vanilla sound. |
| `warmup.sound.custom_sound.namespace` | string | `""` | Resource pack sound namespace. Leave blank to disable custom sounds. |
| `warmup.sound.custom_sound.sound` | string | `"custom_sound"` | Resource pack sound key within the namespace. |

::: tip Reducing Chat Spam
The default configuration shows action bar and title for all 10 seconds but only sends chat messages for the final 5 seconds. This keeps players informed without flooding chat. You can further reduce spam by only including `[3, 2, 1]` in the chat `remaining_seconds`.
:::

::: tip Disabling Specific Displays
To use only the action bar (cleanest experience), set:
```yaml
warmup:
  actionbar:
    enabled: true
  title:
    enabled: false
  chat:
    enabled: false
  sound:
    enabled: true
```
:::

::: warning Warmup and Combat
If the combat system is enabled (`combat.yml`), teleportation warmups are automatically cancelled when a player enters combat (if `cancel_teleport: true` in combat config). This is handled separately from the teleportation config.
:::
