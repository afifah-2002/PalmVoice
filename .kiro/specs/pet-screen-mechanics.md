# Pet Screen Mechanics

## Layout
- Theme dropdown: Top left (same as homepage)
- Pet dropdown: Next to theme
- Health hearts: Top right corner
- Cat name: Above cat image
- Cat sprite: Center of screen
- Treasure chest + coins: Below cat
- Feed/Play/Pet buttons: Bottom of screen (horizontal row)

## Health System
- 5 hearts max
- Loses 1 heart every 5 seconds
- 0 hearts = dead
- Feed/Play/Pet: +1 heart each (max 5)

## Coins
- Default: 10 coins
- Revival cost: 5 coins
- Earn coins: Complete tasks in TO DO list

## Revival
- Cat dies at 0 hearts
- Show popup: "Use 5 coins to revive?"
- If coins >= 5: Revive allowed, deduct 5 coins
- If coins < 5: Show "Not enough coins"

## Persistence
- Health, coins, cat name saved to AsyncStorage
- Loads on app open