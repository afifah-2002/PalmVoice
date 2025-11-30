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
 * Play button tap sound (keyboard clack)
 * Uses a simple, sharp click sound
 */
export async function playButtonTap(): Promise<void> {
  try {
    // Create a short, sharp click sound
    // Using a minimal WAV file with a brief click
    const sampleRate = 44100;
    const duration = 0.03; // 30ms - short and sharp
    const samples = Math.floor(sampleRate * duration);
    
    // Create WAV file buffer
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    // Generate click sound (sharp attack, quick decay)
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 40); // Quick decay
      const click = (Math.random() * 2 - 1) * envelope * 0.4;
      const sample = Math.max(-1, Math.min(1, click));
      view.setInt16(44 + i * 2, sample * 0x7FFF, true);
    }
    
    // Convert to base64 using a React Native compatible method
    const bytes = new Uint8Array(buffer);
    const base64 = bytes.reduce((acc, byte) => {
      return acc + String.fromCharCode(byte);
    }, '');
    
    // Use a simple base64 encoding approach
    let base64String = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (let i = 0; i < bytes.length; i += 3) {
      const b1 = bytes[i];
      const b2 = bytes[i + 1] || 0;
      const b3 = bytes[i + 2] || 0;
      const bitmap = (b1 << 16) | (b2 << 8) | b3;
      base64String += chars.charAt((bitmap >> 18) & 63);
      base64String += chars.charAt((bitmap >> 12) & 63);
      base64String += i + 1 < bytes.length ? chars.charAt((bitmap >> 6) & 63) : '=';
      base64String += i + 2 < bytes.length ? chars.charAt(bitmap & 63) : '=';
    }
    
    const { sound } = await Audio.Sound.createAsync(
      { uri: `data:audio/wav;base64,${base64String}` },
      { shouldPlay: true, volume: 0.5 }
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
