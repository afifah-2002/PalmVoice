import * as Calendar from 'expo-calendar';
import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';
import { Task } from '../types/Task';

/**
 * URL schemes for various apps
 */
/**
 * URL schemes for various apps
 * Note: These must match LSApplicationQueriesSchemes in app.json for iOS
 * After changing app.json, you MUST rebuild the app (not just restart)
 * Expo Go does NOT support custom URL schemes - requires a development build
 */
export const APP_SCHEMES: { [key: string]: { ios?: string; android?: string; web?: string } } = {
  // Full automation apps (using native APIs)
  calendar: { ios: 'calshow://', android: 'content://com.android.calendar/time/' },
  reminders: { ios: 'x-apple-reminderkit://', android: 'content://com.android.calendar/time/' },
  
  // Pre-fill automation apps
  gmail: { 
    ios: 'googlegmail://', 
    android: 'googlegmail://', 
    web: 'https://mail.google.com/mail/?view=cm' 
  },
  outlook: { 
    ios: 'ms-outlook://', 
    android: 'ms-outlook://',
    web: 'https://outlook.live.com/mail/0/deeplink/compose'
  },
  whatsapp: { 
    ios: 'whatsapp://', 
    android: 'whatsapp://',
    web: 'https://web.whatsapp.com/send'
  },
  // Basic app openers
  trello: { 
    ios: 'trello://', 
    android: 'trello://',
    web: 'https://trello.com'
  },
  drive: { 
    ios: 'googledrive://', 
    android: 'googledrive://',
    web: 'https://drive.google.com'
  },
  zoom: { 
    ios: 'zoomus://', 
    android: 'zoomus://',
    web: 'https://zoom.us'
  },
  teams: { 
    ios: 'msteams://', 
    android: 'msteams://',
    web: 'https://teams.microsoft.com'
  },
  gmeet: { 
    ios: 'comgooglemeet://', 
    android: 'com.google.android.apps.meetings',
    web: 'https://meet.google.com'
  },
  canvas: { 
    ios: 'canvas-student://', 
    android: 'com.instructure.candroid',
    web: 'https://canvas.instructure.com'
  },
  fitness: { 
    ios: 'x-apple-health://', 
    android: 'com.google.android.apps.fitness',
    web: undefined
  },
  paypal: { 
    ios: 'paypal://', 
    android: 'com.paypal.android.p2pmobile',
    web: 'https://www.paypal.com'
  },
  amazon: { 
    ios: 'com.amazon.mobile.shopping://', 
    android: 'com.amazon.mShop.android.shopping',
    web: 'https://www.amazon.com'
  },
  uber: { 
    ios: 'uber://', 
    android: 'com.ubercab',
    web: 'https://m.uber.com'
  },
};

/**
 * Request calendar permissions
 */
async function requestCalendarPermissions(): Promise<boolean> {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting calendar permissions:', error);
    return false;
  }
}

/**
 * Request reminders permissions (iOS only)
 */
async function requestRemindersPermissions(): Promise<boolean> {
  try {
    const { status } = await Calendar.requestRemindersPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting reminders permissions:', error);
    return false;
  }
}

/**
 * Get or create PalmVoice calendar
 */
async function getPalmVoiceCalendar(): Promise<string | null> {
  try {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    
    // Look for existing PalmVoice calendar
    const palmCalendar = calendars.find(cal => cal.title === 'PalmVoice Tasks');
    if (palmCalendar) {
      return palmCalendar.id;
    }

    // Create new calendar
    const defaultCalendar = calendars.find(
      cal => cal.allowsModifications && cal.source
    );

    if (!defaultCalendar) {
      console.error('No modifiable calendar found');
      return null;
    }

    const newCalendarId = await Calendar.createCalendarAsync({
      title: 'PalmVoice Tasks',
      color: '#000000',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendar.source.id,
      source: defaultCalendar.source,
      name: 'PalmVoice Tasks',
      ownerAccount: defaultCalendar.ownerAccount || 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    return newCalendarId;
  } catch (error) {
    console.error('Error getting/creating calendar:', error);
    return null;
  }
}

/**
 * Get PalmVoice reminders calendar (iOS only)
 */
async function getPalmVoiceRemindersCalendar(): Promise<string | null> {
  if (Platform.OS !== 'ios') return null;
  
  try {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.REMINDER);
    
    // Look for existing PalmVoice reminders list
    const palmReminders = calendars.find(cal => cal.title === 'PalmVoice');
    if (palmReminders) {
      return palmReminders.id;
    }

    // Use default reminders calendar
    const defaultReminders = calendars.find(cal => cal.allowsModifications);
    if (defaultReminders) {
      return defaultReminders.id;
    }

    return null;
  } catch (error) {
    console.error('Error getting reminders calendar:', error);
    return null;
  }
}

// ============================================
// FULL AUTOMATION - Calendar & Reminders
// ============================================

/**
 * Create a calendar event from a task
 */
export async function createCalendarEvent(task: Task): Promise<{ success: boolean; message: string }> {
  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      return { success: false, message: 'CALENDAR ACCESS DENIED' };
    }

    const calendarId = await getPalmVoiceCalendar();
    if (!calendarId) {
      return { success: false, message: 'COULD NOT ACCESS CALENDAR' };
    }

    const startDate = task.dueDate ? new Date(task.dueDate) : new Date();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    await Calendar.createEventAsync(calendarId, {
      title: task.title || task.text,
      startDate,
      endDate,
      notes: task.description || 'Created by PalmVoice',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return { success: true, message: 'CALENDAR EVENT CREATED!' };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return { success: false, message: 'FAILED TO CREATE EVENT' };
  }
}

/**
 * Create an iOS reminder from a task
 */
export async function createReminder(task: Task): Promise<{ success: boolean; message: string }> {
  if (Platform.OS !== 'ios') {
    return { success: false, message: 'REMINDERS NOT AVAILABLE ON THIS DEVICE' };
  }

  try {
    const hasPermission = await requestRemindersPermissions();
    if (!hasPermission) {
      return { success: false, message: 'REMINDERS ACCESS DENIED' };
    }

    const calendarId = await getPalmVoiceRemindersCalendar();
    if (!calendarId) {
      return { success: false, message: 'COULD NOT ACCESS REMINDERS' };
    }

    const dueDate = task.dueDate ? new Date(task.dueDate) : undefined;

    await Calendar.createReminderAsync(calendarId, {
      title: task.title || task.text,
      notes: task.description || 'Created by PalmVoice',
      dueDate,
      completed: false,
    });

    return { success: true, message: 'REMINDER CREATED!' };
  } catch (error) {
    console.error('Error creating reminder:', error);
    return { success: false, message: 'FAILED TO CREATE REMINDER' };
  }
}

// ============================================
// LIMITED AUTOMATION - Pre-fill Data
// ============================================

/**
 * Open Gmail with subject pre-filled
 */
export async function openGmailCompose(task: Task): Promise<{ success: boolean; message: string }> {
  const subject = encodeURIComponent(task.title || task.text);
  const body = encodeURIComponent(task.description || '');
  
  const gmailUrl = `googlegmail://co?subject=${subject}&body=${body}`;
  const webUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
  
  try {
    // Try opening the app directly (Expo Go doesn't support canOpenURL for custom schemes)
    await Linking.openURL(gmailUrl);
    return { success: true, message: 'OPENED GMAIL' };
  } catch (error) {
    // App not installed, fallback to web
    console.log('Gmail app not available, opening web:', error);
    try {
      await Linking.openURL(webUrl);
      return { success: true, message: 'OPENED GMAIL IN BROWSER' };
    } catch (webError) {
      console.error('Error opening Gmail:', webError);
      return { success: false, message: 'COULD NOT OPEN GMAIL' };
    }
  }
}

/**
 * Open Outlook with subject pre-filled
 */
export async function openOutlookCompose(task: Task): Promise<{ success: boolean; message: string }> {
  const subject = encodeURIComponent(task.title || task.text);
  const body = encodeURIComponent(task.description || '');
  
  const outlookUrl = `ms-outlook://compose?subject=${subject}&body=${body}`;
  const webUrl = `https://outlook.live.com/mail/0/deeplink/compose?subject=${subject}&body=${body}`;
  
  try {
    // Try opening the app directly
    await Linking.openURL(outlookUrl);
    return { success: true, message: 'OPENED OUTLOOK' };
  } catch (error) {
    // App not installed, fallback to web
    console.log('Outlook app not available, opening web:', error);
    try {
      await Linking.openURL(webUrl);
      return { success: true, message: 'OPENED OUTLOOK IN BROWSER' };
    } catch (webError) {
      console.error('Error opening Outlook:', webError);
      return { success: false, message: 'COULD NOT OPEN OUTLOOK' };
    }
  }
}

/**
 * Open WhatsApp with message pre-filled
 */
export async function openWhatsAppMessage(task: Task): Promise<{ success: boolean; message: string }> {
  const title = task.title || task.text;
  const dueInfo = task.dueDate ? `\nDue: ${task.dueDate.toLocaleDateString()}` : '';
  const description = task.description ? `\n${task.description}` : '';
  const message = encodeURIComponent(`📋 Task: ${title}${dueInfo}${description}`);
  
  const whatsappUrl = `whatsapp://send?text=${message}`;
  const webUrl = `https://web.whatsapp.com/send?text=${message}`;
  
  try {
    // Try opening the app directly
    await Linking.openURL(whatsappUrl);
    return { success: true, message: 'OPENED WHATSAPP' };
  } catch (error) {
    // App not installed, fallback to web
    console.log('WhatsApp app not available, opening web:', error);
    try {
      await Linking.openURL(webUrl);
      return { success: true, message: 'OPENED WHATSAPP IN BROWSER' };
    } catch (webError) {
      console.error('Error opening WhatsApp:', webError);
      return { success: false, message: 'COULD NOT OPEN WHATSAPP' };
    }
  }
}

/**
 * Open phone keypad - if number found in task, pre-fill it
 */
export async function openPhoneDialer(task: Task): Promise<{ success: boolean; message: string }> {
  // Try to extract phone number from task description or title
  const text = `${task.title || task.text} ${task.description || ''}`;
  
  // Regex to match phone numbers (various formats)
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}|\+[0-9]{10,14}/g;
  const matches = text.match(phoneRegex);
  
  try {
    if (matches && matches.length > 0) {
      // If phone number found, open keypad with number pre-filled
      const phoneNumber = matches[0].replace(/[-.\s()]/g, '');
      await Linking.openURL(`tel:${phoneNumber}`);
      return { success: true, message: 'OPENED PHONE' };
    } else {
      // No phone number - just open phone keypad with telprompt (no number = just keypad)
      await Linking.openURL('telprompt:');
      return { success: true, message: 'OPENED PHONE' };
    }
  } catch (error) {
    console.error('Error opening phone:', error);
    return { success: false, message: 'COULD NOT OPEN PHONE' };
  }
}

// ============================================
// BASIC AUTOMATION - Just Open App
// ============================================

/**
 * Generic function to open an app by its scheme
 * Note: Tries to open directly without canOpenURL check (Expo Go doesn't support it)
 */
export async function openApp(appName: string): Promise<{ success: boolean; message: string }> {
  const scheme = APP_SCHEMES[appName.toLowerCase()];
  
  if (!scheme) {
    return { success: false, message: `UNKNOWN APP: ${appName.toUpperCase()}` };
  }
  
  const primaryUrl = Platform.OS === 'ios' ? scheme.ios : scheme.android;
  const fallbackUrl = scheme.web;
  
  if (!primaryUrl) {
    if (fallbackUrl) {
      try {
        await Linking.openURL(fallbackUrl);
        return { success: true, message: `OPENED ${appName.toUpperCase()} IN BROWSER` };
      } catch {
        return { success: false, message: `${appName.toUpperCase()} NOT AVAILABLE` };
      }
    }
    return { success: false, message: `${appName.toUpperCase()} NOT AVAILABLE` };
  }
  
  try {
    // Try opening the app directly (bypass canOpenURL which doesn't work in Expo Go)
    await Linking.openURL(primaryUrl);
    return { success: true, message: `OPENED ${appName.toUpperCase()}` };
  } catch (error) {
    // App not installed or scheme not registered, try web fallback
    console.log(`${appName} app not available, trying web:`, error);
    if (fallbackUrl) {
      try {
        await Linking.openURL(fallbackUrl);
        return { success: true, message: `OPENED ${appName.toUpperCase()} IN BROWSER` };
      } catch (webError) {
        console.error(`Error opening ${appName} web:`, webError);
        return { success: false, message: `${appName.toUpperCase()} NOT AVAILABLE` };
      }
    }
    return { success: false, message: `${appName.toUpperCase()} NOT INSTALLED` };
  }
}

// ============================================
// Master Automation Handler
// ============================================

export type AutomationType = 
  | 'calendar' 
  | 'reminders' 
  | 'gmail' 
  | 'outlook' 
  | 'whatsapp' 
  | 'trello'
  | 'drive'
  | 'zoom'
  | 'teams'
  | 'gmeet'
  | 'canvas'
  | 'fitness'
  | 'paypal'
  | 'amazon'
  | 'uber';

/**
 * Execute automation based on type
 */
export async function executeAutomation(
  type: AutomationType, 
  task: Task
): Promise<{ success: boolean; message: string }> {
  switch (type) {
    // Full automation
    case 'calendar':
      return createCalendarEvent(task);
    case 'reminders':
      return createReminder(task);
    
    // Pre-fill automation
    case 'gmail':
      return openGmailCompose(task);
    case 'outlook':
      return openOutlookCompose(task);
    case 'whatsapp':
      return openWhatsAppMessage(task);
    
    // Basic app openers
    case 'trello':
    case 'drive':
    case 'zoom':
    case 'teams':
    case 'gmeet':
    case 'canvas':
    case 'fitness':
    case 'paypal':
    case 'amazon':
    case 'uber':
      return openApp(type);
    
    default:
      return { success: false, message: 'UNKNOWN AUTOMATION TYPE' };
  }
}

/**
 * Get automation description for UI
 */
export function getAutomationDescription(type: AutomationType): string {
  switch (type) {
    case 'calendar':
      return 'CREATE CALENDAR EVENT';
    case 'reminders':
      return 'CREATE REMINDER';
    case 'gmail':
      return 'COMPOSE EMAIL (GMAIL)';
    case 'outlook':
      return 'COMPOSE EMAIL (OUTLOOK)';
    case 'whatsapp':
      return 'SEND VIA WHATSAPP';
    case 'trello':
      return 'OPEN TRELLO';
    case 'drive':
      return 'OPEN GOOGLE DRIVE';
    case 'zoom':
      return 'OPEN ZOOM';
    case 'teams':
      return 'OPEN TEAMS';
    case 'gmeet':
      return 'OPEN GOOGLE MEET';
    case 'canvas':
      return 'OPEN CANVAS';
    case 'fitness':
      return 'OPEN FITNESS';
    case 'paypal':
      return 'OPEN PAYPAL';
    case 'amazon':
      return 'OPEN AMAZON';
    case 'uber':
      return 'OPEN UBER';
    default:
      return 'UNKNOWN';
  }
}

