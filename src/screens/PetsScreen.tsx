import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FavoriteButtons } from '../components/FavoriteButtons';
import { PixelKeyboard } from '../components/PixelKeyboard';
import { PALM_THEMES } from '../constants/palmThemes';
import { useTheme } from '../contexts/ThemeContext';
import { loadPetsTheme, savePetsTheme } from '../services/storage';

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
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [petName, setPetName] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);

  // Load saved pets theme on mount
  useEffect(() => {
    loadPetsTheme().then((savedTheme) => {
      if (savedTheme) {
        setPetsTheme(savedTheme as PetsTheme);
      }
    });
  }, []);

  // Save pets theme when it changes
  useEffect(() => {
    savePetsTheme(petsTheme);
  }, [petsTheme]);

  const handleThemeSelect = (selectedTheme: PetsTheme) => {
    setPetsTheme(selectedTheme);
    setShowThemeDropdown(false);
  };

  const handlePetSelect = (petType: PetType) => {
    if (petType === 'none') {
      setPet(null);
      setShowPetDropdown(false);
    } else if (petType === 'cat') {
      setShowPetDropdown(false);
      setShowNameModal(true);
    }
    // Panda and Penguin are disabled (coming soon)
  };

  const handleNameSubmit = () => {
    if (petName.trim()) {
      setPet({
        type: 'cat',
        name: petName.trim().toUpperCase(),
        health: 5,
        lastFed: Date.now(),
        lastPet: Date.now(),
      });
      setShowNameModal(false);
      setPetName('');
    }
  };

  const handleFeed = () => {
    if (pet && canFeed()) {
      setPet({
        ...pet,
        health: Math.min(5, pet.health + 1),
        lastFed: Date.now(),
      });
    }
  };

  const handlePet = () => {
    if (pet && canPet()) {
      setPet({
        ...pet,
        lastPet: Date.now(),
      });
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
          
          {/* Top Bar with Dropdowns */}
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
          </View>

          {/* Pet Display Frame */}
          {pet ? (
            <View style={styles.petFrame}>
              {/* Pet Sprite */}
              <Text style={styles.petSprite}>🐱</Text>
              
              {/* Health Bar */}
              <View style={styles.healthBar}>
                {[...Array(5)].map((_, i) => (
                  <Text key={i} style={styles.heart}>
                    {i < pet.health ? '❤️' : '🖤'}
                  </Text>
                ))}
              </View>

              {/* Pet Name */}
              <Text style={styles.petName}>{pet.name}</Text>

              {/* Status Message */}
              <Text style={[styles.statusMessage, { color: getStatusDisplay().color }]}>
                {getStatusDisplay().text}
              </Text>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={handleFeed}
                  disabled={!canFeed()}
                  style={[styles.actionButton, styles.feedButton, !canFeed() && styles.disabledButton]}
                >
                  <Text style={styles.actionButtonText}>FEED</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePet}
                  disabled={!canPet()}
                  style={[styles.actionButton, styles.petButton, !canPet() && styles.disabledButton]}
                >
                  <Text style={styles.actionButtonText}>PET</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.noPetMessage}>
              <Text style={styles.noPetText}>Tap to choose pet</Text>
            </View>
          )}
        </View>

        {/* Favorite Buttons - Gray Bezel Bottom */}
        <FavoriteButtons />
      </View>

      {/* Name Input Modal */}
      {showNameModal && (
        <View style={styles.modalOverlay}>
          <View style={[
            styles.nameModal, 
            { 
              backgroundColor: `${PETS_THEMES[petsTheme].color}33`,
              borderColor: PETS_THEMES[petsTheme].color 
            }
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

      {/* Pixel Keyboard - Same as home screen */}
      <PixelKeyboard
        visible={showKeyboard && showNameModal}
        theme={theme}
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
  petFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -140 }, { translateY: -160 }],
    width: 280,
    height: 320,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  petSprite: {
    fontSize: 80,
    marginTop: 10,
  },
  healthBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  heart: {
    fontSize: 24,
  },
  petName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 10,
  },
  statusMessage: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    marginTop: 10,
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
    backgroundColor: 'rgba(100, 200, 100, 0.8)',
  },
  petButton: {
    backgroundColor: 'rgba(100, 150, 200, 0.8)',
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
    zIndex: 2000,
  },
  nameModal: {
    width: '85%',
    padding: 24,
    borderWidth: 3,
    borderRadius: 12,
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
});
