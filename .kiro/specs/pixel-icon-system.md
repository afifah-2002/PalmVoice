# Pixel Icon System Specification

## Design Philosophy
Create authentic Palm OS-style pixelated icons using View components (not images/SVGs).

## Icon Structure
- Grid: 5×5 pixels per icon
- Pixel size: 4×4 points
- Colors:
  - DARK: #FFFFFF (white - primary shape)
  - MEDIUM: #D4E8A8 (light green - highlights)
  - LIGHT: #B8D87A (medium green - accents)
  - transparent: empty pixels

## Icon Types
12 app icons:
- ADDRESS: Person silhouette (head + shoulders)
- CALC: Calculator with display
- DATE BOOK: Calendar with binding
- EXPENSE: Dollar sign ($)
- MAIL: Envelope
- TO DO LIST: Checkmark
- MEMO PAD: Notepad with lines
- SECURITY: Lock/padlock
- GIRAFFE: Giraffe head with spots
- HOTSYNC: Circular sync arrows
- MEMORY: Circuit/chip pattern
- PREFS: Gear/settings icon

Side icons (graffiti area):
- HOME: House shape
- PHONE: Phone receiver
- MAGNIFYING_GLASS: Search icon
- CALCULATOR_SYMBOLS: Grid of math symbols

## Implementation
- Each icon: function returning nested Views
- Rows and pixels as View components
- No image assets required
- Renders consistently across devices