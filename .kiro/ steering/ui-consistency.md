---
inclusion: always
---

# UI Consistency Guidelines

## Typography

### Fonts
- Primary: Press Start 2P (all text)
- No fallback fonts - pixelated aesthetic is critical
- All text must be pixelated, no smooth fonts

### Font Sizes
- Titles: 12px
- Subtitles: 10px
- Body text: 8px
- Small labels: 7px
- Tiny text: 6px

## Color Palette

### Theme Colors (Palm OS)
Used for launcher background, headers, buttons:
- Dark Blue: `#2C3E50`
- Blue: `#3498DB`
- Lavender: `#9B59B6`
- Pink: `#E91E63`
- Beige: `#D7CCC8`

### Pet Screen Colors (GIF themes)
- Background: Full-screen GIF from assets/pets/backgrounds/
- Overlays: Semi-transparent dark `rgba(0, 0, 0, 0.7)`

### Shop Colors
- Background: Beige `#FFE5B4` with 90% opacity
- Border: Brown `#8B4513`
- Text: Dark brown `#3D2914`
- Exclusive items: Golden `#D4AF37`

## Component Patterns

### Buttons
- Border radius: 6-8px (soft rounded, not sharp)
- Border: 2px solid
- Padding: 12px horizontal, 8px vertical
- Hover: Slight scale (0.98)
- Active: Darker background

### Modals
- Background: Semi-transparent with theme tint
- Border: 2px solid
- Border radius: 12px
- Close button: X in top right
- Centered on screen

### Popups (Alerts)
- Background: `rgba(0, 0, 0, 0.95)` for high contrast
- Text: White with dark shadow for readability
- Border: 3px solid white
- Animation: Spring entrance, fade exit

## Animations

### Entrance
- Scale: 0.5 → 1.0
- Opacity: 0 → 1
- Duration: 300ms
- Easing: Spring (friction: 5)

### Exit
- Scale: 1.0 → 0.8
- Opacity: 1 → 0
- Duration: 200ms
- Easing: Ease out

### Continuous (Idle)
- Pet blinking: Every 2 seconds
- Shopkeeper: Alternate frames every 1 second
- Coin popup: Hold 1.5s before exit

## Layout Rules

### Spacing
- Screen padding: 16px
- Component margin: 12px
- Element spacing: 8px
- Icon spacing: 4px

### Overflow Prevention
- All text containers: `numberOfLines` prop
- Long names: Wrap to 2 lines max
- Scrollable for >5 items
- Prevent horizontal overflow at all times

### Responsive Behavior
- Everything within Palm Pilot bezel
- No content on phone screen outside bezel
- Maintain aspect ratio for sprites
- Scale icons proportionally