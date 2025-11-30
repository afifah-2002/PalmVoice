import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../contexts/ThemeContext';
import { PALM_THEMES } from '../constants/palmThemes';
import {
  clearAllData,
  loadCoins,
  loadPet,
  loadPurchasedPets,
  loadSoundEnabled,
  loadNotificationsEnabled,
  loadTasks,
  saveSoundEnabled,
  saveNotificationsEnabled,
} from '../services/storage';
import { playButtonTap } from '../services/soundService';
import { updateNotificationSchedule } from '../services/notificationService';
import Constants from 'expo-constants';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
}

type MenuSection = 'menu' | 'stats' | 'about' | 'settings';

export function MenuModal({ visible, onClose }: MenuModalProps) {
  const { currentTheme } = useTheme();
  const theme = PALM_THEMES[currentTheme];
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const [currentSection, setCurrentSection] = useState<MenuSection>('menu');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [stats, setStats] = useState({
    totalTasksCompleted: 0,
    totalCoinsEarned: 0,
    longestStreak: 0,
    petsOwned: 0,
  });

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Load settings and stats when modal opens
  useEffect(() => {
    if (visible) {
      loadSettings();
      loadStats();
    }
  }, [visible]);

  const loadSettings = async () => {
    const sound = await loadSoundEnabled();
    const notifications = await loadNotificationsEnabled();
    setSoundEnabled(sound);
    setNotificationsEnabled(notifications);
  };

  const loadStats = async () => {
    try {
      const tasks = await loadTasks();
      const completedTasks = tasks.filter(t => t.completed).length;
      
      const coins = await loadCoins();
      
      // Calculate longest streak from pets
      const pets = await loadPurchasedPets();
      let longestStreak = 0;
      
      for (const petType of pets) {
        const pet = await loadPet(petType);
        if (pet && pet.health > 0) {
          // Calculate streak from originalCreatedAt or createdAt
          const creationTime = (pet as any).originalCreatedAt || pet.createdAt;
          if (creationTime) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = today.getTime();
            
            const creationDate = new Date(creationTime);
            creationDate.setHours(0, 0, 0, 0);
            const creationTimestamp = creationDate.getTime();
            
            const daysDifference = Math.floor((todayTimestamp - creationTimestamp) / (24 * 60 * 60 * 1000));
            const streak = Math.max(1, daysDifference + 1);
            
            if (streak > longestStreak) {
              longestStreak = streak;
            }
          }
        }
      }
      
      setStats({
        totalTasksCompleted: completedTasks,
        totalCoinsEarned: coins,
        longestStreak: longestStreak,
        petsOwned: pets.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      setCurrentSection('menu');
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
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Helper function to play keyboard clack sound
  const playClickSound = async () => {
    if (soundEnabled) {
      try {
        await playButtonTap();
      } catch (error) {
        // Silently fail
      }
    }
  };

  const handleToggleSound = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    await saveSoundEnabled(newValue);
    // Play sound even when toggling (before it's saved)
    if (newValue) {
      await playButtonTap();
    }
  };

  const handleToggleNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await playClickSound();
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await saveNotificationsEnabled(newValue);
    // Update notification schedule
    await updateNotificationSchedule();
  };

  const handleClearAllData = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await playClickSound();
    try {
      await clearAllData();
      // Reset stats
      setStats({
        totalTasksCompleted: 0,
        totalCoinsEarned: 0,
        longestStreak: 0,
        petsOwned: 0,
      });
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: theme.modalBackground || '#1A1A1A',
                  borderColor: theme.modalBorder || theme.color || '#8B9B6A',
                },
              ]}
            >
              {/* Close Button */}
              <TouchableOpacity
                onPress={async () => {
                  await playClickSound();
                  onClose();
                }}
                style={[
                  styles.closeButton,
                  {
                    borderColor: theme.modalBorder || theme.color || '#8B9B6A',
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.closeButtonText, { color: theme.modalText || '#FFFFFF' }]}>
                  ✕
                </Text>
              </TouchableOpacity>

              {/* Back Button (when not on menu) */}
              {currentSection !== 'menu' && (
                <TouchableOpacity
                  onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    await playClickSound();
                    setCurrentSection('menu');
                  }}
                  style={[
                    styles.backButton,
                    {
                      borderColor: theme.modalBorder || theme.color || '#8B9B6A',
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.backButtonText, { color: theme.modalText || '#FFFFFF' }]}>
                    ←
                  </Text>
                </TouchableOpacity>
              )}

              {/* Title */}
              <Text style={[styles.title, { color: theme.modalText || '#FFFFFF' }]}>
                {currentSection === 'menu' ? 'MENU' : currentSection.toUpperCase()}
              </Text>

              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {currentSection === 'menu' && (
                  <View style={styles.buttonsContainer}>
                    <MenuButton
                      label="STATS"
                      onPress={async () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        await playClickSound();
                        setCurrentSection('stats');
                      }}
                      theme={theme}
                    />
                    <MenuButton
                      label="ABOUT"
                      onPress={async () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        await playClickSound();
                        setCurrentSection('about');
                      }}
                      theme={theme}
                    />
                    <MenuButton
                      label="SETTINGS"
                      onPress={async () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        await playClickSound();
                        setCurrentSection('settings');
                      }}
                      theme={theme}
                    />
                  </View>
                )}

                {currentSection === 'stats' && (
                  <View style={styles.statsContainer}>
                    <StatRow label="TASKS COMPLETED" value={stats.totalTasksCompleted.toString()} theme={theme} />
                    <StatRow label="COINS EARNED" value={stats.totalCoinsEarned.toString()} theme={theme} />
                    <StatRow label="LONGEST STREAK" value={`${stats.longestStreak} DAYS`} theme={theme} />
                    <StatRow label="PETS OWNED" value={stats.petsOwned.toString()} theme={theme} />
                  </View>
                )}

                {currentSection === 'about' && (
                  <View style={styles.aboutContainer}>
                    <AboutSection label="APP VERSION" value={appVersion} theme={theme} />
                    <AboutSection
                      label="CREDITS"
                      value="PALMVOICE\nCREATED WITH 💗\nRETRO\nINSPIRED"
                      theme={theme}
                    />
                    <AboutSection
                      label="HOW TO PLAY"
                      value="• COMPLETE TASKS TO EARN COINS\n• FEED, PET, AND PLAY WITH YOUR PETS\n• KEEP YOUR PETS HEALTHY\n• COLLECT THEMES AND PETS\n• BUILD YOUR STREAK!"
                      theme={theme}
                    />
                  </View>
                )}

                {currentSection === 'settings' && (
                  <View style={styles.settingsContainer}>
                    <ToggleSetting
                      label="SOUND"
                      value={soundEnabled}
                      onToggle={handleToggleSound}
                      theme={theme}
                    />
                    <ToggleSetting
                      label="NOTIFICATIONS"
                      value={notificationsEnabled}
                      onToggle={handleToggleNotifications}
                      theme={theme}
                    />
                    <ClearDataButton onPress={handleClearAllData} theme={theme} />
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

// Menu Button Component
const MenuButton = ({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void;
  theme: any;
}) => {
  const [pressed, setPressed] = useState(false);
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPressed(true);
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const translateY = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const scale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }, { scale }],
          marginBottom: 16,
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.buttonWrapper}
      >
        <View
          style={[
            styles.menuButton,
            {
              backgroundColor: pressed ? '#2A2A2A' : (theme.headerBackground || '#3A3A3A'),
              borderTopColor: pressed ? '#2A2A2A' : '#E0F0C8',
              borderLeftColor: pressed ? '#2A2A2A' : '#E0F0C8',
              borderBottomColor: pressed ? '#5A5A5A' : '#2A2A2A',
              borderRightColor: pressed ? '#5A5A5A' : '#2A2A2A',
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.headerText || '#FFFFFF' }]}>
            {label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Stat Row Component
const StatRow = ({ label, value, theme }: { label: string; value: string; theme: any }) => (
  <View style={styles.statRow}>
    <Text style={[styles.statLabel, { color: theme.modalText || '#FFFFFF' }]}>{label}</Text>
    <Text style={[styles.statValue, { color: theme.color || '#8B9B6A' }]}>{value}</Text>
  </View>
);

// About Section Component
const AboutSection = ({ label, value, theme }: { label: string; value: string; theme: any }) => {
  const lines = value.split('\n').filter(line => line.trim() !== '');
  return (
    <View style={styles.aboutSection}>
      <Text style={[styles.aboutLabel, { color: theme.color || '#8B9B6A' }]}>{label}</Text>
      <View style={styles.aboutValueContainer}>
        {lines.map((line, index) => (
          <Text key={index} style={[styles.aboutValue, { color: theme.modalText || '#FFFFFF' }]}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
};

// Toggle Setting Component
const ToggleSetting = ({
  label,
  value,
  onToggle,
  theme,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  theme: any;
}) => {
  const [pressed, setPressed] = useState(false);
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
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
    outputRange: [1, 0.97],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }, { scale }],
          marginBottom: 16,
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onToggle}
        style={styles.toggleWrapper}
      >
        <View
          style={[
            styles.toggleContainer,
            {
              backgroundColor: pressed ? '#2A2A2A' : (theme.headerBackground || '#3A3A3A'),
              borderTopColor: pressed ? '#2A2A2A' : '#E0F0C8',
              borderLeftColor: pressed ? '#2A2A2A' : '#E0F0C8',
              borderBottomColor: pressed ? '#5A5A5A' : '#2A2A2A',
              borderRightColor: pressed ? '#5A5A5A' : '#2A2A2A',
            },
          ]}
        >
          <Text style={[styles.toggleLabel, { color: theme.modalText || '#FFFFFF' }]}>{label}</Text>
          <View
            style={[
              styles.toggleSwitch,
              {
                backgroundColor: value ? (theme.color || '#8B9B6A') : '#5A5A5A',
              },
            ]}
          >
            <Text style={[styles.toggleText, { color: '#FFFFFF' }]}>
              {value ? 'ON' : 'OFF'}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Clear Data Button Component
const ClearDataButton = ({ onPress, theme }: { onPress: () => void; theme: any }) => {
  const [pressed, setPressed] = useState(false);
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const translateY = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const scale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }, { scale }],
          marginTop: 8,
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.buttonWrapper}
      >
        <View
          style={[
            styles.clearDataButton,
            {
              backgroundColor: pressed ? '#5A0000' : '#8B0000',
              borderTopColor: pressed ? '#5A0000' : '#A00000',
              borderLeftColor: pressed ? '#5A0000' : '#A00000',
              borderBottomColor: pressed ? '#3A0000' : '#5A0000',
              borderRightColor: pressed ? '#3A0000' : '#5A0000',
            },
          ]}
        >
          <Text style={[styles.clearDataText, { color: '#FFFFFF' }]}>CLEAR ALL DATA</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalContent: {
    borderRadius: 12,
    borderWidth: 3,
    padding: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopColor: '#6A6A6A',
    borderLeftColor: '#6A6A6A',
    borderBottomColor: '#2A2A2A',
    borderRightColor: '#2A2A2A',
    zIndex: 10,
  },
  closeButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    lineHeight: 20,
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopColor: '#6A6A6A',
    borderLeftColor: '#6A6A6A',
    borderBottomColor: '#2A2A2A',
    borderRightColor: '#2A2A2A',
    zIndex: 10,
  },
  backButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    lineHeight: 20,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  scrollView: {
    maxHeight: 400,
  },
  buttonsContainer: {
    gap: 0,
  },
  buttonWrapper: {
    width: '100%',
  },
  menuButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  statsContainer: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    flex: 1,
  },
  statValue: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
  },
  aboutContainer: {
    gap: 20,
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    marginBottom: 8,
  },
  aboutValueContainer: {
    gap: 4,
  },
  aboutValue: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    lineHeight: 12,
  },
  settingsContainer: {
    gap: 0,
  },
  toggleWrapper: {
    width: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },
  toggleLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  toggleSwitch: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  toggleText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  clearDataButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  },
  clearDataText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    textAlign: 'center',
  },
});
