import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';

interface PixelAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    onPress: () => void;
    style?: 'cancel' | 'destructive' | 'default';
  }>;
  theme: PalmTheme;
}

export function PixelAlert({
  visible,
  title,
  message,
  buttons,
  theme,
}: PixelAlertProps) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded || !visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        const cancelButton = buttons.find(b => b.style === 'cancel');
        if (cancelButton) {
          cancelButton.onPress();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertBox, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}>
          {/* Title */}
          <View style={[styles.titleBar, { backgroundColor: theme.modalHeaderBackground, borderBottomColor: theme.modalHeaderBorder }]}>
            <Text style={[styles.title, { color: theme.modalText }]}>{title}</Text>
          </View>

          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: theme.modalText }]}>{message}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.onPress}
                style={[
                  styles.button,
                  {
                    backgroundColor: button.style === 'destructive' ? '#8B0000' : theme.headerBackground,
                    borderColor: button.style === 'destructive' ? '#5A0000' : theme.headerBorder,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, { color: theme.headerText }]}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 3,
    overflow: 'hidden',
    // Pixelated shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 8,
  },
  titleBar: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  messageContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  message: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // Pixelated 3D effect
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    textAlign: 'center',
  },
});
