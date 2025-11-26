# Multi-Pet Data Validator Agent

## Purpose
Validate that multiple pet slots work independently and data doesn't leak between pets.

## Trigger
Manual - Use when switching pets or debugging multi-pet issues

## Context
Each pet type stores separately:
- @palmvoice_pet_cat, @palmvoice_pet_puppy, etc.
- Independent: name, health, timestamps, streak
- Shared: coins, items (revivalInsurance, healthPotion)

## Validation Tasks

### 1. Pet Isolation
- Feeding Cat doesn't affect Puppy's health
- Switching pets preserves previous pet's data
- Each pet has unique name
- Each pet has independent streak

### 2. Data Loading
- loadPet(type) loads correct pet from storage
- Switching updates active pet in state
- Previous pet auto-saves before switch
- New pet loads with correct timestamps

### 3. Shared Data Integrity
- Coins shared across all pets
- Using potion on Cat decrements global count
- Puppy sees same item counts
- Purchasing theme unlocks for all pets

### 4. Storage Key Correctness
- Cat uses @palmvoice_pet_cat
- Puppy uses @palmvoice_pet_puppy
- No cross-contamination
- Active pet stored in @palmvoice_active_pet

### 5. Health Independence
- Each pet's health calculated from own timestamps
- Clock doesn't share between pets
- Dead pet stays dead when switching away
- Reviving one pet doesn't affect others

## Files to Review
- src/utils/storage.ts (loadPet, savePet functions)
- src/screens/PetsScreen.tsx (pet switching logic)
- src/screens/HomeScreen.tsx (active pet display)

## Success Criteria
- Can create and switch between multiple pets
- Each pet maintains independent health
- Shared resources (coins/items) work globally
- No data loss when switching
- Storage keys follow pattern

## Test Scenarios
1. Create Cat named "Mimi" with 3 hearts
2. Create Puppy named "Buddy" with 5 hearts
3. Switch back to Cat → Still "Mimi" with 3 hearts
4. Use potion on Cat → Both pets see potion count decrease
5. Feed Puppy → Cat's health unchanged

## Red Flags
- Health syncing between pets
- Names getting mixed up
- Items showing different counts per pet
- Storage keys not using pet type
- Previous pet data lost on switch