# Pet 24-Hour Lifecycle Specification

## Overview
Pet health operates on a 24-hour cycle starting at midnight (12am). Health automatically declines over time and can be temporarily boosted by daily actions.

## Health Decline System

### Timing
- Lifespan: 24 hours (midnight to midnight)
- Health decline: 1 heart every 4.8 hours
- Calculation: 5 hearts × 4.8 hours = 24 hours total
- Start time: Midnight (12am) of pet creation day

### Health Calculation
- Calculated every minute based on time elapsed since midnight
- Formula: 5 - (hours since midnight / 4.8)
- Rounds down to nearest heart
- Updates automatically as time passes

### Pet Creation
- createdAt set to midnight of current day
- Starts with 5 full hearts
- 24-hour cycle begins immediately

### Pet Revival
- createdAt reset to midnight of current day
- Health restored based on coins spent
- New 24-hour cycle starts fresh

### Backward Compatibility
- Existing pets without createdAt: Set to midnight of today
- Continue functioning with new system

## Temporary Health Boosts

### Actions Effect
- Feed, Pet, Play: Each adds +1 heart (max 5)
- Boost is temporary
- Time-based decline continues
- Health gradually returns to time-calculated value

### Example
- 8am: Health at 3 hearts (8 hours elapsed)
- User feeds: Health becomes 4 hearts
- Time continues: Health declines back toward time-based value
- Next hour (9am): Health back to ~3 hearts based on time