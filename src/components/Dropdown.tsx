import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';

interface DropdownProps<T extends string> {
  label: string;
  value: T;
  options: T[];
  onSelect: (value: T) => void;
  isOpen: boolean;
  onToggle: () => void;
  position?: 'left' | 'center' | 'right';
  theme: PalmTheme;
  customModes?: string[];
  onEditMode?: (modeName: string) => void;
}

export function Dropdown<T extends string>({
  label,
  value,
  options,
  onSelect,
  isOpen,
  onToggle,
  position = 'left',
  theme,
  customModes = [],
  onEditMode,
}: DropdownProps<T>) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSelect = (option: T) => {
    onSelect(option);
    onToggle();
  };

  const getMenuStyle = () => {
    if (position === 'center') {
      return [styles.dropdownMenu, styles.themeDropdownMenu];
    }
    return styles.dropdownMenu;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: theme.dropdownBackground, borderColor: theme.dropdownBorder }]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.dropdownText, { color: theme.dropdownText }]}>{label}</Text>
        <Text style={[styles.dropdownArrow, { color: theme.dropdownText }]}>▼</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={[getMenuStyle(), { backgroundColor: theme.dropdownBackground, borderColor: theme.dropdownBorder }]}>
          {options.map((option) => {
            const isCustomMode = customModes.includes(option);
            const isAddOption = option === '+';
            
            return (
              <View key={option} style={styles.dropdownItemContainer}>
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    { borderBottomColor: theme.dropdownItemBorder },
                    value === option && { backgroundColor: theme.dropdownActiveBackground },
                    isAddOption && styles.addOptionItem,
                  ]}
                  onPress={() => handleSelect(option)}
                  onLongPress={isCustomMode && onEditMode ? () => onEditMode(option) : undefined}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    { color: theme.dropdownText },
                    isAddOption && styles.addOptionText,
                  ]}>
                    {isAddOption ? '+ CREATE MODE' : option.toUpperCase()}
                  </Text>
                  {isCustomMode && (
                    <Text style={[styles.editHint, { color: theme.dropdownText }]}> (long press to edit)</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
  },
  dropdownText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    marginRight: 4,
  },
  dropdownArrow: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    left: 0,
    borderWidth: 2,
    minWidth: 120,
    zIndex: 20,
  },
  themeDropdownMenu: {
    left: '50%',
    marginLeft: -60, // Half of minWidth to center it
  },
  dropdownItemContainer: {
    position: 'relative',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownItemActive: {},
  dropdownItemText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  addOptionItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  addOptionText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  editHint: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 5,
    marginLeft: 4,
  },
});

