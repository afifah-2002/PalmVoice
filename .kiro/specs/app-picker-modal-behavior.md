# App Picker Modal Behavior Specification

## Modal Structure
- Full-screen overlay with 70% opacity black background
- Content box: 85% screen width, max 70% screen height
- Border: 2px solid, color matches current theme
- Background: theme.modalBackground

## App Selection Logic

### Normal Selection (App Not in Mode)
1. User taps app in picker
2. App fills selected slot
3. Modal closes automatically
4. Parent component updates immediately

### Duplicate Detection (App Already Exists)
1. User taps app in picker
2. System checks if app.label exists in current mode
3. If exists:
   - Modal stays open
   - Shows duplicate confirmation dialog
   - Waits for user response
4. User response:
   - YES → Add duplicate, close modal
   - CANCEL → Stay in picker, keep modal open

### Swap Prevention
**Old behavior (removed):**
- Selecting existing app would swap positions

**New behavior:**
- Selecting existing app triggers duplicate dialog
- No automatic swapping
- User explicitly chooses to duplicate or cancel

## App Slot Tracking

### Selected Slot State
```typescript
selectedSlot: {
  rowIndex: number,  // 0-4
  colIndex: number   // 0-2
} | null
```

### Slot Selection Flow
1. User taps `+` in grid → Sets selectedSlot
2. AppPickerModal opens with selectedSlot prop
3. User selects app → Fills selectedSlot position
4. Modal closes → Clears selectedSlot

### Edge Cases
- Modal closes without selection → selectedSlot cleared
- User switches slots mid-selection → Updates selectedSlot
- Multiple rapid taps → Debounced, last tap wins

## Visual Feedback

### Selected Slot Indicator
- `+` slot pressed: Slightly darker background
- Haptic feedback: Light impact

### App Selection Confirmation
- Tap app: Brief highlight (0.2s)
- Haptic feedback: Medium impact
- Modal fade out (0.3s)

## Integration with Custom Mode Modal

### Parent-Child Communication
**CustomModeModal → AppPickerModal:**
- Passes: selectedSlot, availableApps, theme
- Receives: onAppSelect(appLabel) callback

**AppPickerModal → CustomModeModal:**
- Returns: Selected app label
- Triggers: Parent updates modeApps array
- Updates: Preview grid instantly