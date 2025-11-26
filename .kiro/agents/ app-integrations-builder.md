# App Integrations Builder Agent

## Purpose
Implement iOS app integrations for task management - Calendar, Reminders, Gmail, Outlook, WhatsApp, and other productivity apps.

## Trigger
Manual - Use when building or debugging app integration features

## Context
Users can select up to 3 apps per task. Tapping an app icon should:
- Open the app with task data pre-filled (title, due date, description)
- Handle cases where app is not installed
- Show user-friendly feedback

## Implementation Requirements

### 1. Install Dependencies
```bash
npx expo install expo-calendar expo-linking
```

### 2. Create Utility File
**Location:** `src/utils/appIntegrations.ts`

**Structure:**
```typescript
import * as Calendar from 'expo-calendar';
import { Linking, Alert, Platform } from 'react-native';
import { Task } from '../types';

// URL schemes for each app
// Calendar integration functions
// WhatsApp integration
// Gmail/Outlook integration
// Generic app opener
```

### 3. Implement Each Integration

#### ✅ FULL Automation (Use APIs)

**Calendar - CREATE ACTUAL EVENT**
```typescript
export const openCalendar = async (task: Task) => {
  try {
    // Request permissions
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Calendar access needed');
      return;
    }
    
    // Get default calendar
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(cal => cal.allowsModifications);
    
    if (!defaultCalendar) {
      Alert.alert('Error', 'No calendar found');
      return;
    }
    
    // Create event
    await Calendar.createEventAsync(defaultCalendar.id, {
      title: task.title,
      startDate: new Date(task.dueDate),
      endDate: new Date(new Date(task.dueDate).getTime() + 60 * 60 * 1000), // +1 hour
      notes: task.description || '',
      timeZone: 'America/Chicago',
    });
    
    Alert.alert('Success', 'Calendar event created!');
  } catch (error) {
    Alert.alert('Error', 'Could not create calendar event');
  }
};
```

**Reminders - CREATE ACTUAL REMINDER**
```typescript
export const openReminders = async (task: Task) => {
  try {
    const { status } = await Calendar.requestRemindersPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Reminders access needed');
      return;
    }
    
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.REMINDER);
    const defaultCalendar = calendars[0];
    
    if (!defaultCalendar) {
      Alert.alert('Error', 'No reminders list found');
      return;
    }
    
    await Calendar.createReminderAsync(defaultCalendar.id, {
      title: task.title,
      dueDate: new Date(task.dueDate),
      notes: task.description || '',
    });
    
    Alert.alert('Success', 'Reminder created!');
  } catch (error) {
    Alert.alert('Error', 'Could not create reminder');
  }
};
```

#### ⚠️ LIMITED Automation (Pre-fill only)

**Gmail - PRE-FILL COMPOSE**
```typescript
export const openGmail = async (task: Task) => {
  const subject = encodeURIComponent(`Task: ${task.title}`);
  const body = encodeURIComponent(task.description || '');
  const url = `googlegmail://co?subject=${subject}&body=${body}`;
  
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // Fallback to web
      const webUrl = `https://mail.google.com/mail/?view=cm&su=${subject}&body=${body}`;
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    Alert.alert('Error', 'Could not open Gmail');
  }
};
```

**Outlook - PRE-FILL COMPOSE**
```typescript
export const openOutlook = async (task: Task) => {
  const subject = encodeURIComponent(`Task: ${task.title}`);
  const body = encodeURIComponent(task.description || '');
  const url = `ms-outlook://compose?subject=${subject}&body=${body}`;
  
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('App Not Installed', 'Outlook is not installed');
    }
  } catch (error) {
    Alert.alert('Error', 'Could not open Outlook');
  }
};
```

**WhatsApp - PRE-FILL MESSAGE**
```typescript
export const openWhatsApp = async (task: Task) => {
  const text = encodeURIComponent(`Task: ${task.title}\nDue: ${new Date(task.dueDate).toLocaleDateString()}`);
  const url = `whatsapp://send?text=${text}`;
  
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('App Not Installed', 'WhatsApp is not installed');
    }
  } catch (error) {
    Alert.alert('Error', 'Could not open WhatsApp');
  }
};
```

**Phone - OPEN DIALER**
```typescript
export const openPhone = async (task: Task) => {
  // Try to extract phone number from task description
  const phoneRegex = /(\d{3}[-.]?\d{3}[-.]?\d{4})/;
  const match = task.description?.match(phoneRegex);
  
  if (match) {
    const phoneNumber = match[1].replace(/[^0-9]/g, '');
    const url = `tel:${phoneNumber}`;
    
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open phone dialer');
    }
  } else {
    Alert.alert('No Phone Number', 'Add a phone number to the task description');
  }
};
```

#### ❌ BASIC Open (Just launch app)

**Generic App Opener**
```typescript
const APP_SCHEMES: { [key: string]: string } = {
  alarm: 'clock-alarm://',
  zoom: 'zoomus://',
  teams: 'msteams://',
  gmeet: 'https://meet.google.com/new',
  canvas: 'canvas-student://',
  fitness: 'fitness://',
  paypal: 'paypal://',
  amazon: 'com.amazon.mobile.shopping://',
  uber: 'uber://',
};

export const openApp = async (appName: string, task: Task) => {
  const url = APP_SCHEMES[appName.toLowerCase()];
  
  if (!url) {
    Alert.alert('Error', `${appName} integration not configured`);
    return;
  }
  
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
};
```

### 4. Integrate with TaskListScreen

**Location:** `src/screens/TaskListScreen.tsx`

**Add app icon tap handlers:**
```typescript
import { 
  openCalendar, 
  openReminders, 
  openGmail, 
  openOutlook, 
  openWhatsApp, 
  openPhone,
  openApp 
} from '../utils/appIntegrations';

const handleAppTap = async (appName: string, task: Task) => {
  switch (appName.toLowerCase()) {
    case 'calendar':
      await openCalendar(task);
      break;
    case 'reminders':
      await openReminders(task);
      break;
    case 'gmail':
      await openGmail(task);
      break;
    case 'outlook':
      await openOutlook(task);
      break;
    case 'whatsapp':
      await openWhatsApp(task);
      break;
    case 'phone':
      await openPhone(task);
      break;
    default:
      await openApp(appName, task);
  }
};
```

**Update task item rendering:**
```typescript
{task.apps?.map((app, index) => (
  <TouchableOpacity 
    key={index}
    onPress={() => handleAppTap(app, task)}
  >
    <Image source={APP_ICONS[app]} style={styles.appIcon} />
  </TouchableOpacity>
))}
```

## Files to Create/Modify
- **Create:** `src/utils/appIntegrations.ts` (main integration logic)
- **Modify:** `src/screens/TaskListScreen.tsx` (add tap handlers)
- **Modify:** `package.json` (add expo-calendar dependency)
- **Modify:** `app.json` (add calendar permissions)

## Permissions Required

**Add to app.json:**
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCalendarsUsageDescription": "PalmVoice needs calendar access to create events from tasks",
        "NSRemindersUsageDescription": "PalmVoice needs reminders access to create reminders from tasks"
      }
    }
  }
}
```

## Testing Checklist
- [ ] Calendar creates event with correct title and date
- [ ] Reminders creates reminder with correct title and date
- [ ] Gmail opens with pre-filled subject
- [ ] WhatsApp opens with pre-filled message
- [ ] Apps that aren't installed show proper error
- [ ] Permissions requested appropriately
- [ ] Success messages show after creation

## Success Criteria
- ✅ Calendar/Reminders create actual entries (not just open app)
- ✅ Gmail/Outlook/WhatsApp pre-fill with task data
- ✅ Other apps open successfully
- ✅ Error handling for missing apps
- ✅ User feedback via Alerts
- ✅ No crashes on permission denial

## Common Issues to Watch For
- Calendar permission denied → Show clear message
- Task has no due date → Use current date + 1 day
- Phone number extraction fails → Guide user to add number
- URL scheme blocked → Provide fallback option
- Multiple rapid taps → Debounce tap handlers