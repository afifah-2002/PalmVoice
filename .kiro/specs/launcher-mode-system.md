 # Launcher Mode System Specification

## Overview
Context-aware launcher that adapts icon layout based on user modes (Work, Study, Focus, Lazy, Custom).

## Mode Structure
- Each mode contains 15 icon slots (5 rows × 3 columns)
- Icons can be filled or empty (+ symbol)
- Preset modes: Work, Study, Focus, Lazy
- Users can create up to 10 total modes (including custom)

## Mode Management
- Dropdown selector in header (left side)
- Long press on custom modes to edit
- "+ CREATE MODE" option when under 10 modes
- Custom modes persist across app restarts

## Icon Behavior
- Tap: Opens app or screen
- Long press: Enters edit mode
- Edit mode: Shake animation, delete (X) button, swap by tapping two icons
- Empty slots: Lighter background, "+" symbol, tap to add app

## Theme System
- 5 color themes: Dark Blue, Blue, Lavender, Pink, Beige
- Each theme defines:
  - Screen/LCD background colors
  - Header/border colors
  - Icon circle colors
  - Modal/dropdown colors
  - Graffiti area colors
- Theme selector in header center
- All UI components adapt to selected theme

## Data Persistence
- Modes stored in AsyncStorage
- Custom modes saved as: { modeName: [[icons]] }
- Theme preference persists

## UI Constraints
- Press Start 2P font (pixelated retro)
- No rounded corners
- 2px borders everywhere
- Monochrome per-theme color palette
- LCD stripe effect overlay