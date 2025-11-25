# Theme Purchase Flow Specification

## Overview
Users purchase themes with coins. Purchased themes unlock for use in Pet screen.

## Purchase Requirements

### Validation Checks
1. User has sufficient coins (>= theme price)
2. Theme not already purchased
3. Coins available in AsyncStorage

### Insufficient Coins
- Show error popup: "NOT ENOUGH COINS!"
- Display: "You need X more coins"
- Button: "OK" to close
- Theme remains locked

## Purchase Process

### Step 1: User Clicks Theme
- If already purchased: Skip to equip
- If not purchased: Check coin balance

### Step 2: Coin Deduction
- Deduct theme price from @coins
- Save new coin balance to AsyncStorage
- Update coin display immediately

### Step 3: Unlock Theme
- Add theme ID to @purchasedThemes array
- Save to AsyncStorage
- Theme now owned by user

### Step 4: Visual Update
- Theme item changes from price display to "PURCHASED"
- Green border appears on theme item
- "EQUIP" button appears

## Data Persistence

### Storage Keys
- @coins: Current coin balance
- @purchasedThemes: Array of purchased theme IDs
- Example: ["cherryblossom", "anime", "moonlight"]

### Default Purchased Themes
- Serene (theme1)
- Purple Skies (theme2)
- Orange Kiss (theme3)
- These come free, always in purchased list