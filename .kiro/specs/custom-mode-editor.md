# Custom Mode Editor Specification

## Modal Structure
- Full-screen overlay with semi-transparent background
- Header: "CREATE MODE" or "EDIT MODE" with close (X) button
- Body: Text input + icon grid + action buttons

## Mode Name Input
- Text input field with "MODE NAME:" label
- Taps open PixelKeyboard modal
- Max 20 characters
- Auto-uppercase
- Press Start 2P font

## Icon Grid
- Same 5×3 grid as launcher
- All slots start empty (+ symbol) for new modes
- Existing modes show current icons
- Full edit capabilities: add, remove, swap
- Scrollable if needed

## Actions
- SAVE button: Validates name, saves mode config, closes modal
- CANCEL button: Discards changes, closes modal
- DELETE MODE button (edit only): Shows confirmation alert, deletes mode

## Edit Mode State
- Shared with launcher edit mode
- Icons shake when editable
- Delete X appears on filled icons
- Tap to select for swap, tap another to complete swap

## Validation
- Mode name required before save
- Duplicate mode names allowed (overwrites)
- Empty grids allowed (valid use case: minimal mode)

## Data Flow
- Input: modeName, modeApps array
- Output: calls onSave(name, apps) callback
- Parent handles state persistence