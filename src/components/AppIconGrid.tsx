import React from 'react';
import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';
import { AppIconSlot } from './AppIconSlot';

interface AppIcon {
  label: string;
  route?: string;
}

type AppIconOrEmpty = AppIcon | null;

interface AppIconGridProps {
  apps: AppIconOrEmpty[][];
  onAppPress: (app: AppIcon, rowIndex: number, colIndex: number) => void;
  onIconLongPress: (app: AppIcon, rowIndex: number, colIndex: number) => void;
  onEmptySlotPress: (rowIndex: number, colIndex: number) => void;
  theme: PalmTheme;
  isEditMode: boolean;
  selectedIconForSwap: { rowIndex: number; colIndex: number } | null;
  onDeleteIcon: (rowIndex: number, colIndex: number) => void;
  onChangeIcon: (rowIndex: number, colIndex: number) => void;
  onExitEditMode: () => void;
}

export function AppIconGrid({
  apps,
  onAppPress,
  onIconLongPress,
  onEmptySlotPress,
  theme,
  isEditMode,
  selectedIconForSwap,
  onDeleteIcon,
  onChangeIcon,
  onExitEditMode,
}: AppIconGridProps) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) {
    return <View style={styles.appsGridContainer} />;
  }

  return (
    <View style={styles.appsGridContainer}>
      {isEditMode && (
        <View style={styles.editModeBar}>
          <Text style={[styles.editModeText, { color: theme.headerText }]}>
            Tap icons to swap • Tap X to delete
          </Text>
          <TouchableOpacity
            onPress={onExitEditMode}
            style={[styles.doneButton, { backgroundColor: theme.headerBackground, borderColor: theme.headerBorder }]}
          >
            <Text style={[styles.doneButtonText, { color: theme.headerText }]}>DONE</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={[styles.appsGridBox, { backgroundColor: theme.gridBoxBackground, borderColor: theme.gridBoxBorder }]}>
        {/* Pixel effect overlay */}
        <View style={[styles.pixelEffectOverlay, { backgroundColor: theme.gridBoxOverlay }]} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.appsGrid}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{ right: 2 }}
          persistentScrollbar={true}
        >
          {apps.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.appRow}>
              {row.map((app, colIndex) => (
                <AppIconSlot
                  key={`${rowIndex}-${colIndex}`}
                  app={app}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  onPress={onAppPress}
                  onLongPress={onIconLongPress}
                  onEmptySlotPress={onEmptySlotPress}
                  theme={theme}
                  isEditMode={isEditMode}
                  isSelected={selectedIconForSwap?.rowIndex === rowIndex && selectedIconForSwap?.colIndex === colIndex}
                  onDelete={onDeleteIcon}
                  onChangeIcon={onChangeIcon}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appsGridContainer: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  appsGridBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    paddingTop: 12,
    paddingLeft: 12,
    paddingBottom: 12,
    paddingRight: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  pixelEffectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
    pointerEvents: 'none',
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  appsGrid: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 4,
    paddingBottom: 4,
  },
  appRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 12,
  },
  editModeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 8,
  },
  editModeText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    flex: 1,
  },
  doneButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 4,
  },
  doneButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
});

