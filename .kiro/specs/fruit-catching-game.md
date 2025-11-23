# Fruit Catching Mini-Game Specification

## Overview
Mini-game to earn coins when user has insufficient coins for revival. Tap falling fruits to collect coins.

## Access Points

### From Revival Popup (No Coins)
- Pet dies, user has < 5 coins
- Show: "Not enough coins! Play to earn more?"
- Button: "PLAY GAME"

### From Coin Display (Anytime)
- Tap treasure chest/coin count on home or pet screen
- Shows coin popup with current balance
- Button below: "PLAY TO WIN MORE!"
- Tap button: Opens mini-game

## Game Screen

### Layout
- Full Palm Pilot screen (within bezel)
- Background: Current theme color
- X button: Top right corner to close anytime
- Coin counter: Top left showing collected coins
- Timer: Top center showing seconds remaining

### Falling Fruits
- Icons from: assets/icons/
- Fruits: strawberry.png, orange.png, banana.png, apple.png
- Size: ~50px each
- Spawn: Random X position at top
- Fall speed: Medium (reaches bottom in ~3 seconds)
- Spawn rate: 1-2 fruits per second

## Gameplay

### Duration
- Game runs for 20 seconds max
- Timer counts down from 20
- Can exit anytime with X button

### Tapping Fruits
- Tap fruit before it falls off screen
- Fruit disappears with small animation
- +1 coin added immediately
- Show "+1" text where fruit was tapped

### Missed Fruits
- Fruit falls past bottom of screen
- No penalty (just no coin)
- Disappears off screen

## End Game

### Timer Reaches 0
- Game pauses
- Show popup: "TIME'S UP!"
- Display: "You collected X coins!"
- Button: "DONE" (closes game, returns to previous screen)

### X Button Pressed
- Game stops immediately
- Coins earned are kept
- Returns to previous screen

## Coin Persistence
- Coins earned added to AsyncStorage (@coins)
- Updates immediately during gameplay
- Persists after game ends

## Visual Style
- Pixelated font for timer and coin count
- Matches Palm OS theme
- Fruit icons are colorful (contrast against background)
- Simple tap feedback (fruit pops/shrinks on tap)