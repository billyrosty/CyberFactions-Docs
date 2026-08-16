# databases.yml

Controls the storage backends used by CyberFactions. The plugin supports three storage options: SQLite (default, single-server), MySQL (production, multi-server capable), and Redis (optional caching and cross-server synchronization layer).

**Location:** `configurations/databases.yml`

## Full Configuration

```yaml
storage:
  sqlite:
    enabled: true
    table_prefix: "cyberfactions_"
    max_pool_size: 20
    min_pool_size: 5
    timeout: 30000
  mysql:
    enabled: false
    host: "127.0.0.0"
    port: 3306
    database: "database"
    username: "username"
    password: "password"
    table_prefix: "cyberfactions_"
    use_ssl: false
    max_pool_size: 20
    min_pool_size: 5
    timeout: 30000
  redis:
    enabled: false
    host: "127.0.0.1"
    port: 6379
    username: "default"
    password: "password"
    database: 0
```

## Configuration Reference

### SQLite

The default storage backend. Suitable for single-server setups. Data is stored in a local file within the plugin folder.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `storage.sqlite.enabled` | boolean | `true` | Enable SQLite storage. Disable this if you use MySQL. |
| `storage.sqlite.table_prefix` | string | `"cyberfactions_"` | Prefix applied to all database table names. |
| `storage.sqlite.max_pool_size` | integer | `20` | Maximum number of connections in the HikariCP pool. |
| `storage.sqlite.min_pool_size` | integer | `5` | Minimum idle connections maintained in the pool. |
| `storage.sqlite.timeout` | integer | `30000` | Connection timeout in milliseconds. |

### MySQL

Production-grade relational storage. Required for multi-server setups and for Redis integration.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `storage.mysql.enabled` | boolean | `false` | Enable MySQL storage. Disable SQLite when using this. |
| `storage.mysql.host` | string | `"127.0.0.0"` | MySQL server hostname or IP address. |
| `storage.mysql.port` | integer | `3306` | MySQL server port. |
| `storage.mysql.database` | string | `"database"` | Name of the database to use. Must already exist. |
| `storage.mysql.username` | string | `"username"` | Database user with read/write permissions. |
| `storage.mysql.password` | string | `"password"` | Database user password. |
| `storage.mysql.table_prefix` | string | `"cyberfactions_"` | Prefix for all table names. Useful if sharing a database with other plugins. |
| `storage.mysql.use_ssl` | boolean | `false` | Whether to use SSL/TLS for the database connection. |
| `storage.mysql.max_pool_size` | integer | `20` | Maximum connections in the HikariCP pool. |
| `storage.mysql.min_pool_size` | integer | `5` | Minimum idle connections in the pool. |
| `storage.mysql.timeout` | integer | `30000` | Connection timeout in milliseconds. |

### Redis

Optional caching and synchronization layer. Provides fast data access and cross-server communication via pub/sub channels.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `storage.redis.enabled` | boolean | `false` | Enable Redis integration. Requires MySQL to also be enabled. |
| `storage.redis.host` | string | `"127.0.0.1"` | Redis server hostname or IP address. |
| `storage.redis.port` | integer | `6379` | Redis server port. |
| `storage.redis.username` | string | `"default"` | Redis ACL username. Use `"default"` if ACL is not configured. |
| `storage.redis.password` | string | `"password"` | Redis password. |
| `storage.redis.database` | integer | `0` | Redis database index (0-15). Use a dedicated index to avoid conflicts with other applications. |

::: warning SQLite and MySQL are Mutually Exclusive
You must enable exactly one of SQLite or MySQL. Enabling both simultaneously will cause errors. If you switch from SQLite to MySQL, you will need to migrate your data manually.
:::

::: tip Recommended Setup for Networks
For multi-server Minecraft networks:
1. Enable **MySQL** and disable SQLite
2. Enable **Redis** for cross-server synchronization
3. Set `master: true` in `general.yml` on only one server
4. Use different `server_name` values on each server

When Redis is enabled, data loads from Redis first (fast cache), then MySQL fills gaps. Conflict resolution uses `lastUpdate` timestamps.
:::

::: warning Redis Requires MySQL
Redis cannot be used as a standalone storage backend. It acts as a caching and pub/sub layer on top of MySQL. If you enable Redis without MySQL, the plugin will not function correctly.
:::
