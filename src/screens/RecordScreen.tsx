import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmButton } from '../components/PalmButton';
import { parseVoiceToTasks } from '../services/aiService';
import { playRecordStart, playRecordStop } from '../services/soundService';
import { Task } from '../types/Task';

type RecordingState = 'ready' | 'recording' | 'processing';

interface RecordScreenProps {
  onTasksCreated?: (tasks: Task[]) => void;
}

export const RecordScreen: React.FC<RecordScreenProps> = ({ onTasksCreated }) => {
  const router = useRouter();
  const [recordingState, setRecordingState] = useState<RecordingState>('ready');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [duration, setDuration] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (recordingState === 'recording') {
      interval = setInterval(() => {
        setDuration(prev => {
          if (prev >= 120) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  // Pulsing animation effect
  useEffect(() => {
    if (recordingState === 'recording') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [recordingState]);

  const startRecording = async () => {
    try {
      playRecordStart();
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setRecordingState('recording');
      setDuration(0);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      playRecordStop();
      setRecordingState('processing');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) {
        throw new Error('No audio URI available');
      }

      // Use AI service to parse voice to tasks
      const tasks = await parseVoiceToTasks(uri);
      
      // Add tasks to the global task list
      if ((global as any).addTasksToList) {
        (global as any).addTasksToList(tasks);
      }
      
      if (onTasksCreated) {
        onTasksCreated(tasks);
      }
      
      console.log('Parsed tasks:', tasks);
      setRecordingState('ready');
      setDuration(0);
      
      // Navigate back to index
      router.back();
    } catch (error) {
      console.error('Error processing recording:', error);
      setRecordingState('ready');
      setDuration(0);
      // Still navigate back even on error
      router.back();
    }
  };

  const toggleRecording = () => {
    if (recordingState === 'ready') {
      startRecording();
    } else if (recordingState === 'recording') {
      stopRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>RECORD NOTE</Text>
      </View>

      <View style={styles.content}>
        <Animated.View
          style={{
            transform: [{ scale: recordingState === 'recording' ? pulseAnim : 1 }],
          }}
        >
          <TouchableOpacity
            style={[
              styles.recordButton,
              recordingState === 'recording' && styles.recordButtonActive,
            ]}
            onPress={toggleRecording}
            disabled={recordingState === 'processing'}
            activeOpacity={0.7}
          >
            {recordingState === 'ready' && (
              <Text style={styles.recordButtonText}>TAP TO{'\n'}RECORD</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {recordingState === 'recording' && (
          <Text style={styles.timer}>{formatTime(duration)}</Text>
        )}

        {recordingState === 'processing' && (
          <Text style={styles.processingText}>PROCESSING...</Text>
        )}
      </View>

      <View style={styles.footer}>
        <PalmButton
          title="DONE"
          onPress={stopRecording}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#FF0000',
  },
  recordButtonText: {
    fontFamily: 'Courier',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  timer: {
    fontFamily: 'Courier',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
  },
  processingText: {
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
  },
  footer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#000000',
  },
});
