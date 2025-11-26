---
inclusion: always
---

# Coin Economy System

## Earning Coins

### Task Completion
- Complete 1 task = +1 coin
- Complete 3 tasks at once = +5 coins (includes +2 bonus)
- Show animated popup: "+1 COIN EARNED!" with treasure chest icon
- Animation: Scale up (0.5→1.0) bounce, hold 1.5s, fade out

### Daily Login
- First app open each day = +1 coin
- Check via lastLoginDate in AsyncStorage
- Show popup: "DAILY BONUS +1 🪙"

### Fruit Catching Game
- Accessible when insufficient coins for revival
- 1 coin per fruit tapped
- Game duration: 20 seconds
- Fruits: strawberry, orange, banana, apple from assets/icons/

## Spending Coins

### Themes
- Regular themes: 15 coins (Cherry Blossom, Magical, etc.)
- Exclusive themes: 30 coins (Anime, Autumn, Infinite, Moonlight)
- Purchased themes saved to @unlockedThemes array

### Pets
- Puppy: 30 coins
- Panda: 50 coins
- Penguin: 50 coins
- Cat: FREE (default)

### Items
- Health Potion: 5 coins (restores +2 hearts)
- Revival Insurance: 15 coins (1 free revival token)
- Revival without token: 5 coins

## Storage Architecture

### Global vs Per-Pet
- **GLOBAL (shared across all pets):**
  - @coins - Total coin balance
  - @itemInventory - {revivalInsurance: X, healthPotion: Y}
  - @unlockedThemes - Array of theme IDs
  - @unlockedPets - Array of pet types

- **PER-PET (individual):**
  - @palmvoice_pet_[type] - Each pet's health, name, timestamps
  - Health and streak are NOT shared

## Critical Rules
- Always reload items from storage when switching pets
- Use fallback values (|| 0) to prevent undefined displays
- Coin balance updates immediately across all screens
- Items inventory syncs globally - all pets see same counts