import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { PALM_THEMES } from '../constants/palmThemes';

interface DailyRewardPopupProps {
  visible: boolean;
  onClose: () => void;
  coins: number;
}

export function DailyRewardPopup({ visible, onClose, coins }: DailyRewardPopupProps) {
  const { currentTheme } = useTheme();
  const theme = PALM_THEMES[currentTheme];
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const coinScaleAnim = useRef(new Animated.Value(0)).current;
  const coinRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      coinScaleAnim.setValue(0);
      coinRotateAnim.setValue(0);

      // Animate popup entrance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate coin with delay
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(coinScaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 5,
          }),
          Animated.sequence([
            Animated.timing(coinRotateAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(coinRotateAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, 300);
    }
  }, [visible]);

  if (!fontsLoaded) {
    return null;
  }

  const coinRotation = coinRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.modalBackground || '#1A1A1A',
                borderColor: theme.modalBorder || theme.color || '#8B9B6A',
              },
            ]}
          >
            {/* Title */}
            <Text style={[styles.title, { color: theme.modalText || '#FFFFFF' }]}>
              DAILY REWARD!
            </Text>

            {/* Subtitle */}
            <Text style={[styles.subtitle, { color: theme.color || '#8B9B6A' }]}>
              YOU'VE EARNED
            </Text>

            {/* Coin Display */}
            <View style={styles.coinContainer}>
              <Animated.View
                style={[
                  styles.coinWrapper,
                  {
                    transform: [
                      { scale: coinScaleAnim },
                      { rotate: coinRotation },
                    ],
                  },
                ]}
              >
                <Image
                  source={require('../../assets/rewards/coins.png')}
                  style={styles.coinImage}
                  resizeMode="contain"
                />
              </Animated.View>
              <Animated.View
                style={[
                  styles.coinTextContainer,
                  {
                    opacity: coinScaleAnim,
                    transform: [{ scale: coinScaleAnim }],
                  },
                ]}
              >
                <Text style={[styles.coinAmount, { color: theme.color || '#8B9B6A' }]}>
                  +1
                </Text>
                <Text style={[styles.coinLabel, { color: theme.modalText || '#FFFFFF' }]}>
                  COIN
                </Text>
              </Animated.View>
            </View>

            {/* Total Coins */}
            <View style={styles.totalCoinsContainer}>
              <Text style={[styles.totalCoinsLabel, { color: theme.modalText || '#FFFFFF' }]}>
                TOTAL: {coins} COINS
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: theme.headerBackground || '#3A3A3A',
                  borderColor: theme.modalBorder || theme.color || '#8B9B6A',
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeButtonText, { color: theme.headerText || '#FFFFFF' }]}>
                CLAIM
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: 16,
    borderWidth: 4,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 0,
    elevation: 12,
    // Pixelated 3D effect
    borderTopColor: '#E0F0C8',
    borderLeftColor: '#E0F0C8',
    borderBottomColor: '#2A2A2A',
    borderRightColor: '#2A2A2A',
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 24,
  },
  coinContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  coinWrapper: {
    marginBottom: 16,
  },
  coinImage: {
    width: 80,
    height: 80,
  },
  coinTextContainer: {
    alignItems: 'center',
  },
  coinAmount: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 24,
    marginBottom: 4,
  },
  coinLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
  },
  totalCoinsContainer: {
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  totalCoinsLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 3,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    // Pixelated 3D effect
    borderTopColor: '#E0F0C8',
    borderLeftColor: '#E0F0C8',
    borderBottomColor: '#2A2A2A',
    borderRightColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 6,
  },
  closeButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
  },
});

