import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';
import { playButtonTap } from '../services/soundService';

interface PalmButtonProps {
  title: string;
  onPress: () => void;
  theme?: Partial<PalmTheme>;
}

export const PalmButton: React.FC<PalmButtonProps> = ({ title, onPress, theme }) => {
  const pressAnim = useRef(new Animated.Value(0)).current;
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

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

  const handlePress = () => {
    playButtonTap();
    onPress();
  };

  const translateY = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const scale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  if (!fontsLoaded) {
    return null;
  }

  // Use theme properties or fallback to defaults
  const backgroundColor = theme?.gridBoxBackground || '#B8D87A';
  const borderColor = theme?.gridBoxBorder || '#1A2509';
  const textColor = theme?.iconText || '#2B3D0F';

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={0.6}
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        style={[
          styles.button,
          {
            backgroundColor: backgroundColor,
            // 3D effect: light top/left, dark bottom/right
            borderTopColor: '#E0F0C8',
            borderLeftColor: '#E0F0C8',
            borderRightColor: borderColor,
            borderBottomColor: borderColor,
          },
        ]}
      >
        <Text style={[styles.text, { color: textColor }]}>
          {title.toUpperCase()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
    height: 44,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    // 3D elevated effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  text: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
  },
});
