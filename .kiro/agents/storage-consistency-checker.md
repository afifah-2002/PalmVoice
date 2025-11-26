# Storage Consistency Checker Agent

## Purpose
Ensure AsyncStorage keys follow conventions and data persists correctly across app lifecycle.

## Trigger
Manual - Use when adding new storage keys or debugging persistence issues

## Context
Storage architecture:
- Global data: @coins, @itemInventory, @unlockedThemes, @unlockedPets
- Per-pet data: @palmvoice_pet_[type]
- Items are global, health is per-pet

## Check Tasks

### 1. Key Convention Compliance
- Global keys start with @
- Per-pet keys use @palmvoice_pet_[type] pattern
- No spaces in key names
- Keys documented in storage-patterns.md

### 2. Data Structure Validation
- @coins stores number
- @itemInventory stores { revivalInsurance, healthPotion }
- @unlockedThemes stores string[]
- Pet objects match Pet interface

### 3. Save/Load Patterns
- All saves wrapped in try-catch
- All loads include fallback values
- JSON.stringify for objects
- JSON.parse for retrieval

### 4. Reload Timing
- Items reload when opening coins popup
- Items reload when switching pets
- Pets reload when switching types
- Coins reload after purchases

### 5. Race Condition Prevention
- No simultaneous saves to same key
- Await all AsyncStorage operations
- Sequential updates for related data

## Files to Review
- src/utils/storage.ts (all functions)
- src/screens/*.tsx (storage usage)
- src/types/index.ts (data structures)

## Success Criteria
- All keys follow naming convention
- All saves have error handling
- All loads have fallbacks
- Reload happens at correct times

## Red Flags
- Synchronous storage operations
- Missing try-catch blocks
- No fallback values on load
- Hardcoded key names (use constants)
- Items stored per-pet instead of globally