import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { loadNotificationsEnabled, loadPet } from './storage';

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
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
}

/**
 * Schedule daily notifications (3 times per day)
 */
export async function scheduleDailyNotifications(): Promise<void> {
  try {
    // Check if notifications are enabled
    const notificationsEnabled = await loadNotificationsEnabled();
    if (!notificationsEnabled) {
      console.log('Notifications disabled, skipping schedule');
      await cancelAllNotifications();
      return;
    }

    // Request permissions first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('No notification permissions, skipping schedule');
      return;
    }

    // Cancel existing notifications
    await cancelAllNotifications();

    // Get pet name for the first notification
    const pet = await loadPet();
    const petName = pet?.name || 'your pet';

    // Schedule 3 daily notifications with animated, pixelated, cartoon-like style
    // 1. Morning: "Yo [petname] misses you" - 9:00 AM
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

    // 2. Afternoon: "Make sure you completed your tasks" - 2:00 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ PALMVOICE ✨',
        body: `📋 TASK TIME! 📋\n\n(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧\nMAKE SURE YOU COMPLETED\nYOUR TASKS! ✨✓✨`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          type: 'task_reminder',
        },
      },
      trigger: {
        hour: 14,
        minute: 0,
        repeats: true,
      },
    });

    // 3. Evening: "Make sure to open app for daily bonus" - 6:00 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ PALMVOICE ✨',
        body: `🪙 DAILY BONUS TIME! 🪙\n\n( ﾟヮﾟ) ╯\nMAKE SURE TO OPEN APP\nFOR DAILY BONUS! 💰✨`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          type: 'daily_bonus',
        },
      },
      trigger: {
        hour: 18,
        minute: 0,
        repeats: true,
      },
    });

    console.log('Daily notifications scheduled successfully');
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
    await scheduleDailyNotifications();
  }
}

