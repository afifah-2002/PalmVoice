import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppIconGrid } from '../components/AppIconGrid';
import { AppPickerModal } from '../components/AppPickerModal';
import { CustomModeModal } from '../components/CustomModeModal';
import { FavoriteButtons } from '../components/FavoriteButtons';
import { GraffitiArea } from '../components/GraffitiArea';
import { HeaderBar } from '../components/HeaderBar';
import { LCDStripeEffect } from '../components/LCDStripeEffect';
import { PixelAlert } from '../components/PixelAlert';
import { PALM_THEMES, Theme } from '../constants/palmThemes';
import { useTheme } from '../contexts/ThemeContext';

interface AppIcon {
  label: string;
  route?: string;
}

type AppIconOrEmpty = AppIcon | null;

type Mode = string;

const MODE_APPS: Record<Mode, AppIconOrEmpty[][]> = {
  Work: [
    [
      { label: 'TO DO LIST', route: '/tasks' },
      { label: 'CALC' },
      { label: 'DATE BOOK' },
    ],
    [
      { label: 'MAIL' },
      { label: 'MEMO PAD' },
      { label: 'ADDRESS' },
    ],
    [
      { label: 'HOTSYNC' },
      { label: 'MEMORY' },
      { label: 'PREFS' },
    ],
    [
      { label: 'GIRAFFE' },
      null, // Empty slot
      null, // Empty slot
    ],
    [
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
    ],
  ],
  Study: [
    [
      { label: 'MEMO PAD' },
      { label: 'DATE BOOK' },
      { label: 'MEMORY' },
    ],
    [
      { label: 'MAIL' },
      { label: 'CALC' },
      { label: 'TO DO LIST', route: '/tasks' },
    ],
    [
      { label: 'ADDRESS' },
      { label: 'EXPENSE' },
      { label: 'PREFS' },
    ],
    [
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
    ],
    [
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
    ],
  ],
  Focus: [
    [
      { label: 'TO DO LIST', route: '/tasks' },
      { label: 'MEMO PAD' },
      { label: 'DATE BOOK' },
    ],
    [
      { label: 'MEMORY' },
      { label: 'SECURITY' },
      { label: 'CALC' },
    ],
    [
      { label: 'MAIL' },
      { label: 'EXPENSE' },
      { label: 'ADDRESS' },
    ],
    [
      { label: 'PREFS' },
      null, // Empty slot
      null, // Empty slot
    ],
    [
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
    ],
  ],
  Lazy: [
    [
      { label: 'GIRAFFE' },
      { label: 'MAIL' },
      { label: 'MEMO PAD' },
    ],
    [
      { label: 'ADDRESS' },
      { label: 'TO DO LIST', route: '/tasks' },
      { label: 'MEMORY' },
    ],
    [
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
    ],
    [
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
    ],
    [
      null, // Empty slot
      null, // Empty slot
      null, // Empty slot
    ],
  ],
};

export default function LauncherScreen() {
  const router = useRouter();
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isAppPickerOpen, setIsAppPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [modeApps, setModeApps] = useState<Record<Mode, AppIconOrEmpty[][]>>(MODE_APPS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIconForSwap, setSelectedIconForSwap] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [isCustomModeModalOpen, setIsCustomModeModalOpen] = useState(false);
  const [editingModeName, setEditingModeName] = useState<string | null>(null);
  const [duplicateAlert, setDuplicateAlert] = useState<{ visible: boolean; appLabel: string; onConfirm: () => void } | null>(null);
  
  const { currentTheme, setTheme, currentMode, setMode, customModes, saveCustomMode, deleteCustomMode } = useTheme();

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  // Merge default and custom modes
  const allModeApps = { ...modeApps, ...customModes };
  const APPS = allModeApps[currentMode] || [];
  
  // Get all available modes (default + custom)
  const getAllModes = (): Mode[] => {
    const defaultModes: Mode[] = ['Work', 'Study', 'Focus', 'Lazy'];
    const customModeNames = Object.keys(customModes);
    return [...defaultModes, ...customModeNames];
  };
  
  const allModes = getAllModes();

  // Available apps for the picker
  const AVAILABLE_APPS = [
    'ADDRESS',
    'CALC',
    'DATE BOOK',
    'EXPENSE',
    'GIRAFFE',
    'HOTSYNC',
    'MAIL',
    'MEMO PAD',
    'MEMORY',
    'PREFS',
    'SECURITY',
    'TO DO LIST',
  ];

  // Blinking cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleAppPress = (app: AppIcon, rowIndex: number, colIndex: number) => {
    if (isEditMode) {
      // In edit mode, handle icon swapping
      if (selectedIconForSwap) {
        // Swap the two icons
        const { rowIndex: swapRow, colIndex: swapCol } = selectedIconForSwap;
        if (swapRow === rowIndex && swapCol === colIndex) {
          // Same icon, deselect
          setSelectedIconForSwap(null);
        } else {
          // Swap the icons
          const updateApps = (apps: AppIconOrEmpty[][]) => {
            const newModeApps = [...apps];
            const firstRow = [...newModeApps[swapRow]];
            const firstApp = firstRow[swapCol];
            const secondRow = [...newModeApps[rowIndex]];
            const secondApp = secondRow[colIndex];
            
            firstRow[swapCol] = secondApp;
            secondRow[colIndex] = firstApp;
            
            newModeApps[swapRow] = firstRow;
            newModeApps[rowIndex] = secondRow;
            return newModeApps;
          };
          
          // Update in the appropriate state (custom modes or default modes)
          if (customModes[currentMode]) {
            saveCustomMode(currentMode, updateApps(customModes[currentMode]));
          } else {
            setModeApps((prev) => ({
              ...prev,
              [currentMode]: updateApps(prev[currentMode] || []),
            }));
          }
          setSelectedIconForSwap(null);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      } else {
        // Select this icon for swapping
        setSelectedIconForSwap({ rowIndex, colIndex });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      // Normal mode - open the app
      if (app.route) {
        router.push(app.route as any);
      }
    }
  };

  const handleIconLongPress = (app: AppIcon, rowIndex: number, colIndex: number) => {
    // Haptic feedback on long press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Toggle edit mode
    setIsEditMode(true);
    setSelectedIconForSwap(null);
  };
  
  const handleDeleteIcon = (rowIndex: number, colIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updateApps = (apps: AppIconOrEmpty[][]) => {
      const newModeApps = [...apps];
      const newRow = [...newModeApps[rowIndex]];
      newRow[colIndex] = null;
      newModeApps[rowIndex] = newRow;
      return newModeApps;
    };
    
    // Update in the appropriate state (custom modes or default modes)
    if (customModes[currentMode]) {
      saveCustomMode(currentMode, updateApps(customModes[currentMode]));
    } else {
      setModeApps((prev) => ({
        ...prev,
        [currentMode]: updateApps(prev[currentMode] || []),
      }));
    }
  };
  
  const handleChangeIcon = (rowIndex: number, colIndex: number) => {
    setSelectedSlot({ rowIndex, colIndex });
    setIsAppPickerOpen(true);
  };
  
  const exitEditMode = () => {
    setIsEditMode(false);
    setSelectedIconForSwap(null);
  };

  const handleEmptySlotPress = (rowIndex: number, colIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSlot({ rowIndex, colIndex });
    setIsAppPickerOpen(true);
  };

  const handleAppSelect = (appLabel: string) => {
    if (selectedSlot) {
      const { rowIndex, colIndex } = selectedSlot;
      
      // Check if app already exists in this mode (excluding the current slot)
      const currentApps = allModeApps[currentMode] || [];
      let existingRowIndex: number | null = null;
      let existingColIndex: number | null = null;
      
      currentApps.forEach((row, rIdx) => {
        row.forEach((app, cIdx) => {
          // Skip the current slot if we're changing an existing app
          if (rIdx === rowIndex && cIdx === colIndex) {
            return;
          }
          if (app !== null && app.label === appLabel) {
            existingRowIndex = rIdx;
            existingColIndex = cIdx;
          }
        });
      });

      const placeApp = () => {
        const updateApps = (apps: AppIconOrEmpty[][]) => {
          const newModeApps = apps.map(row => [...row]); // Deep copy
          
          // Place app in new location
          newModeApps[rowIndex][colIndex] = { 
            label: appLabel, 
            route: appLabel === 'TO DO LIST' ? '/tasks' : undefined 
          };
          
          return newModeApps;
        };
        
        // Update in the appropriate state (custom modes or default modes)
        if (customModes[currentMode]) {
          saveCustomMode(currentMode, updateApps(customModes[currentMode]));
        } else {
          setModeApps((prev) => ({
            ...prev,
            [currentMode]: updateApps(prev[currentMode] || []),
          }));
        }

        setIsAppPickerOpen(false);
        setSelectedSlot(null);
      };

      // If app already exists, show confirmation dialog
      if (existingRowIndex !== null && existingColIndex !== null) {
        setIsAppPickerOpen(false); // Close app picker before showing alert
        setDuplicateAlert({
          visible: true,
          appLabel,
          onConfirm: placeApp,
        });
      } else {
        // App doesn't exist, just place it
        placeApp();
      }
    }
  };

  const handleModeChange = (mode: Mode) => {
    if (mode === '+') {
      // Open custom mode creation modal
      setEditingModeName(null);
      setIsCustomModeModalOpen(true);
      return;
    }
    setMode(mode);
    // Initialize mode apps if they don't exist
    if (!allModeApps[mode]) {
      if (MODE_APPS[mode as keyof typeof MODE_APPS]) {
        setModeApps((prev) => ({
          ...prev,
          [mode]: MODE_APPS[mode as keyof typeof MODE_APPS],
        }));
      }
    }
  };
  
  const handleSaveCustomMode = (name: string, apps: AppIconOrEmpty[][]) => {
    if (editingModeName && editingModeName !== name) {
      // Renaming mode - delete old, save new
      deleteCustomMode(editingModeName);
      saveCustomMode(name, apps);
      if (currentMode === editingModeName) {
        setMode(name);
      }
    } else {
      // New mode or same name
      saveCustomMode(name, apps);
      if (!editingModeName) {
        setMode(name);
      }
    }
    setIsCustomModeModalOpen(false);
    setEditingModeName(null);
    setIsEditMode(false);
    setSelectedIconForSwap(null);
  };
  
  const handleEditMode = (modeName: string) => {
    setEditingModeName(modeName);
    setIsCustomModeModalOpen(true);
  };
  
  const handleDeleteCustomMode = (modeName: string) => {
    deleteCustomMode(modeName);
    
    // If the deleted mode was the current mode, switch to Work mode
    if (currentMode === modeName) {
      setMode('Work');
    }
  };
  
  const editingModeApps = React.useMemo(() => {
    if (editingModeName) {
      // If editing existing custom mode, use it; otherwise start with empty grid
      return customModes[editingModeName] || Array(5).fill(null).map(() => Array(3).fill(null));
    }
    // New mode - start with empty grid
    return Array(5).fill(null).map(() => Array(3).fill(null));
  }, [editingModeName, customModes]);

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
  };

  const handleAppPickerClose = () => {
    setIsAppPickerOpen(false);
    setSelectedSlot(null);
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <View style={styles.bezel}>
          <View style={styles.screen} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bezel with Palm Pilot branding */}
      <View style={styles.bezel}>
        <View style={styles.bezelTop}>
          <Text style={styles.palmPilotText}>Palm Pilot</Text>
          <View style={styles.logo3Com}>
            <Text style={styles.logo3ComText}>3Com</Text>
          </View>
        </View>

        {/* LCD Screen */}
        <View style={[styles.screen, { backgroundColor: PALM_THEMES[currentTheme].screenBackground }]}>
          {/* LCD RGB subpixel stripe pattern */}
          <LCDStripeEffect />

          {/* Header Bar */}
          <HeaderBar
            currentMode={currentMode}
            onModeChange={handleModeChange}
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
            theme={PALM_THEMES[currentTheme]}
            allModes={allModes}
            customModes={Object.keys(customModes)}
            onEditMode={handleEditMode}
            maxModesReached={allModes.length >= 10}
          />

          {/* App Icons Grid */}
          <AppIconGrid
            apps={APPS}
            onAppPress={handleAppPress}
            onIconLongPress={handleIconLongPress}
            onEmptySlotPress={handleEmptySlotPress}
            theme={PALM_THEMES[currentTheme]}
            isEditMode={isEditMode}
            selectedIconForSwap={selectedIconForSwap}
            onDeleteIcon={handleDeleteIcon}
            onChangeIcon={handleChangeIcon}
            onExitEditMode={exitEditMode}
          />

          {/* Graffiti Area */}
          <GraffitiArea cursorVisible={cursorVisible} theme={PALM_THEMES[currentTheme]} />

          {/* App Picker Modal - Inside screen */}
          <AppPickerModal
            visible={isAppPickerOpen}
            availableApps={AVAILABLE_APPS}
            onSelect={handleAppSelect}
            onClose={handleAppPickerClose}
            theme={PALM_THEMES[currentTheme]}
          />

          {/* Custom Mode Modal - Inside screen */}
          <CustomModeModal
        visible={isCustomModeModalOpen}
        modeName={editingModeName || ''}
        modeApps={editingModeApps}
        theme={PALM_THEMES[currentTheme]}
        onSave={handleSaveCustomMode}
        onDelete={editingModeName ? () => handleDeleteCustomMode(editingModeName) : undefined}
        isEditingExisting={!!editingModeName}
        onClose={() => {
          setIsCustomModeModalOpen(false);
          setEditingModeName(null);
        }}
        onAppPress={(app, rowIndex, colIndex) => {
          // Handled in CustomModeModal
        }}
        onIconLongPress={(app, rowIndex, colIndex) => {
          setIsEditMode(true);
          setSelectedIconForSwap(null);
        }}
        onEmptySlotPress={(rowIndex, colIndex) => {
          setSelectedSlot({ rowIndex, colIndex });
          setIsAppPickerOpen(true);
        }}
        onDeleteIcon={(rowIndex, colIndex) => {
          // Handled in CustomModeModal
        }}
        onChangeIcon={(rowIndex, colIndex) => {
          setSelectedSlot({ rowIndex, colIndex });
          setIsAppPickerOpen(true);
        }}
        isEditMode={isEditMode}
        selectedIconForSwap={selectedIconForSwap}
        onExitEditMode={() => {
          setIsEditMode(false);
          setSelectedIconForSwap(null);
        }}
        availableApps={AVAILABLE_APPS}
        onAppSelect={(appLabel) => {
          // Handled in CustomModeModal
        }}
        selectedSlot={selectedSlot}
        isAppPickerOpen={isAppPickerOpen}
        onAppPickerClose={handleAppPickerClose}
      />

          {/* Pixel Alert for Duplicate Apps - Inside screen */}
          {duplicateAlert && (
            <PixelAlert
              visible={duplicateAlert.visible}
              title="DUPLICATE APP"
              message={`"${duplicateAlert.appLabel}" already exists in this mode. Do you want to add it again?`}
              buttons={[
                {
                  text: 'CANCEL',
                  style: 'cancel',
                  onPress: () => {
                    setDuplicateAlert(null);
                    setSelectedSlot(null);
                  },
                },
                {
                  text: 'YES',
                  onPress: () => {
                    duplicateAlert.onConfirm();
                    setDuplicateAlert(null);
                  },
                },
              ]}
              theme={PALM_THEMES[currentTheme]}
            />
          )}
        </View>

        {/* Favorite Buttons - Gray Bezel Bottom */}
        <FavoriteButtons />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bezel: {
    flex: 1,
    backgroundColor: '#3A3A3A',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  bezelTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  palmPilotText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
  },
  logo3Com: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  logo3ComText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#000000',
  },
  screen: {
    flex: 1,
    position: 'relative',
    opacity: 0.98,
    borderWidth: 2,
    borderColor: '#505050',
  },
});
