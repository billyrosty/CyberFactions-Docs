# Addon Development

An *addon* is an ordinary Bukkit plugin that registers a `CyberAddon` handle with CyberFactions. Doing so buys you three things a plain plugin does not get: a managed lifecycle, a `/f reload` hook, and visibility to other addons through the `AddonRegistry`.

This page covers the addon contract itself. For the project setup — Gradle, `plugin.yml`, obtaining the API — start with [Getting Started](/api/getting-started).

## The contract

```java
package fr.billyrosty.factions.api.addon;

public interface CyberAddon {

    String getId();

    String getName();

    String getVersion();

    String getAuthor();

    Plugin getOwningPlugin();

    default String getAddonDescription() {
        return "";
    }

    void onEnable(CyberFactionsAPI api);

    void onDisable();

    default void onReload() {}
}
```

| Method | Contract |
|--------|----------|
| `getId()` | Unique key in the registry. Lower-case, no spaces. Registering a duplicate id throws `IllegalStateException`. |
| `getName()` | Human-readable, used in log lines. |
| `getVersion()` / `getAuthor()` | Used in the enable log line and readable by other addons. |
| `getOwningPlugin()` | Your `JavaPlugin` instance. Lets CyberFactions attribute the addon to a plugin. |
| `getAddonDescription()` | Optional, defaults to `""`. |
| `onEnable(api)` | Called **synchronously from inside `registerAddon()`**, on whatever thread you called it from. Do your registration here. Throwing rolls the addon back out of the registry. |
| `onDisable()` | Called by `unregisterAddon(id)` and automatically on server shutdown. |
| `onReload()` | Called for every registered addon when an operator runs `/f reload`. |

::: tip
We recommend keeping the addon handle in its own class rather than on your `JavaPlugin`. Full example in [Getting Started](/api/getting-started#shape-b-registered-addon-recommended).
:::

## Lifecycle

```
CyberFactions onEnable()
  └─ managers, schedulers, hooks
  └─ CyberFactionsAPIProvider.register(api)     ← API becomes available

Your plugin onEnable()                          ← guaranteed after, via depend:
  └─ addonRegistry.registerAddon(handle)
       └─ handle.onEnable(api)                  ← synchronous

/f reload
  └─ handle.onReload()                          ← for every registered addon

CyberFactions onDisable()
  └─ handle.onDisable()                         ← for every registered addon
  └─ CyberFactionsAPIProvider.unregister()
```

::: warning Shutdown order is not yours to choose
Bukkit disables plugins in reverse load order, so your plugin's `onDisable()` normally runs **before** CyberFactions'. But if CyberFactions is disabled first — a crash, a plugin manager, a reload plugin — `CyberFactionsAPIProvider.get()` throws inside your `onDisable()`. Always cache the API in a field rather than re-fetching it during shutdown.
:::

## What to do in `onEnable(api)`

```java
@Override
public void onEnable(CyberFactionsAPI api) {
    this.api = api;

    // 1. Registries — declare your extensions before anything reads them.
    api.getPermissionRegistry().registerPermission(new SiegePermission());
    api.getUpgradeRegistry().registerProperty(new MaxSiegesProperty());

    // 2. Commands — main thread, enable-time only. The registry is not
    //    thread-safe and is read from the command thread.
    api.getCommandRegistry().registerSubCommand(new WarchestCommand(api));

    // 3. Listeners — register under YOUR plugin, not CyberFactions'.
    Bukkit.getPluginManager().registerEvents(new WarListener(api, plugin), plugin);

    // 4. Background work.
    this.leaderboard = new WealthLeaderboard(api, plugin);
    this.leaderboard.start();
}
```

## What to do in `onDisable()`

CyberFactions does **not** unwind your registrations for you. Undo them yourself, in reverse:

```java
@Override
public void onDisable() {
    if (leaderboard != null) {
        leaderboard.stop();
    }
    if (api != null) {
        api.getCommandRegistry().unregisterSubCommand("warchest");
        api.getCommandRegistry().unregisterTabCompleter("warchest", 1);
        api.getPermissionRegistry().unregisterPermission("start_siege");
        api.getUpgradeRegistry().unregisterProperty("maxSieges");
    }
}
```

Bukkit cancels your tasks and unregisters your listeners when your own plugin disables, so those two need no manual cleanup — but a `CyberAddon` disabled through `unregisterAddon()` while your plugin stays enabled does need it.

## What to do in `onReload()`

`/f reload` re-reads every CyberFactions configuration file and rebuilds the conditional parts of the plugin. Your subcommands are preserved across the rebuild, so you do not need to re-register them. Use `onReload()` to re-read **your own** configuration and to refresh anything you cached from CyberFactions' config:

```java
@Override
public void onReload() {
    plugin.reloadConfig();
    this.siegeCost = plugin.getConfig().getDouble("siege-cost", 5000);

    // Anything you cached from CyberFactions' own config is now stale.
    this.warmup = api.getTeleportationService().getWarmupDuration();
}
```

## Discovering other addons

```java
AddonRegistry registry = api.getAddonRegistry();

// Optional integration.
registry.getAddon("cyberquests").ifPresent(other ->
        plugin.getLogger().info("Integrating with " + other.getName()
                + " v" + other.getVersion()));

// Roster, e.g. for a /addons command.
for (CyberAddon addon : registry.getRegisteredAddons()) {
    sender.sendMessage(addon.getName() + " v" + addon.getVersion()
            + " by " + addon.getAuthor() + " — " + addon.getAddonDescription());
}
```

::: warning Load order between addons is not guaranteed
`isAddonEnabled(id)` only reports whether the addon is in the registry *right now*. Two addons that register in each other's `onEnable` will see each other or not depending on Bukkit's plugin load order. If addon B needs addon A, declare `depend: [ADependency]` in B's `plugin.yml` and let Bukkit order them.
:::

## Best practices

- **Use `depend: [CyberFactions]`**, never `softdepend`. With `softdepend`, a missing CyberFactions gives you a `NoClassDefFoundError` you cannot catch.
- **Cache the API instance**, never a snapshot. Snapshots wrap live objects and go stale — see [Models](/api/models).
- **Store faction ids and player UUIDs**, and re-resolve them when you need data.
- **Do registration on the main thread at enable time.** The command registry in particular is not thread-safe.
- **Prefer events over polling.** A repeating task that scans `getAllFactions()` every tick is the most common way to make a server feel slow.
- **Batch writes with `mutateFaction` / `mutatePlayer`** — one persist and one Redis broadcast instead of one per field.
- **Declare `<permissions_prefix><subcommand>` in your `plugin.yml`**, or your `/f` subcommand will not appear in `/f help` or in tab-completion.
- **Read [Threading](/api/threading)** before calling anything from an async task.

## Known gaps to design around

| Gap | Work around it by |
|-----|-------------------|
| API writes do not fire events | Do not assume other addons will see your changes; broadcast your own event if it matters |
