# Pet Action Health Boost Specification

## Overview
Feed, Pet, and Play actions each increase pet health by 1 heart. If pet is already at full health (5 hearts), show a popup instead of performing action.

## Health Increase Behavior

### When Health < 5
- User taps FEED, PET, or PLAY button
- Check: Current health < 5?
- If YES: +1 heart added
- Update health immediately
- Save to AsyncStorage
- Show brief success animation on button
- Update health bar display

### Action Effects
- Feed: +1 heart (if < 5)
- Pet: +1 heart (if < 5)
- Play: +1 heart (if < 5)
- All actions have same health effect
- Maximum health: 5 hearts (cannot exceed)

## Full Health Popup

### Trigger
- User taps FEED, PET, or PLAY
- Current health = 5 hearts
- Action blocked
- Popup appears

### Popup Content
- Title: "LIFE BAR IS FULL!"
- Message: (none, title only)
- Button: "OK" (closes popup)
- Close icon: ✕ (top right corner)

### Popup Styling
- Background: Semi-transparent dark with theme tint
- Theme-based colors:
  - Serene theme: Green tint
  - Purple Skies theme: Purple tint
  - Orange Kiss theme: Orange tint
- Border: 2px solid (theme color)
- Font: Press Start 2P (pixelated)
- Size: 280px wide, auto height
- Centered on screen
- No animation (static display)

### Popup Actions
- Tap "OK": Closes popup
- Tap ✕: Closes popup
- Tap outside: Does not close (must use button/X)

## Daily Limit Integration

### Check Order
1. First check: Was action already done today?
   - If YES: Show "Try Again In..." popup
   - If NO: Continue to step 2

2. Second check: Is health at 5?
   - If YES: Show "Life Bar Is Full!" popup
   - If NO: Perform action (+1 heart)

### Both Conditions Met
- If already done today AND health is 5: Show daily limit popup only
- Daily limit takes priority over full health check

## Visual Feedback

### Success (Health Increased)
- Button briefly pulses or scales
- Health bar updates smoothly
- New heart appears with small animation
- No popup shown

### Blocked (Full Health)
- Button press has no effect on health
- Popup appears immediately
- User must dismiss popup
- Health bar remains at 5 hearts

## Persistence
- Health value saved to AsyncStorage after each increase
- Action timestamp saved (for daily limit tracking)
- Popup state not persisted (resets on close)