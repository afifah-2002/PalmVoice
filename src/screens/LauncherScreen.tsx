import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PixelIcon } from '../components/PixelIcon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AppIcon {
  label: string;
  route?: string;
}

const APPS: AppIcon[][] = [
  [
    { label: 'ADDRESS' },
    { label: 'CALC' },
    { label: 'DATE BOOK' },
    { label: 'EXPENSE' },
  ],
  [
    { label: 'GIRAFFE' },
    { label: 'HOTSYNC' },
    { label: 'MAIL' },
    { label: 'MEMO PAD' },
  ],
  [
    { label: 'MEMORY' },
    { label: 'PREFS' },
    { label: 'SECURITY' },
    { label: 'TO DO LIST', route: '/tasks' },
  ],
];

export default function LauncherScreen() {
  const router = useRouter();
  const [cursorVisible, setCursorVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Blinking cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleAppPress = (app: AppIcon) => {
    if (app.route) {
      router.push(app.route as any);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <View style={styles.bezel}>
          <View style={styles.screen} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bezel with Palm Pilot branding */}
      <View style={styles.bezel}>
        <View style={styles.bezelTop}>
          <Text style={styles.palmPilotText}>Palm Pilot</Text>
          <View style={styles.logo3Com}>
            <Text style={styles.logo3ComText}>3Com</Text>
          </View>
        </View>

        {/* LCD Screen */}
        <View style={styles.screen}>
          {/* Subtle LCD grain overlay */}
          <View style={styles.lcdGrain} />

          {/* Status Bar with battery and time */}
          <View style={styles.statusBar}>
            {/* Battery icon (full) */}
            <View style={styles.batteryContainer}>
              <View style={styles.batteryBody}>
                <View style={styles.batteryFill} />
              </View>
              <View style={styles.batteryTip} />
            </View>
            
            {/* Time */}
            <Text style={styles.statusTime}>{currentTime}</Text>
          </View>

          {/* App Icons Grid - 4x3 */}
          <View style={styles.appsGrid}>
            {APPS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.appRow}>
                {row.map((app, colIndex) => (
                  <TouchableOpacity
                    key={`${rowIndex}-${colIndex}`}
                    style={styles.appContainer}
                    onPress={() => handleAppPress(app)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.iconCircle}>
                      <PixelIcon type={app.label} />
                    </View>
                    <Text style={styles.appLabel}>{app.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* Graffiti Area Container */}
          <View style={styles.graffitiContainer}>
            {/* Left Side Icons */}
            <View style={styles.leftIcons}>
              <View style={styles.smallIconCircle}>
                {/* Back arrow */}
                <View style={styles.arrowLeft} />
              </View>
              <View style={styles.smallIconCircle}>
                {/* Menu lines */}
                <View style={styles.menuLines}>
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                </View>
              </View>
            </View>

            {/* Graffiti Writing Area - Single Box */}
            <View style={styles.graffitiArea}>
              <Text style={styles.graffitiLabelTopLeft}>ABC</Text>
              <Text style={styles.graffitiLabelTopRight}>123</Text>
              {cursorVisible && <View style={styles.cursor} />}
            </View>

            {/* Right Side Icons */}
            <View style={styles.rightIcons}>
              <View style={styles.smallIconCircle}>
                {/* Globe/Web */}
                <View style={styles.globe} />
              </View>
              <View style={styles.smallIconCircle}>
                {/* Search/Find */}
                <View style={styles.search} />
              </View>
            </View>
          </View>
        </View>

        {/* Physical Buttons */}
        <View style={styles.buttonsArea}>
          <View style={styles.buttonGroup}>
            <View style={styles.button}>
              <Text style={styles.buttonIcon}>📅</Text>
            </View>
            <Text style={styles.buttonLabel}>Date</Text>
          </View>
          <View style={styles.buttonGroup}>
            <View style={styles.button}>
              <Text style={styles.buttonIcon}>📇</Text>
            </View>
            <Text style={styles.buttonLabel}>Address</Text>
          </View>
          <View style={styles.buttonScroll}>
            <Text style={styles.scrollText}>↕</Text>
          </View>
          <View style={styles.buttonGroup}>
            <View style={styles.button}>
              <Text style={styles.buttonIcon}>✓</Text>
            </View>
            <Text style={styles.buttonLabel}>To Do</Text>
          </View>
          <View style={styles.buttonGroup}>
            <View style={styles.button}>
              <Text style={styles.buttonIcon}>📝</Text>
            </View>
            <Text style={styles.buttonLabel}>Memo</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000000',
  },
  bezel: {
    flex: 1,
    backgroundColor: '#6B6B6B',
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
    backgroundColor: '#9CBD5A',
    position: 'relative',
    opacity: 0.98,
    borderWidth: 2,
    borderColor: '#505050',
  },
  lcdGrain: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(43, 61, 15, 0.03)',
    opacity: 0.5,
  },
  statusBar: {
    height: 28,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6B8537',
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryBody: {
    width: 20,
    height: 10,
    borderWidth: 1,
    borderColor: '#2B3D0F',
    backgroundColor: '#9CBD5A',
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  batteryFill: {
    flex: 1,
    backgroundColor: '#2B3D0F',
  },
  batteryTip: {
    width: 2,
    height: 6,
    backgroundColor: '#2B3D0F',
    marginLeft: -1,
  },
  statusTime: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#2B3D0F',
  },
  appsGrid: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-evenly',
  },
  appRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  appContainer: {
    width: 80,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3D4A1F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2B3D0F',
  },
  appLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: '#2B3D0F',
    textAlign: 'center',
    lineHeight: 11,
    marginTop: 8,
  },
  graffitiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  leftIcons: {
    width: 32,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 140,
  },
  rightIcons: {
    width: 32,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 140,
  },
  smallIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2B3D0F',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D4A1F',
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#9CBD5A',
  },
  menuLines: {
    justifyContent: 'space-around',
    height: 14,
  },
  menuLine: {
    width: 12,
    height: 2,
    backgroundColor: '#9CBD5A',
    marginVertical: 1,
  },
  globe: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#9CBD5A',
  },
  search: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9CBD5A',
  },
  graffitiArea: {
    flex: 1,
    height: 140,
    borderWidth: 2,
    borderColor: '#6B8537',
    backgroundColor: '#9CBD5A',
    marginHorizontal: 6,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graffitiLabelTopLeft: {
    position: 'absolute',
    top: 8,
    left: 12,
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#6B8537',
  },
  graffitiLabelTopRight: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#6B8537',
  },
  cursor: {
    width: 8,
    height: 12,
    backgroundColor: '#2B3D0F',
  },
  buttonsArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  buttonGroup: {
    alignItems: 'center',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3A3A3A',
    borderWidth: 2,
    borderColor: '#505050',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  buttonScroll: {
    width: 36,
    height: 70,
    backgroundColor: '#3A3A3A',
    borderWidth: 2,
    borderColor: '#505050',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 22,
    color: '#6B8537',
  },
  scrollText: {
    fontSize: 28,
    color: '#6B8537',
    fontWeight: 'bold',
  },
  buttonLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#CCCCCC',
  },
});
