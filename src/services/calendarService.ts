import * as Calendar from 'expo-calendar';
import { Task } from '../types/Task';

/**
 * Request calendar permissions
 */
async function requestCalendarPermissions(): Promise<{ granted: boolean; message?: string }> {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    
    if (status === 'granted') {
      return { granted: true };
    } else if (status === 'denied') {
      return { 
        granted: false, 
        message: 'CALENDAR ACCESS DENIED - ENABLE IN SETTINGS' 
      };
    } else {
      return { 
        granted: false, 
        message: 'CALENDAR PERMISSION NOT GRANTED' 
      };
    }
  } catch (error) {
    console.error('Error requesting calendar permissions:', error);
    return { 
      granted: false, 
      message: 'ERROR REQUESTING CALENDAR ACCESS' 
    };
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
      cal => cal.allowsModifications && cal.source.name === 'Default'
    );

    if (!defaultCalendar) {
      console.error('No default calendar found');
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
 * Export tasks to device calendar
 */
export async function exportTasksToCalendar(
  tasks: Task[]
): Promise<{ success: boolean; count: number; message: string }> {
  try {
    // Request permissions
    const permissionResult = await requestCalendarPermissions();
    if (!permissionResult.granted) {
      return {
        success: false,
        count: 0,
        message: permissionResult.message || 'CALENDAR ACCESS DENIED',
      };
    }

    // Get or create calendar
    const calendarId = await getPalmVoiceCalendar();
    if (!calendarId) {
      return {
        success: false,
        count: 0,
        message: 'COULD NOT ACCESS CALENDAR',
      };
    }

    // Filter tasks with due dates that aren't completed
    const tasksWithDates = tasks.filter(task => task.dueDate && !task.completed);
    
    if (tasksWithDates.length === 0) {
      return {
        success: true,
        count: 0,
        message: 'NO TASKS WITH DATES TO SYNC',
      };
    }

    let exportedCount = 0;
    for (const task of tasksWithDates) {
      if (!task.dueDate) continue;

      const startDate = new Date(task.dueDate);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1); // 1 hour duration

      try {
        await Calendar.createEventAsync(calendarId, {
          title: task.text,
          startDate,
          endDate,
          notes: 'Created by PalmVoice',
          timeZone: 'GMT',
        });
        exportedCount++;
      } catch (error) {
        console.error(`Failed to export task: ${task.text}`, error);
      }
    }

    return {
      success: true,
      count: exportedCount,
      message: `SYNCED ${exportedCount} TASK${exportedCount !== 1 ? 'S' : ''}`,
    };
  } catch (error) {
    console.error('Error exporting to calendar:', error);
    return {
      success: false,
      count: 0,
      message: 'SYNC FAILED - ENABLE CALENDAR ACCESS',
    };
  }
}
