# Theme Visual States Specification

## Overview
Theme items show different visual states based on purchase/equip status.

## State 1: Unpurchased (Default)

### Display
- Mini preview image (80px height)
- Theme name (properly spaced, uppercase)
- Price: Treasure box icon + number
- Border: Brown (regular) or Gold (exclusive)
- Background: Beige with 60% opacity
- Clickable: Yes (triggers purchase)

## State 2: Purchased (Not Equipped)

### Display
- Mini preview image (full color)
- Theme name
- Text: "PURCHASED" (green color #00FF00)
- Button: "EQUIP" (brown background, white text)
- Border: Green (#00FF00)
- Background: Beige with 80% opacity
- Clickable: Yes (triggers equip)

## State 3: Equipped (Active)

### Display
- Mini preview image (full color)
- Theme name
- Text: "EQUIPPED" (blue color #4169E1)
- No button (cannot re-equip)
- Border: Blue (#4169E1)
- Background: Beige with 90% opacity
- Clickable: No

## Visual Transitions

### After Purchase
- Border animates from Brown/Gold to Green
- Text changes from price to "PURCHASED"
- "EQUIP" button fades in
- Duration: 300ms

### After Equip
- Border changes from Green to Blue
- Button text changes to "EQUIPPED"
- Previous equipped theme returns to Green border
- Duration: 200ms

## Layout Consistency

### Theme Item Dimensions
- Width: 45% of modal width
- Height: Auto (fits content)
- Padding: 8px inside border
- Margin: 8px between items
- Rounded corners: 8px

### Text Sizing
- Theme name: 7px (Press Start 2P)
- Price/Status text: 8px
- Button text: 7px
- Max 2 lines for theme name
- Ellipsis if name still too long (rare case)