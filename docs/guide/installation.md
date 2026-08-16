# Installation

## Download

Download CyberFactions from the official marketplace page. You will receive a `.jar` file.

## Server Setup

### Single Server

1. Place `CyberFactions-x.x.x.jar` in your `plugins/` folder
2. Start the server
3. Configuration files are generated in `plugins/CyberFactions/configurations/`
4. Edit configs, then `/f reload` or restart

### Storage Options

CyberFactions supports three storage modes:

| Mode | Use Case | Configuration |
|------|----------|---------------|
| **SQLite** | Single server, small networks | Default, zero setup |
| **MySQL** | Production single server | Set in `databases.yml` |
| **MySQL + Redis** | Multi-server networks | Both configured in `databases.yml` |

### File Structure

After first boot, your config folder will look like:

```
plugins/CyberFactions/configurations/
├── general.yml
├── databases.yml
├── factions.yml
├── lang.yml
├── gameplay/
│   ├── claims.yml
│   ├── combat.yml
│   ├── core.yml
│   ├── map.yml
│   ├── quests.yml
│   ├── shield.yml
│   ├── taxes.yml
│   ├── teleportation.yml
│   ├── upgrades.yml
│   └── webmap.yml
└── social/
    ├── menus.yml
    ├── permissions.yml
    ├── relations.yml
    ├── roles.yml
    └── top.yml
```

## Updating

1. Back up your `configurations/` folder
2. Replace the old jar with the new one
3. Restart the server
4. New config keys will be added automatically with defaults
5. Check release notes for breaking changes

## Troubleshooting

### Plugin won't enable

- Check you're running **Paper 1.21.4+** (not Spigot)
- Verify **Java 21+**: run `java -version`
- Check for errors in the console at startup

### Economy not working

- Ensure **Vault** is installed and enabled
- Ensure an economy provider is registered (EssentialsX, CMI, etc.)
- Run `/vault-info economy` to verify

### Redis connection failed

- Verify Redis is running: `redis-cli ping`
- Check host/port/password in `databases.yml`
- Ensure your firewall allows the Redis port
