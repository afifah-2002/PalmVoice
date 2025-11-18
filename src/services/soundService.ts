import { Audio } from 'expo-av';

// Sound instances
let buttonTapSound: Audio.Sound | null = null;
let taskCompleteSound: Audio.Sound | null = null;
let recordStartSound: Audio.Sound | null = null;
let recordStopSound: Audio.Sound | null = null;

/**
 * Initialize all sounds
 */
export async function initializeSounds(): Promise<void> {
  try {
    // For now, we'll use system sounds or generate simple beeps
    // In production, you'd load actual sound files from assets/sounds/
    
    // Set audio mode
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    
    console.log('Sounds initialized');
  } catch (error) {
    console.error('Error initializing sounds:', error);
  }
}

/**
 * Play button tap sound (short beep)
 */
export async function playButtonTap(): Promise<void> {
  try {
    // Create a simple beep sound programmatically
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' },
      { shouldPlay: true, volume: 0.3 }
    );
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    // Silently fail - sounds are not critical
  }
}

/**
 * Play task complete sound (satisfying click)
 */
export async function playTaskComplete(): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' },
      { shouldPlay: true, volume: 0.4 }
    );
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    // Silently fail
  }
}

/**
 * Play recording start sound
 */
export async function playRecordStart(): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' },
      { shouldPlay: true, volume: 0.5 }
    );
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    // Silently fail
  }
}

/**
 * Play recording stop sound
 */
export async function playRecordStop(): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' },
      { shouldPlay: true, volume: 0.5 }
    );
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    // Silently fail
  }
}

/**
 * Cleanup all sounds
 */
export async function cleanupSounds(): Promise<void> {
  try {
    if (buttonTapSound) await buttonTapSound.unloadAsync();
    if (taskCompleteSound) await taskCompleteSound.unloadAsync();
    if (recordStartSound) await recordStartSound.unloadAsync();
    if (recordStopSound) await recordStopSound.unloadAsync();
  } catch (error) {
    console.error('Error cleaning up sounds:', error);
  }
}
