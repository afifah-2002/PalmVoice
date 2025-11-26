# Task Widget Dashboard Specification

## Overview
Home screen task widget displays task statistics with color-coded boxes and modern design.

## Widget Layout

### Header Section
- Icon badge: 📋 emoji in colored circle
- Background color: Current theme color
- Title: "TASKS" (pixelated font)
- Clean, minimal design

### Stats Row (3 Boxes)

**Box 1: TODAY**
- Color: Green (#4CAF50)
- Background: Light green tint (rgba(76, 175, 80, 0.1))
- Shows: Count of tasks due today
- Format: Large number + "TODAY" label below

**Box 2: OVERDUE**
- Color: Gray (default) or Red (if overdue > 0)
- Background: Light gray or light red tint
- Shows: Count of overdue tasks
- Format: Large number + "OVERDUE" label below
- Red warning when count > 0

**Box 3: TOTAL**
- Color: Blue (#2196F3)
- Background: Light blue tint (rgba(33, 150, 243, 0.1))
- Shows: Total incomplete tasks
- Format: Large number + "TOTAL" label below

### Box Styling
- Border radius: 12px (rounded corners)
- Border: 2px solid (box color)
- Padding: 12px
- Shadow: Subtle drop shadow for depth
- Equal width, 3 columns

### Action Button
- Text: "📝 VIEW TASKS"
- Background: Theme color
- Border radius: 8px
- Drop shadow for 3D effect
- Full width below stats
- Tappable: Opens TO DO screen

## Color Coding

### Dynamic Overdue Color
```typescript
const overdueColor = overdueCount > 0 ? '#F44336' : '#9E9E9E';
```
- 0 overdue: Gray (neutral)
- 1+ overdue: Red (warning)

### Theme Integration
- Header badge: Uses current Palm OS theme color
- Action button: Uses current Palm OS theme color
- Other colors: Fixed (green, blue, red)

## Data Sources
- TODAY count: Filter tasks where dueDate = today
- OVERDUE count: Filter tasks where dueDate < today
- TOTAL count: All incomplete tasks

## Visual Hierarchy
- Numbers: Large, bold (18px)
- Labels: Small, uppercase (8px)
- Stats boxes: Prominent with spacing
- Button: Clear call-to-action at bottom

## Responsive Design
- Container: Full width with padding
- Stats boxes: Equal distribution (33% each)
- Spacing: 12px between boxes
- Margin: 16px from widget edges