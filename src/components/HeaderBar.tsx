import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme, Theme } from '../constants/palmThemes';
import { Dropdown } from './Dropdown';

type Mode = string;

interface HeaderBarProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  theme: PalmTheme;
  allModes: Mode[];
  customModes: string[];
  onEditMode: (modeName: string) => void;
  maxModesReached: boolean;
}

export function HeaderBar({
  currentMode,
  onModeChange,
  currentTheme,
  onThemeChange,
  theme,
  allModes,
  customModes,
  onEditMode,
  maxModesReached,
}: HeaderBarProps) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const [currentTime, setCurrentTime] = useState('');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.headerBar} />;
  }

  const themeOptions: Theme[] = ['Dark Blue', 'Blue', 'Lavender', 'Pink', 'Beige'];
  
  // Prepare mode options with "+" option if not at max
  const modeOptionsWithAdd: Mode[] = maxModesReached ? allModes : [...allModes, '+'];

  const handleModeSelect = (mode: Mode) => {
    if (mode === '+') {
      onModeChange('+');
    } else {
      onModeChange(mode);
    }
    setIsModeDropdownOpen(false);
  };

  return (
    <View style={[styles.headerBar, { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorder }]}>
      {/* Left: Theme Dropdown */}
      <View style={styles.headerLeft}>
        <Dropdown
          label="THEME"
          value={currentTheme}
          options={themeOptions}
          onSelect={onThemeChange}
          isOpen={isThemeDropdownOpen}
          onToggle={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
          position="left"
          theme={theme}
        />
      </View>

      {/* Right: Time */}
      <View style={styles.headerRight}>
        <Text style={[styles.headerTime, { color: theme.headerText }]}>{currentTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    position: 'relative',
    zIndex: 10,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  modeDropdownContainer: {
    position: 'relative',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerTime: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
});

