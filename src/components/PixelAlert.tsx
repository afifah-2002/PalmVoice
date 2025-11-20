import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
              <React.Fragment key={index}>
                {index > 0 && <View style={{ width: 12 }} />}
                <AlertButton
                  text={button.text}
                  onPress={button.onPress}
                  style={button.style}
                  theme={theme}
                />
              </React.Fragment>
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
    paddingTop: 12,
  },
  button: {
    paddingVertical: 14,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // 3D elevated effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    textAlign: 'center',
  },
});

// Animated button component for alerts
const AlertButton = ({
  text,
  onPress,
  style,
  theme,
}: {
  text: string;
  onPress: () => void;
  style?: 'cancel' | 'destructive' | 'default';
  theme: PalmTheme;
}) => {
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const translateY = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const scale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  const isDestructive = style === 'destructive';
  const backgroundColor = isDestructive ? '#8B0000' : theme.headerBackground;
  const borderColor = isDestructive ? '#5A0000' : theme.headerBorder;
  const textColor = isDestructive ? '#FFFFFF' : theme.headerText;

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }, { scale }],
          flex: 1,
        },
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.6}
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        style={[
          styles.button,
          {
            backgroundColor: backgroundColor,
            // 3D effect: light top/left, dark bottom/right
            borderTopColor: isDestructive ? '#A00000' : '#E0F0C8',
            borderLeftColor: isDestructive ? '#A00000' : '#E0F0C8',
            borderRightColor: borderColor,
            borderBottomColor: borderColor,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
