import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PixelKeyboardProps {
  visible: boolean;
  theme: PalmTheme;
  onKeyPress: (key: string) => void;
  onClose: () => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
}

export function PixelKeyboard({
  visible,
  theme,
  onKeyPress,
  onClose,
  onBackspace,
  onEnter,
  onSpace,
}: PixelKeyboardProps) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const [isShift, setIsShift] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<'letters' | 'numbers' | 'symbols'>('letters');

  if (!fontsLoaded) {
    return null;
  }

  const handleKeyPress = (key: string) => {
    onKeyPress(key);
    // Auto-disable shift after one character (like mobile keyboards)
    if (isShift && key.length === 1) {
      setIsShift(false);
    }
  };

  const toggleShift = () => {
    setIsShift(!isShift);
  };

  const switchToNumbers = () => {
    setKeyboardMode('numbers');
    setIsShift(false);
  };

  const switchToLetters = () => {
    setKeyboardMode('letters');
    setIsShift(false);
  };

  const switchToSymbols = () => {
    setKeyboardMode('symbols');
    setIsShift(false);
  };

  // iPhone-like keyboard layouts
  const letterRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  const numberRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
    ['#+=', '.', ',', '?', '!', "'"],
  ];

  const symbolRows = [
    ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='],
    ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'],
    ['.', ',', '?', '!', "'"],
  ];

  const KeyButton = ({ 
    keyName, 
    isWide = false,
    isSmallWide = false,
    isLarge = false,
    isMediumLarge = false,
    isSpecial = false,
    isEmoji = false,
    isMedium = false,
    isReturn = false,
  }: { 
    keyName: string; 
    isWide?: boolean;
    isSmallWide?: boolean;
    isLarge?: boolean;
    isMediumLarge?: boolean;
    isSpecial?: boolean;
    isEmoji?: boolean;
    isMedium?: boolean;
    isReturn?: boolean;
  }) => {
    const pressAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    const handlePress = () => {
      if (keyName === 'SHIFT') {
        toggleShift();
      } else if (keyName === 'BACKSPACE') {
        onBackspace();
      } else if (keyName === 'RETURN' || keyName === 'ENTER') {
        onEnter();
      } else if (keyName === 'SPACE') {
        onSpace();
      } else if (keyName === '123') {
        switchToNumbers();
      } else if (keyName === 'ABC') {
        switchToLetters();
      } else if (keyName === '#+=') {
        switchToSymbols();
      } else if (keyName === 'MIC' || keyName === 'EMOJI') {
        // Placeholder for future functionality
        return;
      } else {
        handleKeyPress(keyName);
      }
    };

    const translateY = pressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 2],
    });

    const scale = pressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.95],
    });

    let displayText = keyName;
    if (keyName === 'MIC') {
      displayText = '🎤';
    } else if (keyName === 'EMOJI') {
      displayText = '😀';
    } else if (keyName === 'BACKSPACE') {
      displayText = '⌫';
    } else if (keyName === 'SHIFT') {
      displayText = '↑';
    } else if (keyName === 'RETURN' || keyName === 'ENTER') {
      displayText = isReturn ? '↵' : 'return';
    } else if (keyName === 'SPACE') {
      displayText = 'space';
    } else if (keyName === '#+=') {
      displayText = '#+=';
    }

    return (
      <Animated.View
        style={[
          {
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          activeOpacity={0.6}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          style={[
            styles.key,
            isWide && styles.wideKey,
            isSmallWide && styles.smallWideKey,
            isLarge && styles.largeKey,
            isMediumLarge && styles.mediumLargeKey,
            isSpecial && styles.specialKey,
            isEmoji && styles.emojiKey,
            isMedium && styles.mediumKey,
            isReturn && styles.returnKey,
            {
              backgroundColor: keyName === 'SHIFT' && isShift ? theme.dropdownActiveBackground : theme.gridBoxBackground,
              // 3D effect: light top/left, dark bottom/right
              borderTopColor: '#E0F0C8',
              borderLeftColor: '#E0F0C8',
              borderRightColor: theme.gridBoxBorder,
              borderBottomColor: theme.gridBoxBorder,
            },
          ]}
        >
          {isEmoji ? (
            <Text style={styles.emojiText}>{displayText}</Text>
          ) : (
            <Text
              style={[
                styles.keyText,
                { color: theme.iconText },
                isWide && styles.wideKeyText,
                isSpecial && styles.specialKeyText,
                isMedium && styles.mediumKeyText,
                isReturn && styles.returnText,
                keyName === 'BACKSPACE' && styles.backspaceText,
              ]}
            >
              {displayText}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.keyboardContainer, { backgroundColor: theme.screenBackground }]}>
      {/* Header */}
      <View style={[styles.keyboardHeader, { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorder }]}>
        <Text style={[styles.keyboardTitle, { color: theme.headerText }]}>KEYBOARD</Text>
        <TouchableOpacity
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
        >
          <Text style={[styles.closeButtonText, { color: theme.modalText }]}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Keyboard */}
      <View style={styles.keyboard}>
        {keyboardMode === 'letters' ? (
          <>
            {/* Letter Rows - Aligned vertically */}
            {letterRows.map((row, rowIndex) => {
              // Alignment strategy:
              // - Q, A, Shift, 123 should all have their LEFT EDGES at the same X position
              // - P, L, Backspace, Return should all have their RIGHT EDGES at the same X position
              // 
              // Key structure: margin(3px) + key(width) + margin(3px)
              // - Regular: 3 + 32 + 3 = 38px total space
              // - Wide (Shift/Backspace): 3 + 56 + 3 = 62px total space
              //
              // Row 2 reference: Shift(62) + 7 keys(266) + Backspace(62) = 390px
              // All rows should match this total width
              
              let leftSpacer = 0;
              let rightSpacer = 0;
              
              if (rowIndex === 0) {
                // Q row: 10 keys = 380px total
                // Q's left edge aligns with Shift's left edge (both at paddingLeft + margin)
                // Need right spacer to match backspace: 62px total space
                rightSpacer = 62;
              } else if (rowIndex === 1) {
                // A row: 9 keys = 342px total
                // Center aligned - no spacers needed
                leftSpacer = 0;
                rightSpacer = 0;
              }
              // Row 2 (Z row) already has Shift and Backspace, no spacers needed
              
              return (
                <View key={rowIndex} style={[styles.keyRow, rowIndex === 1 && { justifyContent: 'center', paddingLeft: 8 }]}>
                  {rowIndex === 2 && <KeyButton keyName="SHIFT" isSmallWide />}
                  {leftSpacer > 0 && <View style={{ width: leftSpacer }} />}
                  {row.map((key) => (
                    <KeyButton key={key} keyName={isShift ? key.toUpperCase() : key} />
                  ))}
                  {rightSpacer > 0 && <View style={{ width: rightSpacer }} />}
                  {rowIndex === 2 && <KeyButton keyName="BACKSPACE" isSmallWide />}
                </View>
              );
            })}

            {/* Bottom Row - iPhone style */}
            <View style={styles.bottomRow}>
              <KeyButton keyName="123" isMedium />
              <KeyButton keyName="EMOJI" isEmoji isMedium />
              <KeyButton keyName="SPACE" isSpecial />
              <KeyButton keyName="RETURN" isReturn />
            </View>
          </>
        ) : keyboardMode === 'numbers' ? (
          <>
            {/* Number Rows - Aligned like alphabet keyboard */}
            {numberRows.map((row, rowIndex) => {
              // Align numbers keyboard similar to alphabet keyboard
              // First row has backspace on right, needs left alignment
              // Second and third rows need proper spacing
              
              let leftSpacer = 0;
              let rightSpacer = 0;
              
              if (rowIndex === 0) {
                // First row: numbers 1-0 + backspace
                // Align left with other keyboards, backspace on right
                rightSpacer = 0; // backspace is already there
              } else if (rowIndex === 1) {
                // Second row: symbols, align left
                leftSpacer = 0;
                rightSpacer = 62; // match backspace width
              } else if (rowIndex === 2) {
                // Third row: #+=, ., ,, ?, !, ', and backspace (all large keys)
                leftSpacer = 0;
                rightSpacer = 0; // backspace is already there
              }
              
              return (
                <View key={rowIndex} style={styles.keyRow}>
                  {leftSpacer > 0 && <View style={{ width: leftSpacer }} />}
                  {rowIndex === 2 ? (
                    <>
                      <KeyButton keyName="#+=" isLarge />
                      <View style={{ width: 4 }} />
                      {row.slice(1).map((key) => (
                        <KeyButton key={key} keyName={key} isMediumLarge />
                      ))}
                      <View style={{ width: 4 }} />
                      <KeyButton keyName="BACKSPACE" isLarge />
                    </>
                  ) : (
                    row.map((key) => (
                      <KeyButton key={key} keyName={key} />
                    ))
                  )}
                  {rightSpacer > 0 && <View style={{ width: rightSpacer }} />}
                </View>
              );
            })}

            {/* Bottom Row - Numbers mode (matching alphabet keyboard) */}
            <View style={styles.bottomRow}>
              <KeyButton keyName="ABC" isMedium />
              <KeyButton keyName="EMOJI" isEmoji isMedium />
              <KeyButton keyName="SPACE" isSpecial />
              <KeyButton keyName="RETURN" isReturn />
            </View>
          </>
        ) : (
          <>
            {/* Symbol Rows - Aligned like alphabet keyboard */}
            {symbolRows.map((row, rowIndex) => {
              // Align symbols keyboard similar to alphabet keyboard
              
              let leftSpacer = 0;
              let rightSpacer = 0;
              
              if (rowIndex === 0) {
                // First row: symbols + backspace
                rightSpacer = 0; // backspace is already there
              } else if (rowIndex === 1) {
                // Second row: more symbols
                leftSpacer = 0;
                rightSpacer = 62; // match backspace width
              } else if (rowIndex === 2) {
                // Third row: punctuation + quote
                leftSpacer = 0;
                rightSpacer = 62; // match backspace width
              }
              
              return (
                <View key={rowIndex} style={styles.keyRow}>
                  {leftSpacer > 0 && <View style={{ width: leftSpacer }} />}
                  {row.map((key) => (
                    <KeyButton key={key} keyName={key} />
                  ))}
                  {rowIndex === 0 && <KeyButton keyName="BACKSPACE" isWide />}
                  {rowIndex === 2 && <KeyButton keyName="'" />}
                  {rightSpacer > 0 && <View style={{ width: rightSpacer }} />}
                </View>
              );
            })}

            {/* Bottom Row - Symbols mode (matching alphabet keyboard) */}
            <View style={styles.bottomRow}>
              <KeyButton keyName="123" isMedium />
              <KeyButton keyName="EMOJI" isEmoji isMedium />
              <KeyButton keyName="SPACE" isSpecial />
              <KeyButton keyName="RETURN" isReturn />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    width: '100%',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#6B8537',
    borderTopColor: 'transparent',
  },
  keyboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  keyboardTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  keyboard: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxHeight: 300,
  },
  keyRow: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 6,
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    marginBottom: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 6,
    width: '100%',
  },
  key: {
    width: 32,
    height: 44,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    // 3D elevated effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    // Border creates 3D effect
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  wideKey: {
    width: 56,
    marginHorizontal: 3,
  },
  smallWideKey: {
    width: 51,
    marginHorizontal: 3,
  },
  largeKey: {
    width: 52, // slightly bigger for #+= and backspace
    marginHorizontal: 3,
  },
  mediumLargeKey: {
    width: 45, // slightly smaller than large for middle keys
    marginHorizontal: 3,
  },
  specialKey: {
    flex: 2,
    minWidth: 180,
    maxWidth: 250,
    marginHorizontal: 2,
  },
  emojiKey: {
    width: 36,
    marginHorizontal: 3,
  },
  mediumKey: {
    width: 42,
    marginHorizontal: 3,
  },
  returnKey: {
    flex: 1,
    minWidth: 95,
    maxWidth: 135,
    marginHorizontal: 2,
  },
  keyText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 13,
  },
  wideKeyText: {
    fontSize: 9,
  },
  specialKeyText: {
    fontSize: 8,
  },
  mediumKeyText: {
    fontSize: 10,
  },
  returnText: {
    fontSize: 18,
    lineHeight: 22,
  },
  backspaceText: {
    fontSize: 20,
    lineHeight: 24,
  },
  emojiText: {
    fontSize: 20,
    lineHeight: 24,
  },
});
