# Bottom Hardware Buttons Specification

## Button Count and Layout
- Total buttons: 4 (reduced from 5)
- Layout: Horizontal row, evenly spaced
- Location: Gray bezel area below Palm Pilot screen
- Alignment: Center-aligned in bezel

## Button Definitions

### 1. HOME (🏠)
- Icon: House symbol
- Label: "Home"
- Function: Returns to launcher screen
- Active state: Only active when NOT on launcher
- Behavior: Preserves theme and mode

### 2. TO DO (✓)
- Icon: Checkmark symbol
- Label: "To Do"
- Function: Opens task list screen
- Route: `/tasks`
- Active state: Highlighted when on task screen

### 3. PET (🐾)
- Icon: Paw print symbol
- Label: "Pet"
- Function: Opens pet Tamagotchi screen
- Route: `/pet` (to be created)
- Active state: Highlighted when on pet screen

### 4. MENU (☰)
- Icon: Three horizontal lines (hamburger)
- Label: "Menu"
- Function: Opens settings/about modal or screen
- Route: `/about` or modal
- Temporary: console.log until screen created

## Visual Design

### Button Style
- Shape: Rounded rectangle
- Width: 70px
- Height: 70px
- Border radius: 8px
- Background: #2A2A2A (dark gray)
- Border: 3px solid #1A1A1A (darker, for depth)
- Spacing between buttons: 12px

### Icon Style
- Size: 32px
- Color: #8B9B6A (muted greenish-gray)
- Type: Use Unicode/emoji temporarily, replace with pixel art later
- Position: Centered in button, above label

### Label Style
- Font: Press Start 2P
- Size: 7px
- Color: #999999 (light gray)
- Position: Below icon, 6px spacing
- Text: Title case ("Home", "To Do", "Pet", "Menu")

### Active State
- Background: #1A1A1A (darker)
- Border: 3px solid #3A3A3A (lighter than active bg)
- Icon color: #A8BD7A (brighter green)
- Label color: #CCCCCC (brighter gray)

### Press State
- Background: #0A0A0A (very dark)
- Haptic feedback: Light impact
- Duration: While pressed

## Container Style
- Background: #3A3A3A (matches bezel)
- Padding: 20px vertical, 16px horizontal
- Flex direction: Row
- Justify content: space-around
- Position: Fixed at bottom of Palm Pilot bezel

## Behavior

### Navigation
- Tapping any button navigates to respective screen
- Theme persists across navigation
- Mode persists across navigation
- Current button shows active state

### Presence
- Buttons visible on ALL screens:
  - Launcher (index)
  - Task list (/tasks)
  - Pet screen (/pet)
  - About/Settings (/about)
- Consistent positioning across all screens
- Always in gray bezel, never in LCD screen area

### State Management
- Active button determined by current route
- Use `router.pathname` to determine active state
- Only one button active at a time
- HOME has no active state (always available)

## Future Enhancement
- Replace Unicode emoji icons with custom pixel art
- Match pixel icon style from app icons
- Create icons in assets/icons/ directory
- Icons: home.png, todo.png, pet.png, menu.png