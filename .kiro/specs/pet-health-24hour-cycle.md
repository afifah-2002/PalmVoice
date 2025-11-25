# Pet Health 24-Hour Cycle Specification

## Overview
Pet health operates on a 24-hour lifespan from creation/purchase time. Health declines every 4.8 hours but can be restored with daily actions.

## Health Decline System

### Timing
- Cycle starts: Moment pet is created or purchased
- Duration: 24 hours total
- Decline rate: 1 heart every 4.8 hours
- Calculation: 5 hearts × 4.8 hours = 24 hours

### Health Calculation
- Based on time elapsed since `createdAt` timestamp
- Formula: 5 - Math.floor((now - createdAt) / (4.8 hours))
- Updates every minute
- Continues even when app is closed

### Example Timeline
```
Pet created at 2:00 PM
2:00 PM: 5 hearts (start)
6:48 PM: 4 hearts (4.8 hours later)
11:36 PM: 3 hearts (9.6 hours later)
4:24 AM: 2 hearts (14.4 hours later)
9:12 AM: 1 heart (19.2 hours later)
2:00 PM: 0 hearts (24 hours - pet dies)
```

## Action-Based Health Boost

### Actions Available
- Feed: +1 heart
- Pet: +1 heart
- Play: +1 heart
- Max health: 5 hearts

### Action Limit
- Each action once per day (midnight to midnight)
- Resets at 12:00 AM
- Cannot stack actions

### Clock Reset on Action
When user performs action (feed/pet/play):
1. Health increases by 1 (e.g., 3 → 4)
2. `createdAt` timestamp is adjusted
3. System recalculates as if pet always had 4 hearts
4. Next heart loss: 4.8 hours from NOW

### Example with Action
```
Pet has 3 hearts at 5:00 PM
User feeds pet → 4 hearts
createdAt adjusted to reflect "4 hearts since X time"
Next heart loss: 9:48 PM (4.8 hours later)
```

## Pet Creation/Purchase

### New Pet
- `createdAt` = Current timestamp (Date.now())
- Starts with 5 hearts
- 24-hour cycle begins immediately

### Pet Revival
- `createdAt` = Current timestamp (fresh start)
- Health restored to 5 hearts
- New 24-hour cycle begins

## Active Pet Persistence

### Default Display
- Last active pet saved to @palmvoice_active_pet
- On app open: Load and display active pet
- Pet should appear automatically (not require dropdown selection)

### Switching Pets
- User selects different pet from dropdown
- New pet becomes active
- Active pet saved to storage
- Next app open: Shows this pet by default