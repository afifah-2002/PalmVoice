import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FavoriteButtons } from '../components/FavoriteButtons';
import { PixelKeyboard } from '../components/PixelKeyboard';
import { PALM_THEMES, PalmTheme } from '../constants/palmThemes';
import { useTheme } from '../contexts/ThemeContext';
import { loadCoins, loadPet, loadPetsTheme, saveCoins, savePet, savePetsTheme } from '../services/storage';

type PetsTheme = 'serene' | 'purple-skies' | 'orange-kiss';
type PetType = 'none' | 'cat' | 'panda' | 'penguin';
type PetStatus = 'happy' | 'hungry' | 'sad' | 'dead' | 'sleeping';

interface Pet {
  type: PetType;
  name: string;
  health: number;
  lastFed: number;
  lastPet: number;
  lastPlay?: number; // Timestamp of last play action
  createdAt?: number; // Timestamp of midnight on creation day
}

const PETS_THEMES = {
  'serene': {
    name: 'Serene',
    background: require('../../assets/pets/backgrounds/theme1.gif'),
    color: '#8B9B6A', // Greenish to match serene nature theme
  },
  'purple-skies': {
    name: 'Purple Skies',
    background: require('../../assets/pets/backgrounds/theme2.gif'),
    color: '#9B7BA8', // Purple to match purple skies
  },
  'orange-kiss': {
    name: 'Orange Kiss',
    background: require('../../assets/pets/backgrounds/theme3.gif'),
    color: '#D4895C', // Orange to match orange kiss
  },
};

export function PetsScreen() {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const { currentTheme } = useTheme();
  const theme = PALM_THEMES[currentTheme];
  const [petsTheme, setPetsTheme] = useState<PetsTheme>('serene');

  // Create custom keyboard theme based on pets theme color
  const getKeyboardTheme = (): PalmTheme => {
    const petsColor = PETS_THEMES[petsTheme].color;
    // Create a theme that matches the pets page color scheme
    return {
      ...theme,
      screenBackground: petsColor,
      headerBackground: petsColor,
      headerBorder: petsColor,
      headerText: '#FFFFFF',
      gridBoxBackground: petsColor,
      gridBoxBorder: petsColor,
      modalBackground: petsColor,
      modalHeaderBackground: petsColor,
      modalBorder: petsColor,
      modalHeaderBorder: petsColor,
      modalText: '#FFFFFF',
      dropdownBackground: petsColor,
      dropdownBorder: petsColor,
      iconText: '#FFFFFF',
    };
  };
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [petName, setPetName] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showFullHealthAlert, setShowFullHealthAlert] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [currentCatFrame, setCurrentCatFrame] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState<'feed' | 'pet' | 'play' | null>(null);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [showRevivePopup, setShowRevivePopup] = useState(false);
  const revivePulseAnim = useRef(new Animated.Value(1)).current;
  const [hungryAnimationFrame, setHungryAnimationFrame] = useState(0);
  const [sadAnimationFrame, setSadAnimationFrame] = useState(0);
  const [coins, setCoins] = useState(10);
  const [showCoinsPopup, setShowCoinsPopup] = useState(false);
  const coinsPulseAnim = useRef(new Animated.Value(1)).current;
  const [showTryAgainPopup, setShowTryAgainPopup] = useState(false);
  const [tryAgainActionType, setTryAgainActionType] = useState<'feed' | 'pet' | 'play' | null>(null);
  const tryAgainPulseAnim = useRef(new Animated.Value(1)).current;
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');
  
  // Game state
  const [showGame, setShowGame] = useState(false);
  const [fruits, setFruits] = useState<Array<{ id: string; type: string; x: number; animValue: Animated.Value }>>([]);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fruitSpawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fruit types and images
  const fruitTypes = ['strawberry', 'orange', 'banana', 'apple'];
  const fruitImages = {
    strawberry: require('../../assets/icons/strawberry.png'),
    orange: require('../../assets/icons/orange.png'),
    banana: require('../../assets/icons/banana.png'),
    apple: require('../../assets/icons/apple.png'),
  };
  
  // Cat sit animation frames
  const catSitFrames = [
    require('../../assets/pets/cat/catsit1.png'),
    require('../../assets/pets/cat/catsit2.png'),
    require('../../assets/pets/cat/catsit3.png'),
    require('../../assets/pets/cat/catsit4.png'),
  ];

  // Feed animation frames (catbowl)
  const catBowlFrames = [
    require('../../assets/pets/cat/catbowl1.png'),
    require('../../assets/pets/cat/catbowl2.png'),
    require('../../assets/pets/cat/catbowl3.png'),
  ];

  // Pet animation frames (happycat)
  const happyCatFrames = [
    require('../../assets/pets/cat/happycat1.png'),
    require('../../assets/pets/cat/happycat2.png'),
    require('../../assets/pets/cat/happycat3.png'),
    require('../../assets/pets/cat/happycat4.png'),
  ];

  // Play animation frames (playcat)
  const playCatFrames = [
    require('../../assets/pets/cat/playcat1.png'),
    require('../../assets/pets/cat/playcat2.png'),
    require('../../assets/pets/cat/playcat3.png'),
  ];

  // Hungry animation frames (hungrycat)
  const hungryCatFrames = [
    require('../../assets/pets/cat/hungrycat1.png'),
    require('../../assets/pets/cat/hungrycat2.png'),
    require('../../assets/pets/cat/hungrycat3.png'),
  ];

  // Sad animation frames (sadcat)
  const sadCatFrames = [
    require('../../assets/pets/cat/sadcat1.png'),
    require('../../assets/pets/cat/sadcat2.png'),
  ];

  // Load saved pets theme and pet data on mount
  useEffect(() => {
    loadPetsTheme().then((savedTheme) => {
      if (savedTheme) {
        setPetsTheme(savedTheme as PetsTheme);
      }
    });
    loadPet().then((savedPet) => {
      if (savedPet) {
        // Backward compatibility: if pet doesn't have createdAt, set it to midnight of today
        if (!savedPet.createdAt) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const midnightTimestamp = today.getTime();
          const updatedPet = {
            ...savedPet,
            createdAt: midnightTimestamp,
          };
          setPet(updatedPet);
          savePet(updatedPet);
        } else {
          setPet(savedPet as Pet);
        }
      }
    });
    loadCoins().then((savedCoins) => {
      setCoins(savedCoins);
      // Ensure coins are saved (in case it's the first time)
      saveCoins(savedCoins);
    });
  }, []);

  // Save pets theme when it changes
  useEffect(() => {
    savePetsTheme(petsTheme);
  }, [petsTheme]);

  // Get midnight timestamp of today
  const getTodayMidnight = (): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  };

  // Check if an action was already done today (since midnight)
  const wasActionDoneToday = (lastActionTimestamp: number | undefined): boolean => {
    if (!lastActionTimestamp) {
      return false; // Never done
    }
    const todayMidnight = getTodayMidnight();
    return lastActionTimestamp >= todayMidnight; // Action was done today
  };

  // Calculate time remaining until midnight
  const getTimeUntilMidnight = (): string => {
    const now = Date.now();
    const todayMidnight = getTodayMidnight();
    const tomorrowMidnight = todayMidnight + (24 * 60 * 60 * 1000); // Add 24 hours
    const timeRemaining = tomorrowMidnight - now;
    
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Calculate health based on time elapsed since midnight of creation day
  // 1 heart per 4.8 hours = 17,280,000 milliseconds
  const calculateHealthFromTime = (pet: Pet): number => {
    if (!pet.createdAt) {
      // For backward compatibility, if createdAt doesn't exist, return current health
      return pet.health;
    }
    
    const now = Date.now();
    const elapsedTime = now - pet.createdAt;
    const hoursPerHeart = 4.8;
    const millisecondsPerHeart = hoursPerHeart * 60 * 60 * 1000; // 17,280,000 ms
    
    const heartsLost = Math.floor(elapsedTime / millisecondsPerHeart);
    const calculatedHealth = Math.max(0, 5 - heartsLost);
    
    return calculatedHealth;
  };

  // Update health based on time elapsed (check every minute)
  useEffect(() => {
    if (!pet) {
      return;
    }

    const updateHealth = () => {
      setPet((currentPet) => {
        if (!currentPet) {
          return currentPet;
        }
        
        const calculatedHealth = calculateHealthFromTime(currentPet);
        
        // TEMPORARILY DISABLED FOR TESTING - allow manual health increases to persist
        // Update health based on time calculation
        // If current health is above calculated (from actions), reduce it to calculated
        // If current health is below calculated (shouldn't happen, but handle it), set to calculated
        let newHealth = currentPet.health;
        
        // TEMPORARILY DISABLED: Don't reduce health if above calculated (manual increases should persist)
        // if (currentPet.health > calculatedHealth) {
        //   // Health was increased by actions, but time has passed - reduce it
        //   newHealth = calculatedHealth;
        // }
        
        // Only increase health if it's below calculated (shouldn't happen normally)
        if (currentPet.health < calculatedHealth) {
          // Health is below calculated (shouldn't happen normally), set to calculated
          newHealth = calculatedHealth;
        }
        
        // Only update if health changed
        if (newHealth !== currentPet.health) {
          const updatedPet = {
            ...currentPet,
            health: newHealth,
          };
          savePet(updatedPet); // Save to storage
          return updatedPet;
        }
        
        return currentPet;
      });
    };

    // Update immediately
    updateHealth();

    // Then update every minute
    const healthUpdateInterval = setInterval(updateHealth, 60000); // Every 1 minute

    return () => clearInterval(healthUpdateInterval);
  }, [pet]);


  // Auto-close coins popup after 3 seconds
  useEffect(() => {
    if (showCoinsPopup) {
      const timeout = setTimeout(() => {
        setShowCoinsPopup(false);
      }, 3000);
      
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showCoinsPopup]);

  // Update time for try again popup
  useEffect(() => {
    if (showTryAgainPopup) {
      // Update time immediately
      setTimeUntilMidnight(getTimeUntilMidnight());
      
      // Update time every second
      const timeInterval = setInterval(() => {
        setTimeUntilMidnight(getTimeUntilMidnight());
      }, 1000);

      // Auto-close after 5 seconds
      const timeout = setTimeout(() => {
        setShowTryAgainPopup(false);
        setTryAgainActionType(null);
      }, 5000);

      return () => {
        clearInterval(timeInterval);
        clearTimeout(timeout);
      };
    }
  }, [showTryAgainPopup]);

  // Animate cat sit frames (when no active animation and cat is alive)
  useEffect(() => {
    if (!pet || activeAnimation !== null || pet.health === 0) {
      setCurrentCatFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentCatFrame((prev) => (prev + 1) % catSitFrames.length);
    }, 1000); // 1 second interval

    return () => clearInterval(interval);
  }, [pet, activeAnimation]);

  // Animate hungry cat when health is 2 (but not 1)
  useEffect(() => {
    if (!pet || activeAnimation !== null || pet.health === 0 || pet.health !== 2) {
      setHungryAnimationFrame(0);
      return;
    }

    // Continuously loop through hungry cat frames (1 second per frame)
    const hungryInterval = setInterval(() => {
      setHungryAnimationFrame((prev) => (prev + 1) % hungryCatFrames.length);
    }, 1000); // 1 second per frame

    return () => clearInterval(hungryInterval);
  }, [pet, activeAnimation]);

  // Animate sad cat when health is 1 (continuously loop)
  useEffect(() => {
    if (!pet || activeAnimation !== null || pet.health !== 1) {
      setSadAnimationFrame(0);
      return;
    }

    // Continuously loop through sad cat frames (1 second per frame)
    const sadInterval = setInterval(() => {
      setSadAnimationFrame((prev) => (prev + 1) % sadCatFrames.length);
    }, 1000); // 1 second per frame

    return () => clearInterval(sadInterval);
  }, [pet, activeAnimation]);

  // Cleanup game intervals on unmount
  useEffect(() => {
    return () => {
      if (fruitSpawnIntervalRef.current) {
        clearInterval(fruitSpawnIntervalRef.current);
      }
      if (gameTimerRef.current) {
        clearTimeout(gameTimerRef.current);
      }
    };
  }, []);

  // Handle active animations
  useEffect(() => {
    if (activeAnimation === null) {
      setAnimationFrame(0);
      return;
    }

    let frames: any[];
    let duration: number;
    
    if (activeAnimation === 'feed') {
      frames = catBowlFrames;
      duration = 9000; // 9 seconds
    } else if (activeAnimation === 'pet') {
      frames = happyCatFrames;
      duration = 12000; // 12 seconds
    } else {
      frames = playCatFrames;
      duration = 9000; // 9 seconds
    }

    const frameInterval = setInterval(() => {
      setAnimationFrame((prev) => (prev + 1) % frames.length);
    }, 1000); // 1 second per frame

    const timeout = setTimeout(() => {
      setActiveAnimation(null);
      setAnimationFrame(0);
    }, duration);

    return () => {
      clearInterval(frameInterval);
      clearTimeout(timeout);
    };
  }, [activeAnimation]);

  const handleThemeSelect = (selectedTheme: PetsTheme) => {
    setPetsTheme(selectedTheme);
    setShowThemeDropdown(false);
  };

  const handlePetSelect = (petType: PetType) => {
    if (petType === 'none') {
      setPet(null);
      savePet(null); // Clear from storage
      setShowPetDropdown(false);
    } else if (petType === 'cat') {
      setShowPetDropdown(false);
      setShowNameModal(true);
      // Auto-show keyboard when modal opens
      setTimeout(() => setShowKeyboard(true), 100);
    }
    // Panda and Penguin are disabled (coming soon)
  };

  const handleNameSubmit = () => {
    if (petName.trim()) {
      // Get midnight of today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const midnightTimestamp = today.getTime();
      
      const newPet: Pet = {
        type: 'cat',
        name: petName.trim().replace(/\s+/g, '').toUpperCase(), // Remove all spaces
        health: 5,
        lastFed: 0, // Initialize to 0 (before today's midnight) so action can be done
        lastPet: 0, // Initialize to 0 (before today's midnight) so action can be done
        lastPlay: 0, // Initialize to 0 (before today's midnight) so action can be done
        createdAt: midnightTimestamp, // Set to midnight of creation day
      };
      setPet(newPet);
      savePet(newPet); // Save to storage
      setShowNameModal(false);
      setPetName('');
    }
  };

  const handleRenameSubmit = () => {
    if (renameInput.trim() && pet) {
      const renamedPet: Pet = {
        ...pet,
        name: renameInput.trim().replace(/\s+/g, '').toUpperCase(), // Remove all spaces
      };
      setPet(renamedPet);
      savePet(renamedPet); // Save to storage
      setShowRenameModal(false);
      setRenameInput('');
      setShowKeyboard(false);
    }
  };

  const handleFeed = () => {
    if (pet) {
      if (pet.health === 0) {
        // Show revive popup if cat is dead
        setShowRevivePopup(true);
      } else if (pet.health >= 5) {
        // Health is already full
        setShowFullHealthAlert(true);
      } else if (pet.health > 0 && pet.health < 5) {
        // Check if feed was already done today
        if (wasActionDoneToday(pet.lastFed)) {
          setTryAgainActionType('feed');
          setShowTryAgainPopup(true);
          return; // Already fed today, show popup
        }
        
        setActiveAnimation('feed');
        const newHealth = Math.min(5, pet.health + 1); // Cap at 5
        const updatedPet: Pet = {
          type: pet.type,
          name: pet.name,
          health: newHealth,
          lastFed: Date.now(),
          lastPet: pet.lastPet,
          lastPlay: pet.lastPlay,
          createdAt: pet.createdAt,
        };
        setPet(updatedPet);
        savePet(updatedPet); // Save to storage
        console.log('Fed pet, new health:', updatedPet.health);
      }
    }
  };

  const handlePet = () => {
    if (pet) {
      if (pet.health === 0) {
        // Show revive popup if cat is dead
        setShowRevivePopup(true);
      } else if (pet.health >= 5) {
        // Health is already full
        setShowFullHealthAlert(true);
      } else if (pet.health > 0 && pet.health < 5) {
        // Check if pet was already done today
        if (wasActionDoneToday(pet.lastPet)) {
          setTryAgainActionType('pet');
          setShowTryAgainPopup(true);
          return; // Already petted today, show popup
        }
        
        setActiveAnimation('pet');
        const newHealth = Math.min(5, pet.health + 1); // Cap at 5
        const updatedPet: Pet = {
          type: pet.type,
          name: pet.name,
          health: newHealth,
          lastFed: pet.lastFed,
          lastPet: Date.now(),
          lastPlay: pet.lastPlay,
          createdAt: pet.createdAt,
        };
        setPet(updatedPet);
        savePet(updatedPet); // Save to storage
        console.log('Pet pet, new health:', updatedPet.health);
      }
    }
  };

  const handlePlay = () => {
    if (pet) {
      if (pet.health === 0) {
        // Show revive popup if cat is dead
        setShowRevivePopup(true);
      } else if (pet.health >= 5) {
        // Health is already full
        setShowFullHealthAlert(true);
      } else if (pet.health > 0 && pet.health < 5) {
        // Check if play was already done today
        if (wasActionDoneToday(pet.lastPlay)) {
          setTryAgainActionType('play');
          setShowTryAgainPopup(true);
          return; // Already played today, show popup
        }
        
        setActiveAnimation('play');
        const newHealth = Math.min(5, pet.health + 1); // Cap at 5
        const updatedPet: Pet = {
          type: pet.type,
          name: pet.name,
          health: newHealth,
          lastFed: pet.lastFed,
          lastPet: pet.lastPet,
          lastPlay: Date.now(),
          createdAt: pet.createdAt,
        };
        setPet(updatedPet);
        savePet(updatedPet); // Save to storage
        console.log('Played with pet, new health:', updatedPet.health);
      }
    }
  };

  const handleRevive = () => {
    if (pet && coins >= 5) {
      // Deduct 5 coins
      const newCoins = coins - 5;
      setCoins(newCoins);
      saveCoins(newCoins);
      
      // Get midnight of today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const midnightTimestamp = today.getTime();
      
      // Revive the pet - reset createdAt to midnight of current day
      // Reset action timestamps to 0 so actions can be done again today
      const revivedPet = {
        ...pet,
        health: 5,
        lastFed: 0, // Reset to 0 (before today's midnight) so action can be done
        lastPet: 0, // Reset to 0 (before today's midnight) so action can be done
        lastPlay: 0, // Reset to 0 (before today's midnight) so action can be done
        createdAt: midnightTimestamp, // Reset to midnight of current day
      };
      setPet(revivedPet);
      savePet(revivedPet);
      setShowRevivePopup(false);
      setActiveAnimation(null); // Reset animation to show catsit
    }
  };

  const startGame = () => {
    setShowRevivePopup(false); // Close revive popup when game starts
    setShowGame(true);
    setFruits([]);
    
    // Spawn fruits at random intervals
    fruitSpawnIntervalRef.current = setInterval(() => {
      const fruitType = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
      const x = Math.random() * (300 - 50) + 25; // Random x position (accounting for fruit size ~50px)
      const animValue = new Animated.Value(0);
      
      const newFruit = {
        id: `${Date.now()}-${Math.random()}`,
        type: fruitType,
        x,
        animValue,
      };
      
      setFruits((prev) => [...prev, newFruit]);
      
      // Animate fruit falling
      Animated.timing(animValue, {
        toValue: 600, // Fall to bottom of screen
        duration: 5000, // 5 seconds
        useNativeDriver: true,
      }).start(() => {
        // Remove fruit when it reaches bottom
        setFruits((prev) => prev.filter((f) => f.id !== newFruit.id));
      });
    }, 800); // Spawn a new fruit every 800ms
    
    // End game after 20 seconds
    gameTimerRef.current = setTimeout(() => {
      endGame();
    }, 20000);
  };

  const endGame = () => {
    if (fruitSpawnIntervalRef.current) {
      clearInterval(fruitSpawnIntervalRef.current);
      fruitSpawnIntervalRef.current = null;
    }
    if (gameTimerRef.current) {
      clearTimeout(gameTimerRef.current);
      gameTimerRef.current = null;
    }
    setShowGame(false);
    setFruits([]);
    
    // Reopen revive popup if still not enough coins
    if (pet && pet.health === 0 && coins < 5) {
      setShowRevivePopup(true);
    }
  };

  const handleFruitTap = (fruitId: string) => {
    // Add 1 coin
    const newCoins = coins + 1;
    setCoins(newCoins);
    saveCoins(newCoins);
    
    // Remove fruit
    setFruits((prev) => prev.filter((f) => f.id !== fruitId));
  };

  const canFeed = () => {
    if (!pet) return false;
    const hoursSinceLastFeed = (Date.now() - pet.lastFed) / (1000 * 60 * 60);
    return hoursSinceLastFeed >= 1;
  };

  const canPet = () => {
    if (!pet) return false;
    const minutesSinceLastPet = (Date.now() - pet.lastPet) / (1000 * 60);
    return minutesSinceLastPet >= 30;
  };

  const getPetStatus = (): PetStatus => {
    if (!pet) return 'happy';
    if (pet.health === 0) return 'dead';
    
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) return 'sleeping';
    
    const hoursSinceLastFeed = (Date.now() - pet.lastFed) / (1000 * 60 * 60);
    if (hoursSinceLastFeed > 3) return 'hungry';
    if (pet.health < 3) return 'sad';
    
    return 'happy';
  };

  const getStatusDisplay = () => {
    const status = getPetStatus();
    switch (status) {
      case 'happy': return { text: '😊 HAPPY', color: '#00FF00' };
      case 'hungry': return { text: '😋 HUNGRY', color: '#FFFF00' };
      case 'sad': return { text: '😢 SAD', color: '#FF8800' };
      case 'dead': return { text: '💀 DEAD', color: '#FF0000' };
      case 'sleeping': return { text: '💤 SLEEPING', color: '#4444FF' };
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.outerContainer}>
      {/* Bezel with Palm Pilot branding */}
      <View style={styles.bezel}>
        <View style={styles.bezelTop}>
          {/* Palm Pilot branding */}
          <Text style={styles.palmPilotText}>Palm Pilot</Text>
          <View style={styles.logo3Com}>
            <Text style={styles.logo3ComText}>3Com</Text>
          </View>
        </View>

        {/* Screen with GIF */}
        <View style={styles.screen}>
          <Image
            source={PETS_THEMES[petsTheme].background}
            style={styles.backgroundGif}
            resizeMode="cover"
          />
          
          {/* Top Bar with Dropdowns and Health Bar */}
          <View style={styles.topBar}>
            {/* Theme Selector Dropdown */}
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                onPress={() => {
                  setShowThemeDropdown(!showThemeDropdown);
                  setShowPetDropdown(false);
                }}
                style={[
                  styles.dropdownButton, 
                  { 
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: PETS_THEMES[petsTheme].color
                  }
                ]}
              >
                <Text style={[styles.dropdownLabel, { color: PETS_THEMES[petsTheme].color }]}>
                  {PETS_THEMES[petsTheme].name}
                </Text>
                <Text style={[styles.dropdownArrow, { color: PETS_THEMES[petsTheme].color }]}>▼</Text>
              </TouchableOpacity>

              {showThemeDropdown && (
                <View style={[styles.dropdownMenu, { backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: PETS_THEMES[petsTheme].color }]}>
                  {(Object.keys(PETS_THEMES) as PetsTheme[]).map((themeKey) => (
                    <TouchableOpacity
                      key={themeKey}
                      onPress={() => handleThemeSelect(themeKey)}
                      style={[
                        styles.dropdownOption,
                        { 
                          backgroundColor: petsTheme === themeKey ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                          borderBottomColor: 'rgba(255, 255, 255, 0.2)'
                        }
                      ]}
                    >
                      <View style={[styles.colorIndicator, { backgroundColor: PETS_THEMES[themeKey].color }]} />
                      <Text style={[styles.dropdownOptionText, { color: PETS_THEMES[themeKey].color }]}>
                        {PETS_THEMES[themeKey].name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Pet Selector Dropdown */}
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                onPress={() => {
                  setShowPetDropdown(!showPetDropdown);
                  setShowThemeDropdown(false);
                }}
                style={[
                  styles.dropdownButton, 
                  { 
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: PETS_THEMES[petsTheme].color
                  }
                ]}
              >
                <Text style={[styles.dropdownLabel, { color: PETS_THEMES[petsTheme].color }]}>
                  {pet ? `🐱 ${pet.type.toUpperCase()}` : 'None'}
                </Text>
                <Text style={[styles.dropdownArrow, { color: PETS_THEMES[petsTheme].color }]}>▼</Text>
              </TouchableOpacity>

              {showPetDropdown && (
                <View style={[styles.dropdownMenu, { backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: PETS_THEMES[petsTheme].color }]}>
                  <TouchableOpacity
                    onPress={() => handlePetSelect('none')}
                    style={[
                      styles.dropdownOption, 
                      { 
                        backgroundColor: !pet ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        borderBottomColor: 'rgba(255, 255, 255, 0.2)' 
                      }
                    ]}
                  >
                    <Text style={[styles.dropdownOptionText, { color: PETS_THEMES[petsTheme].color }]}>None</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePetSelect('cat')}
                    style={[
                      styles.dropdownOption, 
                      { 
                        backgroundColor: pet?.type === 'cat' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        borderBottomColor: 'rgba(255, 255, 255, 0.2)' 
                      }
                    ]}
                  >
                    <Text style={[styles.dropdownOptionText, { color: PETS_THEMES[petsTheme].color }]}>🐱 Cat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled
                    style={[styles.dropdownOption, { borderBottomColor: 'rgba(255, 255, 255, 0.2)', opacity: 0.5 }]}
                  >
                    <Text style={[styles.dropdownOptionText, { color: '#888888' }]}>🐼 Panda</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled
                    style={[styles.dropdownOption, { opacity: 0.5 }]}
                  >
                    <Text style={[styles.dropdownOptionText, { color: '#888888' }]}>🐧 Penguin</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Health Bar and Coins - Top Right */}
            <View style={styles.topRightContainer}>
              {pet && (
                <View key={`health-${pet.health}-${pet.lastFed}-${pet.lastPet}-${pet.lastPlay}`} style={styles.healthBarContainer}>
                  <Image 
                    key={`heart-${pet.health}`}
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
                    key={`bar-${pet.health}`}
                    source={
                      pet.health === 5 ? require('../../assets/pets/health/bar5.png') :
                      pet.health === 4 ? require('../../assets/pets/health/bar4.png') :
                      pet.health === 3 ? require('../../assets/pets/health/bar3.png') :
                      pet.health === 2 ? require('../../assets/pets/health/bar2.png') :
                      pet.health === 1 ? require('../../assets/pets/health/bar1.png') :
                      require('../../assets/pets/health/bar0.png')
                    }
                    style={styles.healthBarImage}
                    resizeMode="contain"
                  />
                </View>
              )}
              
              {/* Coins Button */}
              <TouchableOpacity
                onPress={() => setShowCoinsPopup(true)}
                style={styles.coinsButton}
                activeOpacity={0.8}
              >
                <Image 
                  source={require('../../assets/rewards/coins.png')}
                  style={styles.coinsImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Pet Display Area */}
          {pet ? (
            <View style={styles.petDisplayContainer}>
              {/* Pet Name - Long press to rename */}
              <TouchableOpacity
                onLongPress={() => {
                  setRenameInput(pet.name);
                  setShowRenameModal(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.petNameDisplay}>{pet.name}</Text>
              </TouchableOpacity>
              
              {/* Animated Cat Sprite */}
              {pet.health === 0 ? (
                <Image
                  source={require('../../assets/pets/cat/catdead.png')}
                  style={styles.catSprite}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={
                    activeAnimation === 'feed' 
                      ? catBowlFrames[animationFrame]
                      : activeAnimation === 'pet'
                      ? happyCatFrames[animationFrame]
                      :                     activeAnimation === 'play'
                      ? playCatFrames[animationFrame]
                      : pet.health === 1
                      ? sadCatFrames[sadAnimationFrame]
                      : pet.health === 2
                      ? hungryCatFrames[hungryAnimationFrame]
                      : catSitFrames[currentCatFrame]
                  }
                  style={styles.catSprite}
                  resizeMode="contain"
                />
              )}
            </View>
          ) : (
            <View style={styles.noPetMessage}>
              <Text style={styles.noPetText}>Tap to choose pet</Text>
            </View>
          )}

          {/* Name Input Modal - Inside screen */}
          {showNameModal && (
            <View style={styles.modalOverlay}>
              <View style={[
                styles.nameModal, 
                { 
                  backgroundColor: `${PETS_THEMES[petsTheme].color}33`,
                  borderColor: PETS_THEMES[petsTheme].color 
                },
                showKeyboard && styles.nameModalWithKeyboard
              ]}>
                <Text style={[styles.modalTitle, { color: PETS_THEMES[petsTheme].color }]}>NAME YOUR PET</Text>
                <TouchableOpacity
                  style={[
                    styles.nameInput, 
                    { 
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderColor: PETS_THEMES[petsTheme].color 
                    }
                  ]}
                  onPress={() => setShowKeyboard(true)}
                >
                  <Text style={[styles.nameInputText, { color: petName ? '#FFFFFF' : '#AAAAAA' }]}>
                    {petName || 'Enter name (max 12 chars)'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowNameModal(false);
                      setPetName('');
                      setShowKeyboard(false);
                    }}
                    style={[
                      styles.modalButton, 
                      { 
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderColor: PETS_THEMES[petsTheme].color 
                      }
                    ]}
                  >
                    <Text style={[styles.modalButtonText, { color: PETS_THEMES[petsTheme].color }]}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleNameSubmit}
                    disabled={!petName.trim()}
                    style={[
                      styles.modalButton, 
                      { 
                        backgroundColor: PETS_THEMES[petsTheme].color,
                        borderColor: PETS_THEMES[petsTheme].color 
                      }, 
                      !petName.trim() && { opacity: 0.5 }
                    ]}
                  >
                    <Text style={[styles.modalButtonText, { color: '#000000' }]}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Rename Modal - Inside screen */}
          {showRenameModal && (
            <View style={styles.modalOverlay}>
              <View style={[
                styles.nameModal, 
                { 
                  backgroundColor: `${PETS_THEMES[petsTheme].color}33`,
                  borderColor: PETS_THEMES[petsTheme].color 
                },
                showKeyboard && styles.nameModalWithKeyboard
              ]}>
                <Text style={[styles.modalTitle, { color: PETS_THEMES[petsTheme].color }]}>RENAME YOUR PET</Text>
                <TouchableOpacity
                  style={[
                    styles.nameInput, 
                    { 
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderColor: PETS_THEMES[petsTheme].color 
                    }
                  ]}
                  onPress={() => setShowKeyboard(true)}
                >
                  <Text style={[styles.nameInputText, { color: renameInput ? '#FFFFFF' : '#AAAAAA' }]}>
                    {renameInput || 'Enter name (max 12 chars)'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowRenameModal(false);
                      setRenameInput('');
                      setShowKeyboard(false);
                    }}
                    style={[
                      styles.modalButton, 
                      { 
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderColor: PETS_THEMES[petsTheme].color 
                      }
                    ]}
                  >
                    <Text style={[styles.modalButtonText, { color: PETS_THEMES[petsTheme].color }]}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleRenameSubmit}
                    disabled={!renameInput.trim()}
                    style={[
                      styles.modalButton, 
                      { 
                        backgroundColor: PETS_THEMES[petsTheme].color,
                        borderColor: PETS_THEMES[petsTheme].color 
                      }, 
                      !renameInput.trim() && { opacity: 0.5 }
                    ]}
                  >
                    <Text style={[styles.modalButtonText, { color: '#000000' }]}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons - Above bottom bezel */}
          {pet && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                onPress={handleFeed}
                style={[styles.actionButton, styles.feedButton]}
              >
                <Text style={styles.actionButtonText}>FEED</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePet}
                style={[styles.actionButton, styles.petButton]}
              >
                <Text style={styles.actionButtonText}>PET</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePlay}
                style={[styles.actionButton, styles.playButton]}
              >
                <Text style={styles.actionButtonText}>PLAY</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Pixel Keyboard - Inside screen, appears from bottom (same as homepage) */}
          <PixelKeyboard
            visible={showKeyboard && (showNameModal || showRenameModal)}
            theme={getKeyboardTheme()}
            onKeyPress={(key: string) => {
              if (showNameModal && petName.length < 12) {
                setPetName((prev) => prev + key);
              } else if (showRenameModal && renameInput.length < 12) {
                setRenameInput((prev) => prev + key);
              }
            }}
            onBackspace={() => {
              if (showNameModal) {
                setPetName((prev) => prev.slice(0, -1));
              } else if (showRenameModal) {
                setRenameInput((prev) => prev.slice(0, -1));
              }
            }}
            onEnter={() => {
              setShowKeyboard(false);
            }}
            onSpace={() => {
              if (showNameModal && petName.length < 12) {
                setPetName((prev) => prev + ' ');
              } else if (showRenameModal && renameInput.length < 12) {
                setRenameInput((prev) => prev + ' ');
              }
            }}
            onClose={() => setShowKeyboard(false)}
          />

          {/* Revive Popup - Inside screen, shows when cat dies */}
          {showRevivePopup && pet && pet.health === 0 && (
            <View style={styles.reviveOverlay}>
              <View style={styles.revivePopup}>
                <TouchableOpacity
                  onPress={() => setShowRevivePopup(false)}
                  style={styles.reviveCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reviveCloseButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.reviveText}>USE 5 COINS TO REVIVE</Text>
                <View style={styles.reviveInfoContainer}>
                  <Text style={styles.reviveInfoText}>YOU HAVE {coins} COINS</Text>
                </View>
                <TouchableOpacity
                  onPress={coins >= 5 ? handleRevive : startGame}
                  style={[
                    styles.reviveButton,
                    coins < 5 && styles.reviveButtonDisabled
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.reviveButtonText,
                    coins < 5 && styles.reviveButtonTextDisabled
                  ]}>
                    {coins >= 5 ? 'REVIVE' : 'PLAY GAME'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Full Health Alert Popup */}
          {showFullHealthAlert && (
            <View style={styles.reviveOverlay}>
              <View style={[styles.revivePopup, { backgroundColor: `${PETS_THEMES[petsTheme].color}DD`, borderColor: PETS_THEMES[petsTheme].color }]}>
                <TouchableOpacity
                  onPress={() => setShowFullHealthAlert(false)}
                  style={styles.reviveCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reviveCloseButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={[styles.reviveText, { color: '#FFFFFF' }]}>LIFE BAR IS FULL!</Text>
                <TouchableOpacity
                  onPress={() => setShowFullHealthAlert(false)}
                  style={[styles.reviveButton, { backgroundColor: PETS_THEMES[petsTheme].color, borderColor: '#FFFFFF' }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.reviveButtonText, { color: '#000000' }]}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Coins Popup - Shows coins count */}
          {showCoinsPopup && (
            <View style={styles.coinsOverlay}>
              <View style={[styles.coinsPopup, { backgroundColor: `${PETS_THEMES[petsTheme].color}DD`, borderColor: PETS_THEMES[petsTheme].color }]}>
                <Text style={[styles.coinsText, { color: '#FFFFFF' }]}>
                  {coins} : YOU HAVE {coins} COINS!
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowCoinsPopup(false);
                    startGame();
                  }}
                  style={[styles.playToWinButton, { borderColor: PETS_THEMES[petsTheme].color }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.playToWinButtonText, { color: '#FFFFFF' }]}>
                    PLAY TO WIN MORE!
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Try Again Popup - Shows when action is already done today */}
          {showTryAgainPopup && tryAgainActionType && (
            <View style={styles.tryAgainOverlay}>
              <View
                style={[
                  styles.tryAgainPopup,
                  {
                    backgroundColor: `${PETS_THEMES[petsTheme].color}DD`,
                    borderColor: PETS_THEMES[petsTheme].color,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowTryAgainPopup(false);
                    setTryAgainActionType(null);
                  }}
                  style={styles.tryAgainCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tryAgainCloseButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={[styles.tryAgainText, { color: '#FFFFFF' }]}>
                  TRY AGAIN IN
                </Text>
                <Text style={[styles.tryAgainTime, { color: '#FFFFFF' }]}>
                  {timeUntilMidnight}
                </Text>
              </View>
            </View>
          )}

          {/* Fruit Game - Falling fruits mini-game */}
          {showGame && (
            <View style={styles.gameOverlay}>
              <View style={styles.gameContainer}>
                <TouchableOpacity
                  onPress={endGame}
                  style={styles.gameCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.gameCloseButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={[styles.gameTitle, { color: PETS_THEMES[petsTheme].color }]}>
                  TAP THE FRUITS!
                </Text>
                <Text style={[styles.gameSubtitle, { color: '#FFFFFF' }]}>
                  +1 COIN PER FRUIT
                </Text>
                {fruits.map((fruit) => (
                  <Animated.View
                    key={fruit.id}
                    style={[
                      styles.fruitContainer,
                      {
                        left: fruit.x,
                        transform: [{ translateY: fruit.animValue }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleFruitTap(fruit.id)}
                      activeOpacity={0.8}
                      style={styles.fruitButton}
                    >
                      <Image
                        source={fruitImages[fruit.type as keyof typeof fruitImages]}
                        style={styles.fruitImage}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Favorite Buttons - Gray Bezel Bottom */}
        <FavoriteButtons />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
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
    overflow: 'visible',
  },
  backgroundGif: {
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  dropdownWrapper: {
    maxWidth: 160,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 4,
    gap: 6,
  },
  dropdownLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
  },
  dropdownArrow: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
  },
  dropdownMenu: {
    marginTop: 4,
    borderWidth: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  dropdownOptionText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
  },
  topRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinsImage: {
    width: 40,
    height: 40,
  },
  healthHeart: {
    width: 24,
    height: 24,
  },
  healthBarImage: {
    width: 80,
    height: 24,
  },
  petDisplayContainer: {
    position: 'absolute',
    bottom: '33%', // Bottom 2/3 of screen
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petNameDisplay: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  catSprite: {
    width: 200,
    height: 200,
  },
  statusMessage: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    marginTop: 10,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 60, // Add space between buttons and health bar
    zIndex: 999,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    width: 100,
    height: 40,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedButton: {
    backgroundColor: 'rgba(100, 200, 100, 1)', // Fully opaque
  },
  petButton: {
    backgroundColor: 'rgba(100, 150, 200, 1)', // Fully opaque
  },
  playButton: {
    backgroundColor: 'rgba(200, 150, 100, 1)', // Fully opaque
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
  },
  noPetMessage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -20 }],
  },
  noPetText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
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
  nameModal: {
    width: '85%',
    padding: 24,
    borderWidth: 3,
    borderRadius: 12,
    zIndex: 1001,
  },
  nameModalWithKeyboard: {
    marginBottom: 280, // Push modal up when keyboard is visible
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 16,
  },
  nameInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 4,
    marginBottom: 16,
  },
  nameInputText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
  },
  reviveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  revivePopup: {
    backgroundColor: '#8B0000', // Dark red
    borderWidth: 4,
    borderColor: '#FF0000', // Bright red
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    minWidth: 250,
    position: 'relative',
  },
  reviveCloseButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  reviveCloseButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 12,
  },
  reviveText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  reviveInfoContainer: {
    marginBottom: 20,
  },
  reviveInfoText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  reviveButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 4,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 180,
    alignItems: 'center',
  },
  reviveButtonDisabled: {
    backgroundColor: '#666666',
    borderColor: '#333333',
    opacity: 0.6,
  },
  reviveButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#8B0000',
  },
  reviveButtonTextDisabled: {
    color: '#CCCCCC',
  },
  coinsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2001,
  },
  coinsPopup: {
    borderWidth: 4,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    minWidth: 280,
  },
  coinsText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 16,
  },
  playToWinButton: {
    borderWidth: 3,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: 8,
  },
  playToWinButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 2002,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  gameTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameSubtitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2004,
  },
  gameCloseButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 14,
  },
  fruitContainer: {
    position: 'absolute',
    top: 0,
    width: 50,
    height: 50,
    zIndex: 2003,
  },
  fruitButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitImage: {
    width: 50,
    height: 50,
  },
  tryAgainOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  tryAgainPopup: {
    borderWidth: 4,
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    position: 'relative',
  },
  tryAgainCloseButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tryAgainCloseButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 12,
  },
  tryAgainText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tryAgainTime: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
