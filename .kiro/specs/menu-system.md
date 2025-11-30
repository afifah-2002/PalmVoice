# Menu System Specification

## Overview
Menu button in hardware bezel opens modal with three sections: Stats, About, and Settings. Provides user info, app details, and configuration options.

## Menu Modal Structure

### Main Menu Screen
**Three Buttons (Vertical Stack):**
- 📊 STATS - View gameplay statistics
- ℹ️ ABOUT - App info and how to play
- ⚙️ SETTINGS - App configuration
- ❌ CLOSE (top right) - Dismiss modal

### Button Styling
- Pixelated 3D effect with raised borders
- Light border: top/left (#FFF)
- Dark border: bottom/right (#555)
- Pressed state: Invert borders + scale 0.95 + translateY +2px
- Haptic feedback: Light impact on press
- Font: Press Start 2P, 10px
- Theme-aware background colors

### Animation
- **Open:** Spring animation, scale 0.8 → 1.0, opacity 0 → 1
- **Close:** Reverse animation
- **Navigation:** Slide transitions between sections

## Stats Section

### Display Data
**Four Statistics:**
1. **Total Tasks Completed**
   - Source: completedTasks array length
   - Display: "✅ X TASKS"
   - Format: Number with label

2. **Total Coins Earned**
   - Source: @coins from AsyncStorage
   - Display: "🪙 X COINS"
   - Format: Number with treasure chest icon

3. **Longest Streak**
   - Source: All pets' creation dates
   - Calculation: Max days alive across all pets
   - Display: "🔥 X DAYS"
   - Format: Number with fire emoji

4. **Pets Owned**
   - Source: @unlockedPets array length
   - Display: "🐾 X PETS"
   - Format: Number with paw icon

### Layout
- Grid: 2×2 layout
- Each stat in box with border
- Large number (16px) + small label (7px)
- Theme-colored borders
- Padding: 16px per box
- Spacing: 12px between boxes

### Back Button
- Bottom of screen
- Label: "← BACK"
- Returns to main menu
- Same styling as main menu buttons

## About Section

### Content (Scrollable)

**1. App Version**
- Source: package.json version
- Display: "Version X.X.X"
- Font: 8px, gray color
- Top of section

**2. Credits**
- Title: "CREATED BY"
- Content: Your name / team name
- Font: 10px, white
- Spacing: 16px below version

**3. How to Play**
- Title: "HOW TO PLAY"
- Instructions in numbered list:
  1. Complete tasks to earn coins
  2. Feed, pet, play with your pet daily
  3. Keep your pet alive to maintain streak
  4. Spend coins in the shop
  5. Unlock themes and new pets

- Font: 7px, line-height: 14px
- Scrollable if exceeds screen

**4. Hackathon Info**
- Title: "BUILT FOR KIROWEEN HACKATHON"
- Date: "November 2025"
- Tech: "React Native + Expo + Kiro AI"
- Font: 7px, bottom of section

### Styling
- ScrollView with padding
- Semi-transparent background
- Text sections with spacing (24px between)
- Centered alignment for titles
- Left-aligned for body text

## Settings Section

### Options (Toggle Switches)

**1. Sound Effects**
- Label: "SOUND"
- Toggle: ON / OFF
- Storage: @settings_sound (boolean)
- Default: ON
- Effect: Enables/disables all sound effects (coin earn, pet actions)

**2. Notifications**
- Label: "NOTIFICATIONS"
- Toggle: ON / OFF
- Storage: @settings_notifications (boolean)
- Default: ON
- Effect: Enables/disables reminder notifications

**3. Haptic Feedback**
- Label: "HAPTICS"
- Toggle: ON / OFF
- Storage: @settings_haptics (boolean)
- Default: ON
- Effect: Enables/disables vibration on taps

### Toggle Switch Styling
- Custom pixelated toggle (not native iOS switch)
- OFF: Gray background, knob on left
- ON: Theme color background, knob on right
- Knob: White square with border
- Animation: Slide 200ms on toggle

### Clear All Data Button

**Appearance:**
- Label: "CLEAR ALL DATA"
- Color: Red (#FF4444)
- Position: Bottom of settings
- Separated from toggles (40px margin)
- Warning icon: ⚠️ before text

**Action:**
1. Tap → Confirmation popup appears
2. Popup title: "DELETE ALL DATA?"
3. Popup message: "This will delete all pets, tasks, coins, and progress. This cannot be undone."
4. Buttons: "CANCEL" (gray) / "DELETE" (red)
5. If DELETE: Remove all AsyncStorage keys, reset to defaults, close menu, show "Data cleared" message

**Confirmation Popup:**
- Background: rgba(0, 0, 0, 0.95)
- Border: 3px solid red
- Border radius: 12px
- Buttons: Full width, stacked vertically
- Haptic: Warning haptic on open

## Navigation Flow
```
MENU Button (Bezel)
    ↓
Main Menu Modal
    ↓
[STATS] → Stats Screen → [BACK] → Main Menu
[ABOUT] → About Screen → [BACK] → Main Menu
[SETTINGS] → Settings Screen → [BACK] → Main Menu
[CLOSE] → Dismiss Modal
```

## Data Persistence

### Settings Storage
```typescript
@settings_sound: boolean (default: true)
@settings_notifications: boolean (default: true)
@settings_haptics: boolean (default: true)
```

### Load on App Start
- Read settings from AsyncStorage
- Apply settings immediately (sound, haptics, notifications)
- If keys don't exist, use defaults and save

### Save on Toggle
- Update AsyncStorage immediately on toggle change
- Apply new setting in real-time

## Clear All Data Implementation

### Keys to Remove
- All pet data: @palmvoice_pet_*
- Coins: @coins
- Items: @itemInventory
- Tasks: @tasks, @completedTasks
- Themes: @unlockedThemes (reset to free ones)
- Pets: @unlockedPets (reset to ['cat'])
- Active pet: @palmvoice_active_pet
- Settings: Keep settings (don't delete)

### After Clearing
- Redirect to home screen
- Show fresh app state (new cat, 10 coins, empty tasks)
- Toast message: "All data cleared"

## Accessibility

### Visual
- High contrast text on all backgrounds
- Pixelated font large enough to read (min 7px)
- Clear button states (pressed vs unpressed)

### Touch
- All buttons min 44×44px hit area
- Spacing between toggles (16px minimum)
- Large touch targets for important actions

### Feedback
- Haptic on every interaction
- Visual feedback on button press
- Confirmation before destructive actions

## Testing Checklist
- [ ] Menu opens/closes smoothly
- [ ] All three sections accessible
- [ ] Stats display correct numbers
- [ ] About section scrollable
- [ ] Settings toggles save and persist
- [ ] Clear data shows confirmation
- [ ] Clear data actually deletes everything
- [ ] Back button returns to main menu
- [ ] Close button dismisses modal
- [ ] Animations smooth on all transitions