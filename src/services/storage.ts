import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Task';

const TASKS_STORAGE_KEY = '@palmvoice_tasks';
const PETS_THEME_STORAGE_KEY = '@palmvoice_pets_theme';
const PET_STORAGE_KEY = '@palmvoice_pet';
const COINS_STORAGE_KEY = '@palmvoice_coins';
const PURCHASED_THEMES_STORAGE_KEY = '@palmvoice_purchased_themes';
const CURRENT_PET_TYPE_KEY = '@palmvoice_current_pet_type';
const PURCHASED_PETS_STORAGE_KEY = '@palmvoice_purchased_pets';
const REVIVAL_TOKENS_KEY = '@palmvoice_revival_tokens';
const HEALTH_POTIONS_KEY = '@palmvoice_health_potions';

// Helper function to get pet storage key by type
function getPetStorageKey(petType: string): string {
  return `@palmvoice_pet_${petType}`;
}

/**
 * Delete a pet completely from storage
 */
export async function deletePet(petType: string): Promise<void> {
  try {
    // Remove pet data
    await AsyncStorage.removeItem(getPetStorageKey(petType));
    
    // Check if this was the current pet
    const currentPetType = await AsyncStorage.getItem(CURRENT_PET_TYPE_KEY);
    if (currentPetType === petType) {
      await AsyncStorage.removeItem(CURRENT_PET_TYPE_KEY);
    }
    
    console.log(`Pet ${petType} deleted from storage`);
  } catch (error) {
    console.error('Error deleting pet:', error);
    throw error;
  }
}

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
 * Save pet data to AsyncStorage (by pet type)
 */
export async function savePet(pet: { type: string; name: string; health: number; lastFed: number; lastPet: number; lastPlay?: number; lastPotion?: number; lastRevival?: number; createdAt?: number; originalCreatedAt?: number } | null, petType?: string): Promise<void> {
  try {
    if (pet === null) {
      // If no pet type provided, clear the old single pet storage for backward compatibility
      if (!petType) {
        await AsyncStorage.removeItem(PET_STORAGE_KEY);
        await AsyncStorage.removeItem(CURRENT_PET_TYPE_KEY);
        console.log('Pet cleared from storage');
      } else {
        // Clear specific pet type
        await AsyncStorage.removeItem(getPetStorageKey(petType));
        console.log(`Pet ${petType} cleared from storage`);
      }
    } else {
      const jsonValue = JSON.stringify(pet);
      const storageKey = getPetStorageKey(pet.type);
      await AsyncStorage.setItem(storageKey, jsonValue);
      // Also save current pet type
      await AsyncStorage.setItem(CURRENT_PET_TYPE_KEY, pet.type);
      console.log(`Pet ${pet.type} (${pet.name}) saved to storage`);
    }
  } catch (error) {
    console.error('Error saving pet:', error);
    throw error;
  }
}

/**
 * Load pet data from AsyncStorage (by pet type)
 */
export async function loadPet(petType?: string): Promise<{ type: string; name: string; health: number; lastFed: number; lastPet: number; lastPlay?: number; lastPotion?: number; lastRevival?: number; createdAt?: number; originalCreatedAt?: number } | null> {
  try {
    // If petType is provided, load that specific pet
    if (petType) {
      const jsonValue = await AsyncStorage.getItem(getPetStorageKey(petType));
      if (jsonValue === null) {
        return null;
      }
      const pet = JSON.parse(jsonValue);
      console.log(`Pet ${petType} (${pet.name}) loaded from storage`);
      return pet;
    }
    
    // Otherwise, try to load current pet type, or fall back to old storage
    const currentPetType = await AsyncStorage.getItem(CURRENT_PET_TYPE_KEY);
    if (currentPetType) {
      const jsonValue = await AsyncStorage.getItem(getPetStorageKey(currentPetType));
      if (jsonValue !== null) {
        const pet = JSON.parse(jsonValue);
        console.log(`Current pet ${currentPetType} (${pet.name}) loaded from storage`);
        return pet;
      }
    }
    
    // Backward compatibility: try old storage key
    const jsonValue = await AsyncStorage.getItem(PET_STORAGE_KEY);
    if (jsonValue === null) {
      return null;
    }
    
    const pet = JSON.parse(jsonValue);
    console.log('Pet loaded from old storage:', pet.name);
    // Migrate to new storage format
    if (pet.type) {
      await savePet(pet, pet.type);
    }
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

/**
 * Save purchased pets to AsyncStorage
 */
export async function savePurchasedPets(pets: string[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(pets);
    await AsyncStorage.setItem(PURCHASED_PETS_STORAGE_KEY, jsonValue);
    console.log('Purchased pets saved to storage:', pets);
  } catch (error) {
    console.error('Error saving purchased pets:', error);
    throw error;
  }
}

/**
 * Load purchased pets from AsyncStorage
 */
export async function loadPurchasedPets(): Promise<string[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(PURCHASED_PETS_STORAGE_KEY);
    if (jsonValue === null) {
      // Default: only cat is free
      return ['cat'];
    }
    const pets = JSON.parse(jsonValue);
    console.log('Purchased pets loaded from storage:', pets);
    return pets;
  } catch (error) {
    console.error('Error loading purchased pets:', error);
    // Default on error
    return ['cat'];
  }
}

/**
 * Save revival tokens to AsyncStorage
 */
export async function saveRevivalTokens(tokens: number): Promise<void> {
  try {
    await AsyncStorage.setItem(REVIVAL_TOKENS_KEY, tokens.toString());
    console.log('Revival tokens saved to storage:', tokens);
  } catch (error) {
    console.error('Error saving revival tokens:', error);
    throw error;
  }
}

/**
 * Load revival tokens from AsyncStorage
 */
export async function loadRevivalTokens(): Promise<number> {
  try {
    const tokens = await AsyncStorage.getItem(REVIVAL_TOKENS_KEY);
    if (tokens === null) {
      return 0;
    }
    const tokensValue = parseInt(tokens, 10);
    console.log('Revival tokens loaded from storage:', tokensValue);
    return isNaN(tokensValue) ? 0 : tokensValue;
  } catch (error) {
    console.error('Error loading revival tokens:', error);
    return 0;
  }
}

/**
 * Save health potions to AsyncStorage
 */
export async function saveHealthPotions(potions: number): Promise<void> {
  try {
    await AsyncStorage.setItem(HEALTH_POTIONS_KEY, potions.toString());
    console.log('Health potions saved to storage:', potions);
  } catch (error) {
    console.error('Error saving health potions:', error);
    throw error;
  }
}

/**
 * Load health potions from AsyncStorage
 */
export async function loadHealthPotions(): Promise<number> {
  try {
    const potions = await AsyncStorage.getItem(HEALTH_POTIONS_KEY);
    if (potions === null) {
      return 0;
    }
    const potionsValue = parseInt(potions, 10);
    console.log('Health potions loaded from storage:', potionsValue);
    return isNaN(potionsValue) ? 0 : potionsValue;
  } catch (error) {
    console.error('Error loading health potions:', error);
    return 0;
  }
}
