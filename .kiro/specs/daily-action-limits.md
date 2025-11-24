# Daily Action Limits Specification

## Overview
Feed, Pet, and Play actions limited to once per 24-hour cycle (midnight to midnight). Prevents spam and creates meaningful daily ritual.

## Action Limits

### Once Per Day Rule
- Feed: Once between 12am-12am
- Pet: Once between 12am-12am  
- Play: Once between 12am-12am
- Resets at midnight each day

### Tracking
- Store: lastFed, lastPet, lastPlay timestamps in AsyncStorage
- Check: Compare timestamp date to current date
- Reset: Automatically at midnight (new day)

## Action Behavior

### First Action of Day
- User taps Feed/Pet/Play
- Action succeeds
- +1 heart added (if health < 5)
- Timestamp saved
- Button works normally

### Already Done Today
- User taps Feed/Pet/Play again
- Check: Was action done today (since midnight)?
- If YES: Show "Try Again" popup
- If NO: Allow action

### At Full Health
- User taps Feed/Pet/Play
- Health already at 5 hearts
- Show popup: "ALREADY AT MAX HEALTH!"
- No action performed
- Timestamp not updated (can try again when health drops)

## Try Again Popup

### Display
- Title: "TRY AGAIN IN"
- Countdown: Shows time until midnight (e.g., "5h 23m 45s")
- Updates every second
- Theme colors (pixelated font)
- X button to close

### Time Calculation
- Calculate: Time from now to next midnight
- Format: "Xh Ym Zs"
- Example: "2h 15m 30s"
- Live countdown

### Auto-Close
- Closes after 5 seconds automatically
- OR user taps X button
- No animation (static display)

## Max Health Popup

### Display
- Title: "ALREADY AT MAX HEALTH!"
- Message: "Your pet is at full health (5 hearts)"
- Button: "OK" to close
- Theme colors (pixelated font)
- No animation

### Trigger
- Shown when Feed/Pet/Play tapped
- AND current health = 5
- Action not performed
- Timestamp not saved

## Pet Creation/Revival

### New Pet
- lastFed, lastPet, lastPlay all set to 0
- Allows immediate actions on first day
- All actions available

### After Revival
- All timestamps reset to 0
- User can feed/pet/play again
- Fresh 24-hour cycle starts