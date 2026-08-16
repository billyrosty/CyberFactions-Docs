# Events

CyberFactions fires standard Bukkit events. Listening to them is the recommended way to react to faction activity — polling the services on a scheduler is not.

## Where the event classes live

::: danger Events are in the plugin jar, not the API module
The events you can actually listen to are in **`fr.billyrosty.factions.events`**, which is compiled into `CyberFactions.jar`. The `api` module's own `fr.billyrosty.factions.api.event` package contains two classes (`FactionEvent`, `FPlayerEvent`) that **the plugin never fires** — see [the note at the bottom](#the-api-event-package).

To listen to events, add the plugin jar to your compile classpath:

```groovy
dependencies {
    compileOnly 'fr.billyrosty:cyberfactions-api:1.0.4'
    compileOnly fileTree(dir: 'libs', include: ['CyberFactions*.jar'])
}
```

The event getters hand you the plugin's **internal** `Faction`, `FPlayer`, `FChunk`, `FLocation`, `Core` and `FPermission` types — not API snapshots. Those types are not part of the API's compatibility contract and may change between releases. Where possible, read the id / UUID off them immediately and continue through the API:

```java
int factionId = event.getFaction().getId();
api.getFactionService().getFaction(factionId).ifPresent(this::doSomething);
```
:::

All events are fired on the **main server thread**.

## Faction lifecycle

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FactionCreateEvent` | Yes | `getFPlayer()`, `getFaction()` |
| `FactionDisbandEvent` | Yes | `getFPlayer()`, `getFaction()` |
| `FactionRenameEvent` | Yes | `getFPlayer()`, `getFaction()`, `getNewName()`, `getOldName()` |
| `FactionDescChangeEvent` | Yes | `getFPlayer()`, `getFaction()`, `getDesc()` |
| `FactionUpgradeEvent` | No | `getFaction()` |
| `FactionAddedEvent` | No | `getFaction()` |
| `FactionsLoadedEvent` | No | `getFactions()` → `Map<Integer, Faction>` |

::: tip `FactionAddedEvent` vs `FactionCreateEvent`
`FactionCreateEvent` fires when a faction is created **on this server**. `FactionAddedEvent` fires whenever a faction the cache had never seen appears — which includes factions created on *another* server and pushed in over Redis. If you maintain your own per-faction state on a network, hook `FactionAddedEvent`, not `FactionCreateEvent`.
:::

::: tip `FactionsLoadedEvent`
Fired once, after the storage layer has finished loading every faction at startup. This is the right moment to build any index of your own — before it, `getAllFactions()` may still be empty.
:::

## Membership

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FPlayerCreateEvent` | No | `getFPlayer()` |
| `FPlayerInviteEvent` | Yes | `getFPlayer()`, `getInvited()`, `getFaction()` |
| `FPlayerJoinEvent` | Yes | `getFPlayer()`, `getFaction()` |
| `FPlayerLeaveEvent` | Yes | `getFPlayer()`, `getFaction()` |
| `FPlayerKickEvent` | Yes | `getFPlayer()` (the kicker), `getKicked()`, `getFaction()` |
| `FPlayerRoleChangeEvent` | Yes | `getFPlayer()`, `getRole()` → `Role` |

`FPlayerCreateEvent` fires the first time a player ever joins and an `FPlayer` record is created for them.

## Territory

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FactionClaimEvent` | Yes | `getFPlayer()`, `getFaction()`, `getFChunk()` |
| `FactionUnClaimEvent` | Yes | `getFPlayer()`, `getFaction()`, `getFChunk()` |
| `FactionUnClaimAllEvent` | Yes | `getFPlayer()`, `getFaction()` |
| `FPlayerEnteredFactionEvent` | No | `getFPlayer()`, `getFrom()`, `getTo()` |

`FPlayerEnteredFactionEvent` fires on every chunk crossing that changes owning faction. `getFrom()` and `getTo()` are `Faction` objects, and one of them may be the Wilderness faction (id `0`) rather than `null`.

## Home, warps and core

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FactionSetHomeEvent` | Yes | `getFPlayer()`, `getFaction()`, `getFHome()` → `FLocation` |
| `FPlayerTeleportEvent` | Yes | `getFPlayer()`, `getFrom()`, `getTo()` (both `FLocation`) |
| `FactionSetCoreEvent` | No | `getFaction()`, `getCore()` |
| `FactionDelCoreEvent` | No | `getFaction()` |
| `FactionCoreAttackedEvent` | No | `getFaction()` |
| `FactionCoreDestroyEvent` | No | `getFaction()` |
| `FactionCoreRegenEvent` | No | `getFaction()` |
| `FactionCoreFullRegenEvent` | No | `getFaction()` |

::: warning There is no `FactionDelHomeEvent`
Setting a home fires an event; removing one (`/f delhome`, or a home cleared by an overclaim) does not.
:::

## Relations

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FactionRelationRequestEvent` | No | `getFaction1()`, `getFaction2()`, `getRelationId()` |
| `FactionRelationChangeEvent` | Yes | `getFaction1()`, `getFaction2()`, `getRelationId()` |

`FactionRelationRequestEvent` fires when a relation that has `need_request: true` is proposed. `FactionRelationChangeEvent` fires when it actually takes effect.

## Economy, power and permissions

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FPlayerDepositEvent` | No | `getFPlayer()`, `getFaction()`, `getAmount()` |
| `FPlayerWithdrawEvent` | No | `getFPlayer()`, `getFaction()`, `getAmount()` |
| `PowerRegenEvent` | Yes | `getFPlayer()`, `getPower()` |
| `FactionEditPermissionEvent` | No | `getFPlayer()`, `getFaction()`, `getPermission()` → `FPermission` |

::: warning Deposit and withdraw are not cancellable
`FPlayerDepositEvent` and `FPlayerWithdrawEvent` are notifications only — by the time they fire the bank has already moved. Only `PowerRegenEvent` lets you veto an economy-adjacent change.
:::

## Chat and misc

| Event | Cancellable | Getters |
|-------|:-----------:|---------|
| `FPlayerSwitchChatEvent` | Yes | `getFPlayer()`, `getChatType()` |
| `FPlayerSpyChatStateChangeEvent` | Yes | `getFPlayer()`, `isSpy()` |

## Listening

```java
package com.example.myaddon;

import fr.billyrosty.factions.events.FactionClaimEvent;
import fr.billyrosty.factions.events.FactionCreateEvent;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;

public final class FactionListener implements Listener {

    @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
    public void onFactionCreate(FactionCreateEvent event) {
        String name = event.getFaction().getName();
        Bukkit.broadcast(net.kyori.adventure.text.Component.text(
                "A new faction has risen: " + name));
    }

    @EventHandler(priority = EventPriority.HIGH)
    public void onClaim(FactionClaimEvent event) {
        // Block claims in a protected world.
        if ("event_world".equals(event.getFChunk().getWorld())) {
            event.setCancelled(true);
            Player player = Bukkit.getPlayer(event.getFPlayer().getUuid());
            if (player != null) {
                player.sendMessage("You cannot claim in the event world.");
            }
        }
    }
}
```

Register it as usual:

```java
Bukkit.getPluginManager().registerEvents(new FactionListener(), this);
```

::: tip Cancelling
Use `EventPriority.HIGH` (or `HIGHEST`) when you want to veto, and `MONITOR` with `ignoreCancelled = true` when you only want to observe the outcome. Never mutate state from a `MONITOR` handler.
:::

## The `api.event` package

The API module also ships:

```java
package fr.billyrosty.factions.api.event;

public class FactionEvent extends Event {
    public enum Type {
        CREATED, DISBANDED, CLAIMED, UNCLAIMED, UNCLAIMED_ALL, UPGRADED,
        RENAMED, DESCRIPTION_CHANGED, HOME_SET, HOME_REMOVED,
        CORE_SET, CORE_REMOVED, CORE_ATTACKED, CORE_DESTROYED,
        PERMISSION_CHANGED, RELATION_CHANGED
    }
    public FactionSnapshot getFaction();
    public Type getType();
}

public class FPlayerEvent extends Event {
    public enum Type {
        JOINED_FACTION, LEFT_FACTION, KICKED, ROLE_CHANGED, POWER_CHANGED,
        CHAT_MODE_CHANGED, ENTERED_FACTION_TERRITORY, TELEPORTED
    }
    public FPlayerSnapshot getPlayer();
    public Type getType();
}
```

::: danger These two are never fired
As of `1.0.4`, nothing in CyberFactions constructs or calls `FactionEvent` or `FPlayerEvent`. A listener registered for them will never be invoked. They are a planned snapshot-based replacement for the internal event classes; until they are wired up, use `fr.billyrosty.factions.events.*`.

Neither class implements `Cancellable`, so even once fired they would be observation-only.
:::
