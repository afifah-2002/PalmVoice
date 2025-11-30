# Daily Rewards and Notifications Specification

## Overview
Daily login bonus rewards users with coins and push notifications encourage daily engagement.

## Daily Login Reward System

### Eligibility
**Time Window:** 12 AM to 12 AM (midnight to midnight)

**Check Logic:**
```typescript
const isEligibleForDailyReward = (lastRewardTime: number): boolean => {
  const now = new Date();
  const lastReward = new Date(lastRewardTime);
  
  // Check if dates are different days
  return now.toDateString() !== lastReward.toDateString();
};
```

**Reward:** +1 coin

### Flow
1. App opens on LauncherScreen
2. Check last reward timestamp (@lastDailyReward)
3. If new day: Award coin, save timestamp, show popup
4. If same day: No reward, no popup

### Storage
- **Key:** `@lastDailyReward`
- **Value:** Unix timestamp of last reward claim
- **Default:** 0 (never claimed)

## Daily Reward Popup

### Visual Design

**Container:**
- Background: Semi-transparent dark (rgba(0, 0, 0, 0.9))
- Border: 3px solid theme color
- Border radius: 16px
- Padding: 32px
- Centered on screen

**Content (Top to Bottom):**
1. Title: "DAILY BONUS!" (12px, uppercase)
2. Rotating coin icon (64×64px, treasure chest)
3. Reward text: "+1 COIN" (16px, golden color)
4. Total coins: "TOTAL: X COINS" (8px, white)
5. CLAIM button (bottom)

### Coin Icon Animation
```typescript
// Continuous rotation
Animated.loop(
  Animated.timing(rotation, {
    toValue: 1,
    duration: 2000,
    easing: Easing.linear,
  })
).start();

// rotation interpolated: 0deg → 360deg
```

### Entrance Animation
```typescript
// Scale + Fade
Animated.parallel([
  Animated.spring(scale, { toValue: 1, friction: 5 }),
  Animated.timing(opacity, { toValue: 1, duration: 300 }),
]).start();

// Initial: scale 0.5, opacity 0
```

### CLAIM Button
- Width: 160px, Height: 44px
- Background: Theme color
- Border: 3px pixelated (light top/left, dark bottom/right)
- Label: "CLAIM"
- Press: Scale 0.95, translateY +2px
- Haptic: Medium impact
- Action: Close popup, save coin award

### Timing
- Appears 500ms after app load
- Auto-loads if eligible
- User must tap CLAIM to dismiss
- Coin awarded before popup shows

## Daily Notifications System

### Notification Schedule

**Three Times Per Day:**
1. **9:00 AM** - Pet misses you
2. **2:00 PM** - Complete tasks reminder
3. **6:00 PM** - Daily bonus reminder

### Notification Content

**9 AM - Pet Reminder:**
- Title: "Yo! [PetName] misses you 🐾"
- Body: "Check in to keep your pet happy!"
- Example: "Yo! Mimi misses you 🐾"

**2 PM - Task Reminder:**
- Title: "Task Time! ✅"
- Body: "Make sure you completed your tasks"

**6 PM - Daily Bonus:**
- Title: "Don't Forget! 🪙"
- Body: "Open app for your daily bonus"

### Implementation

**Dependencies:**
```bash
npx expo install expo-notifications
```

**Permissions:**
- Request on first app launch
- iOS: Uses native permission dialog
- Settings toggle: Can disable in Settings section

**Scheduling:**
```typescript
import * as Notifications from 'expo-notifications';

// Schedule all three notifications
const scheduleDailyNotifications = async (petName: string) => {
  // Cancel existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  // 9 AM notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Yo! ${petName} misses you 🐾`,
      body: 'Check in to keep your pet happy!',
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
  
  // 2 PM notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Task Time! ✅',
      body: 'Make sure you completed your tasks',
    },
    trigger: {
      hour: 14,
      minute: 0,
      repeats: true,
    },
  });
  
  // 6 PM notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Don't Forget! 🪙",
      body: 'Open app for your daily bonus',
    },
    trigger: {
      hour: 18,
      minute: 0,
      repeats: true,
    },
  });
};
```

### Settings Integration

**Toggle in Settings:**
- Label: "NOTIFICATIONS"
- Storage: @settings_notifications
- Default: ON
- Action: Enable/disable all scheduled notifications

**When Toggled OFF:**
```typescript
await Notifications.cancelAllScheduledNotificationsAsync();
```

**When Toggled ON:**
```typescript
await scheduleDailyNotifications(currentPetName);
```

### Pet Name Updates

**When Pet Renamed:**
- Reschedule all notifications with new name
- Only affects 9 AM notification (contains pet name)
- Others remain unchanged

**When Pet Switched:**
- Update 9 AM notification with active pet's name
- Reschedule on pet switch

### Notification Behavior

**App Foreground:**
- Notifications don't appear (app is open)
- Expo handles this automatically

**App Background:**
- Notifications appear at scheduled times
- Tapping notification opens app

**App Closed:**
- Notifications still fire
- Tapping opens app to LauncherScreen

## Data Persistence

### Daily Reward
```typescript
@lastDailyReward: number (Unix timestamp)
```

### Notification Settings
```typescript
@settings_notifications: boolean (default: true)
@notificationsScheduled: boolean (tracks if scheduled)
```

## Edge Cases

### Daily Reward
- User opens app multiple times same day: Only first open awards coin
- User skips days: Gets reward on next open (1 coin, not accumulated)
- Midnight edge case: After 12:00 AM counts as new day

### Notifications
- Permission denied: Show settings prompt to enable
- Timezone changes: Notifications adjust automatically
- App uninstalled: Notifications auto-removed by iOS
- Settings toggled while notifications pending: Reschedule immediately

## Testing Checklist
- [ ] Daily reward shows once per day
- [ ] Coin awarded before popup appears
- [ ] Popup dismisses on CLAIM tap
- [ ] Notifications request permission on first launch
- [ ] All 3 notifications scheduled correctly
- [ ] 9 AM notification includes pet name
- [ ] Toggle notifications on/off works
- [ ] Pet name change updates 9 AM notification
- [ ] Reward doesn't show on same-day reopens
- [ ] Notifications fire at correct times

## Success Criteria
- ✅ Daily reward popup appears once per 24-hour period
- ✅ Coin awarded and persisted
- ✅ Three notifications scheduled daily
- ✅ Pet name dynamically included in morning notification
- ✅ Notifications respect settings toggle
- ✅ Smooth animations and user feedback