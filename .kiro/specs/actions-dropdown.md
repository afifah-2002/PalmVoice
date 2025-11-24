# Actions Dropdown Specification

## Overview
Replaced coin button in top bar with Actions dropdown. Moved coins to bottom bar with shop and streak icons.

## Top Bar Layout
- Left: Theme dropdown
- Center: Pet dropdown  
- Right: Actions dropdown (shows Feed/Pet/Play)

## Actions Dropdown

### Display
- Button label: "ACTIONS ▼"
- Location: Top right corner
- Only visible when pet exists

### Menu Options
- FEED (increases health by 1)
- PET (increases health by 1)
- PLAY (increases health by 1)
- Same functionality as old buttons

### Behavior
- Tap "ACTIONS ▼": Opens dropdown menu
- Select option: Performs action, closes menu
- Other dropdowns close when Actions opens

## Bottom Bar Layout

### Three Items (Left to Right)
- **Coins** (left): Icon + count, tappable
- **Streak** (center): Icon + "X DAYS", tappable
- **Shop** (right): Icon + "SHOP", tappable

### Icons
- Coins: Treasure chest from assets
- Streak: Flame icon from assets/icons/streak.png
- Shop: Shop icon from assets/icons/shop.png

### Styling
- Equal spacing between items
- Pixelated font
- Theme colors
- Position: Above hardware buttons