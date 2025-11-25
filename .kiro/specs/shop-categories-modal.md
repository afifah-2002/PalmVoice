# Shop Categories Modal Specification

## Overview
Modal showing 4 shopping categories displayed as a 2×2 grid.

## Modal Appearance

### Trigger
- User clicks treasure box (shopbox1)
- Treasure box changes to shopbox2
- Modal opens after 300ms

### Styling
- Background: Beige (#FFE5B4) with 90% opacity
- Border: Brown (#8B4513), 2px
- Rounded corners (not too sharp)
- Soft shadows for depth
- Pixelated aesthetic

## Categories (4 Buttons)

### Layout
- 2 columns × 2 rows
- Equal spacing between buttons
- Centered in modal

### Button 1: THEMES
- Icon: mini version of theme3 from assets/pets/backgrounds/
- Label: "THEMES" (no coin amount shown)
- Background: Beige (#FFE5B4) with 80% opacity
- Border: Brown (#8B4513)

### Button 2: PETS
- Icon: catsit2.png from assets/pets/cat/
- Label: "PETS"
- Same styling as Themes

### Button 3: ITEMS
- Icon: potion.png from assets/pets/shop/
- Label: "ITEMS"
- Same styling as Themes

### Button 4: BUNDLES
- Icon: (generic bundle icon or box)
- Label: "BUNDLES"
- Same styling as Themes

### Button Properties
- Small font size (pixelated)
- No emoji icons
- Translucent backgrounds
- Brown borders matching dialogue boxes

## Close Behavior
- X button in top right
- Tap outside modal does not close
- On close: Treasure box resets to shopbox1 after 1 second