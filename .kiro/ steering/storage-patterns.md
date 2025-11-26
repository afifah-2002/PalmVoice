---
inclusion: always
---

# Storage Patterns and Best Practices

## AsyncStorage Keys

### Global Data
```typescript
@coins                    // number - total coin balance
@itemInventory            // { revivalInsurance: number, healthPotion: number }
@unlockedThemes           // string[] - array of theme IDs
@unlockedPets             // string[] - ['cat', 'puppy', ...]
@theme                    // string - Palm OS launcher theme
@petsTheme                // string - Active pet screen theme
@palmvoice_active_pet     // string - Currently displayed pet type
@completedTasks           // Task[] - array of completed tasks
@tasks                    // Task[] - array of active tasks
```

### Per-Pet Data
```typescript
@palmvoice_pet_cat        // Pet object for cat
@palmvoice_pet_puppy      // Pet object for puppy
@palmvoice_pet_panda      // Pet object for panda
@palmvoice_pet_koala      // Pet object for koala
```

## Pet Object Structure
```typescript
interface Pet {
  type: 'cat' | 'puppy' | 'panda' | 'koala';
  name: string;
  health: number; // 0-5
  originalCreatedAt: number; // Never changes, for streak
  createdAt: number; // Resets on revival
  lastFed: number;
  lastPet: number;
  lastPlay: number;
  lastPotion: number;
  lastRevival: number;
}
```

## Critical Patterns

### Always Reload From Storage
- When opening coins popup
- When switching pets
- When opening shop modals
- After purchases or item usage

### Save Immediately
- After coin changes
- After item purchases/usage
- After theme/pet purchases
- After pet actions (feed/pet/play)

### Fallback Values
```typescript
const coins = (await loadCoins()) || 0;
const items = (await loadItemInventory()) || { revivalInsurance: 0, healthPotion: 0 };
```

## Common Mistakes to Avoid
- Don't store items per-pet (they're global)
- Don't forget to save after state updates
- Don't use stale state - always reload
- Don't hardcode default values - use constants