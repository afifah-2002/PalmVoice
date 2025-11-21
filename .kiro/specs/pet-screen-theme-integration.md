## **Spec Doc 1: Pet Screen Theme Integration**

---

### **`.kiro/specs/pet-screen-theme-integration.md`**

```markdown
# Pet Screen Theme Integration Specification

## Overview
Pet screen uses animated GIF backgrounds (themes) that are independent from the Palm OS launcher themes. Themes can be selected via a dropdown bar at the top of the screen.

## Screen Layout Structure

### Visual Hierarchy (Front to Back)
```
Layer 5 (Front): Modals (naming, confirmations)
Layer 4: Theme/Pet dropdown bars (semi-transparent overlays)
Layer 3: Pet display frame (semi-transparent dark box)
Layer 2: GIF background (fills entire LCD screen)
Layer 1 (Back): Gray bezel (Palm Pilot device frame)
```

### Container Structure
```
┌─────────────────────────────────────┐
│   Gray Bezel (#3A3A3A)              │
│  ┌───────────────────────────────┐  │
│  │ LCD Screen Area               │  │
│  │ (Full-screen GIF background)  │  │
│  │                               │  │
│  │ [Theme Bar - Layer 4]         │  │
│  │ [Pet Bar - Layer 4]           │  │
│  │                               │  │
│  │ [Pet Frame - Layer 3]         │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  [Hardware Buttons]                 │
└─────────────────────────────────────┘
```

## Theme Inheritance on First Launch

### Initial Theme Selection Logic
When user opens Pet screen for the first time (`@petTheme` not in AsyncStorage):

```typescript
const getInitialPetTheme = (launcherTheme: Theme): string => {
  const themeMap = {
    'Dark Blue': 'serene',
    'Blue': 'purple_skies',
    'Lavender': 'orange_kiss',
    'Pink': 'serene',
    'Beige': 'purple_skies',
  };
  
  return themeMap[launcherTheme] || 'serene';
};
```

### Inheritance Mapping
- Dark Blue launcher → Serene pet theme
- Blue launcher → Purple Skies pet theme
- Lavender launcher → Orange Kiss pet theme
- Pink launcher → Serene pet theme
- Beige launcher → Purple Skies pet theme

### On Subsequent Visits
- Load saved `@petTheme` from AsyncStorage
- Ignore launcher theme (pet theme is independent)

## GIF Background Layer

### Full-Screen Coverage
The GIF background fills the entire LCD screen area (edge-to-edge within Palm Pilot bezel).

### Styling
```typescript
<Image
  source={currentTheme.background}
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  }}
  contentFit="cover"
/>
```

### Properties
- Position: Absolute (behind all other content)
- Z-index: 1
- Content fit: Cover (fills screen, may crop edges)
- No padding or margins
- Continuous loop (using expo-image)

## Theme Selection Bar

### Position & Size
- Location: Top of LCD screen
- Height: 50px
- Width: Full width of LCD screen
- Margin: 0px from all edges (flush with screen bounds)
- Z-index: 100 (above GIF, below modals)

### Background Styling
- Background: `rgba(0, 0, 0, 0.75)` (75% opacity black)
- Border: None on top/left/right
- Border bottom: 2px solid `rgba(255, 255, 255, 0.8)`
- Backdrop blur: Optional (if supported): 10px

### Content Layout
- Padding: 8px horizontal, 8px vertical
- Align items: Center
- Justify content: Flex-start (left-aligned)

## Theme Dropdown Button

### Button Styling
- Width: 200px
- Height: 34px
- Background: `rgba(0, 0, 0, 0.6)`
- Border: 2px solid white
- Border radius: 6px
- Padding: 8px left/right, 6px top/bottom

### Label Format
- Text: "Theme: [THEME NAME] ▼"
- Font: Press Start 2P
- Font size: 8px
- Color: White
- Text transform: None (preserve casing)

### Examples
- "Theme: SERENE ▼"
- "Theme: PURPLE SKIES ▼"
- "Theme: ORANGE KISS ▼"

### Button States

**Normal (Dropdown Closed):**
- Background: `rgba(0, 0, 0, 0.6)`
- Border: 2px solid white
- Cursor: pointer

**Pressed:**
- Background: `rgba(0, 0, 0, 0.8)`
- Border: 2px solid white
- Scale: 0.98 (subtle press animation)

**Dropdown Open:**
- Background: `rgba(0, 0, 0, 0.85)`
- Border: 2px solid `rgba(255, 255, 255, 1.0)` (brighter)
- Border bottom corners: Square (not rounded)

## Theme Dropdown Menu

### Menu Container
- Position: Absolute, below button
- Top: 50px (height of theme bar)
- Left: 8px (aligned with button)
- Width: 200px (same as button)
- Background: `rgba(0, 0, 0, 0.95)`
- Border: 2px solid white
- Border top: None (connects to button)
- Border radius: 0px 0px 6px 6px (rounded bottom corners)
- Z-index: 101 (above theme bar)

### Menu Items Structure
```
┌─────────────────────────┐
│ ○ SERENE               │ ← 44px height
├─────────────────────────┤ ← 1px divider
│ ○ PURPLE SKIES         │
├─────────────────────────┤
│ ○ ORANGE KISS          │
└─────────────────────────┘
```

### Menu Item Styling

**Each Option:**
- Height: 44px
- Padding: 12px horizontal, 10px vertical
- Font: Press Start 2P, 8px
- Color: White
- Background: Transparent
- Border bottom: 1px solid `rgba(255, 255, 255, 0.2)`
- Last item: No border bottom

**Radio Button:**
- Position: Left side, 8px from edge
- Size: 12px diameter
- Unselected: ○ (empty circle, white stroke)
- Selected: ● (filled circle, white)

**Hover State:**
- Background: `rgba(255, 255, 255, 0.15)`
- Cursor: pointer

**Active/Pressed State:**
- Background: `rgba(255, 255, 255, 0.25)`

**Selected Item:**
- Radio button: ● (filled)
- Font weight: Bold (if possible with pixel font)
- Slight brightness increase on text

## Available Themes

### Theme Data Structure
```typescript
interface PetTheme {
  id: 'serene' | 'purple_skies' | 'orange_kiss';
  name: string; // All caps for display
  displayName: string; // Friendly name
  background: any; // require() result from GIF
}

const PET_THEMES: PetTheme[] = [
  {
    id: 'serene',
    name: 'SERENE',
    displayName: 'Serene',
    background: require('../../assets/pets/backgrounds/Theme1.gif'),
  },
  {
    id: 'purple_skies',
    name: 'PURPLE SKIES',
    displayName: 'Purple Skies',
    background: require('../../assets/pets/backgrounds/Theme2.gif'),
  },
  {
    id: 'orange_kiss',
    name: 'ORANGE KISS',
    displayName: 'Orange Kiss',
    background: require('../../assets/pets/backgrounds/Theme3.gif'),
  },
];
```

### GIF Asset Paths
- **Serene:** `assets/pets/backgrounds/Theme1.gif`
- **Purple Skies:** `assets/pets/backgrounds/Theme2.gif`
- **Orange Kiss:** `assets/pets/backgrounds/Theme3.gif`

### GIF Requirements
- Format: Animated GIF
- Dimensions: 360×640px (or maintain Palm screen aspect ratio)
- Frame rate: 10-15 FPS
- File size: <2MB per GIF
- Loop: Infinite
- Optimization: Compressed for mobile

## Theme Selection Behavior

### User Interaction Flow
1. User taps "Theme: [NAME] ▼" button
2. Haptic feedback: Light impact
3. Dropdown menu appears below button
4. User taps desired theme option
5. Haptic feedback: Medium impact
6. Dropdown menu closes immediately
7. Theme transition begins

### Theme Transition Animation

**Fade Transition:**
```typescript
const changeTheme = async (newThemeId: string) => {
  // Fade out current background
  Animated.timing(backgroundOpacity, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  }).start(() => {
    // Switch theme
    setCurrentTheme(newThemeId);
    
    // Save to storage
    AsyncStorage.setItem('@petTheme', newThemeId);
    
    // Fade in new background
    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });
};
```

**Duration:** 400ms total (200ms fade out + 200ms fade in)

### During Transition
- Theme bar remains visible
- Pet frame remains visible (no flicker)
- Pet sprite and data unchanged
- User can still interact with pet

## State Management

### Local State
```typescript
const [currentTheme, setCurrentTheme] = useState<string>('serene');
const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
const [backgroundOpacity] = useState(new Animated.Value(1));
```

### AsyncStorage Persistence

**Save on Theme Change:**
```typescript
await AsyncStorage.setItem('@petTheme', themeId);
```

**Load on Screen Mount:**
```typescript
useEffect(() => {
  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem('@petTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else {
      // First time - inherit from launcher
      const launcherTheme = await AsyncStorage.getItem('@theme');
      const initialTheme = getInitialPetTheme(launcherTheme);
      setCurrentTheme(initialTheme);
      await AsyncStorage.setItem('@petTheme', initialTheme);
    }
  };
  
  loadTheme();
}, []);
```

## Theme Independence

### Key Points
- Pet theme does NOT affect launcher theme
- Launcher theme does NOT affect pet theme (after first selection)
- Each theme stored separately:
  - Launcher: `@theme` (Palm OS themes)
  - Pet: `@petTheme` (GIF themes)
- User can have Dark Blue launcher + Orange Kiss pet
- Themes persist independently across app restarts

## Closing Dropdown Behavior

### Click Outside to Close
- Tap anywhere outside dropdown menu → Closes menu
- Tap theme bar background → Closes menu
- Tap pet frame → Closes menu
- Tap GIF background → Closes menu

### Select Item to Close
- Tap any theme option → Closes menu automatically
- Even if selecting current theme → Still closes

### Navigation Away
- Switch to different screen → Closes menu
- App goes to background → Menu closed on return

## Edge Cases

### No GIF Files Found
- Fallback: Solid color background (#4A6FA5 - dark blue)
- Show error in console (not to user)
- Continue functioning normally

### GIF Load Error
- Show loading placeholder (gray screen)
- Retry load after 2 seconds
- After 3 retries: Use fallback solid color

### Theme Not in Storage
- Default to 'serene'
- Or inherit from launcher (first time only)

### Invalid Theme ID
- Validate theme ID exists in PET_THEMES array
- If invalid: Default to 'serene'
- Save corrected value to storage
```

---

**This is Spec #1 complete. Ready for the next spec (Pet Selection System)?** 🎨