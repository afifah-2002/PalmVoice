import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FavoriteButtons } from '../components/FavoriteButtons';
import { PalmButton } from '../components/PalmButton';
import { PixelAlert } from '../components/PixelAlert';
import { PixelCalendar } from '../components/PixelCalendar';
import { PixelKeyboard } from '../components/PixelKeyboard';
import { PALM_THEMES } from '../constants/palmThemes';
import { useTheme } from '../contexts/ThemeContext';
import { formatDate } from '../services/dateParser';
import { playTaskComplete } from '../services/soundService';
import { loadCoins, loadTasks, saveCoins, saveTasks } from '../services/storage';
import { executeAutomation, AutomationType } from '../services/automationService';
import { Task } from '../types/Task';

export const TaskListScreen: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isKeyboardVisibleInEdit, setIsKeyboardVisibleInEdit] = useState(true);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [typedTaskText, setTypedTaskText] = useState('');
  const [typedTaskDescription, setTypedTaskDescription] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isKeyboardVisibleInTyping, setIsKeyboardVisibleInTyping] = useState(true);
  const [typedTaskDueDate, setTypedTaskDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewingTaskDescription, setViewingTaskDescription] = useState<Task | null>(null);
  const [longPressMenuTask, setLongPressMenuTask] = useState<Task | null>(null);
  const [clickedTask, setClickedTask] = useState<Task | null>(null); // Task clicked for action menu
  const [isEditingTitle, setIsEditingTitle] = useState(true); // true = title, false = description
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconPickerTask, setIconPickerTask] = useState<Task | null>(null);
  const [overdueTask, setOverdueTask] = useState<Task | null>(null);
  const [showCoinPopup, setShowCoinPopup] = useState(false);
  const [coinPopupAmount, setCoinPopupAmount] = useState(1);
  const [automationResult, setAutomationResult] = useState<{ visible: boolean; success: boolean; message: string }>({ visible: false, success: false, message: '' });
  
  // Animation refs for coin popup
  const coinPopupScale = useRef(new Animated.Value(0)).current;
  const coinPopupOpacity = useRef(new Animated.Value(0)).current;
  const coinPopupTranslateY = useRef(new Animated.Value(20)).current;
  
  const { currentTheme } = useTheme();
  
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  
  const theme = PALM_THEMES[currentTheme];

  // Icon mapping
  const iconMap: { [key: string]: any } = {
    reminders: require('../../assets/icons/reminders.png'),
    trello: require('../../assets/icons/trello.png'),
    gmail: require('../../assets/icons/gmail.png'),
    canvas: require('../../assets/icons/canvas.png'),
    outlook: require('../../assets/icons/outlook.png'),
    fitness: require('../../assets/icons/fitness.png'),
    calendar: require('../../assets/icons/calendar.png'),
    whatsapp: require('../../assets/icons/whatsapp.png'),
    drive: require('../../assets/icons/drive.png'),
    zoom: require('../../assets/icons/zoom.png'),
    teams: require('../../assets/icons/teams.png'),
    gmeet: require('../../assets/icons/gmeet.png'),
    paypal: require('../../assets/icons/paypal.png'),
    amazon: require('../../assets/icons/amazon.png'),
    uber: require('../../assets/icons/uber.png'),
  };

  const iconNames = Object.keys(iconMap);

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

  // Blinking cursor effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530); // Blink every 530ms like iPhone
    
    return () => clearInterval(blinkInterval);
  }, []);

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

  // Show animated coin popup
  const showCoinEarnedPopup = (amount: number) => {
    setCoinPopupAmount(amount);
    setShowCoinPopup(true);
    
    // Reset animation values
    coinPopupScale.setValue(0);
    coinPopupOpacity.setValue(0);
    coinPopupTranslateY.setValue(20);
    
    // Animate in: scale up, fade in, slide up
    Animated.parallel([
      Animated.spring(coinPopupScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(coinPopupOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(coinPopupTranslateY, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Auto hide after 1.5 seconds
    setTimeout(() => {
      // Animate out: scale down, fade out, slide up more
      Animated.parallel([
        Animated.timing(coinPopupScale, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(coinPopupOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(coinPopupTranslateY, {
          toValue: -30,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowCoinPopup(false);
      });
    }, 1500);
  };

  const toggleTask = (id: string) => {
    if (isSelectionMode) {
      // Toggle selection
      const newSelected = new Set(selectedTaskIds);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setSelectedTaskIds(newSelected);
    } else {
      // Show action menu instead of auto-toggling
    const task = tasks.find(t => t.id === id);
      if (task) {
        setClickedTask(task);
      }
    }
  };

  const handleMarkTaskAsDone = async () => {
    if (clickedTask) {
      const task = tasks.find(t => t.id === clickedTask.id);
      if (task && !task.completed) {
        playTaskComplete();
        
        // Award coins for completing a task
        const currentCoins = await loadCoins();
        const newCoins = currentCoins + 1; // +1 coin for completing 1 task
        await saveCoins(newCoins);
        
        // Show coin earned popup
        showCoinEarnedPopup(1);
      }
      
      setTasks(tasks.map(task => 
        task.id === clickedTask.id ? { ...task, completed: !task.completed } : task
      ));
      setClickedTask(null);
    }
  };

  const handleEditFromClick = () => {
    if (clickedTask) {
      startEditTask(clickedTask);
      setClickedTask(null);
    }
  };

  const handleTaskLongPress = (task: Task) => {
    if (!isSelectionMode) {
      setLongPressMenuTask(task);
    }
  };

  const handleEditFromMenu = () => {
    if (longPressMenuTask) {
      startEditTask(longPressMenuTask);
      setLongPressMenuTask(null);
    }
  };

  const handleDeleteFromMenu = () => {
    if (longPressMenuTask) {
      setTasks(tasks.filter(t => t.id !== longPressMenuTask.id));
      setLongPressMenuTask(null);
    }
  };

  const handleClearAllCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const handleIconButtonPress = (task: Task) => {
    setIconPickerTask(task);
    setShowIconPicker(true);
  };

  const handleIconAutomation = async (task: Task, iconName: string) => {
    // Map icon names to automation types
    const automationTypes: { [key: string]: AutomationType } = {
      calendar: 'calendar',
      reminders: 'reminders',
      gmail: 'gmail',
      outlook: 'outlook',
      whatsapp: 'whatsapp',
      drive: 'drive',
      trello: 'trello',
      zoom: 'zoom',
      teams: 'teams',
      gmeet: 'gmeet',
      canvas: 'canvas',
      fitness: 'fitness',
      paypal: 'paypal',
      amazon: 'amazon',
      uber: 'uber',
    };

    const automationType = automationTypes[iconName.toLowerCase()];
    if (!automationType) {
      setAutomationResult({ visible: true, success: false, message: `NO AUTOMATION FOR ${iconName.toUpperCase()}` });
      return;
    }

    const result = await executeAutomation(automationType, task);
    setAutomationResult({ visible: true, ...result });
  };

  const isTaskOverdue = (task: Task): boolean => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const handleOverdueIconPress = (task: Task) => {
    setOverdueTask(task);
  };

  const handleMarkOverdueAsCompleted = () => {
    if (overdueTask) {
      const updatedTasks = tasks.map(task =>
        task.id === overdueTask.id ? { ...task, completed: true } : task
      );
      setTasks(updatedTasks);
      playTaskComplete();
      setOverdueTask(null);
    }
  };

  const handleExtendDueDate = () => {
    if (overdueTask) {
      // Open edit modal for this task
      setEditingTask(overdueTask);
      setEditText(overdueTask.title || overdueTask.text);
      setEditDescription(overdueTask.description || '');
      setTypedTaskDueDate(overdueTask.dueDate);
      setIsEditingTitle(true);
      setIsKeyboardVisibleInEdit(true);
      setShowCalendar(true);
      setOverdueTask(null);
    }
  };

  const handleIconSelect = (iconName: string) => {
    if (iconPickerTask) {
      const currentIcons = iconPickerTask.icons || [];
      
      // If icon is already selected, remove it
      if (currentIcons.includes(iconName)) {
        const updatedTasks = tasks.map(task =>
          task.id === iconPickerTask.id 
            ? { ...task, icons: currentIcons.filter(icon => icon !== iconName) } 
            : task
        );
        setTasks(updatedTasks);
        // Update iconPickerTask state
        setIconPickerTask({
          ...iconPickerTask,
          icons: currentIcons.filter(icon => icon !== iconName)
        });
      } 
      // If less than 3 icons, add the new one
      else if (currentIcons.length < 3) {
        const updatedTasks = tasks.map(task =>
          task.id === iconPickerTask.id 
            ? { ...task, icons: [...currentIcons, iconName] } 
            : task
        );
        setTasks(updatedTasks);
        // Update iconPickerTask state
        setIconPickerTask({
          ...iconPickerTask,
          icons: [...currentIcons, iconName]
        });
      }
      // If already has 3 icons, don't add more (could show a message, but for now just ignore)
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedTaskIds(new Set());
  };

  const selectAllTasks = () => {
    if (selectedTaskIds.size === tasks.length) {
      // Deselect all
      setSelectedTaskIds(new Set());
    } else {
      // Select all
      setSelectedTaskIds(new Set(tasks.map(t => t.id)));
    }
  };

  const markSelectedAsDone = async () => {
    // Check if all selected tasks are already completed
    const selectedTasks = tasks.filter(t => selectedTaskIds.has(t.id));
    const allCompleted = selectedTasks.length > 0 && selectedTasks.every(t => t.completed);
    
    // Toggle completion: if all are done, mark as undone; otherwise mark as done
    const newTasks = tasks.map(task => 
      selectedTaskIds.has(task.id) ? { ...task, completed: !allCompleted } : task
    );
    setTasks(newTasks);
    
    // Play sound only when marking tasks as done (not when undoing)
    if (!allCompleted) {
      const newlyCompleted = tasks.filter(t => selectedTaskIds.has(t.id) && !t.completed);
      if (newlyCompleted.length > 0) {
      playTaskComplete();
        
        // Award coins for completing tasks
        const currentCoins = await loadCoins();
        let coinsToAdd = 0;
        
        if (newlyCompleted.length === 3) {
          // Complete 3 tasks = +5 coins
          coinsToAdd = 5;
        } else {
          // Complete 1 task = +1 coin per task
          coinsToAdd = newlyCompleted.length;
        }
        
        const newCoins = currentCoins + coinsToAdd;
        await saveCoins(newCoins);
        
        // Show coin earned popup
        showCoinEarnedPopup(coinsToAdd);
      }
    }
    setSelectedTaskIds(new Set());
    setIsSelectionMode(false);
  };

  const deleteSelectedTasks = () => {
    setDeleteAlertVisible(true);
  };

  const confirmDeleteTasks = () => {
    setTasks(tasks.filter(task => !selectedTaskIds.has(task.id)));
    setSelectedTaskIds(new Set());
    setIsSelectionMode(false);
    setDeleteAlertVisible(false);
  };

  const cancelDeleteTasks = () => {
    setDeleteAlertVisible(false);
  };

  const addTasks = (newTasks: Task[]) => {
    setTasks([...newTasks, ...tasks]);
  };

  const handleNewTaskPress = () => {
    // Go directly to typing mode
    setIsTypingMode(true);
    setTypedTaskText('');
    setTypedTaskDescription('');
    setTypedTaskDueDate(undefined);
    setCursorPosition(0);
    setIsEditingTitle(true);
    setIsKeyboardVisibleInTyping(true);
  };

  const handleSaveTypedTask = () => {
    if (typedTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: typedTaskText.trim().toUpperCase(), // Keep for backward compatibility
        title: typedTaskText.trim().toUpperCase(),
        description: typedTaskDescription.trim() || undefined,
        completed: false,
        dueDate: typedTaskDueDate,
        createdAt: new Date(),
      };
      setTasks([newTask, ...tasks]);
      setIsTypingMode(false);
      setTypedTaskText('');
      setTypedTaskDescription('');
      setTypedTaskDueDate(undefined);
      setIsEditingTitle(true);
    }
  };

  const handleCancelTyping = () => {
    setIsTypingMode(false);
    setTypedTaskText('');
    setTypedTaskDescription('');
    setIsEditingTitle(true);
    setIsKeyboardVisibleInTyping(true);
  };

  const hideKeyboardInTyping = () => {
    setIsKeyboardVisibleInTyping(false);
  };

  const startEditTask = (task: Task) => {
    setEditingTask(task);
    // Use title if available, otherwise fall back to text for backward compatibility
    const title = task.title || task.text;
    setEditText(title);
    setEditDescription(task.description || '');
    setTypedTaskDueDate(task.dueDate);
    setIsEditingTitle(true);
    setIsKeyboardVisibleInEdit(true);
  };

  const saveEditTask = () => {
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? { 
          ...task, 
          text: editText.toUpperCase(), // Keep for backward compatibility
          title: editText.toUpperCase(),
          description: editDescription.trim() || undefined,
          dueDate: typedTaskDueDate 
        } : task
      ));
      setEditingTask(null);
      setEditText('');
      setEditDescription('');
      setTypedTaskDueDate(undefined);
      setIsEditingTitle(true);
    }
  };

  const cancelEditTask = () => {
    setEditingTask(null);
    setEditText('');
    setEditDescription('');
    setTypedTaskDueDate(undefined);
    setIsEditingTitle(true);
    setIsKeyboardVisibleInEdit(true);
  };

  const hideKeyboardInEdit = () => {
    setIsKeyboardVisibleInEdit(false);
  };


  // Expose addTasks globally for navigation
  useEffect(() => {
    (global as any).addTasksToList = addTasks;
    return () => {
      delete (global as any).addTasksToList;
    };
  }, [tasks]);

  const renderTask = ({ item }: { item: Task }) => {
    const isSelected = selectedTaskIds.has(item.id);
    // Use title if available, otherwise fall back to text for backward compatibility
    const displayTitle = item.title || item.text;
    return (
    <TouchableOpacity 
        style={[
          styles.taskRow,
          isSelectionMode && isSelected && styles.taskRowSelected
        ]} 
      onPress={() => toggleTask(item.id)}
        onLongPress={() => {
          if (!isSelectionMode) {
            handleTaskLongPress(item);
          } else {
            startEditTask(item);
          }
        }}
      activeOpacity={0.7}
    >
        <View style={[
          styles.checkbox,
          isSelectionMode && styles.checkboxSelection
        ]}>
          {isSelectionMode ? (
            isSelected && <View style={styles.checkboxFilled} />
          ) : (
            item.completed && <View style={styles.checkboxFilled} />
          )}
      </View>
      {item.icons && item.icons.length > 0 && (
        <View style={styles.taskIconsContainer}>
          {item.icons.map((iconName, index) => (
            <TouchableOpacity 
              key={index}
              onPress={(e) => {
                e.stopPropagation();
                handleIconAutomation(item, iconName);
              }}
              activeOpacity={0.7}
            >
              <Image 
                source={iconMap[iconName]} 
                style={styles.taskIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.taskContent}>
        <Text style={[
          styles.taskText,
          item.completed && styles.taskTextCompleted
          ]} numberOfLines={1} ellipsizeMode="tail">
            {displayTitle}
        </Text>
        {item.dueDate && (
          <View style={styles.taskDateContainer}>
            <Text style={styles.taskDate}>{formatDate(item.dueDate)}</Text>
            {isTaskOverdue(item) && (
              <TouchableOpacity
                onPress={() => handleOverdueIconPress(item)}
                style={styles.overdueIcon}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Text style={styles.overdueIconText}>!</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {!isSelectionMode && (
        <TouchableOpacity
          onPress={() => handleIconButtonPress(item)}
          onPressIn={(e) => e.stopPropagation()}
          style={styles.addIconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.addIconText, { color: theme.headerText }]}>+</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
  };

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
            {!isSelectionMode && (
              <View style={styles.headerCenter}>
                <TouchableOpacity
                  onPress={() => setShowCompletedTasks(true)}
                  style={styles.headerButton}
                >
                  <Text style={[styles.headerButtonText, { color: theme.headerText }]}>COMPLETED</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              onPress={toggleSelectionMode}
              style={styles.headerButton}
            >
              <Text style={[styles.headerButtonText, { color: theme.headerText }]}>
                {isSelectionMode ? 'CANCEL' : 'SELECT'}
              </Text>
            </TouchableOpacity>
          </View>

      <FlatList
        data={tasks.filter(task => !task.completed)}
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

          {isSelectionMode ? (
            <View style={[styles.footer, { borderTopColor: theme.headerBorder }]}>
              <TouchableOpacity 
                onPress={selectAllTasks}
                style={[styles.actionButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
              >
                <Text style={[styles.actionButtonText, { color: theme.modalText }]}>
                  {selectedTaskIds.size === tasks.length && tasks.length > 0 ? 'DESELECT ALL' : 'SELECT ALL'}
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonSpacer} />
              <TouchableOpacity 
                onPress={markSelectedAsDone}
                disabled={selectedTaskIds.size === 0}
                style={[
                  styles.actionButton, 
                  { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder },
                  selectedTaskIds.size === 0 && styles.actionButtonDisabled
                ]}
              >
                <Text style={[
                  styles.actionButtonText, 
                  { color: theme.modalText },
                  selectedTaskIds.size === 0 && { opacity: 0.5 }
                ]}>
                  {(() => {
                    const selectedTasks = tasks.filter(t => selectedTaskIds.has(t.id));
                    const allCompleted = selectedTasks.length > 0 && selectedTasks.every(t => t.completed);
                    return allCompleted ? 'MARK UNDONE' : 'MARK DONE';
                  })()}
                </Text>
              </TouchableOpacity>
        <View style={styles.buttonSpacer} />
              <TouchableOpacity 
                onPress={deleteSelectedTasks}
                disabled={selectedTaskIds.size === 0}
                style={[
                  styles.actionButton, 
                  { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder },
                  selectedTaskIds.size === 0 && styles.actionButtonDisabled
                ]}
              >
                <Text style={[
                  styles.actionButtonText, 
                  { color: theme.modalText },
                  selectedTaskIds.size === 0 && { opacity: 0.5 }
                ]}>DELETE</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.footer, { borderTopColor: theme.headerBorder }]}>
        <PalmButton 
          title="NEW TASK" 
                onPress={handleNewTaskPress}
                theme={theme}
              />
            </View>
          )}

          {/* Edit Task Mode with Keyboard */}
          {editingTask !== null && (
            <View style={styles.typingContainer}>
              <View style={[styles.typingHeader, { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorder }]}>
                <Text style={[styles.typingHeaderText, { color: theme.headerText }]}>EDIT TASK</Text>
                <TouchableOpacity 
                  onPress={cancelEditTask}
                  style={styles.closeTypingButton}
                >
                  <Text style={[styles.closeTypingText, { color: theme.headerText }]}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.editTaskScrollView}
                contentContainerStyle={styles.editTaskScrollContent}
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
                scrollIndicatorInsets={{ right: 2 }}
              >
                {/* Title/Description Toggle */}
                <View style={[styles.fieldToggleContainer, { borderBottomColor: theme.headerBorder }]}>
                  <TouchableOpacity 
                    onPress={() => setIsEditingTitle(true)}
                    style={[
                      styles.fieldToggleButton,
                      { 
                        backgroundColor: isEditingTitle ? theme.headerBackground : theme.modalBackground,
                        borderColor: theme.modalBorder 
                      }
                    ]}
                  >
                    <Text style={[styles.fieldToggleText, { color: theme.modalText }]}>TITLE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setIsEditingTitle(false)}
                    style={[
                      styles.fieldToggleButton,
                      { 
                        backgroundColor: !isEditingTitle ? theme.headerBackground : theme.modalBackground,
                        borderColor: theme.modalBorder 
                      }
                    ]}
                  >
                    <Text style={[styles.fieldToggleText, { color: theme.modalText }]}>DESCRIPTION</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsKeyboardVisibleInEdit(true)}
                  style={[styles.typingArea, { backgroundColor: theme.graffitiBackground, borderColor: theme.graffitiBorder }]}
                >
                  <View style={styles.typingAreaContent}>
                    <Text style={[styles.typedText, { color: theme.graffitiCursor }]}>
                      {isEditingTitle ? (editText || ' ') : (editDescription || ' ')}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Due Date Selection */}
                <View style={[styles.datePickerContainer, { borderTopColor: theme.headerBorder }]}>
                  <TouchableOpacity 
                    onPress={() => setShowDatePicker(!showDatePicker)}
                    style={[styles.datePickerButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
                  >
                    <Text style={[styles.datePickerText, { color: theme.modalText }]}>
                      {typedTaskDueDate ? `DUE: ${formatDate(typedTaskDueDate)}` : 'SET DUE DATE'}
                    </Text>
                  </TouchableOpacity>
                  {typedTaskDueDate && (
                    <>
                      <View style={{ width: 8 }} />
                      <TouchableOpacity 
                        onPress={() => setTypedTaskDueDate(undefined)}
                        style={[styles.clearDateButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
                      >
                        <Text style={[styles.datePickerText, { color: theme.modalText }]}>CLEAR</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                {showDatePicker && (
                  <View style={[styles.dateOptionsContainer, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}>
                    <Text style={[styles.dateOptionsTitle, { color: theme.modalText }]}>QUICK SELECT</Text>
                    <View style={styles.dateOptionsGrid}>
                      {[
                        { label: 'TODAY', days: 0 },
                        { label: 'TOMORROW', days: 1 },
                        { label: 'IN 3 DAYS', days: 3 },
                        { label: 'NEXT WEEK', days: 7 },
                      ].map((option) => {
                        const date = new Date();
                        date.setDate(date.getDate() + option.days);
                        date.setHours(9, 0, 0, 0);
                        return (
                          <TouchableOpacity
                            key={option.label}
                            onPress={() => {
                              setTypedTaskDueDate(date);
                              setShowDatePicker(false);
                            }}
                            style={[styles.dateOptionButton, { borderColor: theme.modalBorder }]}
                          >
                            <Text style={[styles.dateOptionText, { color: theme.modalText }]}>{option.label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setShowDatePicker(false);
                        setShowCalendar(true);
                      }}
                      style={[styles.calendarButton, { backgroundColor: theme.headerBackground, borderColor: theme.headerBorder }]}
                    >
                      <Text style={[styles.calendarButtonText, { color: theme.headerText }]}>CALENDAR</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Done Button */}
                <View style={[styles.doneButtonContainer, { borderTopColor: theme.headerBorder }]}>
                  <TouchableOpacity 
                    onPress={saveEditTask}
                    style={[styles.doneButton, { backgroundColor: theme.headerBackground, borderColor: theme.headerBorder }]}
                  >
                    <Text style={[styles.doneButtonText, { color: theme.headerText }]}>DONE</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* Calendar Modal */}
              <PixelCalendar
                visible={showCalendar}
                selectedDate={typedTaskDueDate}
                onDateSelect={(date) => {
                  setTypedTaskDueDate(date);
                  setShowCalendar(false);
                }}
                onClose={() => setShowCalendar(false)}
                theme={theme}
                maxMonthsAhead={12}
              />

              <PixelKeyboard
                visible={editingTask !== null && isKeyboardVisibleInEdit}
                theme={theme}
                onKeyPress={(key) => {
                  if (isEditingTitle) {
                    setEditText((prev) => prev + key);
                  } else {
                    setEditDescription((prev) => prev + key);
                  }
                }}
                onBackspace={() => {
                  if (isEditingTitle) {
                    setEditText((prev) => prev.slice(0, -1));
                  } else {
                    setEditDescription((prev) => prev.slice(0, -1));
                  }
                }}
                onEnter={() => {
                  if (isEditingTitle && editText.trim()) {
                    setIsEditingTitle(false);
                  } else {
                    saveEditTask();
                  }
                }}
                onSpace={() => {
                  if (isEditingTitle) {
                    setEditText((prev) => prev + ' ');
                  } else {
                    setEditDescription((prev) => prev + ' ');
                  }
                }}
                onClose={hideKeyboardInEdit}
              />
            </View>
          )}

          {/* Icon Picker Modal */}
          <Modal
            visible={showIconPicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              setShowIconPicker(false);
              setIconPickerTask(null);
            }}
          >
            <View style={styles.iconPickerOverlay}>
              <View style={[styles.iconPickerModal, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}>
                <View style={[styles.iconPickerHeader, { backgroundColor: theme.modalHeaderBackground, borderBottomColor: theme.modalHeaderBorder }]}>
                  <Text style={[styles.iconPickerTitle, { color: theme.modalText }]}>SELECT APP</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowIconPicker(false);
                      setIconPickerTask(null);
                    }}
                    style={styles.iconPickerCloseButton}
                  >
                    <Text style={[styles.iconPickerCloseText, { color: theme.modalText }]}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView 
                  style={styles.iconPickerScroll}
                  contentContainerStyle={styles.iconPickerGrid}
                  showsVerticalScrollIndicator={true}
                >
                  {iconNames.length > 0 ? (
                    iconNames.map((iconName) => {
                      const isSelected = iconPickerTask?.icons?.includes(iconName) || false;
                      const canSelect = !iconPickerTask?.icons || (iconPickerTask.icons.length < 3);
                      const isDisabled = !isSelected && !canSelect;
                      
                      return (
                        <TouchableOpacity
                          key={iconName}
                          onPress={() => handleIconSelect(iconName)}
                          style={[
                            styles.iconPickerItem, 
                            { borderColor: theme.modalBorder },
                            isSelected && styles.iconPickerItemSelected,
                            isDisabled && styles.iconPickerItemDisabled
                          ]}
                          activeOpacity={0.7}
                          disabled={isDisabled}
                        >
                          <Image
                            source={iconMap[iconName]}
                            style={[
                              styles.iconPickerImage,
                              isDisabled && styles.iconPickerImageDisabled
                            ]}
                            resizeMode="contain"
                          />
                          <Text style={[
                            styles.iconPickerLabel, 
                            { color: theme.modalText },
                            isDisabled && styles.iconPickerLabelDisabled
                          ]}>
                            {iconName.toUpperCase()}
                          </Text>
                          {isSelected && (
                            <View style={styles.iconPickerCheckmark}>
                              <Text style={styles.iconPickerCheckmarkText}>✓</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <Text style={[styles.iconPickerLabel, { color: theme.modalText }]}>
                      NO APPS AVAILABLE
                    </Text>
                  )}
                </ScrollView>
                {iconPickerTask && (
                  <View style={[styles.iconPickerFooter, { borderTopColor: theme.modalBorder }]}>
                    <Text style={[styles.iconPickerFooterText, { color: theme.modalText }]}>
                      {iconPickerTask.icons?.length || 0}/3 APPS SELECTED
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowIconPicker(false);
                        setIconPickerTask(null);
                      }}
                      style={[styles.iconPickerDoneButton, { backgroundColor: theme.modalBorder, borderColor: theme.modalBorder }]}
                    >
                      <Text style={[styles.iconPickerDoneText, { color: '#FFFFFF' }]}>
                        DONE
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>

          {/* Overdue Task Alert */}
          <PixelAlert
            visible={overdueTask !== null}
            title="OVERDUE"
            message={overdueTask ? `OVERDUE. MARK AS COMPLETED? OR EXTEND DUE DATE?` : ''}
            buttons={[
              {
                text: 'MARK COMPLETED',
                onPress: handleMarkOverdueAsCompleted,
              },
              {
                text: 'EXTEND DATE',
                onPress: handleExtendDueDate,
              },
              {
                text: 'CANCEL',
                onPress: () => setOverdueTask(null),
                style: 'cancel',
              },
            ]}
            theme={theme}
          />

          {/* Click Action Menu */}
          <PixelAlert
            visible={clickedTask !== null}
            title="TASK ACTION"
            message={clickedTask ? (clickedTask.title || clickedTask.text).toUpperCase() : ''}
            buttons={[
              {
                text: clickedTask?.completed ? 'MARK UNDONE' : 'MARK AS DONE',
                onPress: handleMarkTaskAsDone,
              },
              {
                text: 'EDIT',
                onPress: handleEditFromClick,
              },
              {
                text: 'CANCEL',
                onPress: () => setClickedTask(null),
                style: 'cancel',
              },
            ]}
            theme={theme}
          />

          {/* Automation Result Alert */}
          <PixelAlert
            visible={automationResult.visible}
            title={automationResult.success ? 'SUCCESS' : 'ERROR'}
            message={automationResult.message}
            buttons={[
              {
                text: 'OK',
                onPress: () => setAutomationResult({ visible: false, success: false, message: '' }),
              },
            ]}
            theme={theme}
          />

          {/* Completed Tasks View */}
          {showCompletedTasks && (
            <View style={[styles.completedTasksContainer, { backgroundColor: theme.screenBackground }]}>
              <View style={[styles.completedTasksHeader, { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorder }]}>
                <Text style={[styles.completedTasksHeaderText, { color: theme.headerText }]}>COMPLETED TASKS</Text>
                <View style={styles.completedTasksHeaderRight}>
                  {tasks.filter(task => task.completed).length > 0 && (
                    <TouchableOpacity
                      onPress={handleClearAllCompleted}
                      style={styles.clearAllButton}
                    >
                      <Text style={styles.clearAllButtonText}>CLEAR ALL</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => setShowCompletedTasks(false)}
                    style={styles.closeCompletedButton}
                  >
                    <Text style={[styles.closeCompletedText, { color: theme.headerText }]}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <FlatList
                data={tasks.filter(task => task.completed)}
                renderItem={renderTask}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: theme.iconText }]}>NO COMPLETED TASKS</Text>
                  </View>
                }
                style={styles.completedTasksList}
              />
            </View>
          )}

          {/* Long Press Menu */}
          <PixelAlert
            visible={longPressMenuTask !== null}
            title="TASK OPTIONS"
            message={longPressMenuTask ? (longPressMenuTask.title || longPressMenuTask.text).toUpperCase() : ''}
            buttons={[
              {
                text: 'EDIT',
                onPress: handleEditFromMenu,
              },
              {
                text: 'DELETE',
                onPress: handleDeleteFromMenu,
                style: 'destructive',
              },
              {
                text: 'CANCEL',
                onPress: () => setLongPressMenuTask(null),
                style: 'cancel',
              },
            ]}
            theme={theme}
          />

          {/* Task Description Viewer */}
          {viewingTaskDescription && (
            <View style={styles.typingContainer}>
              <View style={[styles.typingHeader, { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorder }]}>
                <Text style={[styles.typingHeaderText, { color: theme.headerText }]} numberOfLines={1} ellipsizeMode="tail">
                  {(viewingTaskDescription.title || viewingTaskDescription.text).toUpperCase()}
                </Text>
                <TouchableOpacity 
                  onPress={() => setViewingTaskDescription(null)}
                  style={styles.closeTypingButton}
                >
                  <Text style={[styles.closeTypingText, { color: theme.headerText }]}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={[styles.descriptionViewer, { backgroundColor: theme.graffitiBackground, borderColor: theme.graffitiBorder }]}
                contentContainerStyle={styles.descriptionViewerContent}
                showsVerticalScrollIndicator={true}
              >
                <Text style={[styles.descriptionText, { color: theme.graffitiCursor }]}>
                  {viewingTaskDescription.description || 'NO DESCRIPTION'}
                </Text>
                {viewingTaskDescription.dueDate && (
                  <Text style={[styles.descriptionDate, { color: theme.modalText }]}>
                    DUE: {formatDate(viewingTaskDescription.dueDate)}
                  </Text>
                )}
              </ScrollView>

              <View style={[styles.descriptionFooter, { borderTopColor: theme.headerBorder }]}>
                <TouchableOpacity 
                  onPress={() => {
                    const taskToEdit = viewingTaskDescription;
                    setViewingTaskDescription(null);
                    startEditTask(taskToEdit);
                  }}
                  style={[styles.descriptionButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
                >
                  <Text style={[styles.descriptionButtonText, { color: theme.modalText }]}>EDIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Delete Confirmation Alert */}
          <PixelAlert
            visible={deleteAlertVisible}
            title="DELETE TASKS"
            message={`DELETE ${selectedTaskIds.size} TASK${selectedTaskIds.size > 1 ? 'S' : ''}?`}
            buttons={[
              {
                text: 'CANCEL',
                style: 'cancel',
                onPress: cancelDeleteTasks,
              },
              {
                text: 'DELETE',
                style: 'destructive',
                onPress: confirmDeleteTasks,
              },
            ]}
            theme={theme}
          />


          {/* Typing Mode with Keyboard */}
          {isTypingMode && (
            <View style={styles.typingContainer}>
              <View style={[styles.typingHeader, { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorder }]}>
                <Text style={[styles.typingHeaderText, { color: theme.headerText }]}>TYPE TASK</Text>
                <TouchableOpacity 
                  onPress={handleCancelTyping}
                  style={styles.closeTypingButton}
                >
                  <Text style={[styles.closeTypingText, { color: theme.headerText }]}>✕</Text>
                </TouchableOpacity>
      </View>

              <ScrollView 
                style={styles.editTaskScrollView}
                contentContainerStyle={styles.editTaskScrollContent}
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
                scrollIndicatorInsets={{ right: 2 }}
              >
                {/* Title/Description Toggle */}
                <View style={[styles.fieldToggleContainer, { borderBottomColor: theme.headerBorder }]}>
                  <TouchableOpacity 
                    onPress={() => {
                      setIsEditingTitle(true);
                      setCursorPosition(typedTaskText.length);
                    }}
                    style={[
                      styles.fieldToggleButton,
                      { 
                        backgroundColor: isEditingTitle ? theme.headerBackground : theme.modalBackground,
                        borderColor: theme.modalBorder 
                      }
                    ]}
                  >
                    <Text style={[styles.fieldToggleText, { color: theme.modalText }]}>TITLE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      setIsEditingTitle(false);
                      setCursorPosition(typedTaskDescription.length);
                    }}
                    style={[
                      styles.fieldToggleButton,
                      { 
                        backgroundColor: !isEditingTitle ? theme.headerBackground : theme.modalBackground,
                        borderColor: theme.modalBorder 
                      }
                    ]}
                  >
                    <Text style={[styles.fieldToggleText, { color: theme.modalText }]}>DESCRIPTION</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsKeyboardVisibleInTyping(true);
                    // Set cursor to end when tapping the area
                    const currentText = isEditingTitle ? typedTaskText : typedTaskDescription;
                    setCursorPosition(currentText.length);
                  }}
                  style={[styles.typingArea, { backgroundColor: theme.graffitiBackground, borderColor: theme.graffitiBorder }]}
                >
                  <View style={styles.typingAreaContent}>
                    <Text style={[styles.typedText, { color: theme.graffitiCursor }]}>
                      {(() => {
                        const currentText = isEditingTitle ? typedTaskText : typedTaskDescription;
                        const beforeCursor = currentText.slice(0, cursorPosition);
                        const afterCursor = currentText.slice(cursorPosition);
                        const cursor = cursorVisible ? '|' : ' ';
                        return beforeCursor + cursor + afterCursor || cursor;
                      })()}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Due Date Selection */}
                <View style={[styles.datePickerContainer, { borderTopColor: theme.headerBorder }]}>
                  <TouchableOpacity 
                    onPress={() => setShowDatePicker(!showDatePicker)}
                    style={[styles.datePickerButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
                  >
                    <Text style={[styles.datePickerText, { color: theme.modalText }]}>
                      {typedTaskDueDate ? `DUE: ${formatDate(typedTaskDueDate)}` : 'SET DUE DATE'}
                    </Text>
                  </TouchableOpacity>
                  {typedTaskDueDate && (
                    <>
                      <View style={{ width: 8 }} />
                      <TouchableOpacity 
                        onPress={() => setTypedTaskDueDate(undefined)}
                        style={[styles.clearDateButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
                      >
                        <Text style={[styles.datePickerText, { color: theme.modalText }]}>CLEAR</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                {showDatePicker && (
                  <View style={[styles.dateOptionsContainer, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}>
                    <Text style={[styles.dateOptionsTitle, { color: theme.modalText }]}>QUICK SELECT</Text>
                    <View style={styles.dateOptionsGrid}>
                      {[
                        { label: 'TODAY', days: 0 },
                        { label: 'TOMORROW', days: 1 },
                        { label: 'IN 3 DAYS', days: 3 },
                        { label: 'NEXT WEEK', days: 7 },
                      ].map((option) => {
                        const date = new Date();
                        date.setDate(date.getDate() + option.days);
                        date.setHours(9, 0, 0, 0);
                        return (
                          <TouchableOpacity
                            key={option.label}
                            onPress={() => {
                              setTypedTaskDueDate(date);
                              setShowDatePicker(false);
                            }}
                            style={[styles.dateOptionButton, { borderColor: theme.modalBorder }]}
                          >
                            <Text style={[styles.dateOptionText, { color: theme.modalText }]}>{option.label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setShowDatePicker(false);
                        setShowCalendar(true);
                      }}
                      style={[styles.calendarButton, { backgroundColor: theme.headerBackground, borderColor: theme.headerBorder }]}
                    >
                      <Text style={[styles.calendarButtonText, { color: theme.headerText }]}>CALENDAR</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Done Button */}
                <View style={[styles.doneButtonContainer, { borderTopColor: theme.headerBorder }]}>
                  <TouchableOpacity 
                    onPress={handleSaveTypedTask}
                    style={[styles.doneButton, { backgroundColor: theme.headerBackground, borderColor: theme.headerBorder }]}
                  >
                    <Text style={[styles.doneButtonText, { color: theme.headerText }]}>DONE</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* Calendar Modal */}
              <PixelCalendar
                visible={showCalendar}
                selectedDate={typedTaskDueDate}
                onDateSelect={(date) => {
                  setTypedTaskDueDate(date);
                  setShowCalendar(false);
                }}
                onClose={() => setShowCalendar(false)}
                theme={theme}
                maxMonthsAhead={12}
              />

              <PixelKeyboard
                visible={isTypingMode && isKeyboardVisibleInTyping}
                theme={theme}
                onKeyPress={(key) => {
                  if (isEditingTitle) {
                    setTypedTaskText((prev) => {
                      const newText = prev.slice(0, cursorPosition) + key + prev.slice(cursorPosition);
                      setCursorPosition(cursorPosition + 1);
                      return newText;
                    });
                  } else {
                    setTypedTaskDescription((prev) => {
                      const newText = prev.slice(0, cursorPosition) + key + prev.slice(cursorPosition);
                      setCursorPosition(cursorPosition + 1);
                      return newText;
                    });
                  }
                }}
                onBackspace={() => {
                  if (cursorPosition > 0) {
                    if (isEditingTitle) {
                      setTypedTaskText((prev) => prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition));
                    } else {
                      setTypedTaskDescription((prev) => prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition));
                    }
                    setCursorPosition(cursorPosition - 1);
                  }
                }}
                onEnter={() => {
                  if (isEditingTitle && typedTaskText.trim()) {
                    setIsEditingTitle(false);
                    setCursorPosition(typedTaskDescription.length);
                  } else {
                    handleSaveTypedTask();
                  }
                }}
                onSpace={() => {
                  if (isEditingTitle) {
                    setTypedTaskText((prev) => {
                      const newText = prev.slice(0, cursorPosition) + ' ' + prev.slice(cursorPosition);
                      setCursorPosition(cursorPosition + 1);
                      return newText;
                    });
                  } else {
                    setTypedTaskDescription((prev) => {
                      const newText = prev.slice(0, cursorPosition) + ' ' + prev.slice(cursorPosition);
                      setCursorPosition(cursorPosition + 1);
                      return newText;
                    });
                  }
                }}
                onClose={hideKeyboardInTyping}
              />
            </View>
          )}
        </View>

        {/* Coin Earned Popup */}
        {showCoinPopup && (
          <Animated.View
            style={[
              styles.coinPopupContainer,
              {
                opacity: coinPopupOpacity,
                transform: [
                  { scale: coinPopupScale },
                  { translateY: coinPopupTranslateY },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <View style={styles.coinPopup}>
              <Image
                source={require('../../assets/rewards/coins.png')}
                style={styles.coinPopupIcon}
                resizeMode="contain"
              />
              <Text style={styles.coinPopupText}>
                +{coinPopupAmount} COIN{coinPopupAmount > 1 ? 'S' : ''}!
              </Text>
            </View>
          </Animated.View>
        )}

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    position: 'relative',
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#000000',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#000000',
  },
  completedTasksContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1500,
  },
  completedTasksHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  completedTasksHeaderText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
  },
  completedTasksHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#8B0000',
    borderWidth: 2,
    borderColor: '#FF0000',
    borderRadius: 4,
  },
  clearAllButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#FFFFFF',
  },
  closeCompletedButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeCompletedText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
  },
  completedTasksList: {
    flex: 1,
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
  taskRowSelected: {
    backgroundColor: 'rgba(139, 173, 74, 0.2)',
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
  checkboxSelection: {
    borderWidth: 2,
  },
  checkboxFilled: {
    width: 12,
    height: 12,
    backgroundColor: '#000000',
  },
  taskIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    gap: 4,
  },
  taskIcon: {
    width: 24,
    height: 24,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addIconButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addIconText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
  },
  taskText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#000000',
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
  },
  taskDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 4,
  },
  taskDate: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#666666',
  },
  overdueIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
  },
  overdueIconText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 12,
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
  iconPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPickerModal: {
    width: '80%',
    maxWidth: 400,
    height: '70%',
    maxHeight: 500,
    borderRadius: 8,
    borderWidth: 3,
    overflow: 'hidden',
  },
  iconPickerHeader: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  iconPickerTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  iconPickerCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPickerCloseText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
  },
  iconPickerScroll: {
    flex: 1,
    minHeight: 200,
  },
  iconPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'flex-start',
    minHeight: 200,
  },
  iconPickerItem: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 80,
    minHeight: 80,
  },
  iconPickerImage: {
    width: 50,
    height: 50,
    marginBottom: 4,
  },
  iconPickerLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    textAlign: 'center',
  },
  iconPickerItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 3,
  },
  iconPickerItemDisabled: {
    opacity: 0.4,
  },
  iconPickerImageDisabled: {
    opacity: 0.5,
  },
  iconPickerLabelDisabled: {
    opacity: 0.5,
  },
  iconPickerCheckmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  iconPickerCheckmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconPickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#000000',
  },
  iconPickerFooterText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  iconPickerDoneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#000000',
  },
  iconPickerDoneText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  iconPickerItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 3,
  },
  iconPickerItemDisabled: {
    opacity: 0.4,
  },
  iconPickerImageDisabled: {
    opacity: 0.5,
  },
  iconPickerLabelDisabled: {
    opacity: 0.5,
  },
  iconPickerCheckmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  iconPickerCheckmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconPickerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#000000',
  },
  iconPickerFooterText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  iconPickerDoneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#000000',
  },
  iconPickerDoneText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
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
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#000000',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  typingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
  },
  typingHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  typingHeaderText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
  },
  closeTypingButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeTypingText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editTaskScrollView: {
    flex: 1,
  },
  editTaskScrollContent: {
    paddingBottom: 16,
  },
  typingArea: {
    minHeight: 120,
    borderWidth: 2,
    margin: 16,
    marginBottom: 8,
  },
  typingAreaContent: {
    padding: 16,
    minHeight: 120,
  },
  typedText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    lineHeight: 14,
    flexWrap: 'wrap',
  },
  datePickerContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 2,
    justifyContent: 'space-between',
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearDateButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  datePickerText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  dateOptionsContainer: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderWidth: 2,
    borderRadius: 4,
    maxHeight: 180,
  },
  dateOptionsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 12,
  },
  calendarButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  dateOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  doneButtonContainer: {
    padding: 12,
    borderTopWidth: 2,
  },
  doneButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
  },
  dateOptionButton: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dateOptionText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    textAlign: 'center',
  },
  fieldToggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 2,
  },
  fieldToggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  fieldToggleText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  descriptionViewer: {
    flex: 1,
    borderWidth: 2,
    margin: 16,
    marginBottom: 8,
  },
  descriptionViewerContent: {
    padding: 16,
  },
  descriptionText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    lineHeight: 14,
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  descriptionDate: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    marginTop: 8,
  },
  descriptionFooter: {
    padding: 12,
    borderTopWidth: 2,
  },
  descriptionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  coinPopupContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  coinPopup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.95)',
    borderWidth: 4,
    borderColor: '#DAA520',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  coinPopupIcon: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  coinPopupText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#5C4033',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
