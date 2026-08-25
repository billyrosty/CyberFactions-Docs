# Configuration presets

The shipped defaults are deliberately middle-of-the-road: they play on their
own, need no other plugin, and punish nobody. Most servers want something with
more of an opinion.

Each preset below is a short list of keys to change. They are written as
deltas rather than as whole files on purpose — a copy of `core.yml` frozen at
today's defaults goes stale the moment anything else changes, while a list of
keys stays true.

Apply one, run `/f reload`, and you are done. Nothing here requires restarting
except a change to `databases.yml`.

::: tip Start from the defaults
Each preset assumes the shipped configuration as its baseline. Apply one to a
config you have already heavily edited and you will get a mix of both.
:::

## Hardcore raid

Land is contested, dying costs you, and a core is a real liability. Suited to
a short-season PvP server where the map is meant to change hands.

| File | Key | Value | Why |
|---|---|---|---|
| `factions.yml` | `power.per_death` | `4.0` | Two deaths and a small faction is overclaimable |
| `factions.yml` | `power.per_hour` | `0.5` | Twenty hours to climb back from the floor |
| `factions.yml` | `power.min` | `-20` | A wiped faction stays weak for a while |
| `gameplay/claims.yml` | `overclaim.power_multiplier` | `0.75` | Overclaim before the defender is fully broken |
| `gameplay/claims.yml` | `overclaim.warmup` | `5` | Long enough to defend, short enough to be worth trying |
| `gameplay/claims.yml` | `grace_period.enabled` | `true` | Off by default; without this the hours below do nothing |
| `gameplay/claims.yml` | `grace_period.hours` | `24` | One day of overclaim immunity for a new faction |
| `gameplay/core.yml` | `move_delay` | `10800` | Three hours: a core cannot dodge a raid |
| `gameplay/core.yml` | `siege.rate_limit.core_hits_per_second` | `3` | Numbers start to matter in a raid |
| `gameplay/core.yml` | `vulnerability.duration` | `3600` | An hour to actually exploit a broken core |
| `gameplay/core.yml` | `regen.delay` | `2400` | Ticks between heals, doubled — cores recover slowly |
| `gameplay/shield.yml` | `schedule.max_hours_per_day` | `8` | Protected hours are a real choice, not a default state |
| `gameplay/taxes.yml` | `per_claim` | `5.0` | Holding a big territory hurts |

::: warning REDUCE_POWER
Tempting for this profile, and dangerous. With `power.min: -20` and a
reduction of 5 per day, a faction in debt is unraidable-poor within a week and
has no way back. If you add it, keep `power_reduction` at `1.0`.
:::

## Casual SMP

Factions as a claiming and teamwork layer, not a war engine. PvP exists but
territory is safe, and nobody loses a base to a weekend away.

| File | Key | Value | Why |
|---|---|---|---|
| `gameplay/claims.yml` | `overclaim.power_multiplier` | `2.0` | Overclaim needs a decisive power advantage |
| `gameplay/claims.yml` | `grace_period.enabled` | `true` | Off by default; without this the hours below do nothing |
| `gameplay/claims.yml` | `grace_period.hours` | `168` | A week of protection for a new faction |
| `gameplay/claims.yml` | `limit` | `30` | Room to build, up from 10 |
| `gameplay/claims.yml` | `decay.enabled` | `false` | Already the default; keep it off so land is never taken back on a timer |
| `gameplay/taxes.yml` | `enabled` | `false` | No upkeep, no debt spiral |
| `gameplay/core.yml` | `enabled` | `false` | Removes sieges entirely |
| `gameplay/combat.yml` | `logout.punishment` | `DROP` | Combat logging costs your inventory, not your life |
| `factions.yml` | `power.per_death` | `1.0` | Dying stings, it does not cascade |
| `gameplay/upgrades.yml` | requirements | lower `MEMBER_COUNT` | Small groups should still see level 2 |

::: tip Cores off
Turning `core.enabled` off also removes the vulnerability window, the siege
bossbar and `CORE_*` upgrade properties. Claims are then protected purely by
power and overclaim rules.
:::

## Economy server

The shipped defaults already assume Vault, since nearly every server runs it:
quests pay into player wallets, kill streaks pay a Vault deposit, and upgrade
levels charge the faction bank. This preset pushes that further.

| File | Key | Value | Why |
|---|---|---|---|
| `gameplay/claims.yml` | `cost.enabled` | `true` | Land has a purchase price, not only upkeep |
| `gameplay/claims.yml` | `cost.from_bank` | `true` | Charged to the faction, not the individual |
| `gameplay/taxes.yml` | `base_cost` | `250.0` | Upkeep sized for a real economy |
| `gameplay/upgrades.yml` | `FACTION_MONEY` values | raise them | Levelling becomes the main money sink |
| `social/top.yml` | `seasons.rewards` | your economy's give command | Reward the podium in currency |

::: warning Claim costs and new factions
`cost.enabled` ships off for a reason. With `from_bank: true` a faction that has
just been created has an empty bank and therefore cannot claim anything at all.
Either give new factions a starting balance, or set `from_bank: false` so the
founder pays from their own wallet.
:::

### Running without Vault

Nothing breaks. The plugin lists the disabled features at startup rather than
failing quietly, and the internal half of the economy carries the progression on
its own:

| Needs Vault | Works without it |
|---|---|
| `/f bank deposit` and `/f bank withdraw` | The faction bank itself |
| Quest `money` rewards | Quest `faction_bank` and `points` rewards |
| `kill_streak.money` | `kill_streak.milestones` commands |
| Quest `skip_price` | `FACTION_MONEY` upgrade requirements |
| `PLAYER_MONEY` requirements | Taxes, disband refunds to the bank |

To make a Vault-free server explicit, set every quest `money` to `0` and delete
the `kill_streak.money` block. Avoid `PLAYER_MONEY` in `upgrades.yml`: it fails
closed without Vault, which makes the level unreachable rather than free.

## Multi-server network

Not a gameplay profile: the infrastructure one. Several Paper servers sharing
one set of factions.

| File | Key | Value | Why |
|---|---|---|---|
| `databases.yml` | `storage.sqlite.enabled` | `false` | SQLite and MySQL are mutually exclusive |
| `databases.yml` | `storage.mysql.enabled` | `true` | The shared source of truth |
| `databases.yml` | `storage.redis.enabled` | `true` | Cache plus the channel servers talk over |
| `general.yml` | `server_name` | unique per server | Written into every message; two servers sharing a name break sync |
| `general.yml` | `master` | `true` on **one** server | Only the master runs the persistent save schedulers |

A proxy is required for `/f home` and `/f warp` to move a player between
servers — see [Multi-Server Setup](/guide/multi-server). Claims are scoped per
server by design: a chunk claimed on one is not claimed on another.

::: warning Redis needs MySQL
Redis is a companion to MySQL, never a replacement. Enabling it against SQLite
does nothing.
:::

## Reading a preset back

`/f admin status` reports which storage mode is live, whether Redis is
connected, and which schedulers are running — the quickest way to confirm a
preset took effect after a reload.
