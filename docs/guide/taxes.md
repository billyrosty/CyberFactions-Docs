# Taxes & Upkeep

Empires have costs. The tax system creates a realistic economy where territory and members carry daily upkeep — forcing factions to balance ambition with financial sustainability. Expand too fast without the income to support it, and your empire crumbles. This is the economic pressure that makes faction gameplay strategic.

## How Taxes Work

Every day at a configured time, taxes are automatically collected from the faction bank. The amount scales with the faction's size — more claims and more members mean higher upkeep. Factions that cannot pay enter a grace period before penalties kick in.

```
/f taxes
```

View your faction's complete tax breakdown: base cost, per-claim cost, per-member cost, total daily bill, collection time, bank balance, and debt status.

![Tax info display](./images/taxes-info.png)
<!-- SCREENSHOT: Run /f taxes on a faction with 8 claims and 4 members. Capture the full output showing the breakdown: Base cost $100, Claims (8x $10): $80, Members (4x $5): $20, Total daily: $200, Collection time: 04:00, Bank: $1,500. The formatted output with gray labels and white values should be clearly readable. -->

## Tax Calculation

Taxes are calculated using a transparent formula:

```
Daily Tax = Base Cost + (Claims x Per-Claim Rate) + (Members x Per-Member Rate)
```

| Component | Default | Description |
|-----------|---------|-------------|
| Base cost | $100 | Fixed daily amount every faction pays |
| Per claim | $10 | Additional cost per claimed chunk |
| Per member | $5 | Additional cost per faction member |

### Example Calculation

A faction with 20 claims and 8 members pays:

```
$100 + (20 x $10) + (8 x $5) = $100 + $200 + $40 = $340/day
```

::: tip Strategic Pressure
This formula creates natural pressure against over-expansion. A faction holding 50 chunks needs $600/day just in claim upkeep — they better have the income to match.
:::

## Collection Schedule

Taxes are collected once per day at a fixed time:

```yaml
collection_time: "04:00"
```

A warning notification is sent to all online faction members before collection:

```yaml
warning_hours_before: 1
```

This gives factions a chance to deposit funds if the bank is running low.

## Grace Period

When a faction cannot pay, they do not immediately suffer consequences. A grace period gives them time to recover:

```yaml
grace_period_days: 3
```

During the grace period:
- Debt days accumulate
- Warning messages intensify
- Penalties are suspended
- The faction has time to raise funds

After the grace period expires, penalties activate every collection cycle until the debt is resolved.

## Penalties

When a faction remains in debt past the grace period, configurable penalties apply:

### UNCLAIM_RANDOM

A random chunk is unclaimed from the faction's territory each day. Their empire literally shrinks.

```yaml
unclaim_amount: 1  # Chunks lost per day
```

### REDUCE_POWER

The faction's total power is reduced daily, making them progressively more vulnerable to overclaiming.

```yaml
power_reduction: 5.0  # Power lost per day
```

### FREEZE_UPGRADES

The faction cannot upgrade while in debt. The `/f upgrade` command is blocked until taxes are paid.

### DISBAND

The nuclear option. After extended debt, the faction is automatically disbanded. Use this sparingly — or not at all.

::: warning Combining Penalties
Multiple penalties can be active simultaneously. Configure any combination:
```yaml
penalties:
  - "UNCLAIM_RANDOM"
  - "REDUCE_POWER"
```
This applies both territory loss AND power drain for maximum pressure.
:::

## Penalty Messages

Every penalty triggers a clear notification so players understand exactly what happened and why:

| Event | Message |
|-------|---------|
| Warning | "Taxes will be collected in 1h. Amount: $340" |
| Collected | "Taxes collected: $340 from faction bank." |
| Insufficient funds | "Not enough funds! $340 needed. Grace period: 2 days remaining." |
| Claim lost | "A claim has been lost due to unpaid taxes!" |
| Power reduced | "Power reduced by 5.0 due to unpaid taxes!" |
| Upgrades frozen | "Upgrades frozen due to unpaid taxes." |
| Disbanded | "Your faction has been disbanded due to prolonged unpaid taxes!" |

## Exemptions

Not every faction should pay taxes:

### Minimum Member Exemption

Solo factions (or small ones) can be exempted:

```yaml
min_members_exempt: 1  # Factions with 1 or fewer members skip taxes
```

Set to 0 to tax everyone. Set higher to protect small groups.

### Admin Factions

System factions (Wilderness, Safezone, Warzone — IDs 0, 1, 2) are always exempt from taxation. They cannot accumulate debt.

## Debt Tracking

The `/f taxes` command shows current debt status:

```
Debt: 2 days (Grace: 1 day remaining)
```

This tells the faction exactly how much time they have before penalties start.

![Faction in debt status](./images/taxes-debt.png)
<!-- SCREENSHOT: Run /f taxes on a faction that is in debt (2+ days of unpaid taxes). Capture the output showing the red "Debt: 2 days" line with the grace period countdown. Also capture one of the penalty messages in chat (like the unclaim or power reduction notification) to show what happens when grace runs out. -->

## Economic Strategy

The tax system creates interesting decisions:

| Strategy | Approach |
|----------|----------|
| Lean faction | Few claims, few members, low taxes — sustainable |
| Economic powerhouse | Many members generating income to fund expansion |
| Aggressive expander | Rapid claiming, high taxes, race against debt |
| Defensive optimizer | Minimum claims needed, maximum bank reserves |

## Integration with Other Systems

- **Upgrades** — `FREEZE_UPGRADES` penalty blocks leveling while in debt
- **Bank** — Taxes pull from faction bank, making deposits essential
- **Claims** — `UNCLAIM_RANDOM` directly reduces territory
- **Power** — `REDUCE_POWER` weakens overclaim defense

## Configuration

All tax settings live in `gameplay/taxes.yml`. Hot-reload with `/f reload`. Adjust rates, penalties, grace periods, and exemptions to match your server's economy.
