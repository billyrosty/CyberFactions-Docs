# Events

CyberFactions fires standard Bukkit events through the API module. Listening to them requires **only** the `cyberfactions-api` dependency — no need for the plugin jar.

## Dependency

```groovy
repositories {
    maven { url = 'https://billyrosty.github.io/CyberFactions-API' }
}

dependencies {
    compileOnly 'fr.billyrosty:cyberfactions-api:<version>'
}
```

All event classes live in `fr.billyrosty.factions.api.event.faction` and `fr.billyrosty.factions.api.event.player`.

## Base class

Every event extends `CyberFactionsEvent` (which extends Bukkit's `Event`). All events are fired on the **main server thread**.

## Faction events

All faction events are in `fr.billyrosty.factions.api.event.faction`.

### Lifecycle

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FactionCreateEvent` | Yes | `getCreator()` → `FPlayerSnapshot`, `getFaction()` → `FactionSnapshot` |
| `FactionDisbandEvent` | Yes | `getPlayer()`, `getFaction()` |
| `FactionRenameEvent` | Yes | `getPlayer()`, `getFaction()`, `getOldName()`, `getNewName()` |
| `FactionDescriptionChangeEvent` | Yes | `getPlayer()`, `getFaction()`, `getNewDescription()` |
| `FactionUpgradeEvent` | No | `getFaction()`, `getNewLevel()` |
| `FactionsLoadedEvent` | No | `getFactionCount()` |

::: tip FactionsLoadedEvent
Fired once after the storage layer finishes loading all factions at startup. The right moment to build your own indexes.
:::

### Territory

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FactionClaimEvent` | Yes | `getPlayer()`, `getFaction()`, `getClaim()` → `ClaimSnapshot` |
| `FactionUnclaimEvent` | Yes | `getPlayer()`, `getFaction()`, `getClaim()` |
| `FactionUnclaimAllEvent` | Yes | `getPlayer()`, `getFaction()` |
| `FactionHomeSetEvent` | Yes | `getPlayer()`, `getFaction()`, `getLocation()` → `FLocationSnapshot` |

### Core

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FactionCoreSetEvent` | No | `getFaction()`, `getCore()` → `CoreSnapshot` |
| `FactionCoreRemovedEvent` | No | `getFaction()` |
| `FactionCoreAttackedEvent` | No | `getFaction()`, `getCore()` |
| `FactionCoreDestroyedEvent` | No | `getFaction()` |

### Relations & permissions

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FactionRelationChangeEvent` | Yes | `getFaction()`, `getTargetFaction()`, `getRelationId()` |
| `FactionPermissionChangeEvent` | Yes | `getPlayer()`, `getFaction()`, `getPermission()`, `getRole()`, `getNewValue()` |

## Player events

All player events are in `fr.billyrosty.factions.api.event.player`.

### Membership

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FPlayerJoinFactionEvent` | Yes | `getPlayer()` → `FPlayerSnapshot`, `getFaction()` → `FactionSnapshot` |
| `FPlayerLeaveFactionEvent` | Yes | `getPlayer()`, `getFaction()` |
| `FPlayerKickedEvent` | Yes | `getKicker()`, `getKicked()`, `getFaction()` |
| `FPlayerInviteEvent` | Yes | `getInviter()`, `getInvitedName()`, `getFaction()` |
| `FPlayerRoleChangeEvent` | Yes | `getPlayer()`, `getOldRole()`, `getNewRole()` |

### Economy & power

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FPlayerDepositEvent` | No | `getPlayer()`, `getFaction()`, `getAmount()` |
| `FPlayerWithdrawEvent` | No | `getPlayer()`, `getFaction()`, `getAmount()` |
| `FPlayerPowerRegenEvent` | Yes | `getPlayer()`, `getAmount()`, `setAmount(double)` |

::: tip PowerRegenEvent
The only economy-related event you can modify. Call `setAmount()` to change how much power is regenerated, or `setCancelled(true)` to block it entirely.
:::

### Territory & chat

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FPlayerTerritoryEnterEvent` | No | `getPlayer()`, `getFrom()` → `FactionSnapshot`, `getTo()` → `FactionSnapshot` |
| `FPlayerChatModeChangeEvent` | No | `getPlayer()`, `getOldMode()`, `getNewMode()` |

`FPlayerTerritoryEnterEvent` fires on every chunk crossing that changes owning faction. `getFrom()`/`getTo()` return `FactionSnapshot` — one may be the Wilderness faction (id `0`).

## Listening example

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.event.faction.FactionClaimEvent;
import fr.billyrosty.factions.api.event.faction.FactionCreateEvent;
import fr.billyrosty.factions.api.event.player.FPlayerJoinFactionEvent;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;

public final class FactionListener implements Listener {

    @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
    public void onFactionCreate(FactionCreateEvent event) {
        String name = event.getFaction().getName();
        String creator = event.getCreator().getName();
        Bukkit.broadcast(net.kyori.adventure.text.Component.text(
                creator + " founded the faction " + name + "!"));
    }

    @EventHandler(priority = EventPriority.HIGH)
    public void onClaim(FactionClaimEvent event) {
        if ("event_world".equals(event.getClaim().getWorld())) {
            event.setCancelled(true);
            Player player = Bukkit.getPlayer(event.getPlayer().getUuid());
            if (player != null) {
                player.sendMessage("You cannot claim in the event world.");
            }
        }
    }

    @EventHandler
    public void onJoin(FPlayerJoinFactionEvent event) {
        int memberCount = event.getFaction().getMembersCount();
        Bukkit.getLogger().info(event.getPlayer().getName()
                + " joined " + event.getFaction().getName()
                + " (now " + memberCount + " members)");
    }
}
```

Register:

```java
Bukkit.getPluginManager().registerEvents(new FactionListener(), this);
```

::: tip Cancelling
Use `EventPriority.HIGH` (or `HIGHEST`) when you want to veto, and `MONITOR` with `ignoreCancelled = true` when you only want to observe the outcome. Never mutate state from a `MONITOR` handler.
:::

## Snapshot model

All getters return **snapshot interfaces** (`FactionSnapshot`, `FPlayerSnapshot`, `ClaimSnapshot`, `CoreSnapshot`). These are read-only views of the internal state at the moment the event was fired. You cannot modify the faction/player through them — use the API services for mutations:

```java
@EventHandler
public void onCoreDestroyed(FactionCoreDestroyedEvent event) {
    int factionId = event.getFaction().getId();
    // Use the service for any writes
    api.getFactionService().getFaction(factionId).ifPresent(faction -> {
        // react to the destruction...
    });
}
```

## Internal events (advanced)

The core plugin also fires its own internal events in `fr.billyrosty.factions.events.*`. These expose the raw `Faction`, `FPlayer`, `FChunk` types. They are **not part of the API contract** — they may change between releases without notice. Use them only if you need to modify the internal object mid-event (e.g. `setFaction()` on a `FactionCreateEvent`).

To listen to internal events, you need the plugin jar on your classpath:

```groovy
compileOnly fileTree(dir: 'libs', include: ['CyberFactions*.jar'])
```
