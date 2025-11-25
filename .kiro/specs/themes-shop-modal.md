# Themes Shop Modal Specification

## Overview
Scrollable modal showing all available background themes for purchase/unlock.

## Modal Appearance

### Trigger
- User taps "THEMES" button in categories modal
- Opens with spring animation

### Styling
- Background: Beige (#FFE5B4) with 90% opacity
- Border: Brown (#8B4513), 2px
- Rounded corners: 12px (soft, not too sharp)
- Close button (X) in top right

## Theme Grid

### Layout
- 2 columns per row
- Scrollable vertical list
- Shows scrollbar when content exceeds viewport

### Theme Sources
- Location: assets/pets/backgrounds/
- Include: All GIF/image files EXCEPT theme1, theme2, theme3
- Examples: cherryblossom, feelslike2002, ohsoflowery, etc.

### Theme Item Display

**Each Theme Shows:**
- Mini preview image (80px height, auto width)
- Theme name below preview
- Lock icon (if locked) or checkmark (if unlocked)
- Price (if locked, e.g., "10 COINS")

**Theme Name Format:**
- Filename converted to uppercase
- Remove file extension
- Keep spacing readable (e.g., "CHERRY BLOSSOM" from cherryblossom.gif)
- Font: Press Start 2P, size 7px

**Theme Item Styling:**
- Border: Brown (#8B4513), 2px
- Rounded corners: 8px
- Background: Beige (#FFE5B4) with 60% opacity (if unlocked)
- Background: Gray with 60% opacity (if locked)
- Padding: 8px

## Interaction

### Unlocked Theme
- Shows checkmark ✓
- Tappable but no action (already owned)
- Full color preview

### Locked Theme
- Shows lock icon 🔒
- Shows price below name
- Tap opens purchase confirmation popup
- Grayed out preview

## Purchase Confirmation
- Popup: "BUY [THEME NAME] FOR X COINS?"
- Buttons: "CANCEL" / "BUY"
- On buy: Deduct coins, unlock theme, show success message