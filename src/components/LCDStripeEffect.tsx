import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function LCDStripeEffect() {
  return (
    <View style={styles.container}>
      {Array.from({ length: Math.ceil(SCREEN_WIDTH / 2) }).map((_, index) => {
        const colorIndex = index % 3;
        const colors = [
          'rgba(60, 70, 80, 0.15)', // Greyish-blue - more visible
          'rgba(80, 60, 70, 0.15)', // Greyish-red - more visible
          'rgba(70, 80, 60, 0.15)', // Greyish-green - more visible
        ];
        return (
          <View
            key={index}
            style={[
              styles.stripe,
              {
                left: index * 2,
                backgroundColor: colors[colorIndex],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    pointerEvents: 'none',
  },
  stripe: {
    width: 2,
    height: '100%',
    position: 'absolute',
  },
});

