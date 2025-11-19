import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useState } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';
import { AppIconGrid } from './AppIconGrid';
import { AppPickerModal } from './AppPickerModal';
import { PixelKeyboard } from './PixelKeyboard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

  React.useEffect(() => {
    setModeName(initialModeName);
    setModeApps(initialModeApps);
  }, [initialModeName, initialModeApps, visible]);
  
  const handleAppPress = (app: AppIcon, rowIndex: number, colIndex: number) => {
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
    if (selectedSlot) {
      const { rowIndex, colIndex } = selectedSlot;
      const updatedApps = modeApps.map((row, rIdx) => {
        if (rIdx === rowIndex) {
          const newRow = [...row];
          newRow[colIndex] = { label: appLabel, route: appLabel === 'TO DO LIST' ? '/tasks' : undefined };
          return newRow;
        }
        return row;
      });
      setModeApps(updatedApps);
      onAppSelect(appLabel);
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
    Alert.alert(
      'DELETE MODE',
      `Are you sure you want to delete "${initialModeName}"? This cannot be undone.`,
      [
        {
          text: 'CANCEL',
          style: 'cancel',
        },
        {
          text: 'DELETE',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete();
            }
            onClose();
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  const handleEmptySlotPress = (rowIndex: number, colIndex: number) => {
    onEmptySlotPress(rowIndex, colIndex);
  };
  
  const handleChangeIcon = (rowIndex: number, colIndex: number) => {
    onChangeIcon(rowIndex, colIndex);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}>
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
      
      {/* App Picker Modal */}
      <AppPickerModal
        visible={isAppPickerOpen}
        availableApps={availableApps}
        onSelect={handleAppSelect}
        onClose={onAppPickerClose}
        theme={theme}
      />
      
      {/* Pixel Keyboard */}
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.95,
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
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
    maxHeight: SCREEN_HEIGHT * 0.75,
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
    height: SCREEN_HEIGHT * 0.5,
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

