import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';
import { PixelIcon } from './PixelIcon';
import { PixelKeyboard } from './PixelKeyboard';

interface GraffitiAreaProps {
  cursorVisible: boolean;
  theme: PalmTheme;
}

export function GraffitiArea({ cursorVisible, theme }: GraffitiAreaProps) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const [text, setText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  if (!fontsLoaded) {
    return <View style={styles.graffitiContainer} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.graffitiContainer}>
        {/* Left Side Icons */}
        <View style={styles.leftIcons}>
          <View style={[styles.sideIconCircle, { backgroundColor: theme.sideIconBackground, borderColor: theme.sideIconBorder }]}>
            <PixelIcon type="HOME" />
          </View>
          <View style={[styles.sideIconCircle, { backgroundColor: theme.sideIconBackground, borderColor: theme.sideIconBorder }]}>
            <PixelIcon type="PHONE" />
          </View>
        </View>

        {/* Graffiti Writing Area - Single Box */}
        <TouchableOpacity
          style={[styles.graffitiArea, { backgroundColor: theme.graffitiBackground, borderColor: theme.graffitiBorder }]}
          onPress={() => setIsKeyboardVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.graffitiLabelTopLeft, { color: theme.graffitiLabel }]}>ABC</Text>
          <Text style={[styles.graffitiLabelTopRight, { color: theme.graffitiLabel }]}>123</Text>
          {text ? (
            <Text style={[styles.graffitiText, { color: theme.graffitiCursor }]}>{text}</Text>
          ) : (
            cursorVisible && <View style={[styles.cursor, { backgroundColor: theme.graffitiCursor }]} />
          )}
        </TouchableOpacity>

        {/* Right Side Icons */}
        <View style={styles.rightIcons}>
          <View style={[styles.sideIconCircle, { backgroundColor: theme.sideIconBackground, borderColor: theme.sideIconBorder }]}>
            <PixelIcon type="CALCULATOR_SYMBOLS" />
          </View>
          <View style={[styles.sideIconCircle, { backgroundColor: theme.sideIconBackground, borderColor: theme.sideIconBorder }]}>
            <PixelIcon type="MAGNIFYING_GLASS" />
          </View>
        </View>
      </View>

      {/* Pixel Keyboard */}
      {isKeyboardVisible && (
        <PixelKeyboard
          visible={isKeyboardVisible}
          theme={theme}
          onKeyPress={(key) => {
            setText((prev) => prev + key);
          }}
          onBackspace={() => {
            setText((prev) => prev.slice(0, -1));
          }}
          onEnter={() => {
            setIsKeyboardVisible(false);
          }}
          onSpace={() => {
            setText((prev) => prev + ' ');
          }}
          onClose={() => setIsKeyboardVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  graffitiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    height: 200,
    marginTop: 10,
  },
  leftIcons: {
    width: 64,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 180,
    paddingVertical: 8,
  },
  rightIcons: {
    width: 64,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 180,
    paddingVertical: 8,
  },
  sideIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graffitiArea: {
    flex: 1,
    height: 180,
    borderWidth: 2,
    marginHorizontal: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graffitiLabelTopLeft: {
    position: 'absolute',
    top: 12,
    left: 16,
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  graffitiLabelTopRight: {
    position: 'absolute',
    top: 12,
    right: 16,
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  cursor: {
    width: 10,
    height: 14,
  },
  graffitiText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    maxWidth: '90%',
    textAlign: 'center',
  },
});

