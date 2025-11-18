# PalmVoice - Quick Start Guide

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

## First Run

1. Press `i` for iOS simulator or `a` for Android emulator
2. Or scan QR code with Expo Go app on your phone

## Using the App

### Recording Tasks
1. Tap **"NEW TASK"** button
2. Tap the gray circle to start recording
3. Circle turns red and pulses while recording
4. Tap again or press **"DONE"** to stop
5. Wait for "PROCESSING..." (1 second)
6. New tasks appear in your list!

### Managing Tasks
- **Tap** a task to toggle completion ✓
- **Long press** a task to edit the text
- Tasks are automatically saved

### Syncing to Calendar
1. Tap **"SYNC"** button
2. Grant calendar permissions if prompted
3. Tasks with due dates export to "PalmVoice Tasks" calendar

### About Screen
- Tap the **"?"** button in the top right
- View app info, features, and credits

## Features to Try

- Record multiple tasks in one session
- Edit task text with long press
- Toggle tasks complete/incomplete
- Sync tasks to your calendar
- Notice the Palm OS aesthetic!

## Troubleshooting

### No sound effects?
- Check device volume
- Ensure silent mode is off
- Sounds are subtle beeps

### Calendar sync not working?
- Grant calendar permissions when prompted
- Check Settings → PalmVoice → Permissions

### Tasks not saving?
- Should save automatically
- Check console for errors

## Development

### File Structure
- `app/` - Routes and navigation
- `src/components/` - Reusable UI components
- `src/screens/` - Main app screens
- `src/services/` - Business logic
- `src/types/` - TypeScript interfaces

### Key Files
- `src/services/aiService.ts` - Task parsing logic
- `src/services/storage.ts` - Data persistence
- `src/screens/TaskListScreen.tsx` - Main screen
- `src/screens/RecordScreen.tsx` - Recording UI

### Enabling Real AI
1. Get OpenAI API key
2. Add to `.env`: `OPENAI_API_KEY=your_key`
3. Uncomment real API code in `src/services/aiService.ts`
4. Comment out mock function

## Demo Tips

1. **Show the UI** - Point out Palm OS aesthetic
2. **Record a task** - Demonstrate the flow
3. **Edit a task** - Long press to show editing
4. **Sync calendar** - Export tasks
5. **About screen** - Show credits and features

## Built With Kiro

This entire app was built with assistance from Kiro AI:
- Architecture and design
- Component implementation
- Service layer logic
- UI/UX polish
- Bug fixes and optimization

---

**Ready to demo!** 🎉
