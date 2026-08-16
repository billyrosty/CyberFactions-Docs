# Getting Started

This page builds a complete, compilable CyberFactions addon from an empty directory. Everything here is copy-paste ready.

## 1. Get the API jar

The `api` module is published under the coordinates `fr.billyrosty:cyberfactions-api:<version>`.

### Gradle (Groovy)

```groovy
repositories {
    maven { url = 'https://billyrosty.github.io/CyberFactions-API' }
}

dependencies {
    compileOnly 'fr.billyrosty:cyberfactions-api:<version>'
}
```

### Gradle (Kotlin DSL)

```kotlin
repositories {
    maven("https://billyrosty.github.io/CyberFactions-API")
}

dependencies {
    compileOnly("fr.billyrosty:cyberfactions-api:<version>")
}
```

### Maven

```xml
<repositories>
    <repository>
        <id>cyberfactions</id>
        <url>https://billyrosty.github.io/CyberFactions-API</url>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>fr.billyrosty</groupId>
        <artifactId>cyberfactions-api</artifactId>
        <version>VERSION</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

## 2. `build.gradle`

```groovy
plugins {
    id 'java'
}

group = 'com.example'
version = '1.0.0'

repositories {
    mavenCentral()
    maven { url = 'https://repo.papermc.io/repository/maven-public/' }
    maven { url = 'https://billyrosty.github.io/CyberFactions-API' }
}

dependencies {
    compileOnly 'io.papermc.paper:paper-api:1.21.4-R0.1-SNAPSHOT'

    // The API module — interfaces, events, and snapshot models.
    compileOnly 'fr.billyrosty:cyberfactions-api:<version>'
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

compileJava.options.encoding = 'UTF-8'
```

::: tip Java 21
CyberFactions targets Paper 1.21.4 on Java 21. Compiling your addon with a lower toolchain works, but a higher one does not.
:::

## 3. `plugin.yml`

```yaml
name: MyFactionAddon
version: 1.0.0
main: com.example.myaddon.MyAddon
api-version: '1.21'
author: YourName

# Hard dependency: guarantees CyberFactions' onEnable() runs before yours,
# and that your plugin is not loaded at all when CyberFactions is missing.
depend: [CyberFactions]

permissions:
  # Register a permission named <permissions_prefix><subcommand> for every /f
  # subcommand you add, otherwise it is filtered out of /f help and of the
  # root tab-completion. The prefix is general.yml -> command.permissions_prefix
  # and defaults to "cyberfactions.".
  cyberfactions.bounty:
    description: Use /f bounty
    default: true
```

::: warning `depend` vs `softdepend`
Use `depend: [CyberFactions]`. With `softdepend`, Bukkit still loads your plugin when CyberFactions is absent, and `CyberFactionsAPIProvider.get()` will throw a `NoClassDefFoundError` before you can even catch the `IllegalStateException`.
:::

## 4. Main class

Two shapes are possible. Pick one.

### Shape A — plain Bukkit plugin

The minimal form. You hold the API yourself and clean up in `onDisable()`.

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.CyberFactionsAPIProvider;
import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;

public final class MyAddon extends JavaPlugin {

    private CyberFactionsAPI api;

    @Override
    public void onEnable() {
        // Defensive guard: depend: [CyberFactions] already covers this, but a
        // clear log line beats a stack trace if someone edits plugin.yml.
        if (Bukkit.getPluginManager().getPlugin("CyberFactions") == null) {
            getLogger().severe("CyberFactions is not installed — disabling.");
            Bukkit.getPluginManager().disablePlugin(this);
            return;
        }

        try {
            this.api = CyberFactionsAPIProvider.get();
        } catch (IllegalStateException e) {
            getLogger().severe("CyberFactions API is not loaded: " + e.getMessage());
            Bukkit.getPluginManager().disablePlugin(this);
            return;
        }

        getLogger().info("Hooked into CyberFactions "
                + api.getPlugin().getDescription().getVersion());

        // ... register your commands, listeners, permissions here
    }

    @Override
    public void onDisable() {
        // Registrations made through the API are NOT cleaned up automatically
        // for a plain plugin — undo them yourself.
        if (api != null) {
            api.getCommandRegistry().unregisterSubCommand("bounty");
        }
    }

    public CyberFactionsAPI api() {
        return api;
    }
}
```

### Shape B — registered addon (recommended)

Implementing `CyberAddon` and registering it with the `AddonRegistry` gets you a lifecycle managed by CyberFactions: your `onEnable(api)` is called with the API already handed to you, `onDisable()` is called automatically when CyberFactions shuts down, and `onReload()` fires on `/f reload`.

::: tip Addon handle as a separate class
We recommend keeping the `CyberAddon` implementation in its own class (not your `JavaPlugin`). This keeps responsibilities clean — the plugin handles Bukkit lifecycle, the addon handle talks to CyberFactions.
:::

`MyAddonHandle.java` — the `CyberAddon` implementation:

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPI;
import fr.billyrosty.factions.api.addon.CyberAddon;
import org.bukkit.plugin.Plugin;

public final class MyAddonHandle implements CyberAddon {

    private final MyAddon plugin;
    private CyberFactionsAPI api;

    public MyAddonHandle(MyAddon plugin) {
        this.plugin = plugin;
    }

    // --- identity ---------------------------------------------------------

    @Override
    public String getId() {
        return "myaddon"; // unique; used as the AddonRegistry key
    }

    @Override
    public String getName() {
        return "MyAddon";
    }

    @Override
    public String getVersion() {
        return plugin.getPluginMeta().getVersion();
    }

    @Override
    public String getAuthor() {
        return "YourName";
    }

    @Override
    public Plugin getOwningPlugin() {
        return plugin;
    }

    @Override
    public String getAddonDescription() {
        return "Puts bounties on enemy faction members.";
    }

    // --- lifecycle --------------------------------------------------------

    @Override
    public void onEnable(CyberFactionsAPI api) {
        this.api = api;
        plugin.getLogger().info("Enabled through the CyberFactions addon registry.");
        // register commands / listeners / permissions here
    }

    @Override
    public void onDisable() {
        if (api != null) {
            api.getCommandRegistry().unregisterSubCommand("bounty");
        }
    }

    @Override
    public void onReload() {
        plugin.getLogger().info("/f reload was run — re-reading my own config.");
    }
}
```

`MyAddon.java` — the Bukkit plugin that registers it:

```java
package com.example.myaddon;

import fr.billyrosty.factions.api.CyberFactionsAPIProvider;
import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;

public final class MyAddon extends JavaPlugin {

    @Override
    public void onEnable() {
        if (Bukkit.getPluginManager().getPlugin("CyberFactions") == null) {
            getLogger().severe("CyberFactions is not installed — disabling.");
            Bukkit.getPluginManager().disablePlugin(this);
            return;
        }
        // registerAddon() calls MyAddonHandle.onEnable(api) synchronously.
        CyberFactionsAPIProvider.get()
                .getAddonRegistry()
                .registerAddon(new MyAddonHandle(this));
    }
}
```

::: tip What the registry does for you
`registerAddon()` throws `IllegalStateException` if an addon with the same `getId()` is already registered. It then calls `onEnable(api)` inside a try/catch — if your `onEnable` throws, the addon is rolled back out of the registry and the stack trace is printed, but CyberFactions itself keeps running. On plugin shutdown, `onDisable()` is called on every registered addon before the API is unregistered.
:::

## 5. First read

A one-liner to prove the wiring works:

```java
api.getFactionService()
   .getFactionByPlayer(player.getUniqueId())
   .ifPresentOrElse(
       f -> player.sendMessage("You are in " + f.getName() + " (level " + f.getLevel() + ")"),
       () -> player.sendMessage("You have no faction."));
```

## Where to go next

- [Examples](/api/examples) — eight fully worked use cases
- [Threading](/api/threading) — read this before touching the API from an async task
- [Commands](/api/commands) — adding `/f bounty`
