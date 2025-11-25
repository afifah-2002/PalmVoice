# Theme Equip System Specification

## Overview
After purchasing, users can equip themes to change Pet screen background.

## Equip Button Display

### For Purchased Themes
- Shows: "PURCHASED" text (green)
- Shows: "EQUIP" button below
- Border: Green (#00FF00) when purchased
- Border: Blue when currently equipped

### For Currently Equipped Theme
- Shows: "EQUIPPED" instead of "EQUIP"
- Border: Blue (#4169E1)
- Button disabled (cannot re-equip active theme)

### For Unpurchased Themes
- Shows: Price (treasure box + number)
- Clickable to purchase
- Border: Brown (regular) or Gold (exclusive)

## Equip Action

### User Flow
1. User clicks "EQUIP" button on purchased theme
2. Theme immediately becomes active
3. Pet screen background changes to new theme GIF
4. Button text changes to "EQUIPPED"
5. Border color changes to blue
6. Previous theme's button returns to "EQUIP"

### Data Updates
- Save equipped theme ID to @petsTheme
- Update AsyncStorage
- Load new theme in Pet screen
- Update dropdown in Pet screen header

## Theme Dropdown (Pet Screen)

### Display
- Shows all purchased themes (including free starters)
- Format: "THEME NAME" (properly spaced)
- Current theme selected by default
- Dropdown width: Fits longest theme name without overflow

### Name Display Rules
- Long names (2+ words): Wrap to 2 lines if needed
- Examples:
  - "CHERRY BLOSSOM" (fits in 1 line)
  - "FEELS LIKE CHRISTMAS" (wraps to 2 lines)
  - "THERAPEUTIC" (fits in 1 line)
- Prevent text cutoff at dropdown edges
- Add padding if needed

## Overflow Prevention

### Theme Names in Dropdown
- Max width: Dropdown container width - 20px padding
- Text wraps to multiple lines if needed
- No horizontal overflow
- No text cutoff

### Theme Names in Shop Modal
- 2-column grid layout
- Each column width: 45% of modal width
- Long names wrap to 2 lines:
  - Line 1: First word(s)
  - Line 2: Remaining word(s)
- Examples:
  - "CHERRY BLOSSOM" → 2 lines
  - "FEELS LIKE 2002" → 2 lines
  - "MOONLIGHT" → 1 line

### Action Buttons
- Width: 80% of theme item width
- Positioned below name/price
- No overflow outside theme item border