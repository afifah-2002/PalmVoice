# Task List Screen Specification

## Layout
- Header: "TASKS" centered, 60px height, bold uppercase
- Task rows: scrollable list, 50px each
- Footer: "NEW TASK" button, 60px height

## Task Row
- Checkbox: 20x20px square, left (8px margin)
- Task text: 14px, left aligned after checkbox
- Completed: strike-through text, gray #999999
- Tap anywhere on row to toggle complete
- Bottom border: 1px solid #CCCCCC

## Empty State
- Center text: "NO TASKS"
- Subtitle: "TAP RECORD TO ADD"

## Colors
- Background: White #FFFFFF
- Text: Black #000000
- Borders: Black 2px solid
```

---

### **Step 2: Ask Kiro to generate**
```
Read .kiro/specs/task-list-screen.md and create:

File: src/screens/TaskListScreen.tsx

Build complete task list screen matching spec exactly. Use FlatList. Include sample data with 3 tasks. Import and use PalmButton for footer.
```

---

### **Step 3: Wire it to navigation**

**After Kiro creates the screen, ask:**
```
Edit app/index.tsx to show TaskListScreen instead of just the button