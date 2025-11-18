# Voice Recorder Specification

## RecordScreen Layout
- Header: "RECORD NOTE" centered, 60px
- Center: Large circular record button (100x100px)
- Recording indicator: Red circle when active
- Timer: Show recording duration "00:15"
- Bottom: "DONE" button to finish and parse

## Recording States
1. Ready: Gray circle, text "TAP TO RECORD"
2. Recording: Red circle pulsing, show timer
3. Processing: "PROCESSING..." text

## Functionality
- Tap to start recording
- Tap again to stop
- Auto-stop at 2 minutes max
- After stop: send audio to AI for parsing
- Navigate to TaskList with new tasks added
```

---

## **Step 2: Ask Kiro to generate**
```
Read .kiro/specs/voice-recorder.md and create:

File: src/screens/RecordScreen.tsx

Build the voice recording screen. Use expo-av for audio recording. Include mock AI parsing function that returns sample tasks. Use PalmButton and match Palm OS style.