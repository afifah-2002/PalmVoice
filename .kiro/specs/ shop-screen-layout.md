# Shop Screen Layout Specification

## Overview
Shop opens as full-screen modal with shop interior background and animated shopkeeper.

## Background
- Image: assets/pets/backgrounds/shopinterior.JPG
- Fills entire screen
- Close button (X) in top right corner

## Shopkeeper Animation

### Location
- Center-right area (behind desk)
- Position: right side of screen, vertically centered

### Animation
- Two frames: shopkeeper1.png, shopkeeper2.png
- Location: assets/pets/shop/
- Alternates every 1 second
- Loops continuously while shop is open

### Dialogue Box (Shopkeeper)
- Position: Left side of shopkeeper's head
- Background: Beige (#FFE5B4)
- Border: Brown (#8B4513)
- Text color: Dark brown (#5C4033)
- Speech bubble with tail pointing right
- Spring animation on appear

### Messages
- First: "Hello There!" (appears immediately)
- Second: "What would you like to buy today?" (after 2 seconds)
- Uses pixelated font (Press Start 2P)

## Treasure Box

### Display
- Image: shopbox1.png (default)
- Location: assets/pets/shop/
- Position: Lower center of screen
- Clickable/tappable

### Dialogue Box (Treasure Box)
- Position: Above treasure box
- Background: Same beige (#FFE5B4)
- Text: "click me!"
- Appears after shopkeeper's second message
- Speech bubble tail points down
- Same styling as shopkeeper dialogue

### Click Behavior
1. Changes to shopbox2.png immediately
2. After 300ms: Opens category modal
3. On modal close: Wait 1 second, reset to shopbox1.png