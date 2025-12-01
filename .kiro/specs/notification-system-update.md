# Notification System Update

## Overview
Changed from 3 daily notifications to 1 single daily notification to reduce spam.

## Notification Schedule

**Single Daily Notification:**
- Time: 9:00 AM
- Title: "Yo [PetName] misses you! 🐾"
- Body: "Check in to keep your pet happy!"
- Repeats: Daily

## Spam Prevention

### Duplicate Scheduling Check
- Before scheduling, check if already scheduled
- Storage key: `@notificationsScheduled` (boolean)
- Only schedule once per app lifecycle
- Skip if already scheduled

### Reset Triggers
- Toggle notifications OFF → Cancel + reset scheduled status
- Toggle notifications ON → Reschedule
- Pet renamed → Cancel + reschedule with new name

## Storage
```typescript
@notificationsScheduled: boolean (tracks if scheduled)
```

## Behavior
- First app load: Schedule notification
- Subsequent opens: Skip if already scheduled
- Settings toggle OFF: Cancel all, reset status
- Settings toggle ON: Reschedule
- Pet rename: Update 9 AM notification with new name