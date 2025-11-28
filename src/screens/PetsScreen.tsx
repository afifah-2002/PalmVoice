import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Pressable, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import ViewShot from 'react-native-view-shot';
import { FavoriteButtons } from '../components/FavoriteButtons';
import { PixelKeyboard } from '../components/PixelKeyboard';
import { PALM_THEMES, PalmTheme } from '../constants/palmThemes';
import { useTheme } from '../contexts/ThemeContext';
import { deletePet, loadCoins, loadHealthPotions, loadPet, loadPetsTheme, loadPurchasedPets, loadPurchasedThemes, loadRevivalTokens, loadTasks, saveCoins, saveHealthPotions, savePet, savePetsTheme, savePurchasedPets, savePurchasedThemes, saveRevivalTokens } from '../services/storage';
import { Task } from '../types/Task';

type PetsTheme = 'serene' | 'purple-skies' | 'orange-kiss' | 'cherryblossom' | 'feelslike2002' | 'feelslikechristmas' | 'fishpond' | 'glowy' | 'magical' | 'minecraft' | 'ohsoflowery' | 'peace' | 'secretgarden' | 'snowynight' | 'therapeutic' | 'waterfall' | 'anime' | 'autumn' | 'infinite' | 'moonlight';
type PetType = 'none' | 'cat' | 'puppy' | 'panda' | 'koala';
type PetStatus = 'happy' | 'hungry' | 'sad' | 'dead' | 'sleeping';

interface Pet {
  type: PetType;
  name: string;
  health: number; // Health at time of last interaction (baseline for decline calculation)
  lastFed: number; // Timestamp of last feed action
  lastPet: number; // Timestamp of last pet action
  lastPlay?: number; // Timestamp of last play action
  lastPotion?: number; // Timestamp of last potion used
  lastRevival?: number; // Timestamp of last revival
  createdAt?: number; // Timestamp of creation/revival (used for health decline reference)
  originalCreatedAt?: number; // Original creation time (never changes, used for streak)
}

// Theme mapping with all available themes
const ALL_THEMES: Record<string, { name: string; background: any; color: string; price: number; exclusive?: boolean }> = {
  'serene': {
    name: 'Serene',
    background: require('../../assets/pets/backgrounds/theme1.gif'),
    color: '#8B9B6A',
    price: 0, // Free starter theme
  },
  'purple-skies': {
    name: 'Purple Skies',
    background: require('../../assets/pets/backgrounds/theme2.gif'),
    color: '#9B7BA8',
    price: 0, // Free starter theme
  },
  'orange-kiss': {
    name: 'Orange Kiss',
    background: require('../../assets/pets/backgrounds/theme3.gif'),
    color: '#D4895C',
    price: 0, // Free starter theme
  },
  // Regular themes - 15 coins
  'cherryblossom': {
    name: 'Cherry Blossom',
    background: require('../../assets/pets/backgrounds/cherryblossom.jpg'),
    color: '#E8B4CB',
    price: 15,
  },
  'feelslike2002': {
    name: 'Feels Like 2002',
    background: require('../../assets/pets/backgrounds/feelslike2002.jpg'),
    color: '#A8D5BA',
    price: 15,
  },
  'feelslikechristmas': {
    name: 'Feels Like Christmas',
    background: require('../../assets/pets/backgrounds/feelslikechristmas.jpg'),
    color: '#C8E6C9',
    price: 15,
  },
  'fishpond': {
    name: 'Fish Pond',
    background: require('../../assets/pets/backgrounds/fishpond.jpg'),
    color: '#81C784',
    price: 15,
  },
  'glowy': {
    name: 'Glowy',
    background: require('../../assets/pets/backgrounds/glowy.jpg'),
    color: '#FFB74D',
    price: 15,
  },
  'magical': {
    name: 'Magical',
    background: require('../../assets/pets/backgrounds/magical.jpg'),
    color: '#BA68C8',
    price: 15,
  },
  'minecraft': {
    name: 'Minecraft',
    background: require('../../assets/pets/backgrounds/minecraft.jpg'),
    color: '#90A4AE',
    price: 15,
  },
  'ohsoflowery': {
    name: 'Oh So Flowery',
    background: require('../../assets/pets/backgrounds/ohsoflowery.jpg'),
    color: '#F48FB1',
    price: 15,
  },
  'peace': {
    name: 'Peace',
    background: require('../../assets/pets/backgrounds/peace.jpg'),
    color: '#AED581',
    price: 15,
  },
  'secretgarden': {
    name: 'Secret Garden',
    background: require('../../assets/pets/backgrounds/secretgarden.jpg'),
    color: '#66BB6A',
    price: 15,
  },
  'snowynight': {
    name: 'Snowy Night',
    background: require('../../assets/pets/backgrounds/snowynight.jpg'),
    color: '#B0BEC5',
    price: 15,
  },
  'therapeutic': {
    name: 'Therapeutic',
    background: require('../../assets/pets/backgrounds/therapeutic.jpg'),
    color: '#A5D6A7',
    price: 15,
  },
  'waterfall': {
    name: 'Waterfall',
    background: require('../../assets/pets/backgrounds/waterfall.jpg'),
    color: '#4DB6AC',
    price: 15,
  },
  // Exclusive themes - 30 coins
  'anime': {
    name: 'Anime',
    background: require('../../assets/pets/backgrounds/anime.gif'),
    color: '#FF6B9D',
    price: 30,
    exclusive: true,
  },
  'autumn': {
    name: 'Autumn',
    background: require('../../assets/pets/backgrounds/autumn.gif'),
    color: '#FF8A65',
    price: 30,
    exclusive: true,
  },
  'infinite': {
    name: 'Infinite',
    background: require('../../assets/pets/backgrounds/infinite.gif'),
    color: '#9575CD',
    price: 30,
    exclusive: true,
  },
  'moonlight': {
    name: 'Moonlight',
    background: require('../../assets/pets/backgrounds/moonlight.gif'),
    color: '#64B5F6',
    price: 30,
    exclusive: true,
  },
};

// Legacy PETS_THEMES for backward compatibility
const PETS_THEMES = {
  'serene': ALL_THEMES['serene'],
  'purple-skies': ALL_THEMES['purple-skies'],
  'orange-kiss': ALL_THEMES['orange-kiss'],
};

// Shop pets with pricing
const SHOP_PETS: Record<string, { name: string; icon: any; price: number; emoji: string }> = {
  'cat': {
    name: 'Cat',
    icon: require('../../assets/pets/cat/catsit2.png'),
    price: 0, // Free
    emoji: '🐱',
  },
  'puppy': {
    name: 'Puppy',
    icon: require('../../assets/pets/puppy/puppysit1.png'),
    price: 30,
    emoji: '🐶',
  },
  'panda': {
    name: 'Panda',
    icon: require('../../assets/pets/panda/pandasit1.png'),
    price: 50,
    emoji: '🐼',
  },
  'koala': {
    name: 'Koala',
    icon: require('../../assets/pets/koala/koalasit1.png'),
    price: 50,
    emoji: '🐨',
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
    const currentThemeData = ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene'];
    const petsColor = currentThemeData.color;
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
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [petName, setPetName] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [selectedPetType, setSelectedPetType] = useState<PetType>('cat');
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
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [purchasedThemes, setPurchasedThemes] = useState<string[]>(['serene', 'purple-skies', 'orange-kiss']);
  const [showPurchaseError, setShowPurchaseError] = useState(false);
  const [purchaseErrorMessage, setPurchaseErrorMessage] = useState('');
  const shareViewRef = useRef<ViewShot>(null);
  const [showShop, setShowShop] = useState(false);
  const [shopMessage, setShopMessage] = useState('Hello There!');
  const shopTextOpacity = useRef(new Animated.Value(0)).current;
  const shopTextScale = useRef(new Animated.Value(0.8)).current;
  const [currentShopkeeperFrame, setCurrentShopkeeperFrame] = useState(0);
  const [currentShopBox, setCurrentShopBox] = useState(1);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showThemesModal, setShowThemesModal] = useState(false);
  const [showPetsModal, setShowPetsModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const petsModalScale = useRef(new Animated.Value(0.9)).current;
  const itemsModalScale = useRef(new Animated.Value(0.9)).current;
  const [purchasedPets, setPurchasedPets] = useState<string[]>(['cat']); // Cat is free by default
  const [revivalTokens, setRevivalTokens] = useState(0); // Revival insurance tokens
  const [healthPotions, setHealthPotions] = useState(0); // Health potions
  const [showDeletePetConfirm, setShowDeletePetConfirm] = useState(false);
  const [petToDelete, setPetToDelete] = useState<PetType | null>(null);
  const [treasureBoxMessage, setTreasureBoxMessage] = useState('click me!');
  const treasureBoxOpacity = useRef(new Animated.Value(0)).current;
  const treasureBoxScale = useRef(new Animated.Value(0.8)).current;
  const shopModalScale = useRef(new Animated.Value(0.9)).current;
  const shopModalPulse = useRef(new Animated.Value(1)).current;
  const themesModalScale = useRef(new Animated.Value(0.9)).current;
  const [showTryAgainPopup, setShowTryAgainPopup] = useState(false);
  const [tryAgainActionType, setTryAgainActionType] = useState<'feed' | 'pet' | 'play' | null>(null);
  const tryAgainPulseAnim = useRef(new Animated.Value(1)).current;
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');
  const [showHealthDecayTimer, setShowHealthDecayTimer] = useState(false);
  
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

  // Shopkeeper animation frames
  const shopkeeperFrames = [
    require('../../assets/pets/shop/shopkeeper1.png'),
    require('../../assets/pets/shop/shopkeeper2.png'),
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

  // Puppy sit animation frames
  const puppySitFrames = [
    require('../../assets/pets/puppy/puppysit1.png'),
    require('../../assets/pets/puppy/puppysit2.png'),
  ];

  // Puppy eat animation frames
  const puppyEatFrames = [
    require('../../assets/pets/puppy/puppyeat1.png'),
    require('../../assets/pets/puppy/puppyeat2.png'),
    require('../../assets/pets/puppy/puppyeat3.png'),
  ];

  // Puppy cry animation frames (for when health is 1)
  const puppyCryFrames = [
    require('../../assets/pets/puppy/puppycry1.png'),
    require('../../assets/pets/puppy/puppycry2.png'),
    require('../../assets/pets/puppy/puppycry3.png'),
  ];

  // Puppy pet animation frames (happy)
  const happyPuppyFrames = [
    require('../../assets/pets/puppy/puppypet1.png'),
    require('../../assets/pets/puppy/puppypet2.png'),
    require('../../assets/pets/puppy/puppypet3.png'),
  ];

  // Puppy play animation frames
  const puppyPlayFrames = [
    require('../../assets/pets/puppy/puppyplay1.png'),
    require('../../assets/pets/puppy/puppyplay2.png'),
    require('../../assets/pets/puppy/puppyplay3.png'),
  ];

  // Panda animation frames
  const pandaSitFrames = [
    require('../../assets/pets/panda/pandasit1.png'),
    require('../../assets/pets/panda/pandasit2.png'),
  ];
  const pandaEatFrames = [
    require('../../assets/pets/panda/pandaeat1.png'),
    require('../../assets/pets/panda/pandaeat2.png'),
  ];
  const pandaCryFrames = [
    require('../../assets/pets/panda/pandacry1.png'),
    require('../../assets/pets/panda/pandacry2.png'),
    require('../../assets/pets/panda/pandacry3.png'),
  ];
  const pandaPetFrames = [
    require('../../assets/pets/panda/pandapet1.png'),
    require('../../assets/pets/panda/pandapet2.png'),
    require('../../assets/pets/panda/pandapet3.png'),
  ];
  const pandaPlayFrames = [
    require('../../assets/pets/panda/pandaplay1.png'),
    require('../../assets/pets/panda/pandaplay2.png'),
    require('../../assets/pets/panda/pandaplay3.png'),
  ];

  // Koala animation frames
  const koalaSitFrames = [
    require('../../assets/pets/koala/koalasit1.png'),
    require('../../assets/pets/koala/koalasit2.png'),
  ];
  const koalaEatFrames = [
    require('../../assets/pets/koala/koalaeat1.png'),
    require('../../assets/pets/koala/koalaeat2.png'),
    require('../../assets/pets/koala/koalaeat3.png'),
  ];
  const koalaCryFrames = [
    require('../../assets/pets/koala/koalacry1.png'),
    require('../../assets/pets/koala/koalacry2.png'),
    require('../../assets/pets/koala/koalacry3.png'),
  ];
  const koalaPetFrames = [
    require('../../assets/pets/koala/koalapet1.png'),
    require('../../assets/pets/koala/koalapet2.png'),
    require('../../assets/pets/koala/koalapet3.png'),
  ];
  const koalaPlayFrames = [
    require('../../assets/pets/koala/koalaplay1.png'),
    require('../../assets/pets/koala/koalaplay2.png'),
    require('../../assets/pets/koala/koalaplay3.png'),
  ];

  // Function to repair all pets' health at once
  const repairAllPetsHealth = async (petTypes: string[]) => {
    const now = Date.now();
    const hoursPerHeart = 4.8;
    const millisecondsPerHeart = hoursPerHeart * 60 * 60 * 1000;
    
    for (const petType of petTypes) {
      try {
        const savedPet = await loadPet(petType);
        if (!savedPet) continue;
        
        // Check if pet has lastRevival set
        // CRITICAL: After revival, stored health should be 5 (the baseline), NOT the current calculated health
        // The stored health is the baseline at the time of last interaction - it does NOT decay
        // The calculation function subtracts hearts lost from this baseline to get displayed health
        if (savedPet.lastRevival && savedPet.lastRevival > 0) {
          const hoursSinceRevival = (now - savedPet.lastRevival) / (60 * 60 * 1000);
          
          // After revival, stored health should be 5 (the baseline)
          // Only repair if stored health is NOT 5 and it's been less than 24 hours since revival
          if (savedPet.health !== 5 && hoursSinceRevival < 24) {
            console.warn(`[BATCH HEALTH REPAIR] Pet ${savedPet.name} (${petType}): Stored health is ${savedPet.health} (should be 5 after revival). Hours since revival: ${hoursSinceRevival.toFixed(2)}. Repairing to 5...`);
            
            const repairedPet = {
              ...savedPet,
              health: 5, // Set to 5 (the baseline after revival)
            };
            
            await savePet(repairedPet, petType);
            console.log(`[BATCH HEALTH REPAIR] Saved repaired health: 5 (baseline) for ${savedPet.name}. Calculated current health will be: ${getCurrentHealth(repairedPet as Pet)}`);
            
            // If this is the current pet, update state
            if (pet && pet.type === petType) {
              setPet(repairedPet as Pet);
            }
          }
        }
      } catch (error) {
        console.error(`[BATCH HEALTH REPAIR] Error repairing ${petType}:`, error);
      }
    }
  };

  // Load saved pets theme and pet data on mount
  useEffect(() => {
    loadPetsTheme().then((savedTheme) => {
      if (savedTheme) {
        setPetsTheme(savedTheme as PetsTheme);
      }
    });
    loadPet().then((savedPet) => {
      if (savedPet) {
        // Backward compatibility: if pet doesn't have createdAt, set it to now
        if (!savedPet.createdAt) {
          const now = Date.now();
          const updatedPet = {
            ...savedPet,
            createdAt: now,
            // If no lastFed/lastPet/lastPlay, set them to now so health doesn't decline immediately
            lastFed: savedPet.lastFed || now,
            lastPet: savedPet.lastPet || now,
            lastPlay: savedPet.lastPlay || now,
          };
          setPet(updatedPet as Pet);
          savePet(updatedPet, updatedPet.type);
        } else {
          // Backward compatibility: ensure originalCreatedAt exists
          const petWithOriginalCreated = {
            ...savedPet,
            originalCreatedAt: savedPet.originalCreatedAt || savedPet.createdAt,
            lastPotion: savedPet.lastPotion || 0,
            lastRevival: savedPet.lastRevival || 0,
          };
          
          // Calculate correct health based on time since last interaction
          // Include potion and revival in the calculation
          const lastInteraction = Math.max(
            petWithOriginalCreated.lastFed || 0,
            petWithOriginalCreated.lastPet || 0,
            petWithOriginalCreated.lastPlay || 0,
            petWithOriginalCreated.lastPotion || 0,
            petWithOriginalCreated.lastRevival || 0
          );
          
          let calculatedHealth = petWithOriginalCreated.health;
          
          if (lastInteraction > 0) {
            // Health declines from last interaction
            const now = Date.now();
            const elapsedSinceInteraction = now - lastInteraction;
            const hoursPerHeart = 4.8;
            const millisecondsPerHeart = hoursPerHeart * 60 * 60 * 1000;
            const heartsLost = Math.floor(elapsedSinceInteraction / millisecondsPerHeart);
            calculatedHealth = Math.max(0, petWithOriginalCreated.health - heartsLost);
          } else if (petWithOriginalCreated.createdAt) {
            // New pet with no interactions - decline from creation
            const now = Date.now();
            const elapsedTime = now - petWithOriginalCreated.createdAt;
            const hoursPerHeart = 4.8;
            const millisecondsPerHeart = hoursPerHeart * 60 * 60 * 1000;
            const heartsLost = Math.floor(elapsedTime / millisecondsPerHeart);
            calculatedHealth = Math.max(0, 5 - heartsLost);
          }
          
          // SAFEGUARD: Check if stored health seems corrupted
          // If stored health is very low (1 or 0) but last interaction was recent (< 5 hours), something is wrong
          const now = Date.now();
          const minutesSinceInteraction = lastInteraction > 0 ? (now - lastInteraction) / (60 * 1000) : Infinity;
          const hoursSinceInteraction = minutesSinceInteraction / 60;
          
          // CRITICAL REPAIR: Check if stored health is wrong after revival
          // If lastRevival is set but stored health is not 5, or if stored health is lower than it should be
          let healthToStore = petWithOriginalCreated.health;
          
          // SPECIAL CASE: If lastRevival is set, stored health should be 5 (the baseline)
          // CRITICAL: Stored health is the BASELINE at the time of last interaction - it does NOT decay
          // The calculation function subtracts hearts lost from this baseline to get displayed health
          if (petWithOriginalCreated.lastRevival && petWithOriginalCreated.lastRevival > 0) {
            const hoursSinceRevival = hoursSinceInteraction;
            
            // After revival, stored health should be 5 (the baseline)
            // Only repair if stored health is NOT 5 and it's been less than 24 hours since revival
            if (petWithOriginalCreated.health !== 5 && hoursSinceRevival < 24) {
              console.warn(`[HEALTH REPAIR] Pet ${petWithOriginalCreated.name}: Revival detected but stored health is ${petWithOriginalCreated.health} (should be 5 after revival). Hours since revival: ${hoursSinceRevival.toFixed(2)}. Repairing to 5...`);
              healthToStore = 5; // Set to 5 (the baseline after revival)
            }
          }
          
          // If stored health is 1 or 0 but we had an interaction less than 5 hours ago, the stored health is likely corrupted
          // We should restore it based on the calculated health + hearts lost
          if (petWithOriginalCreated.health <= 1 && lastInteraction > 0 && hoursSinceInteraction < 5 && healthToStore === petWithOriginalCreated.health) {
            // Try to reconstruct what the stored health should be
            // If calculated health is X and we lost Y hearts, stored health should be X + Y
            const heartsLost = Math.floor((now - lastInteraction) / (4.8 * 60 * 60 * 1000));
            const reconstructedStoredHealth = calculatedHealth + heartsLost;
            
            if (reconstructedStoredHealth > petWithOriginalCreated.health && reconstructedStoredHealth <= 5) {
              console.warn(`[HEALTH REPAIR] Pet ${petWithOriginalCreated.name}: Stored health (${petWithOriginalCreated.health}) seems corrupted! Last interaction was ${hoursSinceInteraction.toFixed(2)} hours ago. Reconstructing to ${reconstructedStoredHealth} based on calculated health (${calculatedHealth}) + hearts lost (${heartsLost}).`);
              healthToStore = reconstructedStoredHealth;
            }
          }
          
          // IMPORTANT: Don't save the calculated health back to storage!
          // The stored health is the baseline from the last interaction.
          // We only calculate health for display - we should NOT overwrite the stored baseline.
          // Only update if we need to add missing fields (originalCreatedAt, etc.) OR if health was corrupted
          const correctedPet = {
            ...petWithOriginalCreated,
            health: healthToStore, // Use repaired health if corruption was detected
          };
          
          // Save if we're adding missing metadata fields OR if we repaired corrupted health
          if (!savedPet.originalCreatedAt || !savedPet.lastPotion || !savedPet.lastRevival || healthToStore !== petWithOriginalCreated.health) {
            if (healthToStore !== petWithOriginalCreated.health) {
              console.log(`[HEALTH REPAIR] Saving repaired health: ${healthToStore} (was ${petWithOriginalCreated.health})`);
            } else {
              console.log(`Pet metadata updated on load: adding missing fields`);
            }
            setPet(correctedPet as Pet);
            savePet(correctedPet, correctedPet.type);
          } else {
            // Just set the pet state - don't save calculated health
            setPet(correctedPet as Pet);
          }
          
          // Log what we're working with
          console.log(`[LOAD] Pet loaded - Stored health baseline: ${healthToStore}, Calculated current health: ${calculatedHealth}, Last interaction: ${new Date(lastInteraction).toLocaleString()}`);
        }
      }
    });
    loadCoins().then((savedCoins) => {
      setCoins(savedCoins);
      // Ensure coins are saved (in case it's the first time)
      saveCoins(savedCoins);
    });
    loadPurchasedThemes().then((themes) => {
      setPurchasedThemes(themes);
    });
    loadPurchasedPets().then((pets) => {
      setPurchasedPets(pets);
      // Repair all pets' health after loading purchased pets
      repairAllPetsHealth(pets);
    });
    loadRevivalTokens().then((tokens) => {
      setRevivalTokens(tokens);
    });
    loadHealthPotions().then((potions) => {
      setHealthPotions(potions);
    });
    loadTasks().then((loadedTasks) => {
      setTasks(loadedTasks);
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

  // Calculate health based on time elapsed since pet was created
  // 1 heart per 4.8 hours = 17,280,000 milliseconds (5 hearts = 24 hours)
  const calculateHealthFromTime = (pet: Pet): number => {
    // Get the most recent interaction time
    const lastInteraction = Math.max(
      pet.lastFed || 0,
      pet.lastPet || 0,
      pet.lastPlay || 0
    );
    
    // If no interactions ever, pet starts at full health (5 hearts)
    // and declines from creation time
    if (lastInteraction === 0) {
      if (!pet.createdAt) {
        return pet.health; // No data, keep current health
      }
      // New pet with no interactions - decline from creation
      const now = Date.now();
      const elapsedTime = now - pet.createdAt;
      const hoursPerHeart = 4.8;
      const millisecondsPerHeart = hoursPerHeart * 60 * 60 * 1000;
      const heartsLost = Math.floor(elapsedTime / millisecondsPerHeart);
      return Math.max(0, 5 - heartsLost);
    }
    
    // Calculate health based on time since last interaction
    const now = Date.now();
    const elapsedSinceInteraction = now - lastInteraction;
    const hoursPerHeart = 4.8;
    const millisecondsPerHeart = hoursPerHeart * 60 * 60 * 1000; // 17,280,000 ms
    
    // Each heart is lost after 4.8 hours of no interaction
    const heartsLost = Math.floor(elapsedSinceInteraction / millisecondsPerHeart);
    
    // Health declines from the health at last interaction (stored in pet.health)
    // But we need to track what health was AT the time of last interaction
    // Since we boost health +1 on each action, the stored health reflects post-action health
    // So decline from that stored health value
    const calculatedHealth = Math.max(0, pet.health - heartsLost);
    
    // Debug logging
    const hoursElapsed = elapsedSinceInteraction / (60 * 60 * 1000);
    console.log(`Health calculation: ${hoursElapsed.toFixed(2)} hours since last interaction, ${heartsLost} hearts lost, health: ${pet.health} -> ${calculatedHealth}`);
    
    return calculatedHealth;
  };

  // Calculate current health based on time since last interaction
  // This is a helper that computes health dynamically without modifying stored state
  // Considers: feed, pet, play, potion, and revival as interactions that reset the clock
  const getCurrentHealth = (petData: Pet): number => {
    // Get the most recent interaction time (including potion and revival)
    const lastInteraction = Math.max(
      petData.lastFed || 0,
      petData.lastPet || 0,
      petData.lastPlay || 0,
      petData.lastPotion || 0,
      petData.lastRevival || 0
    );
    
    const now = Date.now();
    const hoursPerHeart = 4.8;
    const millisecondsPerHeart = hoursPerHeart * 60 * 60 * 1000;
    
    if (lastInteraction > 0) {
      // Health declines from the stored health (which was set at last interaction)
      const elapsedSinceInteraction = now - lastInteraction;
      const heartsLost = Math.floor(elapsedSinceInteraction / millisecondsPerHeart);
      const calculatedHealth = Math.max(0, petData.health - heartsLost);
      
      // SAFEGUARD: Detect if stored health seems corrupted
      // If stored health is very low but we just had an interaction recently, something is wrong
      const minutesSinceInteraction = elapsedSinceInteraction / (60 * 1000);
      if (petData.health <= 1 && minutesSinceInteraction < 60 && calculatedHealth <= 1) {
        // This suggests stored health is corrupted - log a warning
        const lastWarnKey = `health_warn_${petData.name}`;
        const lastWarnTime = (global as any)[lastWarnKey] || 0;
        if ((now - lastWarnTime) > 300000) { // Warn every 5 minutes max
          console.error(`[HEALTH CORRUPTION DETECTED] Pet: ${petData.name}, Stored health: ${petData.health} seems too low! Last interaction was ${minutesSinceInteraction.toFixed(1)} minutes ago. This might indicate data corruption.`);
          (global as any)[lastWarnKey] = now;
        }
      }
      
      // Debug logging to help diagnose issues (only log once per minute to prevent spam)
      const hoursElapsed = elapsedSinceInteraction / (60 * 60 * 1000);
      const lastLogKey = `health_log_${petData.name}`;
      const lastLogTime = (global as any)[lastLogKey] || 0;
      
      if (hoursElapsed > 2 && (now - lastLogTime) > 60000) { // Only log if significant time passed AND at least 1 minute since last log
        console.log(`[HEALTH CALC] Pet: ${petData.name}, Stored health: ${petData.health}, Hours since interaction: ${hoursElapsed.toFixed(2)}, Hearts lost: ${heartsLost}, Calculated health: ${calculatedHealth}`);
        console.log(`[HEALTH CALC] Timestamps - lastFed: ${petData.lastFed}, lastPet: ${petData.lastPet}, lastPlay: ${petData.lastPlay}, lastPotion: ${petData.lastPotion}, lastRevival: ${petData.lastRevival}`);
        (global as any)[lastLogKey] = now;
      }
      
      return calculatedHealth;
    } else if (petData.createdAt) {
      // New pet with no interactions - decline from creation (starting at 5 hearts)
      const elapsedTime = now - petData.createdAt;
      const heartsLost = Math.floor(elapsedTime / millisecondsPerHeart);
      return Math.max(0, 5 - heartsLost);
    }
    
    return petData.health;
  };

  // Calculate time remaining until next heart decay
  const getTimeUntilNextDecay = (petData: Pet): string => {
    if (!petData) return '0H 0M';
    
    // If pet is dead, no decay
    if (getCurrentHealth(petData) === 0) return 'PET IS DEAD';
    
    const lastInteraction = Math.max(
      petData.lastFed || 0,
      petData.lastPet || 0,
      petData.lastPlay || 0,
      petData.lastPotion || 0,
      petData.lastRevival || 0
    );
    
    const now = Date.now();
    const hoursPerHeart = 4.8;
    const millisecondsPerHeart = hoursPerHeart * 60 * 60 * 1000;
    
    let elapsedTime: number;
    if (lastInteraction > 0) {
      elapsedTime = now - lastInteraction;
    } else if (petData.createdAt) {
      elapsedTime = now - petData.createdAt;
    } else {
      return '0H 0M';
    }
    
    // Calculate how much time has passed in the current decay cycle
    const timeInCurrentCycle = elapsedTime % millisecondsPerHeart;
    const timeRemaining = millisecondsPerHeart - timeInCurrentCycle;
    
    // Convert to hours and minutes
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}H ${minutes}M`;
  };

  // Force re-render every minute to update displayed health
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    if (!pet) return;
    
    const interval = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 60000); // Update display every minute
    
    return () => clearInterval(interval);
  }, [pet?.type]);

  // AUTOMATIC HEALTH REPAIR: Check and fix corrupted health whenever pet state changes
  useEffect(() => {
    if (!pet) return;
    
    const lastInteraction = Math.max(
      pet.lastFed || 0,
      pet.lastPet || 0,
      pet.lastPlay || 0,
      pet.lastPotion || 0,
      pet.lastRevival || 0
    );
    
    if (lastInteraction > 0) {
      const now = Date.now();
      const hoursSinceInteraction = (now - lastInteraction) / (60 * 60 * 1000);
      const calculatedHealth = getCurrentHealth(pet);
      
      // SPECIAL CASE: If stored health is wrong but lastRevival is set, repair to 5 (the baseline)
      // CRITICAL: Stored health is the BASELINE at the time of last interaction - it does NOT decay
      // The calculation function subtracts hearts lost from this baseline to get displayed health
      if (pet.lastRevival && pet.lastRevival > 0) {
        const hoursSinceRevival = (now - pet.lastRevival) / (60 * 60 * 1000);
        
        // After revival, stored health should be 5 (the baseline)
        // Only repair if stored health is NOT 5 and it's been less than 24 hours since revival
        if (pet.health !== 5 && hoursSinceRevival < 24) {
          console.warn(`[AUTO HEALTH REPAIR] Pet ${pet.name}: Stored health is ${pet.health} (should be 5 after revival). Hours since revival: ${hoursSinceRevival.toFixed(2)}. Repairing to 5...`);
          const repairedPet = {
            ...pet,
            health: 5, // Set to 5 (the baseline after revival)
          };
          savePet(repairedPet, repairedPet.type);
          setPet(repairedPet);
          return; // Exit early, don't check other conditions
        }
      }
      
      // If stored health is very low (1 or 0) but last interaction was recent (< 5 hours), repair it
      if (pet.health <= 1 && hoursSinceInteraction < 5 && calculatedHealth <= 1) {
        const heartsLost = Math.floor((now - lastInteraction) / (4.8 * 60 * 60 * 1000));
        const reconstructedStoredHealth = calculatedHealth + heartsLost;
        
        if (reconstructedStoredHealth > pet.health && reconstructedStoredHealth <= 5) {
          console.error(`[AUTO HEALTH REPAIR] Pet ${pet.name}: Repairing corrupted health from ${pet.health} to ${reconstructedStoredHealth}`);
          const repairedPet = {
            ...pet,
            health: reconstructedStoredHealth,
          };
          savePet(repairedPet, repairedPet.type);
          setPet(repairedPet);
        }
      }
    }
  }, [pet?.health, pet?.lastFed, pet?.lastPet, pet?.lastPlay, pet?.lastPotion, pet?.lastRevival]);

  // Calculate the current displayed health (used for UI and logic)
  // This is computed dynamically based on time since last interaction
  // Use useMemo to prevent infinite re-renders
  const displayedHealth = useMemo(() => {
    if (!pet) return 0;
    return getCurrentHealth(pet);
  }, [pet, forceUpdate]); // Recalculate when pet changes or forceUpdate triggers


  // Auto-close coins popup after 3 seconds
  useEffect(() => {
    if (showCoinsPopup) {
      // Reload global items from storage when popup opens
      const loadItems = async () => {
        const tokens = await loadRevivalTokens();
        const potions = await loadHealthPotions();
        console.log('Coins popup opened - loaded tokens:', tokens, 'potions:', potions);
        setRevivalTokens(tokens);
        setHealthPotions(potions);
      };
      loadItems();
      
      const timeout = setTimeout(() => {
        setShowCoinsPopup(false);
      }, 20000); // Extended to 20 seconds
      
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
    if (!pet || activeAnimation !== null || getCurrentHealth(pet) === 0) {
      setCurrentCatFrame(0);
      return;
    }

    const interval = setInterval(() => {
      if (pet?.type === 'puppy') {
        setCurrentCatFrame((prev) => (prev + 1) % puppySitFrames.length);
      } else if (pet?.type === 'panda') {
        setCurrentCatFrame((prev) => (prev + 1) % pandaSitFrames.length);
      } else if (pet?.type === 'koala') {
        setCurrentCatFrame((prev) => (prev + 1) % koalaSitFrames.length);
      } else {
        setCurrentCatFrame((prev) => (prev + 1) % catSitFrames.length);
      }
    }, 1000); // 1 second interval

    return () => clearInterval(interval);
  }, [pet, activeAnimation]);

  // Animate shopkeeper frames when shop is open
  useEffect(() => {
    if (!showShop) {
      setCurrentShopkeeperFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentShopkeeperFrame((prev) => (prev + 1) % shopkeeperFrames.length);
    }, 1000); // 1 second interval

    return () => clearInterval(interval);
  }, [showShop]);

  // Animate hungry cat when health is 2 (but not 1)
  useEffect(() => {
    if (!pet || activeAnimation !== null || getCurrentHealth(pet) === 0 || getCurrentHealth(pet) !== 2) {
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
    
    if (pet?.type === 'puppy') {
      if (activeAnimation === 'feed') {
        frames = puppyEatFrames;
        duration = 9000; // 9 seconds
      } else if (activeAnimation === 'pet') {
        frames = happyPuppyFrames;
        duration = 9000; // 9 seconds
      } else {
        frames = puppyPlayFrames;
        duration = 9000; // 9 seconds
      }
    } else if (pet?.type === 'panda') {
      if (activeAnimation === 'feed') {
        frames = pandaEatFrames;
        duration = 9000; // 9 seconds
      } else if (activeAnimation === 'pet') {
        frames = pandaPetFrames;
        duration = 9000; // 9 seconds
      } else {
        frames = pandaPlayFrames;
        duration = 9000; // 9 seconds
      }
    } else if (pet?.type === 'koala') {
      if (activeAnimation === 'feed') {
        frames = koalaEatFrames;
        duration = 9000; // 9 seconds
      } else if (activeAnimation === 'pet') {
        frames = koalaPetFrames;
        duration = 9000; // 9 seconds
      } else {
        frames = koalaPlayFrames;
        duration = 9000; // 9 seconds
      }
    } else {
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

  const handleThemeSelect = (selectedTheme: string) => {
    // Check if theme is purchased or is a free starter theme
    if (purchasedThemes.includes(selectedTheme) || ['serene', 'purple-skies', 'orange-kiss'].includes(selectedTheme)) {
      setPetsTheme(selectedTheme as PetsTheme);
    setShowThemeDropdown(false);
    }
  };

  const handleThemeEquip = (themeKey: string) => {
    // Equip the theme (change background)
    setPetsTheme(themeKey as PetsTheme);
    setShowThemesModal(false);
    setTimeout(() => {
      setShowShopModal(true);
      shopModalScale.setValue(0.9);
      Animated.spring(shopModalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  const handleThemePurchase = async (themeKey: string) => {
    const theme = ALL_THEMES[themeKey];
    if (!theme) return;

    // Check if already purchased - don't do anything, equip is handled separately
    if (purchasedThemes.includes(themeKey)) {
      return;
    }

    // Check if user has sufficient coins
    if (coins < theme.price) {
      setPurchaseErrorMessage(`You need ${theme.price} coins to purchase this theme!`);
      setShowPurchaseError(true);
      setTimeout(() => {
        setShowPurchaseError(false);
      }, 3000);
      return;
    }

    // Deduct coins
    const newCoins = coins - theme.price;
    setCoins(newCoins);
    await saveCoins(newCoins);

    // Add theme to purchased themes
    const updatedPurchasedThemes = [...purchasedThemes, themeKey];
    setPurchasedThemes(updatedPurchasedThemes);
    await savePurchasedThemes(updatedPurchasedThemes);

    // Close themes modal and return to shop category modal
    setShowThemesModal(false);
    setTimeout(() => {
      setShowShopModal(true);
      shopModalScale.setValue(0.9);
      Animated.spring(shopModalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  // Handle pet purchase from shop
  const handlePetPurchase = async (petKey: string) => {
    const petData = SHOP_PETS[petKey];
    if (!petData) return;

    // Check if already purchased
    if (purchasedPets.includes(petKey)) {
      return;
    }

    // Check if user has sufficient coins
    if (coins < petData.price) {
      setPurchaseErrorMessage(`You need ${petData.price} coins to purchase this pet!`);
      setShowPurchaseError(true);
      setTimeout(() => {
        setShowPurchaseError(false);
      }, 3000);
      return;
    }

    // Deduct coins
    const newCoins = coins - petData.price;
    setCoins(newCoins);
    await saveCoins(newCoins);

    // Add pet to purchased pets
    const updatedPurchasedPets = [...purchasedPets, petKey];
    setPurchasedPets(updatedPurchasedPets);
    await savePurchasedPets(updatedPurchasedPets);
    
    // Stay on pets modal to show "OWNED" status
  };

  // Handle revival insurance purchase
  const handleBuyRevivalInsurance = async () => {
    const price = 15;
    if (coins < price) {
      setPurchaseErrorMessage(`You need ${price} coins to purchase Revival Insurance!`);
      setShowPurchaseError(true);
      setTimeout(() => setShowPurchaseError(false), 3000);
      return;
    }

    const newCoins = coins - price;
    setCoins(newCoins);
    await saveCoins(newCoins);

    const newTokens = revivalTokens + 1;
    setRevivalTokens(newTokens);
    await saveRevivalTokens(newTokens);

    // Return to shop category modal
    setShowItemsModal(false);
    setTimeout(() => {
      setShowShopModal(true);
      shopModalScale.setValue(0.9);
      Animated.spring(shopModalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  // Handle health potion purchase
  const handleBuyHealthPotion = async () => {
    const price = 5;
    if (coins < price) {
      setPurchaseErrorMessage(`You need ${price} coins to purchase Health Potion!`);
      setShowPurchaseError(true);
      setTimeout(() => setShowPurchaseError(false), 3000);
      return;
    }

    const newCoins = coins - price;
    setCoins(newCoins);
    await saveCoins(newCoins);

    const newPotions = healthPotions + 1;
    setHealthPotions(newPotions);
    await saveHealthPotions(newPotions);

    // Return to shop category modal
    setShowItemsModal(false);
    setTimeout(() => {
      setShowShopModal(true);
      shopModalScale.setValue(0.9);
      Animated.spring(shopModalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  // Use health potion to restore 2 hearts
  const useHealthPotion = async () => {
    if (!pet) return;
    
    const currentHealth = getCurrentHealth(pet);
    console.log('Using potion - current health:', currentHealth, 'stored health:', pet.health, 'lastPotion:', pet.lastPotion);
    
    if (healthPotions <= 0 || currentHealth >= 5 || currentHealth === 0) {
      console.log('Cannot use potion - potions:', healthPotions, 'currentHealth:', currentHealth);
      return;
    }

    const newHealth = Math.min(5, currentHealth + 2);
    const now = Date.now();

    // Using potion counts as an interaction, resets the decline clock
    const updatedPet: Pet = {
      ...pet,
      health: newHealth, // This becomes the new baseline for health calculation
      lastPotion: now, // Track when potion was used - this resets the decay clock
    };
    
    console.log('Potion applied - new health:', newHealth, 'lastPotion:', now);
    
    // IMPORTANT: Await the save to prevent race conditions
    await savePet(updatedPet, updatedPet.type);
    setPet(updatedPet);

    const newPotions = healthPotions - 1;
    setHealthPotions(newPotions);
    await saveHealthPotions(newPotions);
    
    // Verify the save worked
    console.log('Potion complete - pet state updated, health should be:', getCurrentHealth(updatedPet));
  };

  // Helper function to render a theme item
  const renderThemeItem = (themeKey: string, imageSource: any, displayName: string, price: number, isExclusive: boolean = false) => {
    const isPurchased = purchasedThemes.includes(themeKey);
    const isEquipped = petsTheme === themeKey;
    return (
      <View
        key={themeKey}
        style={[
          styles.themeItem,
          isExclusive && styles.exclusiveThemeItem,
          isPurchased && styles.themeItemPurchased,
          isEquipped && styles.themeItemEquipped
        ]}
      >
        <Image
          source={imageSource}
          style={styles.themePreview}
          resizeMode="cover"
        />
        <Text style={styles.themeName}>{displayName}</Text>
        {isPurchased ? (
          <View style={styles.themePurchasedContainer}>
            <Text style={styles.themePurchasedText}>PURCHASED</Text>
            <TouchableOpacity
              style={[
                styles.equipButton,
                isEquipped && styles.equipButtonActive
              ]}
              onPress={() => handleThemeEquip(themeKey)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.equipButtonText,
                isEquipped && styles.equipButtonTextActive
              ]}>
                {isEquipped ? 'EQUIPPED' : 'EQUIP'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.themePriceContainer}
            onPress={() => handleThemePurchase(themeKey)}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/rewards/coins.png')}
              style={styles.coinIcon}
              resizeMode="contain"
            />
            <Text style={isExclusive ? styles.exclusiveThemePrice : styles.themePrice}>
              {price}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getThemeDisplayName = (theme: string): string => {
    const themeData = ALL_THEMES[theme] || PETS_THEMES[theme as PetsTheme];
    if (!themeData) return theme.toUpperCase();
    const name = themeData.name;
    const upperName = name.toUpperCase();
    
    // Split longer names into 2 lines
    const words = upperName.split(' ');
    
    // For names with 2 words, split them
    if (words.length === 2) {
      return `${words[0]}\n${words[1]}`;
    }
    
    // For names with 3+ words, split after first word or two
    if (words.length >= 3) {
      // For "Feels Like 2002" or "Feels Like Christmas", split after "FEELS"
      if (words[0] === 'FEELS' && words[1] === 'LIKE') {
        return `${words[0]} ${words[1]}\n${words.slice(2).join(' ')}`;
      }
      // For "Oh So Flowery", split after "OH"
      if (words[0] === 'OH' && words[1] === 'SO') {
        return `${words[0]} ${words[1]}\n${words.slice(2).join(' ')}`;
      }
      // Default: split after first word
      return `${words[0]}\n${words.slice(1).join(' ')}`;
    }
    
    // For single word names that are long, check if they need splitting
    // "Therapeutic" is long enough to potentially overflow
    if (upperName === 'THERAPEUTIC') {
      return 'THERA\nPEUTIC';
    }
    
    // Single word names stay on one line
    return upperName;
  };

  const calculateStreak = (pet: Pet | null): number => {
    // Use originalCreatedAt for streak calculation (survives revivals)
    const creationTime = pet?.originalCreatedAt || pet?.createdAt;
    if (!pet || !creationTime) {
      return 0;
    }
    
    // If pet is currently dead, streak pauses (shows 0)
    // But once revived, streak continues from originalCreatedAt
    if (getCurrentHealth(pet) === 0) {
      return 0;
    }
    
    // Get midnight of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    // Get midnight of original creation day (survives revivals)
    const creationDate = new Date(creationTime);
    creationDate.setHours(0, 0, 0, 0);
    const creationTimestamp = creationDate.getTime();
    
    // Calculate days difference (including today)
    const daysDifference = Math.floor((todayTimestamp - creationTimestamp) / (24 * 60 * 60 * 1000));
    
    // Streak is days alive (including creation day), so add 1
    return Math.max(1, daysDifference + 1);
  };

  const handleShareStreak = async () => {
    if (!pet || !shareViewRef.current) {
      return;
    }
    
    try {
      const uri = await shareViewRef.current.capture();
      await Share.share({
        url: uri,
        message: `🔥 ${pet.name} has been alive for ${calculateStreak(pet)} ${calculateStreak(pet) === 1 ? 'day' : 'days'}! Keep the streak going! 🐱`,
      });
    } catch (error) {
      console.error('Error sharing streak:', error);
    }
  };

  const getCompletedTasksCount = (): number => {
    return tasks.filter(task => task.completed).length;
  };

  const handlePetSelect = async (petType: PetType) => {
    // Reload global items to ensure they persist across pets
    const tokens = await loadRevivalTokens();
    const potions = await loadHealthPotions();
    setRevivalTokens(tokens);
    setHealthPotions(potions);
    
    if (petType === 'none') {
      setPet(null);
      savePet(null); // Clear from storage (no type needed for clearing)
      setShowPetDropdown(false);
    } else if (purchasedPets.includes(petType)) {
      // Pet is purchased, can be selected
      // Check if pet of this type already exists
      loadPet(petType).then((existingPet) => {
        if (existingPet) {
          // Pet already exists, switch to it
          // Ensure backward compatibility
          const petWithNewFields = {
            ...existingPet,
            originalCreatedAt: existingPet.originalCreatedAt || existingPet.createdAt,
            lastPotion: existingPet.lastPotion || 0,
            lastRevival: existingPet.lastRevival || 0,
          };
          
          // Recalculate health based on time since last interaction
          // Include potion and revival in the calculation
          const lastInteraction = Math.max(
            petWithNewFields.lastFed || 0,
            petWithNewFields.lastPet || 0,
            petWithNewFields.lastPlay || 0,
            petWithNewFields.lastPotion || 0,
            petWithNewFields.lastRevival || 0
          );
          
          // CRITICAL: Do NOT overwrite stored health with calculated health!
          // The stored health is the baseline from the last interaction.
          // We only calculate health for display - we should NEVER overwrite the stored baseline.
          // Just set the pet state - the displayed health will be calculated by getCurrentHealth()
          setPet(petWithNewFields as Pet);
          // Only save if we're adding missing metadata fields, NOT to update health
          if (!existingPet.originalCreatedAt || !existingPet.lastPotion || !existingPet.lastRevival) {
            savePet(petWithNewFields, petWithNewFields.type);
          }
          setShowPetDropdown(false);
        } else {
          // New pet, show name modal
          setSelectedPetType(petType);
      setShowPetDropdown(false);
      setShowNameModal(true);
          // Auto-show keyboard when modal opens
          setTimeout(() => setShowKeyboard(true), 100);
        }
      });
    } else {
      // Pet not purchased - show shop message
      setPurchaseErrorMessage(`Purchase ${SHOP_PETS[petType]?.name || petType} from the shop first!`);
      setShowPurchaseError(true);
      setTimeout(() => {
        setShowPurchaseError(false);
      }, 3000);
      setShowPetDropdown(false);
    }
  };

  // Handle delete pet button click
  const handleDeletePetClick = (petType: PetType) => {
    setPetToDelete(petType);
    setShowDeletePetConfirm(true);
    setShowPetDropdown(false);
  };

  // Confirm and delete pet
  const confirmDeletePet = async () => {
    if (!petToDelete) return;
    
    // Delete from storage
    await deletePet(petToDelete);
    
    // If the deleted pet was the current pet, clear it
    if (pet?.type === petToDelete) {
      setPet(null);
    }
    
    // Close confirmation modal
    setShowDeletePetConfirm(false);
    setPetToDelete(null);
  };

  // Cancel delete
  const cancelDeletePet = () => {
    setShowDeletePetConfirm(false);
    setPetToDelete(null);
  };

  const handleNameSubmit = () => {
    if (petName.trim()) {
      const now = Date.now();
      
      const newPet: Pet = {
        type: selectedPetType,
        name: petName.trim().replace(/\s+/g, '').toUpperCase(), // Remove all spaces
        health: 5,
        lastFed: now, // Start with interaction time so clock starts now
        lastPet: 0, // Initialize to 0 so action can be done
        lastPlay: 0, // Initialize to 0 so action can be done
        lastPotion: 0, // No potions used yet
        lastRevival: 0, // No revivals used yet
        createdAt: now, // Used for health decline reference
        originalCreatedAt: now, // Never changes - used for streak counting
      };
      setPet(newPet);
      savePet(newPet, selectedPetType); // Save to storage with pet type
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
      savePet(renamedPet, renamedPet.type); // Save to storage
      setShowRenameModal(false);
      setRenameInput('');
      setShowKeyboard(false);
    }
  };

  const handleFeed = async () => {
    if (pet) {
      const currentHealth = getCurrentHealth(pet);
      if (currentHealth === 0) {
        // Show revive popup if cat is dead
        setShowRevivePopup(true);
      } else if (currentHealth >= 5) {
        // Health is already full
        setShowFullHealthAlert(true);
      } else if (currentHealth > 0 && currentHealth < 5) {
        // Check if feed was already done today
        if (wasActionDoneToday(pet.lastFed)) {
          setTryAgainActionType('feed');
          setShowTryAgainPopup(true);
          return; // Already fed today, show popup
        }
        
        setActiveAnimation('feed');
        const newHealth = Math.min(5, currentHealth + 1); // Cap at 5
        const now = Date.now();
        
        // Update health and lastFed - the 4.8 hour clock resets from this interaction
        // Store the NEW health as the baseline for future decline calculations
        const updatedPet: Pet = {
          type: pet.type,
          name: pet.name,
          health: newHealth, // This becomes the new baseline
          lastFed: now, // This resets the decline clock
          lastPet: pet.lastPet,
          lastPlay: pet.lastPlay,
          lastPotion: pet.lastPotion, // Preserve potion timestamp
          lastRevival: pet.lastRevival, // Preserve revival timestamp
          createdAt: pet.createdAt, // Keep createdAt for streak counting
          originalCreatedAt: pet.originalCreatedAt, // Keep original creation time
        };
        // IMPORTANT: Save first, then update state to prevent race conditions
        console.log(`[FEED] BEFORE SAVE - currentHealth: ${currentHealth}, newHealth: ${newHealth}, pet.health (stored): ${pet.health}, lastFed (old): ${pet.lastFed}`);
        
        // Validate: newHealth should be at least currentHealth + 1 (unless at max)
        if (newHealth < currentHealth) {
          console.error(`[FEED] ERROR - newHealth (${newHealth}) is less than currentHealth (${currentHealth})! This should never happen.`);
        }
        
        await savePet(updatedPet, updatedPet.type);
        setPet(updatedPet);
        
        // Verify what was actually saved - CRITICAL CHECK
        const verifyPet = await loadPet(updatedPet.type);
        if (verifyPet && verifyPet.health !== newHealth) {
          console.error(`[FEED] SAVE FAILED! Tried to save health: ${newHealth}, but stored health is: ${verifyPet.health}`);
          // Try saving again
          await savePet(updatedPet, updatedPet.type);
          const verifyPet2 = await loadPet(updatedPet.type);
          console.log(`[FEED] RETRY SAVE - saved health: ${verifyPet2?.health}`);
        } else {
          console.log(`[FEED] AFTER SAVE - saved health: ${verifyPet?.health}, saved lastFed: ${verifyPet?.lastFed}, calculated health now: ${getCurrentHealth(updatedPet)}`);
        }
        console.log('Fed pet - stored health:', updatedPet.health, 'lastFed:', now, 'calculated health after save:', getCurrentHealth(updatedPet));
      }
    }
  };

  const handlePet = async () => {
    if (pet) {
      const currentHealth = getCurrentHealth(pet);
      if (currentHealth === 0) {
        // Show revive popup if cat is dead
        setShowRevivePopup(true);
      } else if (currentHealth >= 5) {
        // Health is already full
        setShowFullHealthAlert(true);
      } else if (currentHealth > 0 && currentHealth < 5) {
        // Check if pet was already done today
        if (wasActionDoneToday(pet.lastPet)) {
          setTryAgainActionType('pet');
          setShowTryAgainPopup(true);
          return; // Already petted today, show popup
        }
        
        setActiveAnimation('pet');
        const newHealth = Math.min(5, currentHealth + 1); // Cap at 5
        const now = Date.now();
        
        // Update health and lastPet - the 4.8 hour clock resets from this interaction
        const updatedPet: Pet = {
          type: pet.type,
          name: pet.name,
          health: newHealth, // This becomes the new baseline
          lastFed: pet.lastFed,
          lastPet: now, // This resets the decline clock
          lastPlay: pet.lastPlay,
          lastPotion: pet.lastPotion, // Preserve potion timestamp
          lastRevival: pet.lastRevival, // Preserve revival timestamp
          createdAt: pet.createdAt, // Keep createdAt for streak counting
          originalCreatedAt: pet.originalCreatedAt, // Keep original creation time
        };
        // IMPORTANT: Save first, then update state to prevent race conditions
        console.log(`[PET] BEFORE SAVE - currentHealth: ${currentHealth}, newHealth: ${newHealth}, pet.health (stored): ${pet.health}, lastPet (old): ${pet.lastPet}`);
        
        // Validate: newHealth should be at least currentHealth + 1 (unless at max)
        if (newHealth < currentHealth) {
          console.error(`[PET] ERROR - newHealth (${newHealth}) is less than currentHealth (${currentHealth})! This should never happen.`);
        }
        
        await savePet(updatedPet, updatedPet.type);
        setPet(updatedPet);
        
        // Verify what was actually saved - CRITICAL CHECK
        const verifyPet = await loadPet(updatedPet.type);
        if (verifyPet && verifyPet.health !== newHealth) {
          console.error(`[PET] SAVE FAILED! Tried to save health: ${newHealth}, but stored health is: ${verifyPet.health}`);
          // Try saving again
          await savePet(updatedPet, updatedPet.type);
          const verifyPet2 = await loadPet(updatedPet.type);
          console.log(`[PET] RETRY SAVE - saved health: ${verifyPet2?.health}`);
        } else {
          console.log(`[PET] AFTER SAVE - saved health: ${verifyPet?.health}, saved lastPet: ${verifyPet?.lastPet}, calculated health now: ${getCurrentHealth(updatedPet)}`);
        }
      }
    }
  };

  const handlePlay = async () => {
    if (pet) {
      const currentHealth = getCurrentHealth(pet);
      if (currentHealth === 0) {
        // Show revive popup if cat is dead
        setShowRevivePopup(true);
      } else if (currentHealth >= 5) {
        // Health is already full
        setShowFullHealthAlert(true);
      } else if (currentHealth > 0 && currentHealth < 5) {
        // Check if play was already done today
        if (wasActionDoneToday(pet.lastPlay)) {
          setTryAgainActionType('play');
          setShowTryAgainPopup(true);
          return; // Already played today, show popup
        }
        
        setActiveAnimation('play');
        const newHealth = Math.min(5, currentHealth + 1); // Cap at 5
        const now = Date.now();
        
        // Update health and lastPlay - the 4.8 hour clock resets from this interaction
        const updatedPet: Pet = {
          type: pet.type,
          name: pet.name,
          health: newHealth, // This becomes the new baseline
          lastFed: pet.lastFed,
          lastPet: pet.lastPet,
          lastPlay: now, // This resets the decline clock
          lastPotion: pet.lastPotion, // Preserve potion timestamp
          lastRevival: pet.lastRevival, // Preserve revival timestamp
          createdAt: pet.createdAt, // Keep createdAt for streak counting
          originalCreatedAt: pet.originalCreatedAt, // Keep original creation time
        };
        // IMPORTANT: Save first, then update state to prevent race conditions
        console.log(`[PLAY] BEFORE SAVE - currentHealth: ${currentHealth}, newHealth: ${newHealth}, pet.health (stored): ${pet.health}, lastPlay (old): ${pet.lastPlay}`);
        
        // Validate: newHealth should be at least currentHealth + 1 (unless at max)
        if (newHealth < currentHealth) {
          console.error(`[PLAY] ERROR - newHealth (${newHealth}) is less than currentHealth (${currentHealth})! This should never happen.`);
        }
        
        await savePet(updatedPet, updatedPet.type);
        setPet(updatedPet);
        
        // Verify what was actually saved - CRITICAL CHECK
        const verifyPet = await loadPet(updatedPet.type);
        if (verifyPet && verifyPet.health !== newHealth) {
          console.error(`[PLAY] SAVE FAILED! Tried to save health: ${newHealth}, but stored health is: ${verifyPet.health}`);
          // Try saving again
          await savePet(updatedPet, updatedPet.type);
          const verifyPet2 = await loadPet(updatedPet.type);
          console.log(`[PLAY] RETRY SAVE - saved health: ${verifyPet2?.health}`);
        } else {
          console.log(`[PLAY] AFTER SAVE - saved health: ${verifyPet?.health}, saved lastPlay: ${verifyPet?.lastPlay}, calculated health now: ${getCurrentHealth(updatedPet)}`);
        }
      }
    }
  };

  const handleRevive = async () => {
    if (!pet) return;
    
    // Check if we have revival tokens first (free revival)
    if (revivalTokens > 0) {
      // Use revival token
      const newTokens = revivalTokens - 1;
      setRevivalTokens(newTokens);
      await saveRevivalTokens(newTokens);
    } else if (coins >= 5) {
      // Deduct 5 coins
      const newCoins = coins - 5;
      setCoins(newCoins);
      await saveCoins(newCoins);
    } else {
      // Not enough coins and no tokens
      return;
    }
    
    const now = Date.now();
    
    // Revive the pet with full health
    // lastRevival resets the 4.8 hour decline clock
    // originalCreatedAt is preserved for streak counting (streak continues from original creation!)
    const revivedPet: Pet = {
        ...pet,
      health: 5,
      lastRevival: now, // Track when revival was used - this resets the decline clock
      // Keep originalCreatedAt for streak counting - streak continues!
      originalCreatedAt: pet.originalCreatedAt || pet.createdAt || now,
      // Reset action timestamps so they can be done again
      lastFed: 0,
      lastPet: 0,
      lastPlay: 0,
      lastPotion: 0,
    };
    
    console.log(`[REVIVE] BEFORE SAVE - health: 5, lastRevival: ${now}, pet.health (old): ${pet.health}`);
    // IMPORTANT: Await the save to prevent race conditions
    await savePet(revivedPet, revivedPet.type);
    setPet(revivedPet);
    
    // Verify what was actually saved - CRITICAL CHECK
    const verifyPet = await loadPet(revivedPet.type);
    if (verifyPet && verifyPet.health !== 5) {
      console.error(`[REVIVE] SAVE FAILED! Tried to save health: 5, but stored health is: ${verifyPet.health}`);
      // Try saving again - this is critical!
      await savePet(revivedPet, revivedPet.type);
      const verifyPet2 = await loadPet(revivedPet.type);
      if (verifyPet2 && verifyPet2.health !== 5) {
        console.error(`[REVIVE] RETRY ALSO FAILED! Stored health is still: ${verifyPet2.health}. This is a critical error!`);
      } else {
        console.log(`[REVIVE] RETRY SUCCESS - saved health: ${verifyPet2?.health}`);
        // Update state with the verified pet
        if (verifyPet2) {
          setPet(verifyPet2 as Pet);
        }
      }
    } else {
      console.log(`[REVIVE] AFTER SAVE - saved health: ${verifyPet?.health}, saved lastRevival: ${verifyPet?.lastRevival}, calculated health now: ${getCurrentHealth(revivedPet)}`);
    }
    
    setShowRevivePopup(false);
    setActiveAnimation(null);
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
    if (pet && displayedHealth === 0 && coins < 5) {
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
    if (displayedHealth === 0) return 'dead';
    
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) return 'sleeping';
    
    const hoursSinceLastFeed = (Date.now() - pet.lastFed) / (1000 * 60 * 60);
    if (hoursSinceLastFeed > 3) return 'hungry';
    if (displayedHealth < 3) return 'sad';
    
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
            source={(ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).background}
            style={styles.backgroundGif}
            resizeMode="cover"
          />
          
          {/* Top Bar with Dropdowns and Health Bar */}
          <View style={styles.topBar}>
            {/* Theme Selector Dropdown */}
            <View style={styles.dropdownWrapper}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowThemeDropdown(!showThemeDropdown);
                  setShowPetDropdown(false);
                  setShowActionsDropdown(false);
                }}
                style={({ pressed }) => [
                  styles.dropdownButton, 
                  { 
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color
                  },
                  pressed ? styles.dropdownButtonPressed : styles.dropdownButtonRaised,
                ]}
              >
                <Text 
                  style={[styles.dropdownLabel, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}
                  numberOfLines={2}
                >
                  {getThemeDisplayName(petsTheme)}
                </Text>
                <Text style={[styles.dropdownArrow, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>▼</Text>
              </Pressable>

              {showThemeDropdown && (
                <View style={[styles.dropdownMenu, { backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                  {purchasedThemes.map((themeKey) => {
                    const themeData = ALL_THEMES[themeKey] || PETS_THEMES[themeKey as PetsTheme];
                    if (!themeData) return null;
                    return (
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
                        <View style={[styles.colorIndicator, { backgroundColor: themeData.color }]} />
                        <Text style={[styles.dropdownOptionText, { color: themeData.color }]}>
                          {themeData.name}
                      </Text>
                    </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Pet Selector Dropdown */}
            <View style={styles.dropdownWrapper}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowPetDropdown(!showPetDropdown);
                  setShowThemeDropdown(false);
                  setShowActionsDropdown(false);
                }}
                style={({ pressed }) => [
                  styles.dropdownButton, 
                  { 
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color
                  },
                  pressed ? styles.dropdownButtonPressed : styles.dropdownButtonRaised,
                ]}
              >
                <View style={styles.dropdownLabelWithIcon}>
                  {pet && (
                    <Image 
                      source={
                        pet.type === 'cat' ? require('../../assets/pets/cat/catsit2.png') :
                        pet.type === 'puppy' ? require('../../assets/pets/puppy/puppysit2.png') :
                        pet.type === 'panda' ? require('../../assets/pets/panda/pandasit2.png') :
                        pet.type === 'koala' ? require('../../assets/pets/koala/koalasit2.png') :
                        require('../../assets/pets/cat/catsit2.png')
                      }
                      style={styles.dropdownPetIcon}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={[styles.dropdownLabel, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                    {pet ? pet.type.toUpperCase() : 'None'}
                  </Text>
                </View>
                <Text style={[styles.dropdownArrow, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>▼</Text>
              </Pressable>

              {showPetDropdown && (
                <View style={[styles.dropdownMenu, { backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
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
                    <Text style={[styles.dropdownOptionText, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>None</Text>
                  </TouchableOpacity>
                  
                  {/* Cat - always owned, can delete if created */}
                  <View style={[styles.dropdownOptionRow, { backgroundColor: pet?.type === 'cat' ? 'rgba(255, 255, 255, 0.1)' : 'transparent', borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1 }]}>
                  <TouchableOpacity
                    onPress={() => handlePetSelect('cat')}
                      style={styles.dropdownOptionContent}
                    >
                      <View style={styles.dropdownOptionWithIcon}>
                        <Image source={require('../../assets/pets/cat/catsit2.png')} style={styles.dropdownOptionIcon} resizeMode="contain" />
                        <Text style={[styles.dropdownOptionText, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>Cat</Text>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => handleDeletePetClick('cat')}
                      style={styles.deleteButton}
                  >
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                  </View>
                  
                  {/* Puppy */}
                  <View style={[styles.dropdownOptionRow, { backgroundColor: pet?.type === 'puppy' ? 'rgba(255, 255, 255, 0.1)' : 'transparent', borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, opacity: purchasedPets.includes('puppy') ? 1 : 0.6 }]}>
                  <TouchableOpacity
                      onPress={() => handlePetSelect('puppy')}
                      style={styles.dropdownOptionContent}
                  >
                      <View style={styles.dropdownOptionWithIcon}>
                        <Image source={require('../../assets/pets/puppy/puppysit2.png')} style={[styles.dropdownOptionIcon, !purchasedPets.includes('puppy') && { opacity: 0.5 }]} resizeMode="contain" />
                        <Text style={[styles.dropdownOptionText, { color: purchasedPets.includes('puppy') ? (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color : '#888888' }]}>
                          Puppy {!purchasedPets.includes('puppy') && '🔒'}
                        </Text>
                      </View>
                  </TouchableOpacity>
                    {purchasedPets.includes('puppy') && (
                      <TouchableOpacity
                        onPress={() => handleDeletePetClick('puppy')}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    )}
                </View>
                  
                  {/* Panda */}
                  <View style={[styles.dropdownOptionRow, { borderBottomColor: 'rgba(255, 255, 255, 0.2)', borderBottomWidth: 1, opacity: purchasedPets.includes('panda') ? 1 : 0.6 }]}>
                    <TouchableOpacity
                      onPress={() => handlePetSelect('panda')}
                      style={styles.dropdownOptionContent}
                    >
                      <View style={styles.dropdownOptionWithIcon}>
                        <Image source={require('../../assets/pets/panda/pandasit2.png')} style={[styles.dropdownOptionIcon, !purchasedPets.includes('panda') && { opacity: 0.5 }]} resizeMode="contain" />
                        <Text style={[styles.dropdownOptionText, { color: purchasedPets.includes('panda') ? (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color : '#888888' }]}>
                          Panda {!purchasedPets.includes('panda') && '🔒'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {purchasedPets.includes('panda') && (
                      <TouchableOpacity
                        onPress={() => handleDeletePetClick('panda')}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    )}
          </View>

                  {/* Koala */}
                  <View style={[styles.dropdownOptionRow, { opacity: purchasedPets.includes('koala') ? 1 : 0.6 }]}>
                    <TouchableOpacity
                      onPress={() => handlePetSelect('koala')}
                      style={styles.dropdownOptionContent}
                    >
                      <View style={styles.dropdownOptionWithIcon}>
                        <Image source={require('../../assets/pets/koala/koalasit2.png')} style={[styles.dropdownOptionIcon, !purchasedPets.includes('koala') && { opacity: 0.5 }]} resizeMode="contain" />
                        <Text style={[styles.dropdownOptionText, { color: purchasedPets.includes('koala') ? (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color : '#888888' }]}>
                          Koala {!purchasedPets.includes('koala') && '🔒'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {purchasedPets.includes('koala') && (
                      <TouchableOpacity
                        onPress={() => handleDeletePetClick('koala')}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              </View>

            {/* Health Bar and Coins - Top Right */}
            <View style={styles.topRightContainer}>
              {pet && (
                <TouchableOpacity 
                  key={`health-${displayedHealth}-${pet.lastFed}-${pet.lastPet}-${pet.lastPlay}`} 
                  style={styles.healthBarContainer}
                  onPress={() => setShowHealthDecayTimer(true)}
                  activeOpacity={0.7}
                >
                  <Image 
                    key={`heart-${displayedHealth}`}
                    source={
                      displayedHealth === 5 ? require('../../assets/pets/health/heart5 .png') :
                      displayedHealth === 4 ? require('../../assets/pets/health/heart4.png') :
                      displayedHealth === 3 ? require('../../assets/pets/health/heart3.png') :
                      displayedHealth === 2 ? require('../../assets/pets/health/heart2.png') :
                      displayedHealth === 1 ? require('../../assets/pets/health/heart1.png') :
                      require('../../assets/pets/health/heart0.png')
                    }
                    style={styles.healthHeart}
                    resizeMode="contain"
                  />
                  <Image 
                    key={`bar-${displayedHealth}`}
                    source={
                      displayedHealth === 5 ? require('../../assets/pets/health/bar5.png') :
                      displayedHealth === 4 ? require('../../assets/pets/health/bar4.png') :
                      displayedHealth === 3 ? require('../../assets/pets/health/bar3.png') :
                      displayedHealth === 2 ? require('../../assets/pets/health/bar2.png') :
                      displayedHealth === 1 ? require('../../assets/pets/health/bar1.png') :
                      require('../../assets/pets/health/bar0.png')
                    }
                    style={styles.healthBarImage}
                    resizeMode="contain"
                  />
              </TouchableOpacity>
              )}
              
              {/* Actions Dropdown */}
              {pet && (
                <View style={styles.dropdownWrapper}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowActionsDropdown(!showActionsDropdown);
                      setShowThemeDropdown(false);
                      setShowPetDropdown(false);
                    }}
                    style={({ pressed }) => [
                      styles.dropdownButton, 
                      { 
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color
                      },
                      pressed ? styles.dropdownButtonPressed : styles.dropdownButtonRaised,
                    ]}
                  >
                    <Text style={[styles.dropdownLabel, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                      ACTIONS
              </Text>
                    <Text style={[styles.dropdownArrow, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>▼</Text>
                  </Pressable>

                  {showActionsDropdown && (
                    <View style={[styles.dropdownMenu, styles.actionsDropdownMenu, { backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                <TouchableOpacity
                        onPress={() => {
                          handleFeed();
                          setShowActionsDropdown(false);
                        }}
                        style={[
                          styles.dropdownOption,
                          { 
                            borderBottomColor: 'rgba(255, 255, 255, 0.2)'
                          }
                        ]}
                      >
                        <Text style={[styles.dropdownOptionText, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                          FEED
                        </Text>
                </TouchableOpacity>
                <TouchableOpacity
                        onPress={() => {
                          handlePet();
                          setShowActionsDropdown(false);
                        }}
                        style={[
                          styles.dropdownOption,
                          { 
                            borderBottomColor: 'rgba(255, 255, 255, 0.2)'
                          }
                        ]}
                      >
                        <Text style={[styles.dropdownOptionText, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                          PET
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          handlePlay();
                          setShowActionsDropdown(false);
                        }}
                        style={[
                          styles.dropdownOption
                        ]}
                      >
                        <Text style={[styles.dropdownOptionText, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                          PLAY
                        </Text>
                </TouchableOpacity>
              </View>
                  )}
                </View>
              )}
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
              
              {/* Animated Pet Sprite */}
              {displayedHealth === 0 ? (
                <Image
                  source={
                    pet.type === 'puppy' 
                      ? require('../../assets/pets/puppy/puppydead.png')
                      : pet.type === 'panda'
                      ? require('../../assets/pets/panda/pandadead.png')
                      : pet.type === 'koala'
                      ? require('../../assets/pets/koala/koaladead.png')
                      : require('../../assets/pets/cat/catdead.png')
                  }
                  style={styles.catSprite}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={
                    pet.type === 'puppy'
                      ? activeAnimation === 'feed'
                        ? puppyEatFrames[animationFrame % puppyEatFrames.length]
                        : activeAnimation === 'pet'
                        ? happyPuppyFrames[animationFrame % happyPuppyFrames.length]
                        : activeAnimation === 'play'
                        ? puppyPlayFrames[animationFrame % puppyPlayFrames.length]
                        : displayedHealth === 1
                        ? puppyCryFrames[sadAnimationFrame % puppyCryFrames.length]
                        : puppySitFrames[currentCatFrame % puppySitFrames.length]
                      : pet.type === 'panda'
                      ? activeAnimation === 'feed'
                        ? pandaEatFrames[animationFrame % pandaEatFrames.length]
                        : activeAnimation === 'pet'
                        ? pandaPetFrames[animationFrame % pandaPetFrames.length]
                        : activeAnimation === 'play'
                        ? pandaPlayFrames[animationFrame % pandaPlayFrames.length]
                        : displayedHealth === 1
                        ? pandaCryFrames[sadAnimationFrame % pandaCryFrames.length]
                        : pandaSitFrames[currentCatFrame % pandaSitFrames.length]
                      : pet.type === 'koala'
                      ? activeAnimation === 'feed'
                        ? koalaEatFrames[animationFrame % koalaEatFrames.length]
                        : activeAnimation === 'pet'
                        ? koalaPetFrames[animationFrame % koalaPetFrames.length]
                        : activeAnimation === 'play'
                        ? koalaPlayFrames[animationFrame % koalaPlayFrames.length]
                        : displayedHealth === 1
                        ? koalaCryFrames[sadAnimationFrame % koalaCryFrames.length]
                        : koalaSitFrames[currentCatFrame % koalaSitFrames.length]
                      : activeAnimation === 'feed' 
                      ? catBowlFrames[animationFrame]
                      : activeAnimation === 'pet'
                      ? happyCatFrames[animationFrame]
                      : activeAnimation === 'play'
                      ? playCatFrames[animationFrame]
                      : displayedHealth === 1
                      ? sadCatFrames[sadAnimationFrame]
                      : displayedHealth === 2
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
              backgroundColor: `${(ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color}33`,
              borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color 
                },
                showKeyboard && styles.nameModalWithKeyboard
          ]}>
            <Text style={[styles.modalTitle, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>NAME YOUR PET</Text>
            <TouchableOpacity
              style={[
                styles.nameInput, 
                { 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color 
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
                    borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color 
                  }
                ]}
              >
                <Text style={[styles.modalButtonText, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNameSubmit}
                disabled={!petName.trim()}
                style={[
                  styles.modalButton, 
                  { 
                    backgroundColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color,
                    borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color 
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
                  backgroundColor: `${(ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color}33`,
                  borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color 
                },
                showKeyboard && styles.nameModalWithKeyboard
              ]}>
                <Text style={[styles.modalTitle, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>RENAME YOUR PET</Text>
                <TouchableOpacity
                  style={[
                    styles.nameInput, 
                    { 
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color 
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
                        borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color 
                      }
                    ]}
                  >
                    <Text style={[styles.modalButtonText, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleRenameSubmit}
                    disabled={!renameInput.trim()}
                    style={[
                      styles.modalButton, 
                      { 
                        backgroundColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color,
                        borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color 
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

          {/* Bottom Bar - Coins, Shop, Streak */}
          <View style={styles.bottomBar}>
            <Pressable
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // Reload items from storage to ensure latest values
                const tokens = await loadRevivalTokens();
                const potions = await loadHealthPotions();
                console.log('Button pressed - loaded tokens:', tokens, 'potions:', potions);
                // Set state and wait for next render cycle before showing popup
                setRevivalTokens(tokens);
                setHealthPotions(potions);
                // Delay to ensure state updates are complete before rendering popup
                requestAnimationFrame(() => {
                  setShowCoinsPopup(true);
                });
              }}
              style={({ pressed }) => [
                styles.bottomBarItem,
                pressed ? styles.bottomBarItemPressed : styles.bottomBarItemRaised,
              ]}
            >
              <Image 
                source={require('../../assets/rewards/coins.png')}
                style={styles.bottomBarIcon}
                resizeMode="contain"
              />
              <Text style={[styles.bottomBarText, { color: '#FFFFFF' }]}>{coins}</Text>
            </Pressable>
            
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowStreakPopup(true);
              }}
              style={({ pressed }) => [
                styles.bottomBarItem,
                pressed ? styles.bottomBarItemPressed : styles.bottomBarItemRaised,
              ]}
            >
              <Image 
                source={require('../../assets/icons/streak.png')}
                style={styles.bottomBarIcon}
                resizeMode="contain"
              />
              <Text style={[styles.bottomBarText, { color: '#FFFFFF' }]}>
                {pet ? `${calculateStreak(pet)} DAY${calculateStreak(pet) !== 1 ? 'S' : ''}` : '0 DAYS'}
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowShop(true);
                setCurrentShopBox(1);
                setShowShopModal(false);
                setShopMessage('Hello There!');
                setTreasureBoxMessage('click me!');
                shopTextOpacity.setValue(0);
                shopTextScale.setValue(0.8);
                treasureBoxOpacity.setValue(0);
                treasureBoxScale.setValue(0.8);
                // Show shopkeeper dialogue first
                Animated.parallel([
                  Animated.timing(shopTextOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                  Animated.spring(shopTextScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                  }),
                ]).start();
                // After 2 seconds, change shopkeeper message and show treasure box dialogue
                setTimeout(() => {
                  shopTextOpacity.setValue(0);
                  shopTextScale.setValue(0.8);
                  Animated.parallel([
                    Animated.timing(shopTextOpacity, {
                      toValue: 1,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                    Animated.spring(shopTextScale, {
                      toValue: 1,
                      tension: 50,
                      friction: 7,
                      useNativeDriver: true,
                    }),
                  ]).start();
                  setShopMessage('What would you like to buy today?');
                  // Show treasure box dialogue
                  Animated.parallel([
                    Animated.timing(treasureBoxOpacity, {
                      toValue: 1,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                    Animated.spring(treasureBoxScale, {
                      toValue: 1,
                      tension: 50,
                      friction: 7,
                      useNativeDriver: true,
                    }),
                  ]).start();
                }, 2000);
              }}
              style={({ pressed }) => [
                styles.bottomBarItem,
                pressed ? styles.bottomBarItemPressed : styles.bottomBarItemRaised,
              ]}
            >
              <Image 
                source={require('../../assets/icons/shop.png')}
                style={styles.bottomBarIcon}
                resizeMode="contain"
              />
              <Text style={[styles.bottomBarText, { color: '#FFFFFF' }]}>SHOP</Text>
            </Pressable>
          </View>

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
          {showRevivePopup && pet && displayedHealth === 0 && (
            <View style={styles.reviveOverlay}>
              <View style={styles.revivePopup}>
                <TouchableOpacity
                  onPress={() => setShowRevivePopup(false)}
                  style={styles.reviveCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reviveCloseButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.reviveText}>
                  {revivalTokens > 0 ? 'USE REVIVAL TOKEN' : 'USE 5 COINS TO REVIVE'}
                </Text>
                <View style={styles.reviveInfoContainer}>
                  {revivalTokens > 0 ? (
                    <View style={styles.reviveTokenInfo}>
                      <Image
                        source={require('../../assets/pets/shop/insurance.png')}
                        style={styles.reviveTokenIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.reviveInfoText}>TOKENS: {revivalTokens}</Text>
                    </View>
                  ) : (
                    <Text style={styles.reviveInfoText}>YOU HAVE {coins} COINS</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={(revivalTokens > 0 || coins >= 5) ? handleRevive : startGame}
                  style={[
                    styles.reviveButton,
                    (revivalTokens === 0 && coins < 5) && styles.reviveButtonDisabled
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.reviveButtonText,
                    (revivalTokens === 0 && coins < 5) && styles.reviveButtonTextDisabled
                  ]}>
                    {(revivalTokens > 0 || coins >= 5) ? 'REVIVE' : 'PLAY GAME'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Full Health Alert Popup */}
          {showFullHealthAlert && (
            <View style={styles.reviveOverlay}>
              <View style={[styles.revivePopup, { backgroundColor: `${(ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color}DD`, borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                <TouchableOpacity
                  onPress={() => setShowFullHealthAlert(false)}
                  style={styles.reviveCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reviveCloseButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={[styles.reviveText, { color: '#FFFFFF' }]}>HEALTH BAR IS FULL!</Text>
                <TouchableOpacity
                  onPress={() => setShowFullHealthAlert(false)}
                  style={[styles.reviveButton, { backgroundColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color, borderColor: '#FFFFFF' }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.reviveButtonText, { color: '#000000' }]}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Health Decay Timer Popup */}
          {showHealthDecayTimer && pet && (
            <View style={styles.reviveOverlay}>
              <View style={[styles.coinsPopup, { backgroundColor: `${(ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color}DD`, borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                <TouchableOpacity
                  onPress={() => setShowHealthDecayTimer(false)}
                  style={styles.reviveCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reviveCloseButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={[styles.coinsText, styles.coinsPopupDarkText]}>
                  NEXT HEART LOSS
                </Text>
                <Text style={[styles.healthTimerText, styles.coinsPopupDarkText]}>
                  {getTimeUntilNextDecay(pet)}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowHealthDecayTimer(false)}
                  style={[styles.reviveButton, { backgroundColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color, borderColor: '#FFFFFF' }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.reviveButtonText, { color: '#000000' }]}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Coins Popup - Shows coins count and items */}
          {showCoinsPopup && (
            <View style={styles.coinsOverlay}>
              <View 
                key={`coins-popup-${revivalTokens}-${healthPotions}`}
                style={[styles.coinsPopup, { backgroundColor: `${(ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color}DD`, borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                <TouchableOpacity
                  onPress={() => setShowCoinsPopup(false)}
                  style={styles.reviveCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reviveCloseButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={[styles.coinsText, styles.coinsPopupDarkText]}>
                  {coins} COINS
                </Text>
                
                {/* Items Section - Always show revival tokens and potions */}
                <View style={styles.coinsItemsSection}>
                  {/* Revival Insurance */}
                  <View style={styles.coinsItemRowFixed}>
                    <Image
                      source={require('../../assets/pets/shop/insurance.png')}
                      style={styles.coinsItemIconSmall}
                      resizeMode="contain"
                    />
                    <Text style={[styles.coinsItemTextFixed, styles.coinsPopupDarkText]}>
                      REVIVAL: {revivalTokens ?? 0}
                    </Text>
                    {/* Revival USE button - only when pet is dead (0 hearts) and has tokens */}
                    {revivalTokens > 0 && pet && displayedHealth === 0 ? (
                      <TouchableOpacity
                        onPress={() => {
                          handleRevive();
                          setShowCoinsPopup(false);
                        }}
                        style={styles.useItemButtonSmall}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.useItemButtonTextSmall}>USE</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.useItemButtonPlaceholder} />
                    )}
                  </View>
                  
                  {/* Health Potion */}
                  <View style={styles.coinsItemRowFixed}>
                    <Image
                      source={require('../../assets/pets/shop/potion.png')}
                      style={styles.coinsItemIconSmall}
                      resizeMode="contain"
                    />
                    <Text style={[styles.coinsItemTextFixed, styles.coinsPopupDarkText]}>
                      POTIONS: {healthPotions ?? 0}
                    </Text>
                    {/* Potion USE button - only when pet has 1-3 hearts */}
                    {healthPotions > 0 && pet && displayedHealth >= 1 && displayedHealth <= 3 ? (
                      <TouchableOpacity
                        onPress={() => {
                          useHealthPotion();
                          setShowCoinsPopup(false);
                        }}
                        style={styles.useItemButtonSmall}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.useItemButtonTextSmall}>USE</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.useItemButtonPlaceholder} />
                    )}
                  </View>
                </View>
                
                <TouchableOpacity
                  onPress={() => {
                    setShowCoinsPopup(false);
                    startGame();
                  }}
                  style={[styles.playToWinButton, { borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.playToWinButtonText, styles.coinsPopupDarkText]}>
                    PLAY TO WIN MORE!
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Streak Popup - Shows streak and share option */}
          {showStreakPopup && pet && (
            <View style={styles.coinsOverlay}>
              <View style={[styles.coinsPopup, { backgroundColor: `${(ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color}DD`, borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
                <TouchableOpacity
                  onPress={() => setShowStreakPopup(false)}
                  style={styles.reviveCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reviveCloseButtonText}>✕</Text>
                </TouchableOpacity>
                <Image 
                  source={require('../../assets/icons/streak.png')}
                  style={styles.streakPopupIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.coinsText, { color: '#FFFFFF' }]}>
                  {calculateStreak(pet)} DAY{calculateStreak(pet) !== 1 ? 'S' : ''} STREAK!
                </Text>
                <Text style={[styles.streakSubtext, { color: '#FFFFFF' }]}>
                  {pet.name} HAS BEEN ALIVE FOR {calculateStreak(pet)} DAY{calculateStreak(pet) !== 1 ? 'S' : ''}!
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    handleShareStreak();
                    setShowStreakPopup(false);
                  }}
                  style={[styles.playToWinButton, { borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color, backgroundColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.playToWinButtonText, { color: '#FFFFFF' }]}>
                    SHARE STREAK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Shareable View - Hidden, used for capturing streak image */}
          {pet && (
            <ViewShot
              ref={shareViewRef}
              style={styles.shareableView}
              options={{ format: 'png', quality: 1.0 }}
            >
              <ImageBackground
                source={(ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).background}
                style={styles.shareableBackground}
                resizeMode="cover"
              >
                <View style={styles.shareableContent}>
                  {/* Title */}
                  <Text style={styles.shareableTitle}>PALMVOICE</Text>
                  
                  {/* Pet Sprite */}
                  <View style={styles.shareableSpriteContainer}>
                    {displayedHealth === 0 ? (
                      <Image
                        source={
                          pet.type === 'puppy'
                            ? require('../../assets/pets/puppy/puppydead.png')
                            : pet.type === 'panda'
                            ? require('../../assets/pets/panda/pandadead.png')
                            : pet.type === 'koala'
                            ? require('../../assets/pets/koala/koaladead.png')
                            : require('../../assets/pets/cat/catdead.png')
                        }
                        style={styles.shareableSprite}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={
                          pet.type === 'puppy'
                            ? puppySitFrames[currentCatFrame % puppySitFrames.length]
                            : pet.type === 'panda'
                            ? pandaSitFrames[currentCatFrame % pandaSitFrames.length]
                            : pet.type === 'koala'
                            ? koalaSitFrames[currentCatFrame % koalaSitFrames.length]
                            : catSitFrames[currentCatFrame]
                        }
                        style={styles.shareableSprite}
                        resizeMode="contain"
                      />
                    )}
                  </View>

                  {/* Streak Count */}
                  <Text style={styles.shareableStreakText}>
                    {calculateStreak(pet)} DAY{calculateStreak(pet) !== 1 ? 'S' : ''} STREAK!
                  </Text>
                  
                  {/* Streak Message */}
                  <Text style={styles.shareableMessage}>
                    I'VE KEPT MY PET ALIVE FOR {calculateStreak(pet)} DAY{calculateStreak(pet) !== 1 ? 'S' : ''} STRAIGHT!
                  </Text>

                  {/* Stats */}
                  <View style={styles.shareableStats}>
                    <View style={styles.shareableStatItem}>
                      <Text style={styles.shareableStatIcon}>💰</Text>
                      <Text style={styles.shareableStatText}>EARNED {coins} COINS</Text>
                    </View>
                    <View style={styles.shareableStatItem}>
                      <Text style={styles.shareableStatIcon}>✅</Text>
                      <Text style={styles.shareableStatText}>COMPLETED {getCompletedTasksCount()} TASKS</Text>
                    </View>
                  </View>

                  {/* Download Text */}
                  <Text style={styles.shareableDownloadText}>DOWNLOAD PALMVOICE</Text>
                </View>
              </ImageBackground>
            </ViewShot>
          )}

          {/* Shop Modal */}
          {showShop && (
            <View style={styles.shopOverlay}>
              <ImageBackground
                source={require('../../assets/pets/backgrounds/shopinterior.jpg')}
                style={styles.shopBackground}
                resizeMode="cover"
              >
                <View style={styles.shopContainer}>
                  {/* Close Button */}
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setShowShop(false);
                      setCurrentShopBox(1);
                      setShowShopModal(false);
                      treasureBoxOpacity.setValue(0);
                    }}
                    style={({ pressed }) => [
                      styles.shopCloseButton,
                      pressed ? styles.shopCloseButtonPressed : styles.shopCloseButtonRaised,
                    ]}
                  >
                    {({ pressed }) => (
                      <Text style={[styles.shopCloseButtonText, pressed && { transform: [{ scale: 0.9 }] }]}>✕</Text>
                    )}
                  </Pressable>

                  {/* Animated Shopkeeper */}
                  <View style={styles.shopkeeperContainer}>
                    <Image
                      source={shopkeeperFrames[currentShopkeeperFrame]}
                      style={styles.shopkeeperImage}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Shopkeeper Dialogue Box */}
                  <Animated.View 
                    style={[
                      styles.shopDialogueBox, 
                      { 
                        opacity: shopTextOpacity,
                        transform: [{ scale: shopTextScale }],
                      }
                    ]}
                  >
                    <View style={styles.shopDialogueContent}>
                      <Text style={styles.shopDialogueText}>{shopMessage}</Text>
                    </View>
                    {/* Speech bubble tail pointing right */}
                    <View style={styles.shopDialogueTail} />
                  </Animated.View>

                  {/* Treasure Box Dialogue Box */}
                  {!showShopModal && (
                    <Animated.View 
                      style={[
                        styles.treasureBoxDialogueBox, 
                        { 
                          opacity: treasureBoxOpacity,
                          transform: [{ scale: treasureBoxScale }],
                        }
                      ]}
                    >
                      <View style={styles.shopDialogueContent}>
                        <Text style={styles.shopDialogueText}>{treasureBoxMessage}</Text>
                      </View>
                      {/* Speech bubble tail pointing down */}
                      <View style={styles.treasureBoxDialogueTail} />
                    </Animated.View>
                  )}

                  {/* Shop Box */}
                  {!showShopModal && (
                    <TouchableOpacity
                      onPress={() => {
                        // First show shopbox2
                        setCurrentShopBox(2);
                        // Then open modal after a short delay
                        setTimeout(() => {
                          setShowShopModal(true);
                        }, 300);
                      }}
                      style={styles.shopBoxContainer}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={currentShopBox === 1 
                          ? require('../../assets/pets/shop/shopbox1.png')
                          : require('../../assets/pets/shop/shopbox2.png')
                        }
                        style={styles.shopBoxImage}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}

                  {/* Shop Category Modal */}
                  {showShopModal && (
                    <View style={styles.shopModalOverlay}>
                      <Animated.View 
                        style={[
                          styles.shopModalContent,
                          {
                            transform: [
                              { scale: shopModalScale },
                              { scale: shopModalPulse },
                            ],
                          },
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setShowShopModal(false);
                            shopModalPulse.stopAnimation();
                            // After 0.25 seconds, reset shopbox2 to shopbox1
                            setTimeout(() => {
                              setCurrentShopBox(1);
                            }, 250);
                          }}
                          style={styles.shopModalCloseButton}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.shopModalCloseButtonText}>✕</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.shopCategoriesGrid}>
                          {/* THEMES */}
                          <TouchableOpacity 
                            onPress={() => {
                              setShowShopModal(false);
                              setTimeout(() => {
                                setShowThemesModal(true);
                                themesModalScale.setValue(0.9);
                                Animated.spring(themesModalScale, {
                                  toValue: 1,
                                  tension: 50,
                                  friction: 7,
                                  useNativeDriver: true,
                                }).start();
                              }, 100);
                            }}
                            style={styles.shopCategoryButtonModal}
                            activeOpacity={0.8}
                          >
                            <View style={styles.shopCategoryIcon}>
                              <Image
                                source={require('../../assets/pets/backgrounds/theme3.gif')}
                                style={styles.shopCategoryImage}
                                resizeMode="cover"
                              />
                            </View>
                            <Text style={styles.shopCategoryTextModal}>THEMES</Text>
                          </TouchableOpacity>

                          {/* PETS */}
                          <TouchableOpacity 
                            onPress={() => {
                              setShowShopModal(false);
                              setTimeout(() => {
                                setShowPetsModal(true);
                                petsModalScale.setValue(0.9);
                                Animated.spring(petsModalScale, {
                                  toValue: 1,
                                  tension: 50,
                                  friction: 7,
                                  useNativeDriver: true,
                                }).start();
                              }, 100);
                            }}
                            style={styles.shopCategoryButtonModal}
                            activeOpacity={0.8}
                          >
                            <View style={styles.shopCategoryIcon}>
                              <Image
                                source={require('../../assets/pets/cat/catsit2.png')}
                                style={styles.shopCategoryImage}
                                resizeMode="contain"
                              />
                            </View>
                            <Text style={styles.shopCategoryTextModal}>PETS</Text>
                          </TouchableOpacity>

                          {/* ITEMS */}
                          <TouchableOpacity 
                            onPress={async () => {
                              // Reload items from storage to ensure latest values
                              const tokens = await loadRevivalTokens();
                              const potions = await loadHealthPotions();
                              setRevivalTokens(tokens);
                              setHealthPotions(potions);
                              
                              setShowShopModal(false);
                              setTimeout(() => {
                                setShowItemsModal(true);
                                itemsModalScale.setValue(0.9);
                                Animated.spring(itemsModalScale, {
                                  toValue: 1,
                                  tension: 50,
                                  friction: 7,
                                  useNativeDriver: true,
                                }).start();
                              }, 100);
                            }}
                            style={styles.shopCategoryButtonModal}
                            activeOpacity={0.8}
                          >
                            <View style={styles.shopCategoryIcon}>
                              <Image
                                source={require('../../assets/pets/shop/potion.png')}
                                style={styles.shopCategoryImage}
                                resizeMode="contain"
                              />
                            </View>
                            <Text style={styles.shopCategoryTextModal}>ITEMS</Text>
                          </TouchableOpacity>

                          {/* BUNDLES */}
                          <TouchableOpacity 
                            style={styles.shopCategoryButtonModal}
                            activeOpacity={0.8}
                          >
                            <View style={styles.shopCategoryIcon}>
                              <View style={styles.giftBoxIcon}>
                                <View style={styles.giftBoxBody} />
                                <View style={styles.giftBoxRibbon} />
                              </View>
                            </View>
                            <Text style={styles.shopCategoryTextModal}>BUNDLES</Text>
                          </TouchableOpacity>
                        </View>
                      </Animated.View>
                    </View>
                  )}
                </View>
              </ImageBackground>
            </View>
          )}

          {/* Themes Modal - Outside shop container */}
          {showThemesModal && (
            <View style={[styles.shopModalOverlay, { zIndex: 2000 }]}>
              <Animated.View 
                style={[
                  styles.themesModalContent,
                  {
                    transform: [{ scale: themesModalScale }],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowThemesModal(false);
                    setTimeout(() => {
                      setShowShopModal(true);
                      shopModalScale.setValue(0.9);
                      Animated.spring(shopModalScale, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                      }).start();
                    }, 100);
                  }}
                  style={styles.shopModalCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.shopModalCloseButtonText}>✕</Text>
                </TouchableOpacity>
                
                <ScrollView 
                  style={styles.themesScrollView}
                  contentContainerStyle={styles.themesScrollContent}
                  showsVerticalScrollIndicator={true}
                >
                  {/* Regular Themes - 15 coins each */}
                  {renderThemeItem('cherryblossom', require('../../assets/pets/backgrounds/cherryblossom.jpg'), 'CHERRY BLOSSOM', 15)}
                  {renderThemeItem('feelslike2002', require('../../assets/pets/backgrounds/feelslike2002.jpg'), 'FEELS LIKE 2002', 15)}
                  {renderThemeItem('feelslikechristmas', require('../../assets/pets/backgrounds/feelslikechristmas.jpg'), 'FEELS LIKE CHRISTMAS', 15)}
                  {renderThemeItem('fishpond', require('../../assets/pets/backgrounds/fishpond.jpg'), 'FISH POND', 15)}
                  {renderThemeItem('glowy', require('../../assets/pets/backgrounds/glowy.jpg'), 'GLOWY', 15)}
                  {renderThemeItem('magical', require('../../assets/pets/backgrounds/magical.jpg'), 'MAGICAL', 15)}
                  {renderThemeItem('minecraft', require('../../assets/pets/backgrounds/minecraft.jpg'), 'MINECRAFT', 15)}
                  {renderThemeItem('ohsoflowery', require('../../assets/pets/backgrounds/ohsoflowery.jpg'), 'OH SO FLOWERY', 15)}
                  {renderThemeItem('peace', require('../../assets/pets/backgrounds/peace.jpg'), 'PEACE', 15)}
                  {renderThemeItem('secretgarden', require('../../assets/pets/backgrounds/secretgarden.jpg'), 'SECRET GARDEN', 15)}
                  {renderThemeItem('snowynight', require('../../assets/pets/backgrounds/snowynight.jpg'), 'SNOWY NIGHT', 15)}
                  {renderThemeItem('therapeutic', require('../../assets/pets/backgrounds/therapeutic.jpg'), 'THERAPEUTIC', 15)}
                  {renderThemeItem('waterfall', require('../../assets/pets/backgrounds/waterfall.jpg'), 'WATERFALL', 15)}

                  {/* Exclusive Themes - 30 coins each (GIFs at bottom) */}
                  {renderThemeItem('anime', require('../../assets/pets/backgrounds/anime.gif'), 'ANIME', 30, true)}
                  {renderThemeItem('autumn', require('../../assets/pets/backgrounds/autumn.gif'), 'AUTUMN', 30, true)}
                  {renderThemeItem('infinite', require('../../assets/pets/backgrounds/infinite.gif'), 'INFINITE', 30, true)}
                  {renderThemeItem('moonlight', require('../../assets/pets/backgrounds/moonlight.gif'), 'MOONLIGHT', 30, true)}
                </ScrollView>
              </Animated.View>
            </View>
          )}

          {/* Pets Modal - Shop pets grid */}
          {showPetsModal && (
            <View style={[styles.shopModalOverlay, { zIndex: 2000 }]}>
              <Animated.View 
                style={[
                  styles.themesModalContent,
                  {
                    transform: [{ scale: petsModalScale }],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowPetsModal(false);
                    setTimeout(() => {
                      setShowShopModal(true);
                      shopModalScale.setValue(0.9);
                      Animated.spring(shopModalScale, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                      }).start();
                    }, 100);
                  }}
                  style={styles.shopModalCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.shopModalCloseButtonText}>✕</Text>
                </TouchableOpacity>
                
                <Text style={styles.petsModalTitle}>PETS</Text>
                
                <ScrollView 
                  style={styles.themesScrollView}
                  contentContainerStyle={styles.themesScrollContent}
                  showsVerticalScrollIndicator={true}
                >
                  {/* Pet Grid */}
                  {Object.entries(SHOP_PETS).map(([petKey, petData]) => {
                    const isPurchased = purchasedPets.includes(petKey);
                    const isEquipped = pet?.type === petKey;
                    
                    return (
                      <View
                        key={petKey}
                        style={[
                          styles.petShopCard,
                          isPurchased && styles.petShopCardPurchased,
                          isEquipped && styles.petShopCardEquipped
                        ]}
                      >
                        {/* Pet Image */}
                        <View style={styles.petShopImageContainer}>
                          <Image
                            source={petData.icon}
                            style={styles.petShopImage}
                            resizeMode="contain"
                          />
                        </View>
                        
                        {/* Pet Name */}
                        <Text style={styles.petShopName}>{petData.name.toUpperCase()}</Text>
                        
                        {isPurchased ? (
                          <View style={styles.petShopStatusContainer}>
                            <Text style={styles.petShopOwnedText}>✓ OWNED</Text>
                            {isEquipped && (
                              <View style={styles.petShopEquippedBadge}>
                                <Text style={styles.petShopEquippedText}>ACTIVE</Text>
                              </View>
                            )}
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.petShopBuyButton}
                            onPress={() => handlePetPurchase(petKey)}
                            activeOpacity={0.8}
                          >
                            <Image
                              source={require('../../assets/rewards/coins.png')}
                              style={styles.petShopCoinIcon}
                              resizeMode="contain"
                            />
                            <Text style={styles.petShopPrice}>
                              {petData.price === 0 ? 'FREE' : petData.price}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              </Animated.View>
            </View>
          )}

          {/* Items Modal - Shop items */}
          {showItemsModal && (
            <View style={[styles.shopModalOverlay, { zIndex: 2000 }]}>
              <Animated.View 
                style={[
                  styles.themesModalContent,
                  {
                    transform: [{ scale: itemsModalScale }],
                    height: 'auto',
                    maxHeight: '60%',
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowItemsModal(false);
                    setTimeout(() => {
                      setShowShopModal(true);
                      shopModalScale.setValue(0.9);
                      Animated.spring(shopModalScale, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                      }).start();
                    }, 100);
                  }}
                  style={styles.shopModalCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.shopModalCloseButtonText}>✕</Text>
                </TouchableOpacity>
                
                <Text style={styles.petsModalTitle}>ITEMS</Text>
                
                <View style={styles.itemsGrid}>
                  {/* Revival Insurance */}
                  <View style={styles.itemCard}>
                    <Image
                      source={require('../../assets/pets/shop/insurance.png')}
                      style={styles.itemImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.itemName}>REVIVAL{'\n'}INSURANCE</Text>
                    <Text style={styles.itemDescription}>1 FREE REVIVAL</Text>
                    <Text style={styles.itemOwned}>OWNED: {revivalTokens}</Text>
                    <TouchableOpacity
                      style={styles.itemBuyButton}
                      onPress={handleBuyRevivalInsurance}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require('../../assets/rewards/coins.png')}
                        style={styles.itemCoinIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.itemPrice}>15</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Health Potion */}
                  <View style={styles.itemCard}>
                    <Image
                      source={require('../../assets/pets/shop/potion.png')}
                      style={styles.itemImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.itemName}>HEALTH{'\n'}POTION</Text>
                    <Text style={styles.itemDescription}>+2 HEARTS</Text>
                    <Text style={styles.itemOwned}>OWNED: {healthPotions}</Text>
                    <TouchableOpacity
                      style={styles.itemBuyButton}
                      onPress={handleBuyHealthPotion}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require('../../assets/rewards/coins.png')}
                        style={styles.itemCoinIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.itemPrice}>5</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </View>
          )}

          {/* Purchase Error Popup */}
          {showPurchaseError && (
            <View style={styles.purchaseErrorOverlay}>
              <View style={styles.purchaseErrorPopup}>
                <Text style={styles.purchaseErrorText}>{purchaseErrorMessage}</Text>
              </View>
            </View>
          )}

          {/* Delete Pet Confirmation Popup */}
          {showDeletePetConfirm && petToDelete && (
            <View style={styles.deleteConfirmOverlay}>
              <View style={styles.deleteConfirmPopup}>
                <Text style={styles.deleteConfirmTitle}>DELETE PET?</Text>
                <Text style={styles.deleteConfirmText}>
                  This will permanently delete your {petToDelete.toUpperCase()}'s name, streak, and all progress.
                </Text>
                <Text style={styles.deleteConfirmWarning}>
                  THIS CANNOT BE UNDONE!
                </Text>
                <View style={styles.deleteConfirmButtons}>
                  <TouchableOpacity
                    onPress={cancelDeletePet}
                    style={styles.deleteConfirmCancelButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.deleteConfirmCancelText}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={confirmDeletePet}
                    style={styles.deleteConfirmDeleteButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.deleteConfirmDeleteText}>DELETE</Text>
                  </TouchableOpacity>
                </View>
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
                    backgroundColor: `${(ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color}DD`,
                    borderColor: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color,
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
                <Text style={[styles.gameTitle, { color: (ALL_THEMES[petsTheme] || PETS_THEMES[petsTheme] || ALL_THEMES['serene']).color }]}>
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
    flexShrink: 1,
    minWidth: 0,
    position: 'relative',
    zIndex: 1001,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
    flexShrink: 1,
    minWidth: 0,
    borderWidth: 2,
  },
  dropdownButtonRaised: {
    transform: [{ translateY: -1 }],
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
  },
  dropdownButtonPressed: {
    transform: [{ translateY: 1 }, { scale: 0.97 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    opacity: 0.85,
  },
  dropdownLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    textAlign: 'center',
    flexShrink: 1,
    lineHeight: 9,
  },
  dropdownLabelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dropdownPetIcon: {
    width: 18,
    height: 18,
  },
  dropdownOptionWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownOptionIcon: {
    width: 20,
    height: 20,
  },
  dropdownArrow: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 4,
    borderWidth: 2,
    borderRadius: 4,
    overflow: 'hidden',
    minWidth: 180,
    maxWidth: 200,
    zIndex: 1002,
  },
  actionsDropdownMenu: {
    right: 0,
    left: 'auto',
    minWidth: 120,
    maxWidth: 140,
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
    bottom: '28%', // Bottom 2/3 of screen, lowered for spacing
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petNameDisplay: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  catSprite: {
    width: 180,
    height: 180,
  },
  statusMessage: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    marginTop: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 999,
  },
  bottomBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  bottomBarItemRaised: {
    // Transparent raised 3D effect
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    borderRightColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ translateY: 0 }],
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
  },
  bottomBarItemPressed: {
    // Pressed down effect - inverted borders
    borderWidth: 2,
    borderTopColor: 'rgba(0, 0, 0, 0.5)',
    borderLeftColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    transform: [{ translateY: 2 }, { scale: 0.96 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
  },
  bottomBarIcon: {
    width: 32,
    height: 32,
  },
  bottomBarText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20, // Add space between buttons and bottom bezel
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
  reviveTokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviveTokenIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
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
    minWidth: 220,
    maxWidth: 260,
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
  healthTimerText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
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
  coinsItemsSection: {
    width: '100%',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  coinsItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  coinsItemIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  coinsItemText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    flex: 1,
    marginRight: 8,
  },
  coinsItemRowFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 4,
    width: '100%',
  },
  coinsItemIconSmall: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  coinsItemTextFixed: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    flex: 1,
  },
  useItemButtonSmall: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#388E3C',
    minWidth: 50,
    alignItems: 'center',
  },
  useItemButtonTextSmall: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#FFFFFF',
  },
  useItemButtonPlaceholder: {
    minWidth: 50,
  },
  coinsPopupDarkText: {
    color: '#3D2914',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  useItemButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderWidth: 2,
    borderColor: '#388E3C',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  useItemButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: '#FFFFFF',
  },
  streakPopupIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  streakSubtext: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 16,
  },
  shareableView: {
    position: 'absolute',
    left: -10000,
    top: -10000,
    width: 400,
    height: 600,
  },
  shareableBackground: {
    width: '100%',
    height: '100%',
  },
  shareableContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  shareableTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  shareableSpriteContainer: {
    marginBottom: 30,
  },
  shareableSprite: {
    width: 150,
    height: 150,
  },
  shareableStreakText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  shareableMessage: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  shareableStats: {
    marginBottom: 30,
    gap: 15,
  },
  shareableStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shareableStatIcon: {
    fontSize: 20,
  },
  shareableStatText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  shareableDownloadText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  shopOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  shopBackground: {
    width: '100%',
    height: '100%',
  },
  shopContainer: {
    flex: 1,
    padding: 20,
  },
  shopCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFE5B4',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  shopCloseButtonRaised: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopColor: '#FFEFD5',
    borderLeftColor: '#FFEFD5',
    borderBottomColor: '#8B4513',
    borderRightColor: '#8B4513',
    transform: [{ translateY: 0 }],
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
  },
  shopCloseButtonPressed: {
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopColor: '#8B4513',
    borderLeftColor: '#8B4513',
    borderBottomColor: '#FFEFD5',
    borderRightColor: '#FFEFD5',
    backgroundColor: '#E8D4A8',
    transform: [{ translateY: 2 }, { scale: 0.95 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  shopCloseButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: '#8B4513',
  },
  shopDialogueBox: {
    position: 'absolute',
    left: 20,
    top: '32%',
    maxWidth: 200,
    zIndex: 1001,
  },
  shopDialogueContent: {
    backgroundColor: '#FFE5B4',
    borderWidth: 3,
    borderColor: '#8B4513',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  shopDialogueTail: {
    position: 'absolute',
    right: -10,
    top: 20,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderLeftWidth: 15,
    borderLeftColor: '#FFE5B4',
  },
  shopDialogueText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#5C4033',
    textAlign: 'left',
    lineHeight: 16,
  },
  treasureBoxDialogueBox: {
    position: 'absolute',
    left: '50%',
    marginLeft: -100,
    bottom: 260,
    maxWidth: 200,
    zIndex: 1001,
  },
  treasureBoxDialogueTail: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderTopWidth: 12,
    borderTopColor: '#FFE5B4',
  },
  shopkeeperContainer: {
    position: 'absolute',
    right: 30,
    top: '35%',
    width: 180,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopkeeperImage: {
    width: '100%',
    height: '100%',
  },
  shopBoxContainer: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    marginLeft: -100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopBoxImage: {
    width: '100%',
    height: '100%',
  },
  shopModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002,
  },
  shopModalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 229, 180, 0.9)',
    borderWidth: 4,
    borderColor: '#8B4513',
    borderRadius: 12,
    padding: 20,
    paddingTop: 40,
    position: 'relative',
  },
  shopModalCloseButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 69, 19, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1003,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  shopModalCloseButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
  shopCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  shopCategoryButton: {
    width: '47%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    marginBottom: 15,
  },
  shopCategoryButtonModal: {
    width: '47%',
    backgroundColor: 'rgba(255, 229, 180, 0.8)',
    borderWidth: 3,
    borderColor: '#8B4513',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    marginBottom: 15,
  },
  shopCategoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopCategoryText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  shopCategoryCost: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  shopCategoryTextModal: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#5C4033',
    marginTop: 8,
    textAlign: 'center',
  },
  themesModalContent: {
    width: '85%',
    maxWidth: 350,
    height: '75%',
    backgroundColor: 'rgba(255, 229, 180, 0.95)',
    borderWidth: 4,
    borderColor: '#8B4513',
    borderRadius: 12,
    padding: 20,
    paddingTop: 40,
    position: 'relative',
    zIndex: 2000,
  },
  themesScrollView: {
    flex: 1,
  },
  themesScrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  themeItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 229, 180, 0.6)',
    borderWidth: 3,
    borderColor: '#8B4513',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  themePreview: {
    width: '100%',
    height: 100,
    borderRadius: 4,
    marginBottom: 6,
  },
  themeName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    marginBottom: 4,
  },
  themePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  coinIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  themePrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#5C4033',
  },
  exclusiveThemeItem: {
    borderColor: '#D4AF37',
    borderWidth: 4,
  },
  exclusiveThemePrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#D4AF37',
    textAlign: 'center',
  },
  themeItemPurchased: {
    opacity: 0.8,
    borderColor: '#4CAF50',
  },
  themeItemEquipped: {
    borderColor: '#2196F3',
    borderWidth: 4,
  },
  themePurchasedContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  themePurchasedText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: '#4CAF50',
    marginBottom: 6,
  },
  equipButton: {
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    borderWidth: 2,
    borderColor: '#8B4513',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  equipButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: '#FFFFFF',
  },
  equipButtonTextActive: {
    color: '#FFFFFF',
  },
  petsModalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#5C4033',
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  petIconContainer: {
    width: '100%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  petEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  petShopIcon: {
    width: 60,
    height: 60,
  },
  // New Pet Shop Card Styles
  petShopCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 229, 180, 0.5)',
    borderWidth: 3,
    borderColor: '#8B4513',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  petShopCardPurchased: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  petShopCardEquipped: {
    borderColor: '#2196F3',
    borderWidth: 4,
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
  },
  petShopImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(139, 69, 19, 0.3)',
  },
  petShopImage: {
    width: 65,
    height: 65,
  },
  petShopName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#5C4033',
    marginBottom: 8,
    textAlign: 'center',
  },
  petShopStatusContainer: {
    alignItems: 'center',
    gap: 4,
  },
  petShopOwnedText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: '#4CAF50',
  },
  petShopEquippedBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  petShopEquippedText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#FFFFFF',
  },
  petShopBuyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 69, 19, 0.85)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#5C4033',
  },
  petShopCoinIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  petShopPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#FFFFFF',
  },
  purchasedContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  ownedText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: '#4CAF50',
  },
  equippedBadge: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#2196F3',
    marginTop: 2,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  itemCard: {
    width: '45%',
    backgroundColor: 'rgba(255, 229, 180, 0.6)',
    borderWidth: 3,
    borderColor: '#8B4513',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  itemName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: '#5C4033',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemDescription: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemOwned: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#4CAF50',
    marginBottom: 8,
  },
  itemBuyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    borderWidth: 2,
    borderColor: '#8B4513',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  itemCoinIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  itemPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#FFFFFF',
  },
  purchaseErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000,
  },
  purchaseErrorPopup: {
    backgroundColor: 'rgba(255, 229, 180, 0.95)',
    borderWidth: 4,
    borderColor: '#8B4513',
    borderRadius: 12,
    padding: 20,
    maxWidth: '80%',
    alignItems: 'center',
  },
  purchaseErrorText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#5C4033',
    textAlign: 'center',
  },
  // Delete Pet Confirmation Modal
  deleteConfirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4000,
  },
  deleteConfirmPopup: {
    backgroundColor: 'rgba(60, 20, 20, 0.95)',
    borderWidth: 4,
    borderColor: '#8B0000',
    borderRadius: 12,
    padding: 24,
    maxWidth: '85%',
    alignItems: 'center',
  },
  deleteConfirmTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#FF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  deleteConfirmText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 12,
  },
  deleteConfirmWarning: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#FF6666',
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteConfirmButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  deleteConfirmCancelButton: {
    backgroundColor: 'rgba(100, 100, 100, 0.9)',
    borderWidth: 3,
    borderColor: '#666666',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteConfirmCancelText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
  },
  deleteConfirmDeleteButton: {
    backgroundColor: 'rgba(139, 0, 0, 0.9)',
    borderWidth: 3,
    borderColor: '#FF0000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteConfirmDeleteText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
  },
  // Dropdown row with delete button
  dropdownOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownOptionContent: {
    flex: 1,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 14,
  },
  shopCategoryImage: {
    width: 40,
    height: 40,
  },
  // Palette Icon
  paletteIcon: {
    width: 40,
    height: 30,
    backgroundColor: '#8B4513',
    borderRadius: 2,
    position: 'relative',
  },
  paletteColor: {
    width: 8,
    height: 8,
    position: 'absolute',
    borderRadius: 1,
  },
  // Paw Icon
  pawIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  pawPad: {
    width: 6,
    height: 6,
    backgroundColor: '#808080',
    position: 'absolute',
    borderRadius: 3,
  },
  // Shield Icon
  shieldIcon: {
    width: 30,
    height: 35,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldBody: {
    width: 30,
    height: 35,
    backgroundColor: '#DC143C',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  shieldEmblem: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  // Gift Box Icon
  giftBoxIcon: {
    width: 35,
    height: 35,
    position: 'relative',
  },
  giftBoxBody: {
    width: 35,
    height: 35,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 2,
  },
  giftBoxRibbon: {
    position: 'absolute',
    width: 4,
    height: 35,
    backgroundColor: '#DC143C',
    left: '50%',
    marginLeft: -2,
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
