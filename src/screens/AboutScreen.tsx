import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PalmButton } from '../components/PalmButton';

export const AboutScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ABOUT</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>PALMVOICE</Text>
          <Text style={styles.version}>VERSION 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <Text style={styles.text}>
            VOICE-TO-TASK APP WITH{'\n'}
            PALM OS AESTHETIC.{'\n'}
            RECORD NOTES, GET TASKS.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CREATED BY</Text>
          <Text style={styles.text}>
            AFIFAH KHAN{'\n'}
            2024
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BUILT WITH</Text>
          <Text style={styles.text}>
            KIRO AI ASSISTANT{'\n'}
            REACT NATIVE{'\n'}
            EXPO
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FEATURES</Text>
          <Text style={styles.text}>
            • VOICE RECORDING{'\n'}
            • SMART TASK PARSING{'\n'}
            • DATE DETECTION{'\n'}
            • CALENDAR SYNC{'\n'}
            • PERSISTENT STORAGE{'\n'}
            • PALM OS UI
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CREDITS</Text>
          <Text style={styles.text}>
            THIS APP WAS BUILT WITH{'\n'}
            ASSISTANCE FROM KIRO,{'\n'}
            AN AI-POWERED IDE.{'\n'}
            {'\n'}
            KIRO HELPED WITH:{'\n'}
            • CODE GENERATION{'\n'}
            • ARCHITECTURE DESIGN{'\n'}
            • DEBUGGING{'\n'}
            • UI IMPLEMENTATION
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PalmButton 
          title="BACK" 
          onPress={() => router.back()} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  headerText: {
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Courier',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  version: {
    fontFamily: 'Courier',
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  text: {
    fontFamily: 'Courier',
    fontSize: 12,
    color: '#000000',
    lineHeight: 18,
  },
  footer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#000000',
  },
});
