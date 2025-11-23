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
        setPet(savedPet as Pet);
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

  // Health decline every 10 seconds
  useEffect(() => {
    if (!pet || pet.health <= 0) {
      return;
    }

    const healthDeclineInterval = setInterval(() => {
      setPet((currentPet) => {
        if (!currentPet || currentPet.health <= 0) {
          return currentPet;
        }
        const updatedPet = {
          ...currentPet,
          health: Math.max(0, currentPet.health - 1),
        };
        savePet(updatedPet); // Save to storage
        
        return updatedPet;
      });
    }, 10000); // Every 10 seconds

    return () => clearInterval(healthDeclineInterval);
  }, [pet]);


  // Animate revive text
  useEffect(() => {
    if (showRevivePopup) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(revivePulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(revivePulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [showRevivePopup]);

  // Animate coins popup text
  useEffect(() => {
    if (showCoinsPopup) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(coinsPulseAnim, {
            toValue: 1.1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(coinsPulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      
      // Auto-close after 3 seconds
      const timeout = setTimeout(() => {
        setShowCoinsPopup(false);
      }, 3000);
      
      return () => {
        pulseAnimation.stop();
        clearTimeout(timeout);
      };
    }
  }, [showCoinsPopup]);

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
      const newPet: Pet = {
        type: 'cat',
        name: petName.trim().replace(/\s+/g, '').toUpperCase(), // Remove all spaces
        health: 5,
        lastFed: Date.now(),
        lastPet: Date.now(),
      };
      setPet(newPet);
      savePet(newPet); // Save to storage
      setShowNameModal(false);
      setPetName('');
    }
  };

  const handleFeed = () => {
    if (pet) {
      if (pet.health === 0) {
        // Show revive popup if cat is dead
        setShowRevivePopup(true);
      } else if (pet.health > 0 && pet.health < 5) {
        setActiveAnimation('feed');
        const updatedPet = {
          ...pet,
          health: pet.health + 1,
          lastFed: Date.now(),
        };
        setPet(updatedPet);
        savePet(updatedPet); // Save to storage
      }
    }
  };

  const handlePet = () => {
    if (pet) {
      if (pet.health === 0) {
        // Show revive popup if cat is dead
        setShowRevivePopup(true);
      } else if (pet.health > 0 && pet.health < 5) {
        setActiveAnimation('pet');
        const updatedPet = {
          ...pet,
          health: pet.health + 1,
          lastPet: Date.now(),
        };
        setPet(updatedPet);
        savePet(updatedPet); // Save to storage
      }
    }
  };

  const handlePlay = () => {
    if (pet) {
      if (pet.health === 0) {
        // Show revive popup if cat is dead
        setShowRevivePopup(true);
      } else if (pet.health > 0 && pet.health < 5) {
        setActiveAnimation('play');
        const updatedPet = {
          ...pet,
          health: pet.health + 1,
          lastPet: Date.now(),
        };
        setPet(updatedPet);
        savePet(updatedPet); // Save to storage
      }
    }
  };

  const handleRevive = () => {
    if (pet && coins >= 5) {
      // Deduct 5 coins
      const newCoins = coins - 5;
      setCoins(newCoins);
      saveCoins(newCoins);
      
      // Revive the pet
      const revivedPet = {
        ...pet,
        health: 5,
        lastFed: Date.now(),
        lastPet: Date.now(),
      };
      setPet(revivedPet);
      savePet(revivedPet);
      setShowRevivePopup(false);
      setActiveAnimation(null); // Reset animation to show catsit
    }
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
                <View style={styles.healthBarContainer}>
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
              {/* Pet Name */}
              <Text style={styles.petNameDisplay}>{pet.name}</Text>
              
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
            visible={showKeyboard && showNameModal}
            theme={getKeyboardTheme()}
            onKeyPress={(key: string) => {
              if (petName.length < 12) {
                setPetName((prev) => prev + key);
              }
            }}
            onBackspace={() => {
              setPetName((prev) => prev.slice(0, -1));
            }}
            onEnter={() => {
              setShowKeyboard(false);
            }}
            onSpace={() => {
              if (petName.length < 12) {
                setPetName((prev) => prev + ' ');
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
                <Animated.View style={{ transform: [{ scale: revivePulseAnim }] }}>
                  <Text style={styles.reviveText}>USE 5 COINS TO REVIVE</Text>
                </Animated.View>
                <View style={styles.reviveInfoContainer}>
                  <Text style={styles.reviveInfoText}>YOU HAVE {coins} COINS</Text>
                </View>
                <TouchableOpacity
                  onPress={handleRevive}
                  disabled={coins < 5}
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
                    {coins >= 5 ? 'REVIVE' : 'NOT ENOUGH COINS'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Coins Popup - Shows coins count */}
          {showCoinsPopup && (
            <View style={styles.coinsOverlay}>
              <View style={[styles.coinsPopup, { backgroundColor: `${PETS_THEMES[petsTheme].color}DD`, borderColor: PETS_THEMES[petsTheme].color }]}>
                <Animated.View style={{ transform: [{ scale: coinsPulseAnim }] }}>
                  <Text style={[styles.coinsText, { color: '#FFFFFF' }]}>
                    {coins} : YOU HAVE {coins} COINS!
                  </Text>
                </Animated.View>
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
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  reviveCloseButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 18,
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
  },
});
