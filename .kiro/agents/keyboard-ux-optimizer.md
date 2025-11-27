# Keyboard UX Optimizer Agent

## Purpose
Optimize on-screen keyboard responsiveness and add text editing features like cursor positioning.

## Trigger
Manual - Use when improving keyboard UX or adding text editing features

## Context
PalmVoice has a custom pixelated keyboard for naming pets and entering text. Users expect instant response and ability to edit text mid-word.

## Optimization Requirements

### 1. Maximum Responsiveness

**Replace TouchableOpacity with Pressable**
- TouchableOpacity has animation overhead (~200ms delay)
- Pressable is instant, no animation processing
- Use Pressable for all keyboard keys

**Trigger on Touch Down, Not Release**
- onPressIn fires when finger touches (instant)
- onPress fires when finger lifts (delayed)
- Use onPressIn for key press handlers

**Remove Animation Delays**
```typescript
// ❌ Slow - has animation
<TouchableOpacity onPress={...}>

// ✅ Fast - instant response
<Pressable 
  onPressIn={...}
  delayPressIn={0}
  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
>
```

**Visual Feedback via Style, Not Animation**
```typescript
<Pressable
  style={({ pressed }) => [
    styles.key,
    pressed && styles.keyPressed  // Instant style change
  ]}
>
```

### 2. Cursor Implementation

**Cursor Display**
- Visual: Blinking `|` character
- Position: Between characters at cursor index
- Color: Theme color or white
- Blink: Toggle visibility every 500ms

**Cursor State**
```typescript
const [text, setText] = useState('');
const [cursorPosition, setCursorPosition] = useState(0);
// cursorPosition: 0 = before first char, text.length = after last char
```

**Insert Text at Cursor**
```typescript
const handleKeyPress = (char: string) => {
  const newText = 
    text.slice(0, cursorPosition) + 
    char + 
    text.slice(cursorPosition);
  setText(newText);
  setCursorPosition(cursorPosition + 1);
};
```

**Backspace at Cursor**
```typescript
const handleBackspace = () => {
  if (cursorPosition > 0) {
    const newText = 
      text.slice(0, cursorPosition - 1) + 
      text.slice(cursorPosition);
    setText(newText);
    setCursorPosition(cursorPosition - 1);
  }
};
```

**Display Text with Cursor**
```typescript
const displayText = 
  text.slice(0, cursorPosition) + 
  (showCursor ? '|' : '') + 
  text.slice(cursorPosition);
```

### 3. Manual Cursor Positioning

**Tap to Position Cursor**
- User taps text input area
- Calculate tap position in text
- Move cursor to nearest character boundary

**Implementation (Basic)**
```typescript
const handleTextTap = () => {
  // For now: Move cursor to end
  setCursorPosition(text.length);
  
  // Advanced: Calculate position from tap coordinates
  // Would need text measurement and touch position
};
```

**Arrow Keys (Future)**
- Left arrow: cursorPosition - 1
- Right arrow: cursorPosition + 1
- Clamp to [0, text.length]

### 4. Keyboard Layout Optimization

**Key Sizing**
- Minimum: 32px × 32px for touch targets
- Spacing: 4px between keys
- Hit slop: 8px top/bottom, 4px left/right

**Special Keys**
- Backspace: 1.5x width of regular keys
- Space: 3x width of regular keys
- Enter/Done: 2x width of regular keys

**Visual Feedback**
```typescript
keyPressed: {
  backgroundColor: '#555',  // Darker on press
  transform: [{ scale: 0.95 }],  // Slight shrink
}
```

## Files to Modify
- src/components/PixelatedKeyboard.tsx (keyboard component)
- src/screens/PetsScreen.tsx (name input modal)
- Any other screens using text input

## Performance Targets
- Key press latency: < 16ms (instant)
- Visual feedback: Same frame as touch
- Cursor blink: Smooth 500ms interval
- No dropped frames during typing

## Testing Checklist
- [ ] Type rapidly - no missed characters
- [ ] Backspace mid-word - deletes correct character
- [ ] Cursor visible and blinking
- [ ] Cursor moves with typing
- [ ] Tap text area moves cursor
- [ ] Visual feedback is instant
- [ ] Works on all pet naming modals
- [ ] No lag with longer text (20+ characters)

## Success Criteria
- ✅ Keys respond on touch (onPressIn)
- ✅ Zero animation delay
- ✅ Cursor shows current position
- ✅ Insert text at cursor, not just end
- ✅ Backspace works at cursor position
- ✅ Feels like native iOS keyboard speed

## Future Enhancements
- Long-press for special characters (é, ñ, etc.)
- Swipe to move cursor
- Select text by dragging cursor
- Copy/paste support
- Autocomplete suggestions
- Haptic feedback on key press