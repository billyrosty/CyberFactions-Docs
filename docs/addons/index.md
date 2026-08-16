# Addons

CyberFactions ships a public API in a dedicated `api` module. Addons extend the plugin through it without touching the core.

## Official Addons

*Coming soon — official addons will be listed here.*

## What Addons Can Do

- Read factions, players, claims, relations and upgrade properties through the API services
- Create, disband, join, kick and mutate factions and players
- Move money in and out of faction banks
- Claim, unclaim and transfer territory
- Register subcommands under `/f`
- Listen to the plugin's Bukkit events (create, disband, claim, core destroyed, …)
- Declare custom upgrade properties that server owners can set per level in `upgrades.yml`
- Register themselves in the `AddonRegistry` for a managed lifecycle and `/f reload` hook

::: warning Not currently supported
Some things an addon might reasonably expect are **not** available in `1.0.4`:

- Contributing PlaceholderAPI placeholders through the API
- Adding quest objectives or quest types
- Direct access to the storage layer, Redis channels or the SQL schema
- Per-faction custom permissions (they can be declared, but not granted or revoked)
- `/f` tab-completions from an addon

See [Addon Development → Known gaps](/api/addon-development#known-gaps-to-design-around).
:::

## Installing Addons

1. Download the addon `.jar`
2. Place it in `plugins/` (not inside the CyberFactions folder)
3. Restart the server
4. The addon registers itself via the CyberFactions API on enable

Addons declare `depend: [CyberFactions]`, so Bukkit refuses to load them when CyberFactions is missing rather than failing at runtime.

## Developing Addons

- [API Overview](/api/) — what the API exposes
- [Getting Started](/api/getting-started) — a complete addon project
- [Examples](/api/examples) — eight worked use cases
