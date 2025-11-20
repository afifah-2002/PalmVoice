# Task List Screen Theming Specification

## Theme Consistency
- Task list page must use current selected theme
- Theme persists when navigating between screens
- No theme reset on navigation

## Theme Application

### Screen Elements
- Background: theme.screenBackground
- Header bar: theme.headerBackground, theme.headerBorder
- Task items: theme.gridBoxBackground
- Checkboxes: theme.iconCircleBackground
- Text: theme.headerText, theme.iconText
- Borders: theme.gridBoxBorder

### Header Changes
- Remove question mark (?) icon from top right
- Use Press Start 2P font for all text
- Title: "TO DO LIST" in theme.headerText
- Time display: Same style as launcher

## Palm Pilot Screen Constraints
- Content must fit within Palm Pilot LCD screen bounds
- No overflow to phone screen edges
- Proper padding from screen borders: 20px
- Scrollable content area for tasks

## Bottom Hardware Buttons
- Always visible at bottom of bezel (outside LCD screen)
- 4 buttons: HOME, TO DO, PET, MENU
- Same styling as launcher favorite buttons
- Active state: TO DO button highlighted/different color
- Buttons persist across all app screens

## Navigation Behavior
- HOME button: Returns to launcher, preserves theme and mode
- TO DO button: Already on page, shows active state
- PET button: Navigates to pet screen, preserves theme
- MENU button: Opens settings/about, preserves theme

## State Persistence

### Theme State
- Theme stored in AsyncStorage
- Loaded on app mount
- Passed to all screens via context or props
- Updates propagate to all open screens

### Mode State
- Current mode (Work/Study/Focus/etc.) persists
- Mode not affected by navigation
- Switching pages does not change mode
- Mode only changes via header dropdown

### Prevention of State Reset
- HOME button double-tap: Should NOT reset theme to Dark Blue
- Navigation: Should NOT reset mode to Work
- Screen focus: Should NOT reload default states
- Implement: useEffect cleanup and proper state management