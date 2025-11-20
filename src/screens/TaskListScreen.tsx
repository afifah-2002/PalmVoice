import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FavoriteButtons } from '../components/FavoriteButtons';
import { PalmButton } from '../components/PalmButton';
import { PalmTextInput } from '../components/PalmTextInput';
import { PALM_THEMES } from '../constants/palmThemes';
import { useTheme } from '../contexts/ThemeContext';
import { exportTasksToCalendar } from '../services/calendarService';
import { formatDate } from '../services/dateParser';
import { playTaskComplete } from '../services/soundService';
import { loadTasks, saveTasks } from '../services/storage';
import { Task } from '../types/Task';

export const TaskListScreen: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState('');
  
  const { currentTheme } = useTheme();
  
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  
  const theme = PALM_THEMES[currentTheme];

  // Load tasks on mount
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
    }
  }, [tasks, isLoading]);

  const loadTasksFromStorage = async () => {
    try {
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      playTaskComplete();
    }
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTasks = (newTasks: Task[]) => {
    setTasks([...newTasks, ...tasks]);
  };

  const startEditTask = (task: Task) => {
    setEditingTask(task);
    setEditText(task.text);
  };

  const saveEditTask = () => {
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? { ...task, text: editText.toUpperCase() } : task
      ));
      setEditingTask(null);
      setEditText('');
    }
  };

  const cancelEditTask = () => {
    setEditingTask(null);
    setEditText('');
  };

  const handleSync = async () => {
    try {
      const result = await exportTasksToCalendar(tasks);
      if (result.success) {
        Alert.alert('SYNC COMPLETE', result.message);
      } else {
        Alert.alert('SYNC FAILED', result.message);
      }
    } catch (error) {
      Alert.alert('SYNC ERROR', 'FAILED TO EXPORT TASKS');
    }
  };

  // Expose addTasks globally for navigation
  useEffect(() => {
    (global as any).addTasksToList = addTasks;
    return () => {
      delete (global as any).addTasksToList;
    };
  }, [tasks]);

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      style={styles.taskRow} 
      onPress={() => toggleTask(item.id)}
      onLongPress={() => startEditTask(item)}
      activeOpacity={0.7}
    >
      <View style={styles.checkbox}>
        {item.completed && <View style={styles.checkboxFilled} />}
      </View>
      <View style={styles.taskContent}>
        <Text style={[
          styles.taskText,
          item.completed && styles.taskTextCompleted
        ]}>
          {item.text}
        </Text>
        {item.dueDate && (
          <Text style={styles.taskDate}>{formatDate(item.dueDate)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading || !fontsLoaded) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.bezel}>
          <View style={styles.screen}>
            <View style={styles.header}>
              <Text style={styles.headerText}>TASKS</Text>
            </View>
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>LOADING...</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      {/* Bezel with Palm Pilot branding */}
      <View style={styles.bezel}>
        <View style={styles.bezelTop}>
          <Text style={styles.palmPilotText}>Palm Pilot</Text>
          <View style={styles.logo3Com}>
            <Text style={styles.logo3ComText}>3Com</Text>
          </View>
        </View>

        {/* LCD Screen */}
        <View style={[styles.screen, { backgroundColor: theme.screenBackground }]}>
          {/* LCD grain overlay */}
          <View style={styles.lcdGrain} />
          
          <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorder }]}>
            <Text style={[styles.headerText, { color: theme.headerText }]}>TASKS</Text>
          </View>

          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={item => item.id}
            style={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.iconText }]}>NO TASKS</Text>
                <Text style={[styles.emptySubtext, { color: theme.iconText }]}>TAP NEW TASK TO ADD</Text>
              </View>
            }
          />

          <View style={[styles.footer, { borderTopColor: theme.headerBorder }]}>
            <PalmButton 
              title="SYNC" 
              onPress={handleSync} 
            />
            <View style={styles.buttonSpacer} />
            <PalmButton 
              title="NEW TASK" 
              onPress={() => router.push('/record')} 
            />
          </View>

          <PalmTextInput
            visible={editingTask !== null}
            title="EDIT TASK"
            value={editText}
            onChangeText={setEditText}
            onSave={saveEditTask}
            onCancel={cancelEditTask}
          />
        </View>

        {/* Favorite Buttons - Gray Bezel Bottom */}
        <FavoriteButtons />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bezel: {
    flex: 1,
    backgroundColor: '#3A3A3A',
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
    position: 'relative',
    opacity: 0.98,
    borderWidth: 2,
    borderColor: '#505050',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    position: 'relative',
  },
  headerText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#000000',
  },
  list: {
    flex: 1,
  },
  taskRow: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000000',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxFilled: {
    width: 12,
    height: 12,
    backgroundColor: '#000000',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#000000',
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  taskDate: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#666666',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#000000',
  },
  emptySubtext: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#000000',
    marginTop: 8,
  },
  footer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#000000',
  },
  buttonSpacer: {
    width: 16,
  },
  lcdGrain: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(43, 61, 15, 0.03)',
    opacity: 0.5,
    pointerEvents: 'none',
  },
});
