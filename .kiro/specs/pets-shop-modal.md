# Pets Shop Modal Specification

## Overview
Modal showing available pets for purchase/unlock.

## Modal Appearance

### Trigger
- User taps "PETS" button in categories modal

### Styling
- Same as Themes modal (beige background, brown border)
- Rounded corners: 12px
- Close button (X) in top right

## Pet Grid

### Layout
- 2 columns per row
- Scrollable if more than 4 pets
- Currently: Cat (unlocked), Panda (locked), Penguin (locked)

### Pet Item Display

**Each Pet Shows:**
- Pet sprite preview (from assets/pets/[petname]/)
- Pet name (e.g., "CAT", "PANDA", "PENGUIN")
- Lock icon or checkmark
- Price if locked (e.g., "25 COINS")

**Pet Item Styling:**
- Same as theme items
- Border: Brown, 2px
- Rounded corners: 8px
- Background: Beige (unlocked) or Gray (locked)

## Interaction

### Unlocked Pet
- Shows checkmark ✓
- Displays "OWNED"
- Not tappable

### Locked Pet
- Shows lock icon 🔒
- Shows price
- Tap opens purchase confirmation
- Silhouette or grayed sprite

## Purchase Confirmation
- Popup: "BUY [PET NAME] FOR X COINS?"
- Buttons: "CANCEL" / "BUY"
- On buy: Deduct coins, unlock pet, show in pet dropdown