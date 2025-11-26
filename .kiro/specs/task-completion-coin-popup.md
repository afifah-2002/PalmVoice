# Task Completion Coin Popup Specification

## Overview
Animated pixelated popup appears when user completes tasks, showing coins earned.

## Trigger
- User marks task as complete in TO DO list
- Popup appears immediately after completion

## Popup Display

### Content
- Coin icon: 🪙 emoji (32px size)
- Text format:
  - Single task: "+1 COIN!"
  - Multiple tasks: "+X COINS!"
  - Bonus (3+ tasks): "+5 COINS!"
- Font: Press Start 2P (pixelated)
- Font size: 12px

### Styling
- Background: Golden beige (#FFD700 with 90% opacity)
- Border: Brown (#8B4513), 3px
- Border radius: 12px
- Padding: 24px
- Text color: Dark brown (#3D2914)
- Position: Center of screen
- Z-index: Above all content

## Animation Sequence

### Entrance (0.4s)
- Scale: 0.5 → 1.0 (spring physics)
- Opacity: 0 → 1
- TranslateY: +20 → 0 (slides up)
- Uses Animated.spring for bouncy effect

### Hold (1.5s)
- Stays at full size
- No movement
- Fully opaque

### Exit (0.5s)
- Scale: 1.0 → 0.8 (shrinks)
- Opacity: 1 → 0 (fades out)
- TranslateY: 0 → -30 (floats up)
- Uses Animated.timing

### Total Duration
- 2.4 seconds (entrance + hold + exit)
- Auto-dismisses, no user interaction needed

## Multiple Completions

### Rapid Task Completion
- Complete 1 task: "+1 COIN!"
- Complete 2 tasks quickly: "+2 COINS!"
- Complete 3 tasks: "+5 COINS!" (includes +2 bonus)

### Popup Behavior
- Only one popup at a time
- If multiple tasks completed simultaneously: Shows total
- If tasks completed while popup visible: Queues next popup

## Coin Balance Update
- Coins added to @coins storage immediately
- All coin displays update in real-time:
  - Home screen pet status card
  - Pet screen bottom bar
  - Shop modals
  - Coins popup