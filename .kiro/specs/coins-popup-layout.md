# Coins Popup Layout Specification

## Overview
Fixed overflow issues and proper alignment of items with conditional USE buttons.

## Popup Structure

### Title
- Text: "YOUR COINS"
- Font: Press Start 2P, 10px
- Color: Dark brown (#3D2914)
- Centered at top

### Coin Balance
- Treasure chest icon (32px)
- Coin count number (large, 16px)
- Centered, prominent display

### Items Section

**Each Item Row:**
- Icon (24×24px) - left aligned
- Item name + count - center
- USE button - right aligned (conditional)

**Fixed Layout:**
```
[Icon 24x24]  Item Name: X  [USE]
```

### Item Row Styling
- Height: 40px
- Flex direction: Row
- Align items: Center
- Justify content: Space between
- Padding: 8px horizontal
- Background: Semi-transparent
- Border radius: 6px

## USE Button Conditions

### Revival Token USE Button
**Shows When:**
- Pet has 0 hearts (dead)
- User has 1+ revival tokens

**Hidden When:**
- Pet has 1-5 hearts (alive)
- User has 0 revival tokens

### Health Potion USE Button
**Shows When:**
- Pet has 1-3 hearts (injured but alive)
- User has 1+ health potions

**Hidden When:**
- Pet has 0 hearts (dead - can't use potion on dead pet)
- Pet has 4-5 hearts (already healthy)
- User has 0 health potions

## USE Button Logic Table

| Hearts | Revival USE | Potion USE |
|--------|-------------|------------|
| 0 (dead) | ✅ Shows | ❌ Hidden |
| 1 | ❌ Hidden | ✅ Shows |
| 2 | ❌ Hidden | ✅ Shows |
| 3 | ❌ Hidden | ✅ Shows |
| 4 | ❌ Hidden | ❌ Hidden |
| 5 | ❌ Hidden | ❌ Hidden |

## Alignment Fix

### Placeholder View
When USE button is hidden, show invisible placeholder:
```typescript
{showUseButton ? (
  <Button>USE</Button>
) : (
  <View style={{ width: 60 }} /> // Placeholder for alignment
)}
```

### Why Placeholder?
- Keeps items aligned vertically
- Prevents layout shift when button appears/disappears
- Maintains consistent spacing

## Size Adjustments

### Icon Size
- Reduced from 32px to 24px
- Prevents overflow on smaller screens
- Still recognizable

### Font Size
- Item labels: 7px (from 8px)
- Counts: 8px
- USE button: 7px

### Button Size
- Width: 60px
- Height: 28px
- Fits within row without overflow

## Cross-Pet Consistency

### Same Layout for All Pets
- Cat, Puppy, Panda, Koala all use same popup
- USE buttons conditional on `displayedHealth`
- `displayedHealth` calculated dynamically for active pet
- Items always show same global counts

## Visual Improvements
- No text overflow outside popup bounds
- Proper spacing between elements
- Clear visual hierarchy
- Responsive to different pet health states