# Home Screen Dashboard Specification

## Overview
Home screen displays two cards: Pet Status and Today's Tasks. Replaces icon grid and graffiti text box with useful dashboard.

## Layout Structure

### Screen Areas
- Header bar: Mode dropdown, Theme dropdown, Time (unchanged)
- Card 1: Pet Status (top, ~55% of screen)
- Card 2: Today's Tasks (bottom, ~35% of screen)
- Hardware buttons: HOME, TO DO, PET, MENU (unchanged)

## Card 1: Pet Status

### Container
- Background: Uses same GIF theme from Pet screen
- Border: 2px solid (theme color)
- Margin: 12px from screen edges
- Padding: 16px inside

### Content (Top to Bottom)
- Title: "PET STATUS" (pixelated font, theme text color)
- Cat sprite: Same animated cat from Pet screen (~80px)
- Cat name: Display saved name (e.g., "MIMI")
- Health bar: Heart icon + progress bar (not emoji hearts)
- Coin display: Treasure chest icon + coin count
- Quick action buttons: FEED, PET, PLAY (horizontal row)

### Health Display
- Use custom heart image from assets
- Progress bar next to heart showing health level
- No black heart emojis

### Quick Actions
- Same icons as Pet screen (FEED, PET, PLAY)
- Tapping works same as Pet screen (+1 health)
- Updates health bar immediately

## Card 2: Today's Tasks

### Container
- Background: Theme color (semi-transparent)
- Border: 2px solid (theme color)
- Margin: 12px from screen edges
- Padding: 16px inside

### Content
- Title: "TODAY'S TASKS" (pixelated font)
- Task count: "X tasks due today"
- Overdue warning: "X overdue!" (red color, only if overdue exists)
- Button: "VIEW TASKS" (navigates to TO DO page)

### Overdue Display
- Only shows if tasks are past due date
- Red warning icon (not emoji)
- Red text color

## Theme Integration
- Pet card uses GIF background from Pet screen theme
- Task card uses Palm OS theme colors
- Both cards match selected theme
- Theme persists across all pages

## Data Sources
- Pet data: From AsyncStorage (@petHealth, @petName, @coins)
- Task data: Count from task list, filter by today's date
- Overdue: Filter tasks where dueDate < now

## Removed Elements
- Icon grid (GIRAFFE, MAIL, etc.)
- Empty "+" slots
- Graffiti text box
- Side icons (home, phone, calculator, search)

## Navigation
- Tap Pet card or FEED/PET/PLAY: Actions work on home screen
- Tap "VIEW TASKS": Goes to TO DO page
- Hardware buttons: Work as normal