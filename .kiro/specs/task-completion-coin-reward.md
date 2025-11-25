# Task Completion Coin Reward Specification

## Overview
Users earn +1 coin for each task completed. A cute animated popup celebrates the reward.

## Trigger
- User marks task as complete in TO DO list
- Coin reward triggers immediately

## Coin Reward Amount
- +1 coin per task completed
- Coins added to @coins balance
- Updates coin display in real-time

## Reward Popup

### Display
- Appears center of screen
- Duration: 2 seconds
- Auto-dismisses (no button needed)

### Content
- Icon: Mini treasure chest (shopbox1.png)
- Text: "+1 COIN EARNED!"
- Font: Press Start 2P (pixelated)
- Size: Medium (fits Palm screen comfortably)

### Animation
- Entrance: Scale up from 0.5 to 1.0 (bounce effect)
- Hold: 1.5 seconds at full size
- Exit: Fade out with slight scale up (1.0 to 1.2)
- Total duration: 2 seconds

### Animation Details
```typescript
// Entrance (0.3s)
Animated.spring(scale, {
  toValue: 1.0,
  friction: 5,
}).start();

// Hold (1.5s)
setTimeout(() => {
  // Exit (0.5s)
  Animated.parallel([
    Animated.timing(opacity, { toValue: 0, duration: 300 }),
    Animated.timing(scale, { toValue: 1.2, duration: 300 }),
  ]).start();
}, 1500);
```

### Styling
- Background: Semi-transparent beige (#FFE5B4 with 90% opacity)
- Border: Brown (#8B4513), 2px
- Border radius: 8px
- Padding: 20px
- Text color: Dark brown (#5C4033)
- Treasure icon: 32px size

## Multiple Task Completion

### Rapid Completion
- If user completes 3 tasks quickly
- Show 3 separate popups (not stacked)
- Each popup appears and dismisses independently

### Bonus Reward (Optional)
- Complete 3 tasks in a row
- Show special popup: "+5 COIN BONUS!"
- Different animation (maybe sparkles)

## Coin Balance Update

### Immediate Update
- Coin count updates in all displays:
  - Home screen Pet Status card
  - Pet screen bottom bar
  - Shop modal
- No delay, instant synchronization

## Sound Effect (Optional)
- Play coin sound on popup appear
- Use pixelated/8-bit sound effect
- Short and satisfying (0.5 seconds)