import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  const handleHomePress = () => {
    if (onHomePress) {
      onHomePress();
    } else {
      router.push('/' as any);
    }
  };

  const handleTodoPress = () => {
    if (onTodoPress) {
      onTodoPress();
    } else {
      router.push('/tasks' as any);
    }
  };

  const handlePetPress = () => {
    if (onPetPress) {
      onPetPress();
    } else {
      console.log('Open Pet');
    }
  };

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      console.log('Open Menu');
    }
  };

  if (!fontsLoaded) {
    return <View style={styles.buttonsArea} />;
  }

  return (
    <View style={styles.buttonsArea}>
      <TouchableOpacity
        style={styles.buttonGroup}
        onPress={handleHomePress}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          <Text style={styles.buttonIcon}>🏠</Text>
        </View>
        <Text style={styles.buttonLabel}>HOME</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonGroup}
        onPress={handleTodoPress}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          <Text style={styles.buttonIcon}>✓</Text>
        </View>
        <Text style={styles.buttonLabel}>TO DO</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonGroup}
        onPress={handlePetPress}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          <Text style={styles.buttonIcon}>🐾</Text>
        </View>
        <Text style={styles.buttonLabel}>PET</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonGroup}
        onPress={handleMenuPress}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          <Text style={styles.buttonIcon}>☰</Text>
        </View>
        <Text style={styles.buttonLabel}>MENU</Text>
      </TouchableOpacity>
    </View>
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3A3A3A',
    borderWidth: 2,
    borderColor: '#505050',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  buttonIcon: {
    fontSize: 20,
    color: '#9CBD5A',
  },
  buttonLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#CCCCCC',
  },
});

