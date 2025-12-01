import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  loadNotificationsEnabled,
  loadNotificationsScheduled,
  loadPet,
  saveNotificationsScheduled,
} from './storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // Configure notification channel for Android with cartoon-like styling
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: '✨ PalmVoice ✨',
        description: 'Pixelated cartoon notifications',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 100, 50, 100, 50, 100], // Bouncy, cartoon-like vibration
        lightColor: '#FF6B9D', // Pink cartoon color
        enableLights: true,
        enableVibrate: true,
        showBadge: true,
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await saveNotificationsScheduled(false);
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
}

/**
 * Schedule daily notification (once per day - pet reminder at 9:00 AM)
 */
export async function scheduleDailyNotifications(): Promise<void> {
  try {
    // Check if notifications are enabled
    const notificationsEnabled = await loadNotificationsEnabled();
    if (!notificationsEnabled) {
      console.log('Notifications disabled, skipping schedule');
      await cancelAllNotifications();
      await saveNotificationsScheduled(false);
      return;
    }

    // Check if notifications are already scheduled to prevent spam
    const alreadyScheduled = await loadNotificationsScheduled();
    if (alreadyScheduled) {
      console.log('Notifications already scheduled, skipping');
      return;
    }

    // Request permissions first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('No notification permissions, skipping schedule');
      return;
    }

    // Cancel any existing notifications first
    await cancelAllNotifications();

    // Get pet name for the notification
    const pet = await loadPet();
    const petName = pet?.name || 'your pet';

    // Schedule 1 daily notification with animated, pixelated, cartoon-like style
    // Morning: "Yo [petname] misses you" - 9:00 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ PALMVOICE ✨',
        body: `🎮 YO ${petName} MISSES YOU! 🐾💕\n\n(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧\nCOME CHECK ON YOUR PET!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          type: 'pet_reminder',
          petName: petName,
        },
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

    // Mark as scheduled
    await saveNotificationsScheduled(true);
    console.log('Daily notification scheduled successfully');
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
}

/**
 * Update notifications when settings change
 */
export async function updateNotificationSchedule(): Promise<void> {
  const notificationsEnabled = await loadNotificationsEnabled();
  if (notificationsEnabled) {
    // Reset scheduled status so it can be rescheduled
    await saveNotificationsScheduled(false);
    await scheduleDailyNotifications();
  } else {
    await cancelAllNotifications();
  }
}

/**
 * Update pet name in notifications (reschedule with new name)
 */
export async function updatePetNameInNotifications(): Promise<void> {
  const notificationsEnabled = await loadNotificationsEnabled();
  if (notificationsEnabled) {
    // Reset scheduled status so it can be rescheduled with new name
    await saveNotificationsScheduled(false);
    await scheduleDailyNotifications();
  }
}

