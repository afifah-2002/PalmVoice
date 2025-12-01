# Keyboard Newline Functionality

## Overview
Enter key now inserts newline character instead of submitting or switching modes.

## Behavior

### Typing Mode (New Task)
**Enter Key Action:**
- Inserts `\n` at cursor position
- Moves cursor after newline
- Works in both title and description fields

### Edit Mode (Existing Task)
**Enter Key Action:**
- Inserts `\n` at end of text
- Works in both title and description fields

## Implementation
```typescript
case 'Enter':
  // Insert newline at cursor position
  const newText = text.slice(0, cursorPosition) + '\n' + text.slice(cursorPosition);
  setText(newText);
  setCursorPosition(cursorPosition + 1);
  break;
```

## Text Display
- Multiline text input supports `\n`
- Line breaks render correctly
- numberOfLines not restricted
- ScrollView enables scrolling for long text

## Use Cases
- Multi-line task titles
- Detailed task descriptions with paragraphs
- Formatted notes