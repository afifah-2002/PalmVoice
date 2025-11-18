import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { playButtonTap } from '../services/soundService';

interface PalmButtonProps {
  title: string;
  onPress: () => void;
}

export const PalmButton: React.FC<PalmButtonProps> = ({ title, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    playButtonTap();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.button, isPressed && styles.buttonPressed]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Text style={[styles.text, isPressed && styles.textPressed]}>
        {title.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 120,
    height: 40,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#000000',
  },
  text: {
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  textPressed: {
    color: '#FFFFFF',
  },
});
