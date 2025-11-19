# Palm OS Authenticity Guidelines

## Core Design Principles
1. **Simplicity First**: No feature bloat, focused interfaces
2. **Monochrome Aesthetic**: Single-color LCD screen per theme
3. **Pixel-Perfect**: Everything grid-aligned, no sub-pixel rendering
4. **Tactile Feedback**: Haptics on interactions, instant visual response

## Visual Constraints
### Typography
- Font: Press Start 2P (pixelated bitmap style)
- Sizes: 6-14px max
- No anti-aliasing effects
- Uppercase preferred for headers/buttons

### Colors
- LCD background: Theme-specific green/blue/lavender/pink
- Text: Dark shade of theme color
- Icons: Circles with solid fills
- No gradients anywhere
- Borders: Always 2px solid

### Layout
- Headers: 50-60px height
- Buttons: Rectangular, 2px borders
- Graffiti area: 180-200px height
- Side icons: Circular, 56px diameter
- Grid spacing: 12-20px between elements

## Interaction Patterns
### Tap Behavior
- Instant visual feedback (press state)
- Haptic on tap (light impact)
- Sound effect (beep) optional

### Long Press
- Triggers edit mode
- Medium haptic feedback
- Shake animation on icons

### Edit Mode
- Continuous shake animation
- Delete (X) buttons appear
- Background tint change
- "DONE" button to exit

## Animation Guidelines
- Cursor blink: 530ms interval
- Shake: 50ms steps, ±10 points
- No smooth easing (instant state changes preferred)
- Press animations: Spring with high tension

## Avoid These Modern Patterns
- ❌ Rounded corners (except circles)
- ❌ Drop shadows
- ❌ Gradients
- ❌ Blur effects
- ❌ Smooth animations (too fluid)
- ❌ Skeuomorphic textures
- ❌ Modern iOS/Material Design patterns