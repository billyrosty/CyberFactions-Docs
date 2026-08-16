# Commands & Tab Completion

Addons add subcommands to the plugin's own command (`/f` by default, configurable via `general.yml` → `command.name`) through the `CommandRegistry`.

## CommandRegistry

```java
package fr.billyrosty.factions.api.command;

public interface CommandRegistry {

    void registerSubCommand(FactionSubCommand command);

    void unregisterSubCommand(String name);

    boolean hasSubCommand(String name);

    Collection<FactionSubCommand> getRegisteredCommands();

    void registerTabCompleter(String commandName, int argIndex, TabCompleter completer);

    void unregisterTabCompleter(String commandName, int argIndex);
}
```

`getRegisteredCommands()` returns only the subcommands registered through the API, not the plugin's built-in ones.

::: tip Addon subcommands survive a reload
`/f reload` rebuilds the built-in subcommand list from the fresh configuration. Subcommands added through the API are kept in a separate list and re-appended, so you do not have to re-register them on `onReload()`.
:::

## FactionSubCommand

```java
package fr.billyrosty.factions.api.command;

public interface FactionSubCommand {

    String getName();

    String getDescription();

    default String getLongDescription() {
        return getDescription();
    }

    String getSyntax();

    default boolean canConsole() {
        return false;
    }

    default String getPermission() {
        return null;
    }

    void execute(CommandSender sender, String[] args);

    default List<String> tabComplete(CommandSender sender, String[] args) {
        return Collections.emptyList();
    }
}
```

| Member | Contract |
|--------|----------|
| `getName()` | The literal typed after `/f`. Matched case-insensitively. Registering a name that already exists shadows nothing — **both** handlers run, so check `hasSubCommand(name)` first. |
| `getDescription()` / `getLongDescription()` | Substituted into the `%cmd_desc%` / `%cmd_long_desc%` placeholders of the `/f help` entry. |
| `getSyntax()` | Substituted into `%cmd_syntax%`. Convention is the full form, e.g. `"/f bounty <player> <amount>"`. |
| `canConsole()` | When `false` (the default), a console sender gets the configured "only in game" message and `execute` is never called. |
| `getPermission()` | Checked with `sender.hasPermission(...)` before `execute`. Returning `null` (the default) means no check. **On denial the command silently does nothing** — no message is sent. Send your own from `execute` if you want feedback. |
| `execute(sender, args)` | `args[0]` is **your subcommand name**, so the first real argument is `args[1]`. |
| `tabComplete(sender, args)` | See the warning below — currently never called. |

::: warning `args[0]` is the subcommand name
`/f bounty Steve 500` reaches your `execute` as `args = ["bounty", "Steve", "500"]`. Guard on `args.length` accordingly.
:::

## A complete subcommand

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.command.FactionSubCommand;
import fr.billyrosty.factions.api.model.FactionSnapshot;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public final class BountyCommand implements FactionSubCommand {

    private final CyberFactionsAPI api;

    public BountyCommand(CyberFactionsAPI api) {
        this.api = api;
    }

    @Override
    public String getName() {
        return "bounty";
    }

    @Override
    public String getDescription() {
        return "Put a bounty on an enemy faction";
    }

    @Override
    public String getLongDescription() {
        return "Spends your faction bank to place a bounty on an enemy faction. "
             + "The reward is paid to whoever destroys their core.";
    }

    @Override
    public String getSyntax() {
        return "/f bounty <faction> <amount>";
    }

    @Override
    public boolean canConsole() {
        return false;
    }

    @Override
    public String getPermission() {
        return "cyberfactions.bounty";
    }

    @Override
    public void execute(CommandSender sender, String[] args) {
        Player player = (Player) sender; // safe: canConsole() == false

        if (args.length < 3) {
            player.sendMessage("Usage: " + getSyntax());
            return;
        }

        FactionSnapshot own = api.getFactionService()
                .getFactionByPlayer(player.getUniqueId())
                .orElse(null);
        if (own == null) {
            player.sendMessage("You are not in a faction.");
            return;
        }

        FactionSnapshot target = api.getFactionService().getFaction(args[1]).orElse(null);
        if (target == null) {
            player.sendMessage("Unknown faction: " + args[1]);
            return;
        }
        if (target.getId() == own.getId()) {
            player.sendMessage("You cannot put a bounty on your own faction.");
            return;
        }

        double amount;
        try {
            amount = Double.parseDouble(args[2]);
        } catch (NumberFormatException e) {
            player.sendMessage("'" + args[2] + "' is not a number.");
            return;
        }
        if (amount <= 0) {
            player.sendMessage("The bounty must be positive.");
            return;
        }

        if (!api.getEconomyService().hasEnough(own.getId(), amount)) {
            player.sendMessage("Your faction bank only holds "
                    + api.getEconomyService().getBalance(own.getId()) + ".");
            return;
        }

        api.getEconomyService().withdraw(own.getId(), amount);
        player.sendMessage("Bounty of " + amount + " placed on " + target.getName() + ".");
    }
}
```

Register and unregister it:

```java
// onEnable
api.getCommandRegistry().registerSubCommand(new BountyCommand(api));

// onDisable
api.getCommandRegistry().unregisterSubCommand("bounty");
```

## Making it visible in `/f help` and tab-completion

The root tab-completion and the `/f help` listing both filter subcommands by a Bukkit permission built as:

```
<general.yml: command.permissions_prefix> + <subcommand name>
```

With the default prefix `cyberfactions.`, `/f bounty` is only listed to players holding `cyberfactions.bounty`. Declare it in your `plugin.yml`:

```yaml
permissions:
  cyberfactions.bounty:
    description: Use /f bounty
    default: true
```

::: warning This is separate from `getPermission()`
`getPermission()` gates *execution*. The `permissions_prefix` permission gates *visibility*. They are two different checks and, unless you use the same node for both, a player can be shown a command they cannot run — or run one they were never shown.
:::

## Tab completion

```java
package fr.billyrosty.factions.api.command;

@FunctionalInterface
public interface TabCompleter {

    List<String> complete(CommandSender sender, String[] args);
}
```

```java
api.getCommandRegistry().registerTabCompleter("bounty", 1, (sender, args) ->
        api.getFactionService().getAllFactions().stream()
                .filter(f -> !f.isSystemFaction() && !f.isAdmin())
                .map(FactionSnapshot::getName)
                .filter(name -> name.toLowerCase().startsWith(args[1].toLowerCase()))
                .toList());

api.getCommandRegistry().registerTabCompleter("bounty", 2, (sender, args) ->
        List.of("100", "1000", "10000"));

// onDisable
api.getCommandRegistry().unregisterTabCompleter("bounty", 1);
api.getCommandRegistry().unregisterTabCompleter("bounty", 2);
```

`argIndex` is the index into the argument array **including** the subcommand name, so index `1` is the first argument after `/f bounty`. Supported indices are `1` through `4`; anything higher is stored but never consulted.

::: danger Dynamic tab completers are currently inert
`registerTabCompleter(String, int, TabCompleter)` stores your completer in a map that the plugin's tab-completion handler never reads. As of `1.0.4` the call compiles, registers, and produces **no completions at runtime**.

The plugin's completer does support a static `List<String>` variant internally, but that overload is not exposed on `CommandRegistry`. `FactionSubCommand.tabComplete(...)` is not called either — the bridge that adapts an API subcommand to the internal one does not forward it.

Until this is fixed there is no working way for an addon to contribute `/f` tab-completions. Register your completers anyway so they start working on the release that wires them up.
:::

## Registering a separate top-level command

If you need real tab-completion today, register an ordinary Bukkit command in your own `plugin.yml` instead of a `/f` subcommand, and call the API from it:

```yaml
commands:
  bounty:
    description: Put a bounty on an enemy faction
    usage: /bounty <faction> <amount>
    permission: cyberfactions.bounty
```

```java
getCommand("bounty").setExecutor((sender, cmd, label, args) -> { /* ... */ return true; });
getCommand("bounty").setTabCompleter((sender, cmd, label, args) -> List.of(/* ... */));
```
