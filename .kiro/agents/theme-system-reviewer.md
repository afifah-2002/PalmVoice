# Theme System Reviewer Agent

## Purpose
Review theme purchase flow, storage, and application to ensure themes work correctly.

## Trigger
Manual - Use when adding new themes or debugging theme issues

## Context
Themes have two tiers:
- Regular: 15 coins (13 themes)
- Exclusive: 30 coins (4 themes: Anime, Autumn, Infinite, Moonlight)
- Free starters: Serene, Purple Skies, Orange Kiss

## Review Tasks

### 1. Purchase Flow
- Verify coin validation before purchase
- Check theme not already owned
- Confirm coin deduction and theme unlock happen together
- Validate storage save includes both updates

### 2. Theme States
- Unpurchased: Shows price + treasure icon
- Purchased: Shows "PURCHASED" + "EQUIP" button
- Equipped: Shows "EQUIPPED", button disabled

### 3. Visual States
- Unpurchased: Brown border (regular) or Gold (exclusive)
- Purchased: Green border (#00FF00)
- Equipped: Blue border (#4169E1)

### 4. Name Display
- Long names wrap to 2 lines
- No horizontal overflow
- Proper spacing (cherryblossom → CHERRY BLOSSOM)
- Dropdown shows all without cutoff

### 5. Theme Application
- GIF loads from correct path
- Background updates immediately
- Theme saves to @petsTheme
- Appears in dropdown on Pet screen

## Files to Review
- src/screens/ShopScreen.tsx (purchase UI)
- src/screens/PetsScreen.tsx (theme application)
- src/utils/storage.ts (theme storage)
- src/constants/themes.ts (theme definitions)

## Success Criteria
- Purchase flow is atomic (all-or-nothing)
- Visual states match spec exactly
- Names display without overflow
- Themes persist and apply correctly

## Common Issues to Flag
- Theme unlocked but coins not deducted
- Equipped theme not showing in dropdown
- Name overflow in modal or dropdown
- GIF not loading after purchase