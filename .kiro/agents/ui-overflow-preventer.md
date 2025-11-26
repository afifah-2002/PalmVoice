# UI Overflow Preventer Agent

## Purpose
Prevent text and UI elements from overflowing outside containers, especially for long pet/theme names.

## Trigger
Manual - Use when adding new text displays or fixing layout issues

## Context
Palm Pilot aesthetic requires everything within the bezel. Common overflow areas:
- Theme names in dropdown
- Pet names in modals
- Task titles
- Shop item names

## Prevention Tasks

### 1. Text Container Rules
- All Text components need width constraint
- Long text needs numberOfLines prop
- Dropdowns need maxWidth
- Modals need padding from edges

### 2. Name Display Patterns
- Theme names: Wrap to 2 lines max, 7px font
- Pet names: 12 char limit, single line
- Task titles: numberOfLines={2}
- Buttons: Fixed width, ellipsis if overflow

### 3. Dropdown Handling
- Width: Longest name + 40px padding
- Max width: Screen width - 80px
- Text wraps inside dropdown
- Selected text doesn't cut off

### 4. Modal Boundaries
- Content padding: 16px from edges
- Scrollable if content > screen height
- Border radius doesn't cause cutoff
- Buttons stay within modal

### 5. Grid Layouts
- Shop grid: 2 columns with proper spacing
- Task list: Full width minus padding
- Pet selection: Centered with margins

## Files to Review
- src/screens/PetsScreen.tsx (dropdown, pet display)
- src/screens/ShopScreen.tsx (theme grid, modals)
- src/screens/TaskListScreen.tsx (task items)
- src/components/*.tsx (reusable components)

## Success Criteria
- No horizontal scrolling anywhere
- All text readable and within bounds
- Dropdowns show full text
- Modals fit on screen

## CSS Properties to Check
- width: Should be constrained, not 'auto'
- maxWidth: Set on containers
- numberOfLines: Set on Text components
- flexWrap: 'wrap' for multi-line text
- overflow: 'hidden' on containers

## Common Fixes
- Add numberOfLines={2} to Text
- Set maxWidth on dropdowns
- Use flexWrap: 'wrap' for names
- Reduce fontSize for long content
- Add horizontal padding to modals