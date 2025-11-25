import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Task';

const TASKS_STORAGE_KEY = '@palmvoice_tasks';
const PETS_THEME_STORAGE_KEY = '@palmvoice_pets_theme';
const PET_STORAGE_KEY = '@palmvoice_pet';
const COINS_STORAGE_KEY = '@palmvoice_coins';
const PURCHASED_THEMES_STORAGE_KEY = '@palmvoice_purchased_themes';

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
      // Backward compatibility: convert old icon (string) to icons (array)
      icons: task.icons || (task.icon ? [task.icon] : undefined),
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

/**
 * Save pet data to AsyncStorage
 */
export async function savePet(pet: { type: string; name: string; health: number; lastFed: number; lastPet: number } | null): Promise<void> {
  try {
    if (pet === null) {
      await AsyncStorage.removeItem(PET_STORAGE_KEY);
      console.log('Pet cleared from storage');
    } else {
      const jsonValue = JSON.stringify(pet);
      await AsyncStorage.setItem(PET_STORAGE_KEY, jsonValue);
      console.log('Pet saved to storage:', pet.name);
    }
  } catch (error) {
    console.error('Error saving pet:', error);
    throw error;
  }
}

/**
 * Load pet data from AsyncStorage
 */
export async function loadPet(): Promise<{ type: string; name: string; health: number; lastFed: number; lastPet: number } | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(PET_STORAGE_KEY);
    if (jsonValue === null) {
      return null;
    }
    
    const pet = JSON.parse(jsonValue);
    console.log('Pet loaded from storage:', pet.name);
    return pet;
  } catch (error) {
    console.error('Error loading pet:', error);
    return null;
  }
}

/**
 * Save coins to AsyncStorage
 */
export async function saveCoins(coins: number): Promise<void> {
  try {
    await AsyncStorage.setItem(COINS_STORAGE_KEY, coins.toString());
    console.log('Coins saved to storage:', coins);
  } catch (error) {
    console.error('Error saving coins:', error);
    throw error;
  }
}

/**
 * Load coins from AsyncStorage
 */
export async function loadCoins(): Promise<number> {
  try {
    const coins = await AsyncStorage.getItem(COINS_STORAGE_KEY);
    if (coins === null) {
      return 10; // Default to 10 coins
    }
    const coinsValue = parseInt(coins, 10);
    console.log('Coins loaded from storage:', coinsValue);
    return isNaN(coinsValue) ? 10 : coinsValue;
  } catch (error) {
    console.error('Error loading coins:', error);
    return 10; // Default to 10 coins on error
  }
}

/**
 * Save purchased themes to AsyncStorage
 */
export async function savePurchasedThemes(themes: string[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(themes);
    await AsyncStorage.setItem(PURCHASED_THEMES_STORAGE_KEY, jsonValue);
    console.log('Purchased themes saved to storage:', themes);
  } catch (error) {
    console.error('Error saving purchased themes:', error);
    throw error;
  }
}

/**
 * Load purchased themes from AsyncStorage
 */
export async function loadPurchasedThemes(): Promise<string[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(PURCHASED_THEMES_STORAGE_KEY);
    if (jsonValue === null) {
      // Default themes: serene, purple-skies, orange-kiss are already available
      return ['serene', 'purple-skies', 'orange-kiss'];
    }
    const themes = JSON.parse(jsonValue);
    console.log('Purchased themes loaded from storage:', themes);
    return themes;
  } catch (error) {
    console.error('Error loading purchased themes:', error);
    // Default themes on error
    return ['serene', 'purple-skies', 'orange-kiss'];
  }
}
