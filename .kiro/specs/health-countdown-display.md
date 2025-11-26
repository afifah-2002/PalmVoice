# Health Countdown Display Specification

## Overview
Display time remaining until next heart loss when user taps on health hearts or bar.

## Trigger
- Tap on heart icons (health display)
- Tap on health bar

## Popup Display

### Content
- **Title:** "NEXT HEART LOSS"
- **Time:** Shows hours and minutes (e.g., "2H 45M", "0H 30M", "4H 10M")
- **Style:** Pixelated font (Press Start 2P), dark background with theme border

### Special Cases

**Full Health (5 hearts):**
- Title: "FULL HEALTH"
- Message: "Your pet is healthy!"
- No countdown shown

**Dead Pet (0 hearts):**
- Title: "PET IS DEAD"
- Message: "Revive your pet to continue"
- No countdown shown

**Normal (1-4 hearts):**
- Shows time until next heart decays
- Format: "XH YM" (e.g., "2H 45M")
- Updates based on most recent interaction

## Calculation Logic

### Time Until Next Heart Loss
```
mostRecentInteraction = Math.max(lastFed, lastPet, lastPlay, lastPotion, lastRevival, createdAt)
timeSinceInteraction = now - mostRecentInteraction
timeInCurrentInterval = timeSinceInteraction % (4.8 hours in ms)
timeUntilNextLoss = 4.8 hours - timeInCurrentInterval
```

### Format Display
- Hours: Math.floor(timeUntilNextLoss / (1000 * 60 * 60))
- Minutes: Math.floor((timeUntilNextLoss % (1000 * 60 * 60)) / (1000 * 60))
- Format: "{H}H {M}M"

## Visual Design

### Popup
- Background: Semi-transparent dark (rgba(0, 0, 0, 0.9))
- Border: Theme color, 3px
- Border radius: 12px
- Padding: 24px
- Centered on screen

### Text
- Title: 10px, uppercase
- Time: 16px, bold
- Color: White with theme color accent
- Font: Press Start 2P

### Animation
- Entrance: Scale 0.8 → 1.0, opacity 0 → 1 (200ms)
- Exit: Tap anywhere to dismiss
- Auto-dismiss: 3 seconds

## Implementation

### Files to Modify
- src/screens/PetsScreen.tsx (add tap handlers and popup)

### State Required
- showHealthCountdown: boolean
- timeUntilNextLoss: number (milliseconds)

### Functions Needed
- calculateTimeUntilNextHeartLoss(pet: Pet): number
- formatTimeRemaining(ms: number): string
- handleHealthTap(): void

## Edge Cases
- Pet just fed/pet/played: Shows full 4.8 hours (or close to it)
- Pet about to lose heart: Shows "0H 5M" (less than 1 hour)
- Multiple pets: Each shows their own countdown
- App in background: Recalculates on tap (not live updating)

## User Feedback
- Clear indication that hearts/bar are tappable (slight scale on press)
- Instant popup response (no loading delay)
- Easy to dismiss (tap anywhere)