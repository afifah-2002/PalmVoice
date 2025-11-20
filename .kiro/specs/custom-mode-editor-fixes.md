# Custom Mode Editor Fixes Specification

## Modal Sizing
- Modal width: 95% of screen width
- Modal height: Maximum 90% of screen height
- Content scrollable if exceeds height
- Proper padding: 16px all sides

## Keyboard Layout (PixelKeyboard)

### Special Characters Keyboard - Row Structure
**Row 1 (Symbols):**
- Start with: `[`
- End with: `=`
- Keys: `[`, `]`, `{`, `}`, `#`, `%`, `^`, `*`, `+`, `=`
- All keys same width: 32px
- Spacing: 3px between keys

**Row 2 (More Symbols):**
- Start with: `_`
- End with: `.`
- Keys: `_`, `\`, `|`, `~`, `<`, `>`, `€`, `£`, `¥`, `•`
- All keys same width: 32px
- Spacing: 3px between keys

**Row 3 (Bottom Row - Larger Keys):**
- Start with: `123` (mode switch button)
- End with: `⌫` (backspace)
- Key widths: 1.5x larger than rows above (48px)
- Keys: `123`, `.`, `,`, `?`, `!`, `'`, `⌫`
- Spacing: 4px between keys

### Keyboard Width Constraint
- Keyboard must span ONLY the Palm Pilot screen width
- Max width: Match the green LCD screen, not full phone width
- Proper padding from screen edges: 12px left/right
- No overflow or cut-off keys

## App Picker Integration

### Selection Behavior
**In Custom Mode Modal:**
- Tap `+` slot → Opens AppPickerModal
- Select app from picker → App appears in selected slot immediately
- Modal updates in real-time
- No swap behavior during creation

**Empty Slot Selection:**
- All 15 slots show `+` symbol initially
- Each `+` is tappable
- Clicking stores slot position (rowIndex, colIndex)
- AppPickerModal receives slot position
- Selected app fills that exact slot

### App Addition Rules
- First-time add: Places app in selected slot
- App already exists: Shows duplicate confirmation dialog
- User confirms: Creates duplicate in new slot
- User cancels: Returns to modal without changes

### Duplicate Confirmation Dialog
```
Title: "DUPLICATE APP"
Message: "EXPENSE already exists in this mode. Add another copy?"
Buttons:
  - CANCEL (gray background)
  - YES (theme background)
Style: Palm OS pixelated font, theme colors
```

## State Management

### During Mode Creation
- Apps array initializes as 15 null values (5 rows × 3 cols)
- User can add apps before saving mode
- Changes reflect immediately in preview grid
- SAVE button writes mode to storage

### After Mode Creation
- Mode appears in dropdown with custom modes
- Switching to mode loads correct icons
- Full edit capabilities available
- Grid shows with proper scrolling

## Grid Scrolling

### Default Modes (Work/Study/Focus/Lazy)
- Fixed grid, no scroll needed
- All icons visible at once

### Custom Modes
- Scrollable container for 15 icon slots
- ScrollView with:
  - showsVerticalScrollIndicator: true
  - contentContainerStyle: proper padding
  - Same icon size as default modes (70px circles)
- Scroll bar always visible when content exceeds viewport

### Size Consistency
- Custom mode icons: Same size as launcher icons
- Circle diameter: 70px
- Icon spacing: 12px vertical between rows
- Grid container height: Match default mode grids