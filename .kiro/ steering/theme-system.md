---
inclusion: fileMatch
fileMatchPattern: "src/screens/PetsScreen.tsx"
---

# Theme System Rules

## Theme Structure

### Available Themes
**Regular (15 coins):**
- Cherry Blossom, Feels Like 2002, Feels Like Christmas, Fish Pond
- Glowy, Magical, Minecraft, Oh So Flowery
- Peace, Secret Garden, Snowy Night, Therapeutic, Waterfall

**Exclusive (30 coins):**
- Anime, Autumn, Infinite, Moonlight
- Displayed at bottom of themes modal
- Golden border (#D4AF37) to distinguish

**Free Starter Themes:**
- Serene (theme1), Purple Skies (theme2), Orange Kiss (theme3)
- Always unlocked, cannot be locked

## Theme Naming

### Display Format
- Convert camelCase to spaced words
- Examples:
  - cherryblossom → CHERRY BLOSSOM
  - feelslike2002 → FEELS LIKE 2002
  - ohsoflowery → OH SO FLOWERY

### Overflow Prevention
- Long names wrap to 2 lines max
- Dropdown width: Fits longest name without cutoff
- No horizontal overflow in shop modal

## Purchase Flow

### Validation
1. Check coins >= theme price
2. Check theme not already purchased
3. Deduct coins from @coins
4. Add theme ID to @unlockedThemes
5. Save both to AsyncStorage

### Visual States
- **Unpurchased:** Shows price with treasure chest icon
- **Purchased:** Shows "PURCHASED" (green) + "EQUIP" button
- **Equipped:** Shows "EQUIPPED" (blue), button disabled

## Theme Application
- Active theme saved to @petsTheme
- GIF background from assets/pets/backgrounds/
- Updates Pet screen immediately
- Available in theme dropdown in Pet screen header