import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FavoriteButtons } from '../components/FavoriteButtons';
import { HeaderBar } from '../components/HeaderBar';
import { LCDStripeEffect } from '../components/LCDStripeEffect';
import { PALM_THEMES, Theme } from '../constants/palmThemes';
import { useTheme } from '../contexts/ThemeContext';
import { loadCoins, loadPet, loadPetsTheme, loadTasks } from '../services/storage';
import { Task } from '../types/Task';

type PetsTheme = 'serene' | 'purple-skies' | 'orange-kiss';

const PETS_THEMES = {
  'serene': {
    name: 'Serene',
    background: require('../../assets/pets/backgrounds/theme1.gif'),
    color: '#8B9B6A',
  },
  'purple-skies': {
    name: 'Purple Skies',
    background: require('../../assets/pets/backgrounds/theme2.gif'),
    color: '#9B7BA8',
  },
  'orange-kiss': {
    name: 'Orange Kiss',
    background: require('../../assets/pets/backgrounds/theme3.gif'),
    color: '#D4895C',
  },
};

interface Pet {
  type: string;
  name: string;
  health: number;
  lastFed: number;
  lastPet: number;
  createdAt?: number; // Timestamp of midnight on creation day
}

// Cat sit animation frames
const catSitFrames = [
  require('../../assets/pets/cat/catsit1.png'),
  require('../../assets/pets/cat/catsit2.png'),
  require('../../assets/pets/cat/catsit3.png'),
  require('../../assets/pets/cat/catsit4.png'),
];

export default function LauncherScreen() {
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [coins, setCoins] = useState(10);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentCatFrame, setCurrentCatFrame] = useState(0);
  const [petsTheme, setPetsTheme] = useState<PetsTheme>('serene');
  
  const { currentTheme, setTheme, currentMode, setMode, customModes } = useTheme();

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  // Load pet, coins, tasks, and pets theme on mount
  useEffect(() => {
    loadPet().then((savedPet) => {
      if (savedPet) {
        setPet(savedPet as Pet);
      }
    });
    loadCoins().then((savedCoins) => {
      setCoins(savedCoins);
    });
    loadTasks().then((loadedTasks) => {
      setTasks(loadedTasks);
    });
    loadPetsTheme().then((savedTheme) => {
      if (savedTheme) {
        setPetsTheme(savedTheme as PetsTheme);
      }
    });
  }, []);

  // Animate cat sit frames
  useEffect(() => {
    if (!pet || pet.health === 0) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentCatFrame((prev) => (prev + 1) % catSitFrames.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [pet]);

  // Calculate streak (days alive)
  const calculateStreak = (pet: Pet | null): number => {
    if (!pet || !pet.createdAt) {
      return 0;
    }
    
    // Get midnight of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    // Get midnight of creation day
    const creationDate = new Date(pet.createdAt);
    creationDate.setHours(0, 0, 0, 0);
    const creationTimestamp = creationDate.getTime();
    
    // Calculate days difference (including today)
    const daysDifference = Math.floor((todayTimestamp - creationTimestamp) / (24 * 60 * 60 * 1000));
    
    // Streak is days alive (including creation day), so add 1
    return Math.max(1, daysDifference + 1);
  };

  // Get today's tasks and overdue count
  const getTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(task => {
      if (task.completed) return false;
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
  };

  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(task => {
      if (task.completed) return false;
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
  };

  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();

  const handleViewTasks = () => {
    router.push('/tasks');
  };

  const handleFeed = () => {
    router.push('/pets');
  };

  const handlePet = () => {
    router.push('/pets');
  };

  const handlePlay = () => {
    router.push('/pets');
  };

  const getAllModes = (): string[] => {
    const defaultModes: string[] = ['Work', 'Study', 'Focus', 'Lazy'];
    const customModeNames = Object.keys(customModes);
    return [...defaultModes, ...customModeNames];
  };

  const allModes = getAllModes();

  const handleModeChange = (mode: string) => {
    if (mode === '+') return; // Handle custom mode creation elsewhere if needed
    setMode(mode);
  };

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
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

  const theme = PALM_THEMES[currentTheme];

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
        <View style={[styles.screen, { backgroundColor: theme.screenBackground }]}>
          {/* LCD RGB subpixel stripe pattern */}
          <LCDStripeEffect />

          {/* Header Bar */}
          <HeaderBar
            currentMode={currentMode}
            onModeChange={handleModeChange}
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
            theme={theme}
            allModes={allModes}
            customModes={Object.keys(customModes)}
            onEditMode={() => {}}
            maxModesReached={allModes.length >= 10}
          />

          {/* Content Area */}
          <View style={styles.contentArea}>
            {/* Card 1: Pet Status (Top 60%) */}
            <ImageBackground
              source={PETS_THEMES[petsTheme].background}
              style={[styles.petCard, { borderColor: PETS_THEMES[petsTheme].color }]}
              resizeMode="cover"
            >
              <View style={styles.petCardOverlay}>
                {pet ? (
                  <>
                    {/* Top Section: Pet Status */}
                    <View style={styles.petStatusTop}>
                      <Text style={[styles.cardTitle, { color: '#FFFFFF' }]}>PET STATUS</Text>
                      
                      {/* Cat Sprite */}
                      <View style={styles.petSpriteContainer}>
                        {pet.health === 0 ? (
                          <Image
                            source={require('../../assets/pets/cat/catdead.png')}
                            style={styles.petSprite}
                            resizeMode="contain"
                          />
                        ) : (
                          <Image
                            source={catSitFrames[currentCatFrame]}
                            style={styles.petSprite}
                            resizeMode="contain"
                          />
                        )}
                      </View>

                      {/* Pet Name */}
                      <Text style={[styles.petName, { color: '#FFFFFF' }]}>{pet.name}</Text>

                      {/* Health Hearts and Bar */}
                      <View style={styles.healthContainer}>
                        <Image
                          source={
                            pet.health === 5 ? require('../../assets/pets/health/heart5 .png') :
                            pet.health === 4 ? require('../../assets/pets/health/heart4.png') :
                            pet.health === 3 ? require('../../assets/pets/health/heart3.png') :
                            pet.health === 2 ? require('../../assets/pets/health/heart2.png') :
                            pet.health === 1 ? require('../../assets/pets/health/heart1.png') :
                            require('../../assets/pets/health/heart0.png')
                          }
                          style={styles.healthHeart}
                          resizeMode="contain"
                        />
                        <Image
                          source={
                            pet.health === 5 ? require('../../assets/pets/health/bar5.png') :
                            pet.health === 4 ? require('../../assets/pets/health/bar4.png') :
                            pet.health === 3 ? require('../../assets/pets/health/bar3.png') :
                            pet.health === 2 ? require('../../assets/pets/health/bar2.png') :
                            pet.health === 1 ? require('../../assets/pets/health/bar1.png') :
                            require('../../assets/pets/health/bar0.png')
                          }
                          style={styles.healthBar}
                          resizeMode="contain"
                        />
                      </View>

                      {/* Coin Count */}
                      <View style={styles.coinsContainer}>
                        <Image
                          source={require('../../assets/rewards/coins.png')}
                          style={styles.coinIcon}
                          resizeMode="contain"
                        />
                        <Text style={[styles.coinText, { color: '#FFFFFF' }]}>{coins} coins</Text>
                      </View>

                      {/* Streak Count */}
                      <View style={styles.streakContainer}>
                        <Image
                          source={require('../../assets/icons/streak.png')}
                          style={styles.streakIcon}
                          resizeMode="contain"
                        />
                        <Text style={[styles.streakText, { color: '#FFFFFF' }]}>
                          {calculateStreak(pet)} DAY{calculateStreak(pet) !== 1 ? 'S' : ''}
                        </Text>
                      </View>
                    </View>

                    {/* Bottom Section: Quick Actions */}
                    <View style={styles.petActionsBottom}>
                      <View style={styles.quickActions}>
                        <TouchableOpacity
                          onPress={handleFeed}
                          style={[styles.actionButton, { backgroundColor: PETS_THEMES[petsTheme].color, borderColor: '#FFFFFF' }]}
                        >
                          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>FEED</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handlePet}
                          style={[styles.actionButton, { backgroundColor: PETS_THEMES[petsTheme].color, borderColor: '#FFFFFF' }]}
                        >
                          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>PET</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handlePlay}
                          style={[styles.actionButton, { backgroundColor: PETS_THEMES[petsTheme].color, borderColor: '#FFFFFF' }]}
                        >
                          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>PLAY</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                ) : (
                <View style={styles.noPetContainer}>
                  <Text style={[styles.noPetText, { color: '#FFFFFF' }]}>NO PET</Text>
                  <TouchableOpacity
                    onPress={() => router.push('/pets')}
                    style={[styles.actionButton, { backgroundColor: PETS_THEMES[petsTheme].color, borderColor: '#FFFFFF' }]}
                  >
                    <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>CREATE PET</Text>
                  </TouchableOpacity>
                </View>
              )}
              </View>
            </ImageBackground>

            {/* Card 2: Task Summary (Bottom 40%) */}
            <View style={[styles.taskCard, { backgroundColor: theme.gridBoxBackground, borderColor: PETS_THEMES[petsTheme].color }]}>
              <Text style={[styles.cardTitle, { color: theme.iconText }]}>TODAY'S TASKS</Text>
              
              <Text style={[styles.taskCount, { color: theme.iconText }]}>
                {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''} due today
              </Text>

              {overdueTasks.length > 0 && (
                <View style={styles.overdueWarning}>
                  <Text style={styles.overdueText}>⚠️ {overdueTasks.length} overdue!</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleViewTasks}
                style={[styles.viewTasksButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
              >
                <Text style={[styles.viewTasksButtonText, { color: theme.modalText }]}>VIEW TASKS</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  contentArea: {
    flex: 1,
    padding: 12,
    gap: 12,
  },
  petCard: {
    flex: 0.6,
    borderWidth: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  petCardOverlay: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  petStatusTop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
  },
  petActionsBottom: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  taskCard: {
    flex: 0.4,
    borderWidth: 3,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    marginBottom: 16,
  },
  petSpriteContainer: {
    height: 80,
    width: 80,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petSprite: {
    width: 80,
    height: 80,
  },
  petName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    marginBottom: 16,
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  healthHeart: {
    width: 28,
    height: 28,
  },
  healthBar: {
    width: 65,
    height: 28,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  coinIcon: {
    width: 24,
    height: 24,
  },
  coinText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  streakIcon: {
    width: 24,
    height: 24,
  },
  streakText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  noPetContainer: {
    alignItems: 'center',
    gap: 16,
  },
  noPetText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
  },
  taskCount: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    marginBottom: 8,
  },
  overdueWarning: {
    marginBottom: 12,
  },
  overdueText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FF0000',
  },
  viewTasksButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 2,
    minWidth: 150,
    alignItems: 'center',
  },
  viewTasksButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
});
