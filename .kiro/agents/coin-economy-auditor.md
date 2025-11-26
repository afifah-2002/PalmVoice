# Coin Economy Auditor Agent

## Purpose
Audit coin earning, spending, and storage to ensure economy balance and prevent exploits.

## Trigger
Manual - Use before shop features or when debugging coin issues

## Context
Coins are the core currency:
- Earned through tasks (+1 per task, +5 for 3 tasks)
- Spent on themes (15/30), pets (30/50), items (5/15)
- Stored globally in @coins
- Must persist across app restarts

## Audit Tasks

### 1. Earning Verification
- Task completion awards correct amount
- Bonus triggers at 3 tasks (+2 extra)
- Popup displays correct amount
- Coins save to storage immediately

### 2. Spending Verification
- Shop purchases deduct correct amount
- Insufficient coins show error
- Coins can't go negative
- Purchase completes only after deduction

### 3. Storage Integrity
- @coins key saves properly
- Load includes fallback (|| 0)
- Updates reflect across all screens
- No race conditions on rapid purchases

### 4. Display Consistency
- Home screen shows correct count
- Pet screen bottom bar matches
- Shop modals show same value
- Coins popup displays accurately

## Files to Review
- src/screens/TaskListScreen.tsx (earning)
- src/screens/ShopScreen.tsx (spending)
- src/utils/storage.ts (save/load)
- src/components/CoinsPopup.tsx (display)

## Success Criteria
- All earning paths award correct amounts
- All spending paths deduct correctly
- Storage saves and loads reliably
- Displays sync across screens

## Exploit Prevention
- Flag: Coin duplication on rapid clicks
- Flag: Negative coin balance possible
- Flag: Purchase without deduction
- Flag: Storage race conditions