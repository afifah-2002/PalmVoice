---
inclusion: always
---

# Error Handling Standards

## User-Facing Errors

### Insufficient Coins
```typescript
Alert.alert(
  'NOT ENOUGH COINS!',
  `You need ${price - coins} more coins`,
  [{ text: 'OK' }]
);
```

### App Not Installed
```typescript
Alert.alert(
  'App Not Installed',
  `${appName} is not installed on this device`,
  [{ text: 'OK' }]
);
```

### Storage Errors
```typescript
try {
  await AsyncStorage.setItem(key, value);
} catch (error) {
  Alert.alert('Save Failed', 'Could not save data. Please try again.');
  console.error('Storage error:', error);
}
```

## Silent Errors (Log Only)

### Health Calculation
```typescript
try {
  const health = calculateHealth(pet);
} catch (error) {
  console.error('Health calculation error:', error);
  return 5; // Fallback to full health
}
```

### Animation Failures
```typescript
try {
  Animated.spring(value, config).start();
} catch (error) {
  console.warn('Animation failed:', error);
  // Continue without animation
}
```

## Error Prevention

### Validate Before Save
```typescript
if (coins < 0) {
  console.error('Invalid coin amount:', coins);
  coins = 0;
}
if (health > 5 || health < 0) {
  console.error('Invalid health:', health);
  health = Math.max(0, Math.min(5, health));
}
```

### Fallback Values
```typescript
const coins = (await loadCoins()) || 0;
const pet = (await loadPet(type)) || createDefaultPet(type);
```

### Type Safety
- Always use TypeScript interfaces
- Never use `any` type
- Validate external data (storage, user input)

## Logging Strategy
- `console.log` - Development only
- `console.warn` - Non-critical issues
- `console.error` - Errors that need attention
- Never log sensitive data (tokens, passwords)