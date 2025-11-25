# Items Shop Modal Specification

## Overview
Modal showing purchasable items that affect gameplay.

## Available Items

### 1. Revival Insurance
- Icon: Shield icon
- Price: 15 coins
- Effect: 1 free revival token (use when pet dies)
- Can buy multiple

### 2. Health Potion
- Icon: potion.png from assets/pets/shop/
- Price: 5 coins
- Effect: Instantly restore 2 hearts
- Can buy multiple, use from inventory

### 3. Coin Doubler
- Icon: Double coin icon
- Price: 20 coins
- Effect: 2x coins from tasks for 24 hours
- One-time use, timer-based

### 4. Auto-Feeder
- Icon: Food bowl icon
- Price: 25 coins
- Effect: Auto-feed pet once daily for 7 days
- One-time purchase, 7-day timer

## Item Display

### Layout
- Vertical list (1 column)
- Scrollable
- Each item shows:
  - Icon (60px)
  - Name
  - Description (small text)
  - Price
  - "BUY" button

### Item Styling
- Border: Brown, 2px
- Background: Beige with 80% opacity
- Rounded corners: 8px
- Spacing: 12px between items

## Purchase Flow
1. User taps "BUY" button
2. Confirmation popup: "BUY [ITEM] FOR X COINS?"
3. On confirm: Deduct coins, add to inventory
4. Show success message
5. Item count updates