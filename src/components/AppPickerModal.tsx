import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';
import { PixelIcon } from './PixelIcon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AppPickerModalProps {
  visible: boolean;
  availableApps: string[];
  onSelect: (appLabel: string) => void;
  onClose: () => void;
  theme: PalmTheme;
}

export function AppPickerModal({
  visible,
  availableApps,
  onSelect,
  onClose,
  theme,
}: AppPickerModalProps) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

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
            <Text style={[styles.modalTitle, { color: theme.modalText }]}>SELECT APP</Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.modalCloseButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
            >
              <Text style={[styles.modalCloseText, { color: theme.modalText }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.appPickerGrid}>
              {availableApps.map((appLabel) => (
                <TouchableOpacity
                  key={appLabel}
                  style={styles.appPickerItem}
                  onPress={() => onSelect(appLabel)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.appPickerIconCircle, { backgroundColor: theme.iconCircleBackground, borderColor: theme.iconCircleBorder }]}>
                    <PixelIcon type={appLabel} />
                  </View>
                  <Text style={[styles.appPickerLabel, { color: theme.modalText }]}>{appLabel}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
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
    width: SCREEN_WIDTH * 0.85,
    maxHeight: SCREEN_HEIGHT * 0.7,
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
  modalScrollView: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  appPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  appPickerItem: {
    width: 100,
    alignItems: 'center',
    marginBottom: 16,
  },
  appPickerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  appPickerLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    textAlign: 'center',
    lineHeight: 10,
    marginTop: 8,
  },
});

