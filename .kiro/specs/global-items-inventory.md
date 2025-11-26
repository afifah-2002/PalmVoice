# Global Items Inventory Specification

## Overview
Revival tokens and health potions are shared across ALL pets globally, not per-pet.

## Shared Inventory System

### Storage
- Key: @itemInventory
- Value: Single JSON object (not per-pet)
```json
{
  "revivalInsurance": 3,
  "healthPotion": 5
}
```

### Shared Across All Pets
- Cat has 3 potions → Puppy also sees 3 potions
- Use 1 potion with Cat → All pets see 2 potions
- Buy token with Puppy → All pets see new token count

## Inventory Reload Points

### When to Reload from Storage
1. Opening coins popup (tap coins in bottom bar)
2. Switching pets (select different pet from dropdown)
3. Opening Items modal in shop
4. Purchasing items in shop
5. Using item (potion or token)

### Why Reload?
- React state can be stale
- Storage is source of truth
- Ensures consistency across pets and screens

## Item Usage

### Health Potion
- Usable from coins popup
- Available when:
  - Have 1+ potions
  - Pet is alive (health > 0)
  - Pet not at full health (< 5)
- Effect: +2 hearts immediately
- Deducts 1 from global inventory

### Revival Token
- Usable when pet dies (health = 0)
- Shows in revival popup if available
- Effect: Revive pet for free (no coins)
- Deducts 1 from global inventory

## Visual Display

### Coins Popup
Shows both item counts:
```
💰 15 COINS

🛡️ Revival Tokens: 3
🧪 Health Potions: 5

[USE POTION] (if applicable)
```

### Text Visibility
- Text color: Dark brown (#3D2914)
- Text shadow: White 1px outline
- Visible on all theme backgrounds (light and dark)

## Purchase Flow
1. User buys item in shop
2. Deduct coins from @coins
3. Add 1 to @itemInventory
4. Save to storage
5. Reload items in current screen
6. Update display immediately

## Storage Persistence
- Items saved after every purchase
- Items saved after every usage
- Loaded on app start
- Never per-pet, always global