---
inclusion: fileMatch
fileMatchPattern: "src/utils/appIntegrations.ts"
---

# App Integrations Guidelines

## Supported Apps

### Time-Based
- **Alarm:** Opens Clock app (cannot auto-set)
- **Reminders:** Creates iOS reminder with expo-calendar
- **Calendar:** Creates calendar event with expo-calendar

### Communication
- **Gmail:** Opens compose with subject pre-filled
- **Outlook:** Opens compose with subject
- **WhatsApp:** Opens chat with message draft
- **Phone:** Opens dialer (requires phone number)

### Meetings
- **Zoom:** Opens Zoom app
- **Teams:** Opens Microsoft Teams
- **Google Meet:** Opens Meet in browser

### Other
- **Canvas:** Opens Canvas Student app
- **Fitness:** Opens Apple Fitness
- **PayPal:** Opens PayPal (no auto-payment)
- **Amazon:** Opens Amazon app
- **Uber:** Opens Uber app

## Implementation Pattern

### URL Schemes
```typescript
const APP_SCHEMES = {
  reminders: 'x-apple-reminderkit://',
  alarm: 'clock-alarm://',
  gmail: 'googlegmail://co?subject=',
  outlook: 'ms-outlook://compose?subject=',
  whatsapp: 'whatsapp://send?text=',
  phone: 'tel://',
  zoom: 'zoomus://',
  teams: 'msteams://',
  canvas: 'canvas-student://',
  fitness: 'fitness://',
  paypal: 'paypal://',
  amazon: 'com.amazon.mobile.shopping://',
  uber: 'uber://',
};
```

### Error Handling
```typescript
try {
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    Alert.alert('App Not Installed', `${appName} is not installed`);
  }
} catch (error) {
  Alert.alert('Error', `Could not open ${appName}`);
}
```

## Integration with Tasks

### Task App Selection
- User can select up to 3 apps per task
- Apps shown as small icons next to task title
- Tapping icon opens that app with task data

### Data Passed
- Task title → Email subject / Message text
- Task due date → Calendar event time / Reminder time
- Task description → Event notes (if supported)

## Limitations
- Cannot auto-send emails (security)
- Cannot create Zoom meetings (API required)
- Cannot book Uber rides (payment required)
- Cannot set alarms automatically (iOS restriction)