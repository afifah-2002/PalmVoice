import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';
import { AppIconGrid } from './AppIconGrid';
import { AppPickerModal } from './AppPickerModal';
import { PixelAlert } from './PixelAlert';
import { PixelKeyboard } from './PixelKeyboard';

interface AppIcon {
  label: string;
  route?: string;
}

type AppIconOrEmpty = AppIcon | null;

interface CustomModeModalProps {
  visible: boolean;
  modeName: string;
  modeApps: AppIconOrEmpty[][];
  theme: PalmTheme;
  onSave: (name: string, apps: AppIconOrEmpty[][]) => void;
  onClose: () => void;
  onDelete?: () => void;
  isEditingExisting: boolean;
  onAppPress: (app: AppIcon, rowIndex: number, colIndex: number) => void;
  onIconLongPress: (app: AppIcon, rowIndex: number, colIndex: number) => void;
  onEmptySlotPress: (rowIndex: number, colIndex: number) => void;
  onDeleteIcon: (rowIndex: number, colIndex: number) => void;
  onChangeIcon: (rowIndex: number, colIndex: number) => void;
  isEditMode: boolean;
  selectedIconForSwap: { rowIndex: number; colIndex: number } | null;
  onExitEditMode: () => void;
  availableApps: string[];
  onAppSelect: (appLabel: string) => void;
  selectedSlot: { rowIndex: number; colIndex: number } | null;
  isAppPickerOpen: boolean;
  onAppPickerClose: () => void;
}

export function CustomModeModal({
  visible,
  modeName: initialModeName,
  modeApps: initialModeApps,
  theme,
  onSave,
  onClose,
  onDelete,
  isEditingExisting,
  onAppPress,
  onIconLongPress,
  onEmptySlotPress,
  onDeleteIcon,
  onChangeIcon,
  isEditMode,
  selectedIconForSwap,
  onExitEditMode,
  availableApps,
  onAppSelect,
  selectedSlot,
  isAppPickerOpen,
  onAppPickerClose,
}: CustomModeModalProps) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const [modeName, setModeName] = useState(initialModeName);
  const [modeApps, setModeApps] = useState<AppIconOrEmpty[][]>(initialModeApps);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [localSelectedSlot, setLocalSelectedSlot] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [localIsAppPickerOpen, setLocalIsAppPickerOpen] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<{ visible: boolean; appLabel: string; onConfirm: () => void } | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ visible: boolean; modeName: string; onConfirm: () => void } | null>(null);

  // Track if modal was just opened
  const prevVisibleRef = React.useRef(visible);
  const initialModeAppsRef = React.useRef(initialModeApps);
  const initialModeNameRef = React.useRef(initialModeName);
  
  // Update refs when modal is closed
  React.useEffect(() => {
    if (!visible) {
      initialModeAppsRef.current = initialModeApps;
      initialModeNameRef.current = initialModeName;
    }
  }, [visible, initialModeApps, initialModeName]);
  
  React.useEffect(() => {
    // Only reset when modal transitions from hidden to visible
    if (visible && !prevVisibleRef.current) {
      setModeName(initialModeNameRef.current);
      setModeApps(initialModeAppsRef.current);
      setLocalSelectedSlot(null);
      setLocalIsAppPickerOpen(false);
    }
    prevVisibleRef.current = visible;
  }, [visible]);
  
  const handleAppPress = (app: AppIcon, rowIndex: number, colIndex: number) => {
    setIsKeyboardVisible(false); // Close keyboard when interacting with apps
    if (isEditMode) {
      // Handle swap in custom mode modal
      if (selectedIconForSwap) {
        const { rowIndex: swapRow, colIndex: swapCol } = selectedIconForSwap;
        if (swapRow === rowIndex && swapCol === colIndex) {
          // Deselect
          return;
        } else {
          // Swap the icons
          const updatedApps = modeApps.map((row, rIdx) => {
            if (rIdx === swapRow) {
              const newRow = [...row];
              const temp = newRow[swapCol];
              newRow[swapCol] = modeApps[rowIndex][colIndex];
              return newRow;
            }
            if (rIdx === rowIndex) {
              const newRow = [...row];
              newRow[colIndex] = modeApps[swapRow][swapCol];
              return newRow;
            }
            return row;
          });
          setModeApps(updatedApps);
          onAppPress(app, rowIndex, colIndex);
        }
      } else {
        onAppPress(app, rowIndex, colIndex);
      }
    }
  };
  
  const handleDeleteIcon = (rowIndex: number, colIndex: number) => {
    setIsKeyboardVisible(false); // Close keyboard when deleting apps
    const updatedApps = modeApps.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        const newRow = [...row];
        newRow[colIndex] = null;
        return newRow;
      }
      return row;
    });
    setModeApps(updatedApps);
    onDeleteIcon(rowIndex, colIndex);
  };
  
  const handleAppSelect = (appLabel: string) => {
    const slot = localSelectedSlot || selectedSlot;
    
    if (!slot) {
      console.warn('No slot selected when trying to place app');
      return;
    }
    
    const { rowIndex, colIndex } = slot;
    
    // Check if app already exists in this mode (excluding the current slot)
    let existingRowIndex: number | null = null;
    let existingColIndex: number | null = null;
    
    modeApps.forEach((row, rIdx) => {
      row.forEach((app, cIdx) => {
        // Skip the current slot
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
      // Create new apps array with the selected app - ensure deep copy for React to detect change
      const updatedApps = modeApps.map((row, rIdx) => {
        if (rIdx === rowIndex) {
          // Create a new row array
          const newRow = [...row];
          newRow[colIndex] = { 
            label: appLabel, 
            route: appLabel === 'TO DO LIST' ? '/tasks' : undefined 
          };
          return newRow;
        }
        return [...row]; // Return a copy of the row even if not modified
      });
      
      // Update local state with new array reference
      setModeApps(updatedApps);
      
      // Clear selection and close picker
      setLocalSelectedSlot(null);
      setLocalIsAppPickerOpen(false);
      onAppPickerClose();
    };

    // If app already exists, show confirmation dialog
    if (existingRowIndex !== null && existingColIndex !== null) {
      setLocalIsAppPickerOpen(false); // Close app picker before showing alert
      onAppPickerClose();
      setDuplicateAlert({
        visible: true,
        appLabel,
        onConfirm: placeApp,
      });
    } else {
      // App doesn't exist, just place it
      placeApp();
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleSave = () => {
    if (modeName.trim()) {
      onSave(modeName.trim().toUpperCase(), modeApps);
      onClose();
    }
  };
  
  const handleDelete = () => {
    setDeleteAlert({
      visible: true,
      modeName: initialModeName,
      onConfirm: () => {
        if (onDelete) {
          onDelete();
        }
        onClose();
      },
    });
  };
  
  const handleEmptySlotPress = (rowIndex: number, colIndex: number) => {
    setIsKeyboardVisible(false); // Close keyboard when selecting apps
    setLocalSelectedSlot({ rowIndex, colIndex });
    setLocalIsAppPickerOpen(true);
    onEmptySlotPress(rowIndex, colIndex);
  };
  
  const handleChangeIcon = (rowIndex: number, colIndex: number) => {
    setIsKeyboardVisible(false); // Close keyboard when changing apps
    setLocalSelectedSlot({ rowIndex, colIndex });
    setLocalIsAppPickerOpen(true);
    onChangeIcon(rowIndex, colIndex);
  };
  
  const handleAppPickerClose = () => {
    setLocalSelectedSlot(null);
    setLocalIsAppPickerOpen(false);
    onAppPickerClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent, 
          isKeyboardVisible && styles.modalContentWithKeyboard,
          { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }
        ]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.modalHeaderBackground, borderBottomColor: theme.modalHeaderBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.modalText }]}>
              {initialModeName ? 'EDIT MODE' : 'CREATE MODE'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.modalCloseButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
            >
              <Text style={[styles.modalCloseText, { color: theme.modalText }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.nameInputContainer}>
              <Text style={[styles.label, { color: theme.modalText }]}>MODE NAME:</Text>
              <TouchableOpacity
                style={[styles.nameInput, { backgroundColor: theme.dropdownBackground, borderColor: theme.dropdownBorder }]}
                onPress={() => setIsKeyboardVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.nameInputText, { color: modeName ? theme.modalText : theme.dropdownText }]}>
                  {modeName || 'Enter mode name'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Only show app grid when editing existing mode */}
            {isEditingExisting && (
              <View style={styles.gridContainer}>
                <AppIconGrid
                  apps={modeApps}
                  onAppPress={handleAppPress}
                  onIconLongPress={onIconLongPress}
                  onEmptySlotPress={handleEmptySlotPress}
                  theme={theme}
                  isEditMode={isEditMode}
                  selectedIconForSwap={selectedIconForSwap}
                  onDeleteIcon={handleDeleteIcon}
                  onChangeIcon={handleChangeIcon}
                  onExitEditMode={onExitEditMode}
                />
              </View>
            )}

            {isEditingExisting && onDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.deleteButton, { backgroundColor: '#8B0000', borderColor: '#5A0000' }]}
              >
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>DELETE MODE</Text>
              </TouchableOpacity>
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.cancelButton, { backgroundColor: theme.dropdownBackground, borderColor: theme.dropdownBorder }]}
              >
                <Text style={[styles.buttonText, { color: theme.modalText }]}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveButton, { backgroundColor: theme.headerBackground, borderColor: theme.headerBorder }]}
                disabled={!modeName.trim()}
              >
                <Text style={[styles.buttonText, { color: theme.headerText }]}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Pixel Keyboard - Outside modal, appears from bottom */}
      <PixelKeyboard
        visible={isKeyboardVisible}
        theme={theme}
        onKeyPress={(key) => {
          if (modeName.length < 20) {
            setModeName((prev) => prev + key);
          }
        }}
        onBackspace={() => {
          setModeName((prev) => prev.slice(0, -1));
        }}
        onEnter={() => {
          setIsKeyboardVisible(false);
        }}
        onSpace={() => {
          if (modeName.length < 20) {
            setModeName((prev) => prev + ' ');
          }
        }}
        onClose={() => setIsKeyboardVisible(false)}
      />
      
      {/* App Picker Modal */}
      <AppPickerModal
        visible={localIsAppPickerOpen || isAppPickerOpen}
        availableApps={availableApps}
        onSelect={handleAppSelect}
        onClose={handleAppPickerClose}
        theme={theme}
      />

      {/* Pixel Alert for Duplicate Apps */}
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
                setLocalSelectedSlot(null);
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
          theme={theme}
        />
      )}

      {/* Pixel Alert for Delete Mode */}
      {deleteAlert && (
        <PixelAlert
          visible={deleteAlert.visible}
          title="DELETE MODE"
          message={`Are you sure you want to delete "${deleteAlert.modeName}"? This cannot be undone.`}
          buttons={[
            {
              text: 'CANCEL',
              style: 'cancel',
              onPress: () => {
                setDeleteAlert(null);
              },
            },
            {
              text: 'DELETE',
              style: 'destructive',
              onPress: () => {
                deleteAlert.onConfirm();
                setDeleteAlert(null);
              },
            },
          ]}
          theme={theme}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    position: 'relative',
    width: '95%',
    maxHeight: '75%',
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    zIndex: 1001,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  nameInputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    marginBottom: 8,
  },
  nameInput: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 4,
    minHeight: 36,
    justifyContent: 'center',
  },
  nameInputText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  gridContainer: {
    height: 350,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  deleteButton: {
    width: '100%',
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
});

