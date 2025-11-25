# Multiple Pet Slots System Specification

## Overview
Each pet type (Cat, Puppy, etc.) has its own separate data slot. Users can switch between pets, and each maintains its own name, health, streak, and interaction history.

## Pet Types

### Available Pets
- Cat (default, always unlocked)
- Puppy (unlockable via shop for 25 coins)
- Panda (future, locked)
- Penguin (future, locked)

## Data Structure

### Individual Pet Data
Each pet type stores separately:
- Pet name (e.g., "Mimi", "Buddy")
- Health (0-5 hearts)
- Created date (for streak calculation)
- Last fed timestamp
- Last pet timestamp
- Last play timestamp

### Storage Keys
Each pet has its own AsyncStorage key:
- Cat: `@palmvoice_pet_cat`
- Puppy: `@palmvoice_pet_puppy`
- Panda: `@palmvoice_pet_panda`
- Penguin: `@palmvoice_pet_penguin`

### Active Pet
- Key: `@palmvoice_active_pet`
- Value: 'cat' | 'puppy' | 'panda' | 'penguin'
- Determines which pet displays on screen

## Pet Creation Flow

### First Time Selection
1. User selects pet type from dropdown (e.g., "🐶 Puppy")
2. Check if pet exists in storage
3. If NO: Open name input modal
4. User enters name (max 12 characters)
5. Create new pet with:
   - Name: User input
   - Health: 5 hearts
   - Created date: Current date midnight
   - Last interactions: All set to 0 (allows immediate actions)
6. Save pet to storage with pet-specific key
7. Set as active pet
8. Display pet on screen

### Returning to Existing Pet
1. User selects pet type from dropdown
2. Check if pet exists in storage
3. If YES: Load pet data
4. Set as active pet
5. Display pet with saved data (name, health, streak)

## Pet Switching

### User Flow
1. User taps pet dropdown in Pet screen
2. Dropdown shows:
   - 🐱 Cat
   - 🐶 Puppy
   - 🐼 Panda (locked)
   - 🐧 Penguin (locked)
3. User selects different pet
4. Current pet data auto-saves
5. Selected pet data loads
6. Screen updates with new pet

### Data Preservation
- Switching pets does NOT affect individual pet data
- Each pet continues health decay independently
- Streaks continue for each pet separately
- User can switch back anytime

## Pet Sprites

### Cat Sprites
Location: assets/pets/cat/
- catsit.png (idle, 5-3 hearts)
- cateat.png (feeding animation)
- catcry.png (low health, 1-2 hearts)
- catpet.png (petting/playing animation)

### Puppy Sprites
Location: assets/pets/puppy/
- puppysit.png (idle, 5-3 hearts)
- puppyeat.png (feeding animation)
- puppycry.png (low health, 1-2 hearts)
- puppypet.png (petting/playing animation)

### Sprite Selection Logic
Based on pet type and health state:
- Health 5-3: Show sit sprite
- Health 1-2: Show cry sprite
- Feeding: Show eat sprite (duration: 1 second)
- Petting/Playing: Show pet sprite (duration: 1 second)

## Health System Per Pet

### Independent Health Decay
- Each pet loses 1 heart every 4.8 hours
- Calculated from midnight of creation day
- Decay continues even when pet is not active
- When switching to a pet, recalculate health based on time elapsed

### Health Check on Switch
1. Load pet data from storage
2. Calculate time since last health check
3. Apply health decay
4. Update health in storage
5. Display current health

## Streak System Per Pet

### Individual Streaks
- Each pet has its own streak
- Streak = Days since pet creation
- Starts at 1 day (includes creation day)
- Continues even when pet is not active
- Does NOT reset when switching pets

### Streak Display
- Home screen: Shows active pet's streak
- Pet screen: Shows active pet's streak
- Shop share: Uses active pet's streak

## Multiple Pets Example

### User Scenario
```
User owns:
- Cat named "Mimi"
  - Health: 4 hearts
  - Streak: 7 days
  - Last fed: 2 hours ago

- Puppy named "Buddy"
  - Health: 5 hearts
  - Streak: 3 days
  - Last fed: 5 hours ago

Currently viewing: Mimi (Cat)
Home screen shows: "7 DAYS" streak

User switches to Buddy:
- Screen updates to show puppy sprite
- Health bar shows: 5 hearts
- Bottom bar shows: "3 DAYS" streak
- Can feed/pet/play Buddy

User switches back to Mimi:
- Screen updates to show cat sprite
- Health bar shows: 4 hearts (unchanged)
- Bottom bar shows: "7 DAYS" streak
- Mimi's data preserved
```

## Unlocking New Pets

### Purchase Flow
1. User buys pet from shop (e.g., Puppy for 25 coins)
2. Pet type unlocked and saved to `@unlockedPets`
3. Pet appears in dropdown (no longer grayed out)
4. User can now select and create this pet type

### Free vs Paid
- Cat: Always unlocked (free)
- Puppy: 25 coins
- Panda: 25 coins (future)
- Penguin: 25 coins (future)

## Edge Cases

### Pet Dies While Not Active
- Cat is active, Puppy is inactive
- Puppy's health reaches 0 while user is viewing Cat
- Next time user switches to Puppy: Shows dead sprite
- Requires revival (5 coins) to restore

### Creating Same Pet Type Twice
- Cannot create duplicate pet types
- If Cat already exists, selecting Cat switches to existing Cat
- Does NOT create "Cat 2"

### Deleting Pets
- Not implemented for hackathon
- Could add "Release Pet" feature later
- Would delete pet-specific storage key

## Data Migration

### First Launch After Update
- Check for old pet data (single pet system)
- If exists: Migrate to `@palmvoice_pet_cat`
- Set Cat as active pet
- User's existing pet preserved as Cat