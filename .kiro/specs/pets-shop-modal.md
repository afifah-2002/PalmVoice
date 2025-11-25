# Pets Shop Modal Specification

## Overview
Modal displaying all available pets for purchase. Users can buy new pets with coins.

## Modal Trigger
- User taps "PETS" button in shop categories modal
- Opens scrollable grid modal

## Available Pets

### Pet List
1. 🐱 Cat - FREE (always owned)
2. 🐶 Puppy - 30 coins
3. 🐼 Panda - 50 coins
4. 🐧 Penguin - 50 coins

### Pet Display
- 2-column scrollable grid
- Each pet shows:
  - Pet icon/sprite preview
  - Pet name (uppercase)
  - Price or ownership status

## Pet States

### Owned Pets
- Badge: "OWNED" (green text)
- Shows "EQUIPPED" if currently active pet
- No purchase button
- Full color display

### Locked Pets
- Shows coin icon + price
- Grayed out or dimmed preview
- Lock icon overlay
- Tappable to purchase

## Purchase Flow

### Sufficient Coins
1. User taps locked pet
2. Confirmation popup: "BUY [PET NAME] FOR X COINS?"
3. User confirms
4. Coins deducted from balance
5. Pet unlocked and added to @unlockedPets
6. Pet status changes to "OWNED"
7. Modal updates to show ownership

### Insufficient Coins
- Show error popup: "NOT ENOUGH COINS!"
- Display how many more coins needed
- Pet remains locked

## Pet Dropdown Integration

### Locked Pets in Dropdown
- Show in dropdown with 🔒 icon
- Grayed out text
- Tap shows message: "Purchase from the shop first!"
- Cannot select until purchased

### Unlocked Pets in Dropdown
- Full color, tappable
- Switches to that pet when selected
- No lock icon

## Asset Paths
- Cat: assets/pets/cat/catsit.png
- Puppy: assets/pets/puppy/puppysit.png
- Panda: assets/pets/panda/ (placeholder until added)
- Penguin: assets/pets/penguin/ (placeholder until added)

## Storage
- Key: @unlockedPets
- Value: Array of pet types ['cat', 'puppy']
- Default: ['cat'] (cat is free)