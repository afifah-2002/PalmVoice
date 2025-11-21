import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Task';

const TASKS_STORAGE_KEY = '@palmvoice_tasks';
const PETS_THEME_STORAGE_KEY = '@palmvoice_pets_theme';

/**
 * Save tasks to AsyncStorage
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
    console.log('Tasks saved to storage');
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
}

/**
 * Load tasks from AsyncStorage
 */
export async function loadTasks(): Promise<Task[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (jsonValue === null) {
      return [];
    }
    
    const tasks = JSON.parse(jsonValue);
    
    // Convert date strings back to Date objects
    return tasks.map((task: any) => ({
      ...task,
      // Backward compatibility: if no title, use text as title
      title: task.title || task.text,
      text: task.text || task.title, // Keep text for backward compatibility
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      createdAt: new Date(task.createdAt),
    }));
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}

/**
 * Clear all tasks from storage
 */
export async function clearTasks(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
    console.log('Tasks cleared from storage');
  } catch (error) {
    console.error('Error clearing tasks:', error);
    throw error;
  }
}

/**
 * Save pets theme to AsyncStorage
 */
export async function savePetsTheme(theme: string): Promise<void> {
  try {
    await AsyncStorage.setItem(PETS_THEME_STORAGE_KEY, theme);
    console.log('Pets theme saved to storage:', theme);
  } catch (error) {
    console.error('Error saving pets theme:', error);
    throw error;
  }
}

/**
 * Load pets theme from AsyncStorage
 */
export async function loadPetsTheme(): Promise<string | null> {
  try {
    const theme = await AsyncStorage.getItem(PETS_THEME_STORAGE_KEY);
    console.log('Pets theme loaded from storage:', theme);
    return theme;
  } catch (error) {
    console.error('Error loading pets theme:', error);
    return null;
  }
}
