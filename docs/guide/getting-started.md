# Getting Started

## Requirements

- **Paper 1.21.4+** (or any Paper fork: Purpur, Pufferfish, etc.)
- **Java 21+**
- **Vault** + an economy plugin (EssentialsX, CMI, etc.)

### Optional dependencies

| Plugin | Purpose |
|--------|---------|
| PlaceholderAPI | 70+ placeholders for scoreboards, holograms, tab lists |
| WorldGuard | Prevents claiming in blacklisted regions, disables fly in specific regions |
| WorldEdit | Bulk claim via selection (`/f admin weclaim`) |

| HuskSync | Delays player data loading until inventory is synced (multi-server) |
| HuskHomes | Cross-server respawn at spawn point |
| MythicMobs | "Kill MythicMob" quest objectives |
| DiscordSRV | Discord DM notifications when your core is attacked or destroyed |
| ChatControl Red | Relational placeholder color parsing in chat format |
| Dynmap / BlueMap / Pl3xMap | Display faction claims as colored areas on web map |

## Installation

1. Download the latest `CyberFactions-x.x.x.jar`
2. Place it in your server's `plugins/` folder
3. Start the server — default configs will be generated
4. Stop the server and edit configurations to your liking
5. Restart and you're ready

## First Steps

After installation:

1. **Set your command name** in `general.yml` → `command.name` (default: `f`)
2. **Configure storage** in `databases.yml` (SQLite by default, MySQL for production)
3. **Set up the economy** — ensure Vault and an economy plugin are installed
4. **Review faction settings** in `factions.yml` (creation cost, max members, etc.)
5. **Customize messages** in `lang.yml`

## Multi-Server Setup

See the [Multi-Server Guide](/guide/multi-server) for Redis setup instructions.
