import * as Haptics from 'expo-haptics';
import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';
import { PixelIcon } from './PixelIcon';

interface AppIcon {
  label: string;
  route?: string;
}

interface AppIconSlotProps {
  app: AppIcon | null;
  rowIndex: number;
  colIndex: number;
  onPress: (app: AppIcon, rowIndex: number, colIndex: number) => void;
  onLongPress: (app: AppIcon, rowIndex: number, colIndex: number) => void;
  onEmptySlotPress: (rowIndex: number, colIndex: number) => void;
  theme: PalmTheme;
  isEditMode?: boolean;
  isSelected?: boolean;
  onDelete?: (rowIndex: number, colIndex: number) => void;
  onChangeIcon?: (rowIndex: number, colIndex: number) => void;
}

export function AppIconSlot({
  app,
  rowIndex,
  colIndex,
  onPress,
  onLongPress,
  onEmptySlotPress,
  theme,
  isEditMode = false,
  isSelected = false,
  onDelete,
  onChangeIcon,
}: AppIconSlotProps) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Shake animation when in edit mode
  useEffect(() => {
    if (isEditMode && app !== null) {
      const shake = Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]);
      Animated.loop(Animated.sequence([shake, Animated.delay(1000)])).start();
    } else {
      shakeAnimation.setValue(0);
    }
  }, [isEditMode, app, shakeAnimation]);

  if (!fontsLoaded) {
    return <View style={styles.appContainer} />;
  }

  if (app === null) {
    // Empty slot
    return (
      <TouchableOpacity
        style={styles.appContainer}
        onPress={() => onEmptySlotPress(rowIndex, colIndex)}
        activeOpacity={0.6}
      >
        <View style={[styles.emptyIconCircle, { backgroundColor: theme.emptySlotBackground, borderColor: theme.emptySlotBorder }]}>
          <Text style={[styles.addIcon, { color: theme.emptySlotText }]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Filled slot
  const animatedStyle = {
    transform: [{ translateX: shakeAnimation }],
  };

  return (
    <Animated.View style={[styles.appContainer, isEditMode && animatedStyle]}>
      <TouchableOpacity
        onPress={() => onPress(app, rowIndex, colIndex)}
        onLongPress={() => onLongPress(app, rowIndex, colIndex)}
        activeOpacity={0.6}
        style={styles.touchableArea}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.iconCircleBackground, borderColor: theme.iconCircleBorder },
            isSelected && styles.selectedIcon,
          ]}
        >
          <PixelIcon type={app.label} />
          {isEditMode && onDelete && (
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: theme.modalText }]}
              onPress={() => onDelete(rowIndex, colIndex)}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.appLabel, { color: theme.iconText }]}>{app.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    width: 90,
    alignItems: 'center',
    position: 'relative',
  },
  touchableArea: {
    alignItems: 'center',
  },
  selectedIcon: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  appLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    textAlign: 'center',
    lineHeight: 12,
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  addIcon: {
    fontSize: 36,
    fontWeight: 'bold',
  },
});

