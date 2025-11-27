import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';

interface MiniKeyboardProps {
  visible: boolean;
  theme: PalmTheme;
  onKeyPress: (key: string) => void;
  onClose: () => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
}

export function MiniKeyboard({
  visible,
  theme,
  onKeyPress,
  onClose,
  onBackspace,
  onEnter,
  onSpace,
}: MiniKeyboardProps) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const [isShift, setIsShift] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<'letters' | 'numbers' | 'symbols'>('letters');

  if (!fontsLoaded || !visible) {
    return null;
  }

  const handleKeyPress = (key: string) => {
    onKeyPress(key);
    if (isShift && key.length === 1) {
      setIsShift(false);
    }
  };

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
    ['123', '.', ',', '?', '!', "'", 'BACKSPACE'],
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
    isExtraLarge = false,
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
    isExtraLarge?: boolean;
  }) => {
    const handlePressIn = () => {
      // Haptic feedback - like iPhone keyboard!
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Trigger key action immediately on touch (not waiting for release)
      if (keyName === 'SHIFT') {
        setIsShift(!isShift);
      } else if (keyName === 'BACKSPACE') {
        onBackspace();
      } else if (keyName === 'RETURN' || keyName === 'ENTER') {
        onEnter();
      } else if (keyName === 'SPACE') {
        onSpace();
      } else if (keyName === '123') {
        setKeyboardMode('numbers');
        setIsShift(false);
      } else if (keyName === 'ABC') {
        setKeyboardMode('letters');
        setIsShift(false);
      } else if (keyName === '#+=') {
        setKeyboardMode('symbols');
        setIsShift(false);
      } else if (keyName === 'EMOJI') {
        // Placeholder for future functionality
      } else {
        handleKeyPress(keyName);
      }
    };

    let displayText = keyName;
    if (keyName === 'EMOJI') {
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
      <TouchableOpacity
        onPressIn={handlePressIn}
        delayPressIn={0}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
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
          isExtraLarge && styles.extraLargeKey,
          {
            backgroundColor: keyName === 'SHIFT' && isShift ? theme.dropdownActiveBackground : theme.gridBoxBackground,
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
              isExtraLarge && styles.extraLargeKeyText,
              keyName === 'BACKSPACE' && styles.backspaceText,
            ]}
          >
            {displayText}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.keyboardContainer, { backgroundColor: theme.screenBackground, borderColor: theme.gridBoxBorder }]}>
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
            {/* Letter Rows */}
            {letterRows.map((row, rowIndex) => {
              let rightSpacer = 0;
              
              if (rowIndex === 0) {
                rightSpacer = 62;
              }
              
              return (
                <View key={rowIndex} style={[styles.keyRow, rowIndex === 1 && { justifyContent: 'center', paddingLeft: 8 }]}>
                  {rowIndex === 2 && <KeyButton keyName="SHIFT" isSmallWide />}
                  {row.map((key) => (
                    <KeyButton key={key} keyName={isShift ? key.toUpperCase() : key} />
                  ))}
                  {rightSpacer > 0 && <View style={{ width: rightSpacer }} />}
                  {rowIndex === 2 && <KeyButton keyName="BACKSPACE" isSmallWide />}
                </View>
              );
            })}

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
              <KeyButton keyName="123" isMedium />
              <KeyButton keyName="EMOJI" isEmoji isMedium />
              <KeyButton keyName="SPACE" isSpecial />
              <KeyButton keyName="RETURN" isReturn />
            </View>
          </>
        ) : keyboardMode === 'numbers' ? (
          <>
            {/* Number Rows */}
            {numberRows.map((row, rowIndex) => {
              let rightSpacer = 0;
              
              if (rowIndex === 1) {
                rightSpacer = 62;
              }
              
              return (
                <View key={rowIndex} style={styles.keyRow}>
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
                    <>
                      {row.map((key) => (
                        <KeyButton key={key} keyName={key} />
                      ))}
                      {rightSpacer > 0 && <View style={{ width: rightSpacer }} />}
                    </>
                  )}
                </View>
              );
            })}

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
              <KeyButton keyName="ABC" isMedium />
              <KeyButton keyName="EMOJI" isEmoji isMedium />
              <KeyButton keyName="SPACE" isSpecial />
              <KeyButton keyName="RETURN" isReturn />
            </View>
          </>
        ) : (
          <>
            {/* Symbol Rows */}
            {symbolRows.map((row, rowIndex) => {
              return (
                <View key={rowIndex} style={styles.keyRow}>
                  {rowIndex === 2 ? (
                    row.map((key) => (
                      <KeyButton key={key} keyName={key} isExtraLarge />
                    ))
                  ) : (
                    row.map((key) => (
                      <KeyButton key={key} keyName={key} />
                    ))
                  )}
                </View>
              );
            })}

            {/* Bottom Row */}
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
    borderTopWidth: 2,
    zIndex: 1002,
  },
  keyboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 2,
  },
  keyboardTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 2,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  keyboard: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  keyRow: {
    flexDirection: 'row',
    marginBottom: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 6,
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 6,
    width: '100%',
  },
  key: {
    width: 28,
    height: 38,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  wideKey: {
    width: 48,
    marginHorizontal: 2,
  },
  smallWideKey: {
    width: 44,
    marginHorizontal: 2,
  },
  largeKey: {
    width: 45,
    marginHorizontal: 2,
  },
  mediumLargeKey: {
    width: 38,
    marginHorizontal: 2,
  },
  specialKey: {
    flex: 2,
    minWidth: 150,
    maxWidth: 220,
    marginHorizontal: 2,
  },
  emojiKey: {
    width: 32,
    marginHorizontal: 2,
  },
  mediumKey: {
    width: 36,
    marginHorizontal: 2,
  },
  returnKey: {
    flex: 1,
    minWidth: 80,
    maxWidth: 115,
    marginHorizontal: 2,
  },
  extraLargeKey: {
    width: 42,
    height: 38,
    marginHorizontal: 2,
  },
  keyText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 11,
  },
  wideKeyText: {
    fontSize: 8,
  },
  specialKeyText: {
    fontSize: 7,
  },
  mediumKeyText: {
    fontSize: 8,
  },
  returnText: {
    fontSize: 16,
    lineHeight: 20,
  },
  backspaceText: {
    fontSize: 18,
    lineHeight: 22,
  },
  emojiText: {
    fontSize: 18,
    lineHeight: 22,
  },
  extraLargeKeyText: {
    fontSize: 11,
  },
});
