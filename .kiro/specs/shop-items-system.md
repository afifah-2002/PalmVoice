# Shop Items System Specification

## Overview
Users can purchase consumable items from shop to help with pet care.

## Available Items

### 1. Revival Insurance
- Icon: insurance.png (assets/pets/shop/)
- Price: 15 coins
- Effect: 1 free revival token
- Stackable: Yes (can own multiple)
- Usage: When pet dies, can use token instead of paying 5 coins

### 2. Health Potion
- Icon: potion.png (assets/pets/shop/)
- Price: 5 coins
- Effect: Instantly restore 2 hearts
- Stackable: Yes (can own multiple)
- Usage: When pet health is below 5, use to restore 2 hearts immediately

## Items Modal

### Display
- Opens from shop categories (tap "ITEMS")
- Vertical scrollable list
- Each item shows:
  - Icon (60px)
  - Name
  - Description
  - "OWNED: X" count
  - Buy button with price

### Item Card Layout
```
┌────────────────────────┐
│  [Icon]                │
│  REVIVAL INSURANCE     │
│  1 free revival token  │
│  OWNED: 2              │
│  [BUY - 15 coins]      │
└────────────────────────┘
```

### Purchase Flow
1. User taps BUY button
2. Check sufficient coins
3. Deduct coins
4. Add 1 to item count
5. Update "OWNED: X" display
6. Save to @itemInventory

### Return to Categories
- After purchase or close
- Returns to main shop categories modal (THEMES, PETS, ITEMS, BUNDLES)
- Does not close entire shop

## Coins Popup Integration

### Display Items Count
When user taps coins icon:
- Shows coin balance
- Shows item inventory:
  - Revival tokens: X
  - Health potions: X
- USE button for health potions (if applicable)

### Health Potion Usage from Popup
- USE button appears when:
  - User has 1+ health potions
  - Pet is alive (health > 0)
  - Pet is not at full health (health < 5)
- Tap USE: Consumes 1 potion, restores 2 hearts
- Updates display immediately

## Revival Token Usage

### Revival Popup
When pet dies (health = 0):
- Check revival tokens count
- If tokens > 0:
  - Show "USE REVIVAL TOKEN" option with insurance icon
  - Free revival (no coins cost)
  - Consumes 1 token
- If tokens = 0:
  - Show regular "REVIVE FOR 5 COINS" option
  - Requires 5 coins

### Revival Priority
1. First check: Do you have revival tokens?
2. If YES: Show token revival option
3. If NO: Show coin revival option (5 coins)

## Storage

### Item Inventory
- Key: @itemInventory
- Value: JSON object
```json
{
  "revivalInsurance": 2,
  "healthPotion": 5
}
```

### Loading Items
- Load on app start
- Display counts in shop and coins popup
- Check before usage