# Health Calculation System Specification

## Overview
Pet health declines based on most recent interaction time, not creation time. Each interaction resets the 4.8-hour decline clock.

## Health Decline Logic

### Decline Rate
- 1 heart lost every 4.8 hours
- Calculated from most recent interaction
- Continues even when app is closed

### Interaction Timestamps
Pet stores 5 interaction types:
- `lastFed`: Last time pet was fed
- `lastPet`: Last time pet was petted
- `lastPlay`: Last time pet was played with
- `lastPotion`: Last time potion was used
- `lastRevival`: Last time pet was revived

### Health Calculation
```typescript
const mostRecentInteraction = Math.max(
  lastFed,
  lastPet,
  lastPlay,
  lastPotion,
  lastRevival,
  createdAt // fallback if no interactions
);

const hoursSinceInteraction = (now - mostRecentInteraction) / (1000 * 60 * 60);
const heartsLost = Math.floor(hoursSinceInteraction / 4.8);
const currentHealth = Math.max(0, 5 - heartsLost);
```

### When No Interactions
- If pet has never been fed/pet/played/potioned/revived
- Uses `createdAt` as fallback
- Health declines from creation time

## Action Effects on Health

### Feed/Pet/Play
- Effect: +1 heart (max 5)
- Updates respective timestamp (lastFed, lastPet, or lastPlay)
- Resets 4.8-hour decline clock from NOW

### Potion Usage
- Effect: +2 hearts (max 5)
- Updates `lastPotion` timestamp
- Resets 4.8-hour decline clock from NOW
- Deducts 1 potion from global inventory

### Revival
- Effect: Restores to 5 hearts
- Updates `lastRevival` timestamp
- Resets 4.8-hour decline clock from NOW
- Resets all action timestamps (lastFed/lastPet/lastPlay/lastPotion) to 0
- Allows actions to be performed immediately after revival
- Deducts revival token or 5 coins

## Creation vs Streak Timestamps

### Two Separate Timestamps

**originalCreatedAt:**
- Set once when pet is first created
- NEVER changes (even after revival)
- Used ONLY for streak calculation
- Preserved through death and revival

**createdAt:**
- Set when pet is created
- Also set when pet is revived
- Used as fallback for health calculation when no interactions exist
- Resets on revival

### Streak Calculation
```typescript
const daysSinceCreation = Math.floor(
  (now - originalCreatedAt) / (1000 * 60 * 60 * 24)
);
const streak = daysSinceCreation + 1; // +1 includes creation day

// If pet is currently dead, show 0
if (health === 0) {
  streak = 0;
}
```

## Example Timeline

### Day 1: Pet Created
- originalCreatedAt: Day 1, 2:00 PM
- createdAt: Day 1, 2:00 PM
- Health: 5 hearts
- Streak: 1 day

### Day 1: Feed at 4:00 PM
- lastFed: Day 1, 4:00 PM
- Health: 5 hearts (was already 5)
- Next decline: Day 1, 8:48 PM (4.8 hours later)

### Day 2: No Interaction
- 24 hours since last feed
- Hearts lost: 24 / 4.8 = 5 hearts
- Health: 0 hearts (dead)
- Streak: 0 (shown as 0 when dead)

### Day 3: Revive Pet
- lastRevival: Day 3, 10:00 AM
- Health: 5 hearts
- originalCreatedAt: UNCHANGED (still Day 1, 2:00 PM)
- Streak: 2 days (from original creation)
- All actions available again

### Day 4: Use Potion at 2:00 PM
- Health was 3, now 5
- lastPotion: Day 4, 2:00 PM
- Next decline: Day 4, 6:48 PM
- Streak: 3 days