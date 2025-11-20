import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../constants/palmThemes';

type AppIconOrEmpty = { label: string; route?: string } | null;

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  currentMode: string;
  setMode: (mode: string) => void;
  customModes: Record<string, AppIconOrEmpty[][]>;
  saveCustomMode: (name: string, apps: AppIconOrEmpty[][]) => void;
  deleteCustomMode: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@palm_pilot_theme';
const MODE_STORAGE_KEY = '@palm_pilot_mode';
const CUSTOM_MODES_STORAGE_KEY = '@palm_pilot_custom_modes';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('Dark Blue');
  const [currentMode, setCurrentMode] = useState<string>('Work');
  const [customModes, setCustomModes] = useState<Record<string, AppIconOrEmpty[][]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme, mode, and custom modes from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedTheme, savedMode, savedCustomModes] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(MODE_STORAGE_KEY),
        AsyncStorage.getItem(CUSTOM_MODES_STORAGE_KEY),
      ]);
      
      if (savedTheme) {
        setCurrentTheme(savedTheme as Theme);
      }
      if (savedMode) {
        setCurrentMode(savedMode);
      }
      if (savedCustomModes) {
        setCustomModes(JSON.parse(savedCustomModes));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setTheme = async (theme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const setMode = async (mode: string) => {
    try {
      await AsyncStorage.setItem(MODE_STORAGE_KEY, mode);
      setCurrentMode(mode);
    } catch (error) {
      console.error('Failed to save mode:', error);
    }
  };

  const saveCustomMode = async (name: string, apps: AppIconOrEmpty[][]) => {
    try {
      const updated = { ...customModes, [name]: apps };
      await AsyncStorage.setItem(CUSTOM_MODES_STORAGE_KEY, JSON.stringify(updated));
      setCustomModes(updated);
    } catch (error) {
      console.error('Failed to save custom mode:', error);
    }
  };

  const deleteCustomMode = async (name: string) => {
    try {
      const updated = { ...customModes };
      delete updated[name];
      await AsyncStorage.setItem(CUSTOM_MODES_STORAGE_KEY, JSON.stringify(updated));
      setCustomModes(updated);
    } catch (error) {
      console.error('Failed to delete custom mode:', error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, currentMode, setMode, customModes, saveCustomMode, deleteCustomMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
