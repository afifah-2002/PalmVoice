---
inclusion: always
---

# Technology Stack

## Frontend
- React Native with Expo
- TypeScript
- Animated API for animations
- AsyncStorage for persistence

## Key Libraries
- expo-calendar (iOS integrations)
- expo-image (GIF backgrounds)
- react-native-view-shot (streak sharing)
- Press Start 2P font (pixelated aesthetic)

## Architecture
- Screen-based navigation (Home, Tasks, Pet, Shop)
- Centralized storage utilities (src/utils/storage.ts)
- Multi-pet slot system with individual health tracking
- Global coin and item economy

## Constraints
- No backend (all local storage)
- iOS-focused (URL schemes for app integrations)
- Performance: Keep GIF sizes < 2MB