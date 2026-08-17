# Examples

Eight complete, self-contained classes. Each one compiles against the API as it exists in `1.0.4`; where a feature is known not to work at runtime, the example says so inline rather than pretending.

All of them assume you have a `CyberFactionsAPI api` reference obtained as shown in [Getting Started](/api/getting-started).

[[toc]]

## 1. Reading a faction profile

A `/factioninfo <name>` command that renders everything the API exposes about a faction.

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.model.FLocationSnapshot;
import fr.billyrosty.factions.api.model.FPlayerSnapshot;
import fr.billyrosty.factions.api.model.FactionSnapshot;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.jetbrains.annotations.NotNull;

import java.text.SimpleDateFormat;
import java.util.Optional;

public final class FactionInfoCommand implements CommandExecutor {

    private final CyberFactionsAPI api;

    public FactionInfoCommand(CyberFactionsAPI api) {
        this.api = api;
    }

    @Override
    public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command,
                             @NotNull String label, @NotNull String[] args) {
        if (args.length < 1) {
            sender.sendMessage("Usage: /factioninfo <faction>");
            return true;
        }

        Optional<FactionSnapshot> found = api.getFactionService().getFaction(args[0]);
        if (found.isEmpty()) {
            sender.sendMessage("No faction named '" + args[0] + "'.");
            return true;
        }
        FactionSnapshot faction = found.get();

        sender.sendMessage("=== " + faction.getName() + " (#" + faction.getId() + ") ===");
        sender.sendMessage("Description : " + faction.getDescription());
        sender.sendMessage("Level       : " + faction.getLevel());
        sender.sendMessage("Power       : " + faction.getPower() + " / " + faction.getMaxPower());
        sender.sendMessage("Bank        : " + faction.getBank()
                + " / " + api.getEconomyService().getBankLimit(faction.getId()));
        sender.sendMessage("Claims      : " + api.getClaimService().getClaimCount(faction.getId()));
        sender.sendMessage("Created     : "
                + new SimpleDateFormat("yyyy-MM-dd").format(faction.getCreationDate()));

        // getOwner() is null for the Wilderness / SafeZone / WarZone factions.
        if (faction.getOwner() != null) {
            sender.sendMessage("Owner       : "
                    + Bukkit.getOfflinePlayer(faction.getOwner()).getName());
        }

        sender.sendMessage("Members     : " + faction.getMembersCount()
                + " (" + faction.getOnlineMembers().size() + " online)");
        for (FPlayerSnapshot member : faction.getOnlineMembers()) {
            sender.sendMessage("  - " + member.getName()
                    + " [" + member.getRole() + "] power " + member.getPower());
        }

        // getHome() is nullable.
        FLocationSnapshot home = faction.getHome();
        if (home != null) {
            sender.sendMessage("Home        : " + home.getWorld()
                    + " " + (int) home.getX() + "/" + (int) home.getY() + "/" + (int) home.getZ()
                    + " on server " + home.getServer());
        }

        // getCore() is nullable, and null whenever core.yml is disabled.
        if (faction.getCore() != null) {
            sender.sendMessage("Core        : " + faction.getCore().getHealth() + " HP, "
                    + (faction.getCore().isPlaced() ? "placed" : "not placed"));
        }

        // Relations: other faction id -> relation id.
        faction.getRelations().forEach((otherId, relationId) ->
                api.getFactionService().getFaction(otherId).ifPresent(other ->
                        sender.sendMessage("  " + relationId + ": " + other.getName())));

        return true;
    }
}
```

## 2. Reacting to events

Two handlers: one vetoes claims in a protected world, one pays out when a core falls.

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.event.faction.FactionClaimEvent;
import fr.billyrosty.factions.api.event.faction.FactionCoreDestroyedEvent;
import fr.billyrosty.factions.api.event.player.FPlayerJoinFactionEvent;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.plugin.Plugin;

import java.util.Set;

public final class WarListener implements Listener {

    private static final Set<String> PROTECTED_WORLDS = Set.of("event_world", "hub");

    private final CyberFactionsAPI api;
    private final Plugin plugin;

    public WarListener(CyberFactionsAPI api, Plugin plugin) {
        this.api = api;
        this.plugin = plugin;
    }

    @EventHandler(priority = EventPriority.HIGH, ignoreCancelled = true)
    public void onClaim(FactionClaimEvent event) {
        if (!PROTECTED_WORLDS.contains(event.getClaim().getWorld())) {
            return;
        }
        event.setCancelled(true);

        Player player = Bukkit.getPlayer(event.getPlayer().getUuid());
        if (player != null) {
            player.sendMessage("This world cannot be claimed.");
        }
    }

    @EventHandler(priority = EventPriority.MONITOR)
    public void onCoreDestroyed(FactionCoreDestroyedEvent event) {
        int factionId = event.getFaction().getId();
        String name = event.getFaction().getName();

        Bukkit.broadcast(net.kyori.adventure.text.Component.text(
                "The core of " + name + " has fallen!"));

        Bukkit.getScheduler().runTaskAsynchronously(plugin, () ->
                api.getEconomyService().withdraw(factionId, 5000));
    }

    @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
    public void onJoinFaction(FPlayerJoinFactionEvent event) {
        int factionId = event.getFaction().getId();
        Player player = Bukkit.getPlayer(event.getPlayer().getUuid());
        if (player == null) {
            return;
        }
        api.getFactionService().getFaction(factionId).ifPresent(faction ->
                player.sendMessage("Welcome to " + faction.getName()
                        + " — level " + faction.getLevel()
                        + ", " + api.getClaimService().getClaimCount(factionId) + " claims."));
    }
}
```

All events used here (`FactionClaimEvent`, `FactionCoreDestroyedEvent`, `FPlayerJoinFactionEvent`) are in the API module — no plugin jar needed.

## 3. Adding `/f warchest`

A full `FactionSubCommand` with a permission gate, argument parsing and a bank write.

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.command.FactionSubCommand;
import fr.billyrosty.factions.api.model.FactionSnapshot;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public final class WarchestCommand implements FactionSubCommand {

    private final CyberFactionsAPI api;

    public WarchestCommand(CyberFactionsAPI api) {
        this.api = api;
    }

    @Override
    public String getName() {
        return "warchest";
    }

    @Override
    public String getDescription() {
        return "Convert faction bank into war points";
    }

    @Override
    public String getLongDescription() {
        return "Spends faction bank funds at a 100:1 rate to buy war points, "
             + "which are spent on siege equipment.";
    }

    @Override
    public String getSyntax() {
        return "/f warchest <amount>";
    }

    @Override
    public boolean canConsole() {
        return false; // execute() may therefore cast sender to Player safely
    }

    @Override
    public String getPermission() {
        return "cyberfactions.warchest";
    }

    @Override
    public void execute(CommandSender sender, String[] args) {
        Player player = (Player) sender;

        // args[0] is "warchest" — the first real argument is args[1].
        if (args.length < 2) {
            player.sendMessage("Usage: " + getSyntax());
            return;
        }

        FactionSnapshot faction = api.getFactionService()
                .getFactionByPlayer(player.getUniqueId())
                .orElse(null);
        if (faction == null) {
            player.sendMessage("You need a faction to do that.");
            return;
        }

        boolean allowed = api.getPermissionRegistry()
                .hasPermission(faction.getId(), player.getUniqueId(), "BANK_WITHDRAW");
        if (!allowed) {
            player.sendMessage("Your role cannot withdraw from the faction bank.");
            return;
        }

        double amount;
        try {
            amount = Double.parseDouble(args[1]);
        } catch (NumberFormatException e) {
            player.sendMessage("'" + args[1] + "' is not a number.");
            return;
        }
        if (amount <= 0) {
            player.sendMessage("Amount must be positive.");
            return;
        }

        // withdraw() clamps at zero and never fails — check first.
        if (!api.getEconomyService().hasEnough(faction.getId(), amount)) {
            player.sendMessage("Bank holds only "
                    + api.getEconomyService().getBalance(faction.getId()) + ".");
            return;
        }

        api.getEconomyService().withdraw(faction.getId(), amount);
        int points = (int) (amount / 100);
        player.sendMessage("Converted " + amount + " into " + points + " war points.");
    }
}
```

Wire it up, and remember the visibility permission:

```java
api.getCommandRegistry().registerSubCommand(new WarchestCommand(api));
```

```yaml
# plugin.yml
permissions:
  cyberfactions.warchest:
    description: Use /f warchest
    default: true
```

## 4. Tab completion for a subcommand

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.command.CommandRegistry;
import fr.billyrosty.factions.api.command.TabCompleter;
import fr.billyrosty.factions.api.model.FactionSnapshot;
import org.bukkit.command.CommandSender;

import java.util.List;
import java.util.Locale;

public final class WarchestCompletions {

    private final CyberFactionsAPI api;

    public WarchestCompletions(CyberFactionsAPI api) {
        this.api = api;
    }

    public void register() {
        CommandRegistry registry = api.getCommandRegistry();

        // argIndex 1 == the first argument after "/f warchest".
        registry.registerTabCompleter("warchest", 1, amountSuggestions());

        // argIndex 2 == the second argument.
        registry.registerTabCompleter("warchest", 2, enemyFactionNames());
    }

    public void unregister() {
        api.getCommandRegistry().unregisterTabCompleter("warchest", 1);
        api.getCommandRegistry().unregisterTabCompleter("warchest", 2);
    }

    private TabCompleter amountSuggestions() {
        return (CommandSender sender, String[] args) -> List.of("100", "1000", "10000");
    }

    /** Only suggests factions this player's faction is at war with. */
    private TabCompleter enemyFactionNames() {
        return (CommandSender sender, String[] args) -> {
            if (!(sender instanceof org.bukkit.entity.Player player)) {
                return List.of();
            }
            FactionSnapshot own = api.getFactionService()
                    .getFactionByPlayer(player.getUniqueId())
                    .orElse(null);
            if (own == null) {
                return List.of();
            }

            String prefix = args.length > 2 ? args[2].toLowerCase(Locale.ROOT) : "";
            return api.getRelationService()
                    .getFactionsWithRelation(own.getId(), "enemy").stream()
                    .map(id -> api.getFactionService().getFaction(id).orElse(null))
                    .filter(f -> f != null)
                    .map(FactionSnapshot::getName)
                    .filter(name -> name.toLowerCase(Locale.ROOT).startsWith(prefix))
                    .toList();
        };
    }
}
```

::: danger This registers but does not complete
As of `1.0.4` the plugin's tab-completion handler never reads the dynamic completer map that `registerTabCompleter` writes to. The code above is correct against the API and will start working when the plugin wires it up — but it produces no suggestions today. See [Commands](/api/commands#tab-completion) for the workaround.
:::

## 5. A custom permission

Declare it, register it, and gate an action on it.

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.permission.CustomPermission;
import fr.billyrosty.factions.api.permission.PermissionRegistry;
import fr.billyrosty.factions.api.permission.PermissionState;
import fr.billyrosty.factions.api.permission.PermissionType;

import java.util.UUID;

public final class SiegePermission implements CustomPermission {

    public static final String ID = "start_siege";

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public String getDisplayName() {
        return "Start a siege";
    }

    @Override
    public String getDescription() {
        return "Allows declaring a siege against an enemy faction's core.";
    }

    @Override
    public PermissionState getDefaultState() {
        return PermissionState.DENIED;
    }

    @Override
    public PermissionType getType() {
        return PermissionType.ROLE;
    }

    // --- usage -----------------------------------------------------------

    public static void register(CyberFactionsAPI api) {
        api.getPermissionRegistry().registerPermission(new SiegePermission());
    }

    public static boolean canStartSiege(CyberFactionsAPI api, int factionId, UUID player) {
        return api.getPermissionRegistry().hasPermission(factionId, player, ID);
    }
}
```

::: tip Setting permissions per faction
Use `setPermission(factionId, roleId, permissionId, state)` to let faction leaders grant/revoke your custom permission per role. The state is persisted and synced via Redis.
:::

## 6. A custom upgrade property

This one works end to end: server owners can put `maxSieges: 3` on a level in `upgrades.yml` and your addon reads it.

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.upgrade.CustomProperty;
import fr.billyrosty.factions.api.upgrade.UpgradeRegistry;

public final class MaxSiegesProperty implements CustomProperty {

    public static final String KEY = "maxSieges";

    @Override
    public String getKey() {
        return KEY;
    }

    @Override
    public Object getDefaultValue() {
        return 1; // levels that do not define maxSieges fall back to this
    }

    @Override
    public PropertyType getType() {
        return PropertyType.INTEGER;
    }

    // --- usage -----------------------------------------------------------

    public static void register(CyberFactionsAPI api) {
        api.getUpgradeRegistry().registerProperty(new MaxSiegesProperty());
    }

    public static int maxSiegesFor(CyberFactionsAPI api, int factionId) {
        UpgradeRegistry upgrades = api.getUpgradeRegistry();

        // Typed read returns null if the stored value is not an Integer —
        // e.g. if someone wrote `maxSieges: 2.5` in upgrades.yml.
        Integer value = upgrades.getPropertyValue(factionId, KEY, Integer.class);
        if (value != null) {
            return value;
        }

        // Also scale with faction level as a safety net.
        return Math.max(1, upgrades.getFactionLevel(factionId) / 3);
    }

    /** Reading a built-in property works the same way. */
    public static int claimsLimitFor(CyberFactionsAPI api, int factionId) {
        Integer limit = api.getUpgradeRegistry()
                .getPropertyValue(factionId, "claimsLimit", Integer.class);
        return limit == null ? 0 : limit;
    }
}
```

## 7. Manipulating claims

An admin tool that transfers every claim of one faction to another, and a radius-claim helper.

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.model.ClaimSnapshot;
import fr.billyrosty.factions.api.model.FactionSnapshot;
import fr.billyrosty.factions.api.service.ClaimService;
import org.bukkit.Chunk;
import org.bukkit.Location;
import org.bukkit.entity.Player;

import java.util.Collection;
import java.util.List;

public final class ClaimTools {

    private final CyberFactionsAPI api;

    public ClaimTools(CyberFactionsAPI api) {
        this.api = api;
    }

    /**
     * Moves every claim owned by {@code fromId} to {@code toId}.
     * Main thread: claim() notifies the web-map integrations.
     */
    public int transferAllClaims(int fromId, int toId) {
        ClaimService claims = api.getClaimService();

        // Copy the collection first: claim() mutates the table we are reading.
        Collection<ClaimSnapshot> owned = List.copyOf(claims.getClaims(fromId));

        for (ClaimSnapshot claim : owned) {
            claims.claim(toId, claim.getServer(), claim.getWorld(), claim.getX(), claim.getZ());
        }
        return owned.size();
    }

    /**
     * Claims a square of chunks around the player, skipping anything already
     * owned by another faction. No power or claim-limit check is performed by
     * the API — enforce your own.
     */
    public int claimRadius(Player player, int radius) {
        ClaimService claims = api.getClaimService();

        FactionSnapshot faction = api.getFactionService()
                .getFactionByPlayer(player.getUniqueId())
                .orElse(null);
        if (faction == null || faction.isSystemFaction()) {
            return 0;
        }

        Integer limit = api.getUpgradeRegistry()
                .getPropertyValue(faction.getId(), "claimsLimit", Integer.class);
        int budget = (limit == null ? Integer.MAX_VALUE : limit)
                - claims.getClaimCount(faction.getId());

        Chunk centre = player.getLocation().getChunk();
        int claimed = 0;

        for (int dx = -radius; dx <= radius && claimed < budget; dx++) {
            for (int dz = -radius; dz <= radius && claimed < budget; dz++) {
                int x = centre.getX() + dx;
                int z = centre.getZ() + dz;

                // getFactionIdAt returns 0 (Wilderness) for unclaimed land.
                int owner = claims.getFactionIdAt(
                        currentServer(), centre.getWorld().getName(), x, z);
                if (owner != 0) {
                    continue;
                }

                claims.claim(faction.getId(), currentServer(),
                        centre.getWorld().getName(), x, z);
                claimed++;
            }
        }
        return claimed;
    }

    /** Who owns the chunk this player is standing in? */
    public String territoryName(Location location) {
        int factionId = api.getClaimService().getFactionIdAt(location);
        return api.getFactionService().getFaction(factionId)
                .map(FactionSnapshot::getName)
                .orElse("Wilderness");
    }

    /**
     * The Chunk/Location overloads always assume THIS server. In a Redis
     * network, read the server name off any claim to address another one.
     */
    private String currentServer() {
        // Any claim on this server carries the local server name; fall back to
        // the Location overload, which uses it implicitly.
        return api.getClaimService()
                .getClaimAt(anyLocalLocation())
                .map(ClaimSnapshot::getServer)
                .orElse("");
    }

    private Location anyLocalLocation() {
        return org.bukkit.Bukkit.getWorlds().get(0).getSpawnLocation();
    }
}
```

::: warning There is no `getServerName()` on the API
The API exposes the server name on `ClaimSnapshot` and `FLocationSnapshot` but offers no direct accessor for "the name of the server I am running on". If you need it, read it yourself from `plugins/CyberFactions/configurations/general.yml` → `server_name`, or stick to the `Chunk` / `Location` overloads, which fill it in implicitly. The `currentServer()` helper above is a workaround, not a recommendation.
:::

## 8. An async leaderboard

A repeating task that ranks factions off the main thread, then publishes the result back on it.

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.model.FactionSnapshot;
import org.bukkit.Bukkit;
import org.bukkit.plugin.Plugin;
import org.bukkit.scheduler.BukkitTask;

import java.util.Comparator;
import java.util.List;

public final class WealthLeaderboard {

    private final CyberFactionsAPI api;
    private final Plugin plugin;

    private volatile List<String> topTen = List.of();
    private BukkitTask task;

    public WealthLeaderboard(CyberFactionsAPI api, Plugin plugin) {
        this.api = api;
        this.plugin = plugin;
    }

    public void start() {
        // Every 5 minutes. Reads are ConcurrentHashMap lookups, so async is safe.
        task = Bukkit.getScheduler().runTaskTimerAsynchronously(plugin, this::recompute,
                20L * 30, 20L * 60 * 5);
    }

    public void stop() {
        if (task != null) {
            task.cancel();
        }
    }

    private void recompute() {
        List<String> ranked = api.getFactionService().getAllFactions().stream()
                // Never rank Wilderness / SafeZone / WarZone or staff factions.
                .filter(f -> !f.isSystemFaction() && !f.isAdmin())
                .sorted(Comparator.comparingDouble(FactionSnapshot::getBank).reversed())
                .limit(10)
                // Read every value here, inside the stream: snapshots must not
                // escape this method.
                .map(f -> f.getName() + " — " + f.getBank()
                        + " (" + api.getClaimService().getClaimCount(f.getId()) + " claims)")
                .toList();

        this.topTen = ranked;

        // Anything that touches players goes back to the main thread.
        Bukkit.getScheduler().runTask(plugin, () ->
                Bukkit.getOnlinePlayers().forEach(p -> {
                    if (p.hasPermission("cyberfactions.leaderboard.notify")) {
                        p.sendMessage("Wealth leaderboard updated.");
                    }
                }));
    }

    public List<String> getTopTen() {
        return topTen;
    }
}
```

::: tip Why this is safe
`getAllFactions()`, `getBank()` and `getClaimCount()` only read `ConcurrentHashMap`s — no Bukkit call, no blocking I/O. The one thing that touches players is bounced back with `runTask`. See [Threading](/api/threading) for the full per-method verdict.
:::

## Bringing it together

```java
@Override
public void onEnable() {
    if (Bukkit.getPluginManager().getPlugin("CyberFactions") == null) {
        getLogger().severe("CyberFactions is not installed — disabling.");
        Bukkit.getPluginManager().disablePlugin(this);
        return;
    }
    CyberFactionsAPI api = CyberFactionsAPIProvider.get();

    // Registries first — other components read from them.
    SiegePermission.register(api);
    MaxSiegesProperty.register(api);

    // Commands and completions (main thread, enable-time only).
    api.getCommandRegistry().registerSubCommand(new WarchestCommand(api));
    this.completions = new WarchestCompletions(api);
    this.completions.register();

    getCommand("factioninfo").setExecutor(new FactionInfoCommand(api));

    // Listeners.
    Bukkit.getPluginManager().registerEvents(new WarListener(api, this), this);

    // Background work.
    this.leaderboard = new WealthLeaderboard(api, this);
    this.leaderboard.start();
}

@Override
public void onDisable() {
    if (leaderboard != null) leaderboard.stop();
    if (completions != null) completions.unregister();

    CyberFactionsAPI api = CyberFactionsAPIProvider.get();
    api.getCommandRegistry().unregisterSubCommand("warchest");
    api.getPermissionRegistry().unregisterPermission(SiegePermission.ID);
    api.getUpgradeRegistry().unregisterProperty(MaxSiegesProperty.KEY);
}
```

::: warning `CyberFactionsAPIProvider.get()` in `onDisable()`
CyberFactions unregisters the API in its own `onDisable()`. If CyberFactions shuts down before your plugin, `get()` throws `IllegalStateException`. Cache the `CyberFactionsAPI` reference in a field at enable time and use that in `onDisable()`, or wrap the cleanup in a try/catch.
:::
