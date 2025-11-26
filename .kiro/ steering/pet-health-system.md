---
inclusion: always
---

# Pet Health System Rules

## CRITICAL: Health Calculation
- Health declines 1 heart every 4.8 hours
- Calculate from MOST RECENT interaction timestamp
- Interaction timestamps: lastFed, lastPet, lastPlay, lastPotion, lastRevival
- NEVER use createdAt for health calculation
- createdAt is ONLY for streak counting

## Timestamps
- originalCreatedAt: Never changes, used for streak
- createdAt: Resets on revival, fallback for health
- lastFed/lastPet/lastPlay: Daily action timestamps
- lastPotion: Potion usage timestamp
- lastRevival: Revival timestamp

## Action Effects
- Feed/Pet/Play: +1 heart (max 5), resets 4.8hr clock
- Health Potion: +2 hearts (max 5), resets 4.8hr clock
- Revival: Restore to 5 hearts, reset all action timestamps

## Common Mistakes to Avoid
- Don't calculate health from createdAt
- Don't reset originalCreatedAt on revival
- Don't allow duplicate actions same day
```

---


