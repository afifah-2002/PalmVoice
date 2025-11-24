# Streak Sharing Specification

## Overview
Share streak as an image showing pet status, days alive, coins earned, and tasks completed.

## Share Trigger
- Tap streak display (bottom bar or home screen)
- Opens share options
- Generates image and shares

## Shareable Image Content

### Layout
- Background: Current pet theme GIF (Serene/Purple Skies/Orange Kiss)
- Title: "PALMVOICE" (top, not "PET STATUS")
- Pet sprite: Current cat image from Pet screen
- Streak headline: "15 DAYS STREAK!" (example)
- Message: "I'VE KEPT MY PET ALIVE FOR 15 DAYS STRAIGHT!"
- Stats section:
  - 💰 Coins earned: X
  - ✅ Tasks completed: X
- Footer: "DOWNLOAD PALMVOICE"

### Styling
- Pixelated font (Press Start 2P)
- Theme colors for text
- Semi-transparent overlays for readability
- Same aesthetic as app screens

## Implementation

### Technology
- Uses react-native-view-shot library
- Captures hidden view as PNG image
- Shares via expo-sharing

### Process
1. User taps streak
2. App renders hidden view with share content
3. ViewShot captures view as image
4. Share dialog opens with image
5. User shares to WhatsApp/Instagram/etc.

### Hidden View
- Positioned off-screen (not visible to user)
- Matches Pet screen dimensions
- Uses actual GIF background from current theme
- Includes all streak data

## Data Displayed
- Streak days: From createdAt calculation
- Coins: Current coin count from AsyncStorage
- Tasks completed: Count of completed tasks from task list
- Pet name: From pet data
- Pet sprite: Current cat image