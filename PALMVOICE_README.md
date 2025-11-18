# PalmVoice

A voice-to-task productivity app with nostalgic Palm OS aesthetic.

## Features

### Core Functionality
- **Voice Recording**: Record voice notes with a simple tap
- **Smart Task Parsing**: Automatically extracts tasks from voice recordings
- **Date Detection**: Recognizes phrases like "tomorrow", "friday", "at 3pm"
- **Persistent Storage**: Tasks saved locally using AsyncStorage
- **Task Management**: Toggle completion, edit tasks with long press

### Palm OS UI
- Monochrome black & white design
- Courier monospace font throughout
- 2px solid black borders
- No shadows, gradients, or rounded corners (except record button)
- Button press inversion effect
- Sound effects for interactions

### Advanced Features
- **Calendar Sync**: Export tasks with due dates to device calendar
- **Pulsing Animation**: Red circle pulses during recording
- **Timer Display**: Shows recording duration
- **Processing State**: Visual feedback during AI parsing
- **About Screen**: App info and credits

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Expo AV** for audio recording
- **Expo Calendar** for calendar integration
- **AsyncStorage** for data persistence

## Project Structure

```
src/
├── components/
│   ├── PalmButton.tsx          # Reusable Palm OS style button
│   └── PalmTextInput.tsx       # Modal text input for editing
├── screens/
│   ├── TaskListScreen.tsx      # Main task list view
│   ├── RecordScreen.tsx        # Voice recording interface
│   └── AboutScreen.tsx         # App information
├── services/
│   ├── aiService.ts            # Smart mock task parsing
│   ├── dateParser.ts           # Natural language date parsing
│   ├── storage.ts              # AsyncStorage wrapper
│   ├── soundService.ts         # Sound effect management
│   └── calendarService.ts      # Calendar export functionality
└── types/
    └── Task.ts                 # Task interface definition
```

## Task Interface

```typescript
interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
}
```

## Smart Mock Parsing

Currently uses intelligent mock data generation instead of real AI APIs:
- Generates 2-4 realistic tasks per recording
- Includes common patterns: EMAIL, CALL, BUY, MEETING, etc.
- Randomly assigns due dates with natural language phrases
- 1 second simulated processing delay

**Future Enhancement**: Uncomment real API integration in `aiService.ts` to use OpenAI Whisper + GPT-4.

## Date Parsing

Supports natural language date phrases:
- "today", "tomorrow"
- Days of week: "monday", "friday", etc.
- "this week", "next week", "next month"
- Time phrases: "at 3pm", "at 2:30pm"

## Sound Effects

Simple beep sounds for:
- Button taps
- Task completion
- Recording start/stop

## Installation

```bash
npm install
```

## Running

```bash
npx expo start
```

## Building

```bash
npx expo build:ios
npx expo build:android
```

## Credits

Built by Afifah Khan with assistance from Kiro AI Assistant.

Kiro helped with:
- Code generation and architecture
- Component implementation
- Service layer design
- Debugging and optimization
- UI/UX implementation

## License

MIT
