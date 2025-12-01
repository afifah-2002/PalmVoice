# Heart Countdown Tooltip

## Overview
First-time tooltip guides users to tap hearts to see health countdown.

## Display Behavior

### Trigger Conditions
- First visit to Pet screen only
- Appears 2 seconds after pet loads
- Positioned above health hearts

### Visibility
- Shows for 3 seconds, then fades out
- OR disappears when user taps hearts
- Never shows again after first interaction

### Storage
```typescript
@heartTooltipSeen: boolean
```

## Tooltip Design

### Styling
- Background: Golden yellow (#FFD700)
- Border: Orange (#FFA500), 2px
- Text: "TAP ME!"
- Font: Press Start 2P, 8px
- Border radius: 6px
- Padding: 8px
- Shadow for depth

### Position
- Absolute positioning
- Above health hearts container
- Centered horizontally
- 10px above hearts

### Animation

**Entrance (0-300ms):**
- Opacity: 0 → 1
- Scale: 0.8 → 1.0

**Pulse (Continuous):**
```typescript
Animated.sequence([
  Animated.timing(scale, { toValue: 1.1, duration: 800 }),
  Animated.timing(scale, { toValue: 1.0, duration: 800 }),
]).loop();
```

**Exit (After 3s or tap):**
- Opacity: 1 → 0
- Duration: 300ms

## User Flow
1. User opens Pet screen first time
2. Wait 2 seconds
3. Tooltip appears with pulse
4. User taps hearts OR waits 3 seconds
5. Tooltip fades out
6. Save to AsyncStorage
7. Never shows again