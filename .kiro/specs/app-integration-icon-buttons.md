# App Integration Icon Buttons

## Overview
Converted app integration icons from square images to rounded, raised, clickable buttons.

## Button Design

### Visual Style
- Shape: Rounded corners (borderRadius: 8px)
- Size: 32×32px
- Background: White
- Border: Pixelated 3D effect
  - Light borders: Top/left (#FFF)
  - Dark borders: Bottom/right (#888)
- Shadow: Subtle drop shadow for depth

### Button States

**Normal:**
- Raised appearance (3D borders)
- Scale: 1.0

**Pressed:**
- Inverted borders (dark top/left, light bottom/right)
- Scale: 0.9
- Haptic: Light impact

### Animation
```typescript
// On press
Animated.spring(scale, { toValue: 0.9 }).start();
// On release
Animated.spring(scale, { toValue: 1.0 }).start();
```

## Implementation

**Component:** IconButton (reusable)

**Props:**
- iconSource: Image source
- onPress: Handler function
- size: 32 (default)

**Apps Using This:**
- Gmail, Outlook, WhatsApp
- Calendar, Reminders
- Zoom, Teams, Google Meet
- Uber, Amazon, PayPal
- Canvas, Fitness, Google Drive, Notion

## User Experience
- Clear clickable affordance
- Tactile feedback (haptic + visual)
- Consistent with pixelated aesthetic
- Better than flat images