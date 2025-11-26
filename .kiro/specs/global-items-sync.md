# Global Items Synchronization Specification

## Overview
Revival tokens and health potions are stored globally and must show the same count for all pets.

## Storage Structure

### Single Global Inventory
```json
// @itemInventory (global, not per-pet)
{
  "revivalInsurance": 2,
  "healthPotion": 4
}
```

### NOT Per-Pet Storage
Items are NOT stored like:
```json
// ❌ WRONG - Don't do this
{
  "cat_items": { "revivalInsurance": 2 },
  "puppy_items": { "revivalInsurance": 0 }
}
```

## Reload Points

### When to Reload Items from Storage
1. Opening coins popup (every time)
2. Switching pets
3. Opening items shop modal
4. After purchasing items
5. After using potion or revival token

### Implementation
```typescript
useEffect(() => {
  const loadItems = async () => {
    const items = await loadItemInventory();
    setRevivalTokens(items.revivalInsurance || 0);
    setHealthPotions(items.healthPotion || 0);
  };
  loadItems();
}, [isCoinsPopupOpen, selectedPetType]);
```

## Display Consistency

### All Pets Show Same Counts
- Cat sees: 2 revival tokens, 4 potions
- Puppy sees: 2 revival tokens, 4 potions
- Panda sees: 2 revival tokens, 4 potions
- Koala sees: 2 revival tokens, 4 potions

### After Usage
- Use 1 potion with Cat → All pets see 3 potions
- Use 1 token with Puppy → All pets see 1 token

## Fallback Values

### Prevent Undefined Display
Always use fallback to 0:
```typescript
const displayTokens = revivalTokens || 0;
const displayPotions = healthPotions || 0;
```

### Loading State
- While loading: Show 0 (not blank or undefined)
- After load: Show actual count
- Timeout: 20 seconds for slow storage reads

## Bug Fix Summary
- Items now reload on popup open (useEffect)
- Fallback values (|| 0) prevent blank displays
- Extended timeout handles slow storage
- Global storage ensures all pets see same values