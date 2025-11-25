# Shop Data Persistence Specification

## Overview
All shop purchases and unlocks saved to AsyncStorage for persistence.

## Storage Keys

### Unlocked Themes
- Key: `@unlockedThemes`
- Value: JSON array of theme IDs
- Example: `["cherryblossom", "feelslike2002", "ohsoflowery"]`
- Default: `["serene", "purple_skies", "orange_kiss"]` (starter themes)

### Unlocked Pets
- Key: `@unlockedPets`
- Value: JSON array of pet types
- Example: `["cat", "panda"]`
- Default: `["cat"]`

### Item Inventory
- Key: `@itemInventory`
- Value: JSON object with item counts
- Example: `{ "revivalInsurance": 2, "healthPotion": 5, "coinDoubler": 0, "autoFeeder": 0 }`
- Default: `{ "revivalInsurance": 0, "healthPotion": 0, "coinDoubler": 0, "autoFeeder": 0 }`

### Active Buffs
- Key: `@activeBuffs`
- Value: JSON object with buff expiry times
- Example: `{ "coinDoubler": 1703123456789, "autoFeeder": 1703987654321 }`
- Timestamps in Unix time
- Check on app load, remove expired buffs

## Purchase Flow

### Theme Purchase
1. Check coins >= theme price
2. Deduct coins from `@coins`
3. Add theme ID to `@unlockedThemes`
4. Save both to AsyncStorage
5. Theme now available in Pet screen dropdown

### Pet Purchase
1. Check coins >= pet price
2. Deduct coins from `@coins`
3. Add pet type to `@unlockedPets`
4. Save both to AsyncStorage
5. Pet now available in Pet dropdown

### Item Purchase
1. Check coins >= item price
2. Deduct coins from `@coins`
3. Increment item count in `@itemInventory`
4. Save both to AsyncStorage
5. Item usable from inventory

## Loading on App Start
- Load all shop data from AsyncStorage
- Apply to shop UI (show unlocked/locked states)
- Check for expired buffs
- Update displays accordingly