# Multi-Server Setup

CyberFactions supports full cross-server synchronization via Redis. All faction data, claims, and player states are synced in real-time.

## Diagnosing a desync

Three layers hold faction and player state, and they can drift apart — a notification lost while
Redis was down, a cache entry evicted, a server that missed an event.

| Layer | Role |
|---|---|
| MySQL | The source of truth. Every mutation is written here. |
| Redis | A fast copy. Receivers read it when a notification arrives. |
| Server memory | Each server's own copy, fed by those notifications. |

```
/f admin inspect faction <name>
/f admin inspect player <name>
```

Reports presence and `lastUpdate` per layer, and says whether they agree. This turns "something
desynced" into a specific layer before you touch anything.

```
/f admin sync faction <name>
/f admin sync player <name>
/f admin sync all
```

Re-reads the authoritative row from MySQL, replaces the local copy, rewrites the Redis cache and
notifies the other servers — the same three steps the reconnect resync performs, aimed at one
entity. `all` is the blunt instrument for after an incident.

If `inspect` reports the entity absent from MySQL, `sync` will refuse: there is nothing
authoritative to restore, and the entity should be removed rather than resurrected.

::: tip Both commands run off the main thread
They read through JDBC and block on Redis. Results arrive in chat a moment later.
:::

## Requirements

- **MySQL** database (shared between all servers)
- **Redis** server (6.0+)
- CyberFactions installed on all servers in the network

## Architecture

```
Server A ──┐                    ┌── Server B
            ├── Redis (sync) ──┤
Server C ──┘                    └── Server D
            │
            └── MySQL (persistence)
```

- **Redis** handles real-time sync via pub/sub and streams
- **MySQL** handles persistent storage
- One server is designated as **master** (runs save schedulers)

## Configuration

### 1. MySQL Setup

In `databases.yml` on **all servers**:

```yaml
storage:
  type: MYSQL
  mysql:
    host: "your-mysql-host"
    port: 3306
    database: "cyberfactions"
    username: "user"
    password: "password"
    pool_size: 10
```

### 2. Redis Setup

In `databases.yml` on **all servers**:

```yaml
  redis:
    enabled: true
    host: "your-redis-host"
    port: 6379
    username: ""
    password: "your-redis-password"
    database: 0
```

### 3. Master Server

In `general.yml`, designate **one** server as master:

```yaml
# On master server:
master: true

# On all other servers:
master: false
```

The master server runs:
- Data save schedulers (periodic MySQL flushes)
- Offline player cleanup
- Tax collection
- Upgrade scheduling

### 4. Server Name

Each server needs a unique name in `general.yml`:

```yaml
server_name: "server-1"
```

This is used for cross-server claim identification.

## How Sync Works

| Action | Sync Method |
|--------|-------------|
| Faction create/disband | Redis Stream (reliable) |
| Claim/unclaim | Redis Stream (reliable) |
| Player join/leave faction | Redis Stream (reliable) |
| Chat messages | Redis Pub/Sub (ephemeral) |
| Online player detection | Redis Pub/Sub (ephemeral) |

- **Streams** guarantee delivery even if a server was temporarily disconnected
- **Pub/Sub** is used for ephemeral messages where missing one isn't critical

## Health Monitoring

CyberFactions includes built-in Redis health monitoring:

- Automatic reconnection on disconnect
- Message queuing when Redis is down (up to 10,000 messages)
- Queue flush on reconnection
- Admin alerts when Redis goes down/up
- `/f admin status` shows Redis health, ping, and queue size

## Troubleshooting

### Data not syncing

1. Check Redis connection: `/f admin status`
2. Verify all servers use the same Redis database
3. Check firewall rules between servers and Redis

### Duplicate data after restart

- Ensure only **one** server has `master: true`
- CyberFactions uses `lastUpdate` timestamps for conflict resolution

### High Redis queue

- Indicates Redis was recently disconnected
- Queue flushes automatically on reconnect
- If persistent, check Redis server performance
