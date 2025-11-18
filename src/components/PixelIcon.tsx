import React from 'react';
import { StyleSheet, View } from 'react-native';

const PIXEL_SIZE = 4;
const DARK = '#FFFFFF'; // White for icon on dark green background
const MEDIUM = '#D4E8A8'; // Light green for highlights
const LIGHT = '#B8D87A'; // Medium green for lighter highlights

interface PixelIconProps {
  type: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({ type }) => {
  const renderPixels = () => {
    switch (type) {
      case 'ADDRESS':
        // Person icon - head and shoulders
        return (
          <View style={styles.iconContainer}>
            {/* Head */}
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            {/* Shoulders */}
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
          </View>
        );

      case 'CALC':
        // Calculator icon
        return (
          <View style={styles.iconContainer}>
            {/* Border */}
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
            {/* Display */}
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            {/* Buttons */}
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
          </View>
        );

      case 'DATE BOOK':
        // Calendar icon
        return (
          <View style={styles.iconContainer}>
            {/* Top binding */}
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            {/* Calendar body */}
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
          </View>
        );

      case 'EXPENSE':
        // Dollar sign
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
          </View>
        );

      case 'MAIL':
        // Envelope icon
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
          </View>
        );

      case 'TO DO LIST':
        // Checkmark icon
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
          </View>
        );

      case 'MEMO PAD':
        // Notepad icon
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
          </View>
        );

      case 'SECURITY':
        // Lock icon
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
          </View>
        );

      case 'GIRAFFE':
        // Giraffe icon - simple head with spots
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
          </View>
        );

      case 'HOTSYNC':
        // HotSync icon - circular arrows
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
          </View>
        );

      case 'MEMORY':
        // Memory icon - chip/circuit
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
          </View>
        );

      case 'PREFS':
        // Preferences icon - gear/settings
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
          </View>
        );

      case 'HOME':
        // Home icon - house shape
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
          </View>
        );

      case 'ARROW_LEFT':
        // Left-pointing arrow
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
          </View>
        );

      case 'PHONE':
        // Phone receiver icon
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
          </View>
        );

      case 'MAGNIFYING_GLASS':
        // Magnifying glass/search icon
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
            </View>
          </View>
        );

      case 'CALCULATOR_SYMBOLS':
        // Calculator with + - % * symbols in a grid
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
            {/* Row with + and - */}
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            {/* Row with % and * */}
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
          </View>
        );

      case 'CALCULATOR_ICON':
        // Calculator icon (keyboard style)
        return (
          <View style={styles.iconContainer}>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: MEDIUM }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: 'transparent' }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
              <View style={[styles.pixel, { backgroundColor: DARK }]} />
            </View>
            <View style={styles.row}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.pixel, { backgroundColor: DARK }]} />
              ))}
            </View>
          </View>
        );

      default:
        // Generic square for other apps
        return (
          <View style={styles.iconContainer}>
            {[...Array(5)].map((_, rowIdx) => (
              <View key={rowIdx} style={styles.row}>
                {[...Array(5)].map((_, colIdx) => (
                  <View key={colIdx} style={[styles.pixel, { backgroundColor: DARK }]} />
                ))}
              </View>
            ))}
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderPixels()}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  pixel: {
    width: PIXEL_SIZE,
    height: PIXEL_SIZE,
  },
});

// Export a function to get icon size based on type
export const getIconSize = (type: string): { width: number; height: number } => {
  // Side icons (ARROW_LEFT, PHONE, etc.) should be larger
  if (['ARROW_LEFT', 'PHONE', 'MAGNIFYING_GLASS', 'CALCULATOR_ICON'].includes(type)) {
    return { width: 48, height: 48 };
  }
  // App icons
  return { width: 56, height: 56 };
};
