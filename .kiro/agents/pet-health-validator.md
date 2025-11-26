# Pet Health Validator Agent

## Purpose
Validate pet health calculations and ensure they follow the 4.8-hour decline system correctly.

## Trigger
Manual - Use when working on pet health features or debugging health issues

## Context
The pet health system is critical and has specific rules that must be followed:
- Health declines 1 heart every 4.8 hours
- Calculated from most recent interaction timestamp
- Must use lastFed, lastPet, lastPlay, lastPotion, lastRevival
- NEVER use createdAt for health calculation
- originalCreatedAt is only for streak counting

## Validation Tasks

### 1. Check Health Calculation Function
- Verify it finds the MOST RECENT timestamp among all interactions
- Confirm it calculates hours elapsed correctly
- Ensure it uses 4.8-hour intervals
- Validate it returns 0-5 hearts only

### 2. Check Action Handlers
- Feed/Pet/Play should update respective timestamp
- Health should increase by 1 (max 5)
- Potion should update lastPotion and increase by 2
- Revival should update lastRevival and reset to 5 hearts

### 3. Check Streak Calculation
- Verify it uses originalCreatedAt, not createdAt
- Confirm days calculation includes creation day (+1)
- Ensure it shows 0 when pet is dead (health === 0)

### 4. Check Revival Logic
- Confirm createdAt resets but originalCreatedAt doesn't
- Verify all action timestamps reset to 0
- Ensure health restores to 5

## Files to Review
- src/screens/PetsScreen.tsx
- src/utils/storage.ts
- src/types/index.ts (Pet interface)

## Success Criteria
- Health calculation uses correct timestamp
- No references to createdAt in health logic
- originalCreatedAt preserved through revival
- All action effects match specification

## Common Issues to Flag
- Using createdAt instead of interaction timestamps
- Not finding most recent interaction
- Resetting originalCreatedAt on revival
- Allowing health > 5 or < 0