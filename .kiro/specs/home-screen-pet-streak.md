# Home Screen Pet Streak Display

## Overview
Pet Status card on home screen shows streak information below coins display.

## Location
- Inside Pet Status card
- Below coins display
- Above quick action buttons (FEED/PET)

## Display Format
- Flame icon (from assets/icons/streak.png)
- Text: "X DAYS" or "X DAY" (singular for 1)
- Same styling as coins display

## Data Source
- Reads createdAt from pet data
- Calculates: (now - createdAt) / (24 hours)
- Rounds down to whole days
- Minimum 1 day (includes creation day)

## Update Frequency
- Recalculates on screen mount
- Updates when pet data changes
- Shows current streak immediately

## Interaction
- Tappable: Opens share streak options
- Same functionality as bottom bar streak
- Shares streak image when tapped

## Visual Consistency
- Matches Pet screen streak display
- Uses same icons and fonts
- Theme colors applied
- Pixelated aesthetic maintained