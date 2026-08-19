# taxes.yml

Configures the faction upkeep/tax system. Taxes are automatically collected from faction banks on a daily schedule, with amounts scaling by faction level. Factions that cannot pay enter a grace period, after which penalties are applied (territory loss, power reduction, or even disbanding).

**Location:** `configurations/gameplay/taxes.yml`

## Full Configuration

```yaml
taxes:
  enabled: true

  base_cost: 100.0
  per_claim: 10.0
  per_member: 5.0

  collection_time: "04:00"
  warning_hours_before: 1

  grace_period_days: 3

  penalties:
    - "UNCLAIM_RANDOM"
    - "REDUCE_POWER"

  unclaim_amount: 1
  power_reduction: 5.0

  max_debt_days: 14

  new_faction_grace_days: 3

  level_multipliers:
    1: 1.0
    2: 1.2
    3: 1.5
    4: 2.0
    5: 2.5

  allow_manual_pay: true

  min_members_exempt: 1

  messages:
    warning: "<yellow>Taxes will be collected in <white>%time%</white>. Amount: <white>$%amount%</white>"
    collected: "<green>Taxes collected: <white>$%amount%</white> from faction bank."
    insufficient: "<red>Not enough funds to pay taxes! <white>$%amount%</white> needed. Grace period: <white>%days%</white> days remaining."
    penalty_unclaim: "<red>A claim has been lost due to unpaid taxes!"
    penalty_power: "<red>Power reduced by <white>%amount%</white> due to unpaid taxes!"
    penalty_freeze: "<yellow>Upgrades frozen due to unpaid taxes."
    penalty_disband: "<dark_red>Your faction has been disbanded due to prolonged unpaid taxes!"
```

## Configuration Reference

### General Settings

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `taxes.enabled` | boolean | `true` | Enable or disable the tax system entirely. |
| `taxes.collection_time` | string | `"04:00"` | Time of day (24h format, server timezone) when taxes are collected. Choose a low-activity time to minimize player impact. |
| `taxes.warning_hours_before` | integer | `1` | Hours before collection to send a warning notification to online faction members. |
| `taxes.grace_period_days` | integer | `3` | Number of days a faction can be in debt before penalties begin. Gives factions time to raise funds. |
| `taxes.max_debt_days` | integer | `14` | Maximum days a faction can remain in debt before automatic disband, regardless of configured penalties. `0` = no limit. |
| `taxes.new_faction_grace_days` | integer | `3` | Days after faction creation during which the faction is exempt from taxes. |
| `taxes.allow_manual_pay` | boolean | `true` | Allow members to manually pay off tax debt with `/f taxes pay`. |
| `taxes.min_members_exempt` | integer | `1` | Factions with fewer members than this value are exempt from taxes. Set to `1` to exempt solo factions. |

### Cost Formula

The daily tax amount is calculated as:

```
total = (base_cost + (per_claim * claims) + (per_member * members)) * level_multiplier
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `taxes.base_cost` | double | `100.0` | Fixed daily cost regardless of faction size. |
| `taxes.per_claim` | double | `10.0` | Additional cost per claimed chunk. Incentivizes efficient territory use. |
| `taxes.per_member` | double | `5.0` | Additional cost per faction member. |

::: tip Tax Calculation Example
A level 3 faction with 15 claims and 8 members pays:
```
($100 + (15 * $10) + (8 * $5)) * 1.5 = ($100 + $150 + $40) * 1.5 = $435/day
```
:::

### Level Multipliers

Higher-level factions pay proportionally more in taxes, creating a natural economic pressure against unchecked progression.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `taxes.level_multipliers` | map | (see below) | Tax multiplier per faction level. Key = faction level, value = multiplier applied to the total tax. Levels without an entry default to `1.0`. |

Default multipliers:

| Level | Multiplier | Effect |
|-------|-----------|--------|
| 1 | 1.0x | Standard tax |
| 2 | 1.2x | +20% tax |
| 3 | 1.5x | +50% tax |
| 4 | 2.0x | Double tax |
| 5 | 2.5x | +150% tax |

::: tip Progression Balance
Level multipliers ensure that upgrading your faction increases upkeep. A level 5 faction pays 2.5x what a level 1 faction would for the same territory — they need the economy to match their ambition.
:::

### Penalties

After the grace period expires with unpaid taxes, penalties are applied daily.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `taxes.penalties` | list | `["UNCLAIM_RANDOM", "REDUCE_POWER"]` | Active penalty modes. Multiple penalties can be combined. |
| `taxes.unclaim_amount` | integer | `1` | Number of claims removed per day when `UNCLAIM_RANDOM` is active. |
| `taxes.power_reduction` | double | `5.0` | Power points removed per day when `REDUCE_POWER` is active. |

Available penalty modes:

| Penalty | Description |
|---------|-------------|
| `UNCLAIM_RANDOM` | Randomly removes claims from the faction each day. |
| `REDUCE_POWER` | Reduces faction power, potentially enabling overclaims. |
| `FREEZE_UPGRADES` | Prevents the faction from upgrading until taxes are paid. |
| `DISBAND` | Disbands the faction entirely after the grace period. Use with caution. |

### Messages

| Key | Type | Placeholders | Description |
|-----|------|--------------|-------------|
| `messages.warning` | string | `%time%`, `%amount%` | Warning sent before collection. |
| `messages.collected` | string | `%amount%` | Confirmation when taxes are successfully collected. |
| `messages.insufficient` | string | `%amount%`, `%days%` | Sent when bank has insufficient funds. |
| `messages.penalty_unclaim` | string | -- | Sent when a claim is lost to penalties. |
| `messages.penalty_power` | string | `%amount%` | Sent when power is reduced. |
| `messages.penalty_freeze` | string | -- | Sent when upgrades are frozen. |
| `messages.penalty_disband` | string | -- | Sent just before the faction is disbanded. |

### Exemptions

The following factions are always exempt from taxes:
- Admin factions (Safezone, Warzone, Wilderness -- factions with ID 0, 1, or 2)
- Factions with fewer members than `min_members_exempt`

### New Faction Grace

Newly created factions are exempt from taxes for `new_faction_grace_days` days (default: 3). This gives new factions time to establish their economy before upkeep kicks in.

::: warning DISBAND Penalty
The `DISBAND` penalty is irreversible. If enabled, factions that fail to pay taxes for the grace period duration will be permanently deleted. Consider using gentler penalties (`UNCLAIM_RANDOM` + `REDUCE_POWER`) for most servers. Additionally, `max_debt_days` provides a hard limit — after 14 days (default) of unpaid debt, the faction is force-disbanded regardless of configured penalties.
:::

::: tip Economy Sink
Taxes serve as an important economy sink, removing money from circulation daily. This helps combat inflation on servers with generous money sources. Adjust costs and level multipliers relative to your server's economy to ensure taxes are meaningful but not oppressive.
:::

::: tip Scaling for Server Size
For larger servers with more mature economies:
- Increase `base_cost` to $500-1000
- Increase `per_claim` to $25-50
- Tune `level_multipliers` to match your upgrade tiers
- Keep `grace_period_days` at 3-5 for fairness
- Use `UNCLAIM_RANDOM` + `FREEZE_UPGRADES` as primary penalties
:::
