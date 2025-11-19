import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FavoriteButtonsProps {
  onDatePress?: () => void;
  onAddressPress?: () => void;
  onSyncPress?: () => void;
  onTodoPress?: () => void;
  onMemoPress?: () => void;
}

export function FavoriteButtons({
  onDatePress,
  onAddressPress,
  onSyncPress,
  onTodoPress,
  onMemoPress,
}: FavoriteButtonsProps) {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  const handleDatePress = () => {
    if (onDatePress) {
      onDatePress();
    } else {
      console.log('Open Date Book');
    }
  };

  const handleAddressPress = () => {
    if (onAddressPress) {
      onAddressPress();
    } else {
      console.log('Open Address');
    }
  };

  const handleSyncPress = () => {
    if (onSyncPress) {
      onSyncPress();
    } else {
      console.log('Open Sync');
    }
  };

  const handleTodoPress = () => {
    if (onTodoPress) {
      onTodoPress();
    } else {
      router.push('/tasks' as any);
    }
  };

  const handleMemoPress = () => {
    if (onMemoPress) {
      onMemoPress();
    } else {
      console.log('Open Memo Pad');
    }
  };

  if (!fontsLoaded) {
    return <View style={styles.buttonsArea} />;
  }

  return (
    <View style={styles.buttonsArea}>
      <TouchableOpacity
        style={styles.buttonGroup}
        onPress={handleDatePress}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          <Text style={styles.buttonIcon}>📅</Text>
        </View>
        <Text style={styles.buttonLabel}>Date</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonGroup}
        onPress={handleAddressPress}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          <Text style={styles.buttonIcon}>📇</Text>
        </View>
        <Text style={styles.buttonLabel}>Address</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonGroup}
        onPress={handleSyncPress}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          <Text style={styles.buttonIcon}>↕</Text>
        </View>
        <Text style={styles.buttonLabel}>Sync</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonGroup}
        onPress={handleTodoPress}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          <Text style={styles.buttonIcon}>✓</Text>
        </View>
        <Text style={styles.buttonLabel}>To Do</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonGroup}
        onPress={handleMemoPress}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          <Text style={styles.buttonIcon}>📝</Text>
        </View>
        <Text style={styles.buttonLabel}>Memo</Text>
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

