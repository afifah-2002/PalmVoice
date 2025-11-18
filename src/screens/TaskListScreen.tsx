import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmButton } from '../components/PalmButton';
import { PalmTextInput } from '../components/PalmTextInput';
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>TASKS</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>LOADING...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* LCD grain overlay */}
      <View style={styles.lcdGrain} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.aboutButton}
          onPress={() => router.push('/about' as any)}
        >
          <Text style={styles.aboutButtonText}>?</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>TASKS</Text>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>NO TASKS</Text>
            <Text style={styles.emptySubtext}>TAP NEW TASK TO ADD</Text>
          </View>
        }
      />

      <View style={styles.footer}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9CBD5A', // Changed from '#FFFFFF'
    position: 'relative',
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
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  aboutButton: {
    position: 'absolute',
    right: 16,
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutButtonText: {
    fontFamily: 'Courier',
    fontSize: 18,
    fontWeight: 'bold',
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
    fontFamily: 'Courier',
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  taskDate: {
    fontFamily: 'Courier',
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  emptySubtext: {
    fontFamily: 'Courier',
    fontSize: 14,
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
