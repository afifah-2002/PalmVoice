import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MenuModal } from './MenuModal';

interface FavoriteButtonsProps {
  onHomePress?: () => void;
  onTodoPress?: () => void;
  onPetPress?: () => void;
  onMenuPress?: () => void;
}

export function FavoriteButtons({
  onHomePress,
  onTodoPress,
  onPetPress,
  onMenuPress,
}: FavoriteButtonsProps) {
  const router = useRouter();
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  const handleHomePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onHomePress) {
      onHomePress();
    } else {
      router.push('/' as any);
    }
  };

  const handleTodoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onTodoPress) {
      onTodoPress();
    } else {
      router.push('/tasks' as any);
    }
  };

  const handlePetPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onPetPress) {
      onPetPress();
    } else {
      router.push('/pets' as any);
    }
  };

  const handleMenuPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onMenuPress) {
      onMenuPress();
    } else {
      setShowMenuModal(true);
    }
  };

  if (!fontsLoaded) {
    return <View style={styles.buttonsArea} />;
  }

  return (
    <>
      <View style={styles.buttonsArea}>
        <View style={styles.buttonGroup}>
          <Pressable
            onPress={handleHomePress}
            style={({ pressed }) => [
              styles.button,
              pressed ? styles.buttonPressed : styles.buttonRaised,
            ]}
          >
            <Image 
              source={require('../../assets/icons/home.png')} 
              style={styles.buttonImage}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.buttonLabel}>HOME</Text>
        </View>
        <View style={styles.buttonGroup}>
          <Pressable
            onPress={handleTodoPress}
            style={({ pressed }) => [
              styles.button,
              pressed ? styles.buttonPressed : styles.buttonRaised,
            ]}
          >
            <Image 
              source={require('../../assets/icons/todo.png')} 
              style={styles.buttonImage}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.buttonLabel}>TO DO</Text>
        </View>
        <View style={styles.buttonGroup}>
          <Pressable
            onPress={handlePetPress}
            style={({ pressed }) => [
              styles.button,
              pressed ? styles.buttonPressed : styles.buttonRaised,
            ]}
          >
            <Image 
              source={require('../../assets/icons/pet.png')} 
              style={styles.buttonImage}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.buttonLabel}>PET</Text>
        </View>
        <View style={styles.buttonGroup}>
          <Pressable
            onPress={handleMenuPress}
            style={({ pressed }) => [
              styles.button,
              pressed ? styles.buttonPressed : styles.buttonRaised,
            ]}
          >
            <Text style={styles.buttonIcon}>☰</Text>
          </Pressable>
          <Text style={styles.buttonLabel}>MENU</Text>
        </View>
      </View>
      <MenuModal
        visible={showMenuModal}
        onClose={() => setShowMenuModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  buttonsArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  buttonGroup: {
    alignItems: 'center',
    flex: 1,
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  buttonRaised: {
    // Pixelated 3D raised effect - light on top/left, dark on bottom/right
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopColor: '#6A6A6A',
    borderLeftColor: '#6A6A6A',
    borderBottomColor: '#2A2A2A',
    borderRightColor: '#2A2A2A',
    transform: [{ translateY: 0 }],
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
  },
  buttonPressed: {
    // Pressed down effect - inverted borders, pushed down
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopColor: '#2A2A2A',
    borderLeftColor: '#2A2A2A',
    borderBottomColor: '#5A5A5A',
    borderRightColor: '#5A5A5A',
    backgroundColor: '#3A3A3A',
    transform: [{ translateY: 2 }, { scale: 0.95 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  buttonIcon: {
    fontSize: 20,
    color: '#9CBD5A',
  },
  buttonLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#CCCCCC',
    marginTop: 2,
  },
  buttonImage: {
    width: 26,
    height: 26,
  },
});

