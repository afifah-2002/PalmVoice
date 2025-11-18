# Palm OS UI Component Specifications

## Design System
- Colors: Black #000000, White #FFFFFF, Gray #CCCCCC
- Font: Courier monospace 14px
- No shadows, gradients, rounded corners
- Borders: 2px solid black

## PalmButton Component
- Size: 120px x 40px
- Border: 2px solid black
- Background: white
- Text: uppercase, centered, bold black
- OnPress: background inverts to black, text white

## TaskRow Component
- Height: 50px
- Checkbox: 20x20px square, left side
- Text: 14px, strike-through if completed
- Bottom border: 1px solid gray

## Screen Layout
- Header: 60px height, centered title
- Content: scrollable white background
- Footer: 60px height, buttons centered
```

---

### **Step 2: Ask Kiro to build first component**

In Kiro chat:
```
Read /.kiro/specs/palm-ui-components.md and create:

File: src/components/PalmButton.tsx

Build a React Native button component that matches the PalmButton spec exactly. Use TouchableOpacity, View, and Text from react-native.