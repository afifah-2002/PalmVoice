import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FavoriteButtons } from '../components/FavoriteButtons';
import { PalmButton } from '../components/PalmButton';
import { PixelAlert } from '../components/PixelAlert';
import { PixelCalendar } from '../components/PixelCalendar';
import { PixelKeyboard } from '../components/PixelKeyboard';
import { PALM_THEMES } from '../constants/palmThemes';
import { useTheme } from '../contexts/ThemeContext';
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
  const [editDescription, setEditDescription] = useState('');
  const [isKeyboardVisibleInEdit, setIsKeyboardVisibleInEdit] = useState(true);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [newTaskOptionsVisible, setNewTaskOptionsVisible] = useState(false);
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [typedTaskText, setTypedTaskText] = useState('');
  const [typedTaskDescription, setTypedTaskDescription] = useState('');
  const [isKeyboardVisibleInTyping, setIsKeyboardVisibleInTyping] = useState(true);
  const [typedTaskDueDate, setTypedTaskDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewingTaskDescription, setViewingTaskDescription] = useState<Task | null>(null);
  const [longPressMenuTask, setLongPressMenuTask] = useState<Task | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(true); // true = title, false = description
  
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
      // Normal toggle completion
      const task = tasks.find(t => t.id === id);
      if (task && !task.completed) {
        playTaskComplete();
      }
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
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

  const markSelectedAsDone = () => {
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
    setNewTaskOptionsVisible(true);
  };

  const handleRecordOption = () => {
    setNewTaskOptionsVisible(false);
    router.push('/record');
  };

  const handleTypeOption = () => {
    setNewTaskOptionsVisible(false);
    setIsTypingMode(true);
    setTypedTaskText('');
    setTypedTaskDescription('');
    setTypedTaskDueDate(undefined);
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
        <View style={styles.taskContent}>
          <Text style={[
            styles.taskText,
            item.completed && styles.taskTextCompleted
          ]} numberOfLines={1} ellipsizeMode="tail">
            {displayTitle}
          </Text>
          {item.dueDate && (
            <Text style={styles.taskDate}>{formatDate(item.dueDate)}</Text>
          )}
        </View>
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

          {/* New Task Options Alert */}
          <PixelAlert
            visible={newTaskOptionsVisible}
            title="NEW TASK"
            message="CHOOSE INPUT METHOD"
            buttons={[
              {
                text: 'CANCEL',
                style: 'cancel',
                onPress: () => setNewTaskOptionsVisible(false),
              },
              {
                text: 'RECORD',
                onPress: handleRecordOption,
              },
              {
                text: 'TYPE',
                onPress: handleTypeOption,
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
                  onPress={() => setIsKeyboardVisibleInTyping(true)}
                  style={[styles.typingArea, { backgroundColor: theme.graffitiBackground, borderColor: theme.graffitiBorder }]}
                >
                  <View style={styles.typingAreaContent}>
                    <Text style={[styles.typedText, { color: theme.graffitiCursor }]}>
                      {isEditingTitle ? (typedTaskText || ' ') : (typedTaskDescription || ' ')}
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
                    setTypedTaskText((prev) => prev + key);
                  } else {
                    setTypedTaskDescription((prev) => prev + key);
                  }
                }}
                onBackspace={() => {
                  if (isEditingTitle) {
                    setTypedTaskText((prev) => prev.slice(0, -1));
                  } else {
                    setTypedTaskDescription((prev) => prev.slice(0, -1));
                  }
                }}
                onEnter={() => {
                  if (isEditingTitle && typedTaskText.trim()) {
                    setIsEditingTitle(false);
                  } else {
                    handleSaveTypedTask();
                  }
                }}
                onSpace={() => {
                  if (isEditingTitle) {
                    setTypedTaskText((prev) => prev + ' ');
                  } else {
                    setTypedTaskDescription((prev) => prev + ' ');
                  }
                }}
                onClose={hideKeyboardInTyping}
              />
            </View>
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    position: 'relative',
  },
  headerText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#000000',
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
});
