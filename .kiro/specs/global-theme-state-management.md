# Global Theme and Mode State Management

## Problem Statement
- Theme resets to Dark Blue on navigation
- Mode resets to Work when clicking HOME multiple times
- Each screen loads default state instead of current state

## Solution: Context API

### Theme Context
```typescript
// src/contexts/ThemeContext.tsx
interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  themeColors: PalmTheme;
}

const ThemeContext = React.createContext<ThemeContextType>();
```

### Mode Context
```typescript
// src/contexts/ModeContext.tsx
interface ModeContextType {
  currentMode: string;
  setMode: (mode: string) => void;
  customModes: Record<string, AppIconOrEmpty[][]>;
  setCustomModes: (modes: Record<string, AppIconOrEmpty[][]>) => void;
}

const ModeContext = React.createContext<ModeContextType>();
```

## Implementation

### App Wrapper
```typescript
// app/_layout.tsx
<ThemeProvider>
  <ModeProvider>
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="tasks" />
      <Stack.Screen name="pet" />
    </Stack>
  </ModeProvider>
</ThemeProvider>
```

### Screen Usage
```typescript
// Any screen
const { currentTheme, themeColors } = useTheme();
const { currentMode } = useMode();

// Use themeColors for all styling
<View style={{ backgroundColor: themeColors.screenBackground }}>
```

## Persistence

### AsyncStorage Integration
**On Theme Change:**
1. Update context state
2. Save to AsyncStorage: `@theme`
3. All screens re-render with new theme

**On Mode Change:**
1. Update context state
2. Save to AsyncStorage: `@currentMode`
3. Launcher updates icon grid

**On App Load:**
1. Read from AsyncStorage
2. Initialize context with saved values
3. Fallback to defaults if not found

### Storage Keys
- `@theme`: Current theme name
- `@currentMode`: Current mode name
- `@customModes`: JSON of custom mode configs

## Navigation State Preservation

### Router Navigation
- Use `router.push()` for all navigation
- Pass no props (read from context instead)
- Context survives navigation

### HOME Button Behavior
```typescript
// In FavoriteButtons.tsx
const handleHomePress = () => {
  if (router.pathname === '/') {
    // Already on home, do nothing
    return;
  }
  router.push('/');
  // Theme and mode persist via context
};
```

### Preventing Double-Tap Reset
- Track last HOME press timestamp
- Ignore rapid repeated presses (<500ms)
- Never reset theme/mode on navigation

## State Initialization

### First Launch
- Theme: Default to 'Dark Blue'
- Mode: Default to 'Work'
- Save to AsyncStorage

### Subsequent Launches
- Load theme from storage
- Load mode from storage
- Initialize contexts with saved values
- UI renders with correct state immediately