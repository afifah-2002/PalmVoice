import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import React, { useState, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PalmTheme } from '../constants/palmThemes';

interface PixelCalendarProps {
  visible: boolean;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  theme: PalmTheme;
  maxMonthsAhead?: number;
}

export function PixelCalendar({
  visible,
  selectedDate,
  onDateSelect,
  onClose,
  theme,
  maxMonthsAhead = 12,
}: PixelCalendarProps) {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const slideAnim = useRef(new Animated.Value(0)).current;

  if (!fontsLoaded || !visible) {
    return null;
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + maxMonthsAhead);
      if (newDate.getMonth() < maxDate.getMonth() || newDate.getFullYear() < maxDate.getFullYear()) {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    }
    setCurrentMonth(newDate);

    // Animate slide
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: direction === 'next' ? 1 : -1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const canGoNext = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + maxMonthsAhead);
    return currentMonth.getMonth() < maxDate.getMonth() || 
           currentMonth.getFullYear() < maxDate.getFullYear();
  };

  const canGoPrev = () => {
    const today = new Date();
    return currentMonth.getMonth() > today.getMonth() || 
           currentMonth.getFullYear() > today.getFullYear();
  };

  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + maxMonthsAhead);
    maxDate.setHours(23, 59, 59, 999);
    return date >= today && date <= maxDate;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateSelectable(date)) {
      date.setHours(9, 0, 0, 0);
      onDateSelect(date);
    }
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const translateX = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-20, 0, 20],
  });

  return (
    <View style={styles.overlay}>
      <View style={[styles.calendarContainer, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.headerBorder }]}>
          <TouchableOpacity
            onPress={() => navigateMonth('prev')}
            disabled={!canGoPrev()}
            style={[
              styles.navButton,
              { borderColor: theme.modalBorder },
              !canGoPrev() && styles.navButtonDisabled
            ]}
          >
            <Text style={[styles.navButtonText, { color: theme.modalText }, !canGoPrev() && { opacity: 0.3 }]}>◀</Text>
          </TouchableOpacity>
          
          <View style={styles.monthYearContainer}>
            <Text style={[styles.monthYearText, { color: theme.headerText }]}>
              {monthNames[month]} {year}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigateMonth('next')}
            disabled={!canGoNext()}
            style={[
              styles.navButton,
              { borderColor: theme.modalBorder },
              !canGoNext() && styles.navButtonDisabled
            ]}
          >
            <Text style={[styles.navButtonText, { color: theme.modalText }, !canGoNext() && { opacity: 0.3 }]}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Day Names */}
        <View style={styles.dayNamesRow}>
          {dayNames.map((day, index) => (
            <View key={index} style={styles.dayNameCell}>
              <Text style={[styles.dayNameText, { color: theme.modalText }]}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <Animated.View style={[styles.calendarGrid, { transform: [{ translateX }] }]}>
          {Array.from({ length: 42 }, (_, index) => {
            const day = index - startingDayOfWeek + 1;
            const date = new Date(year, month, day);
            const isValidDay = day > 0 && day <= daysInMonth;
            const selectable = isValidDay && isDateSelectable(date);
            const selected = isValidDay && isDateSelected(date);
            const today = isValidDay && isToday(date);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => isValidDay && handleDateSelect(day)}
                disabled={!selectable}
                style={[
                  styles.dateCell,
                  { borderColor: theme.modalBorder },
                  !isValidDay && styles.dateCellEmpty,
                  !selectable && isValidDay && styles.dateCellDisabled,
                  selected && { backgroundColor: theme.headerBackground, borderColor: theme.headerBorder },
                  today && !selected && { borderColor: theme.headerBorder, borderWidth: 2 },
                ]}
              >
                {isValidDay && (
                  <Text
                    style={[
                      styles.dateText,
                      { color: theme.modalText },
                      !selectable && { opacity: 0.3 },
                      selected && { color: theme.headerText },
                      today && !selected && { color: theme.headerText, fontWeight: 'bold' },
                    ]}
                  >
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Footer Buttons */}
        <View style={[styles.footer, { borderTopColor: theme.headerBorder }]}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.footerButton, { backgroundColor: theme.modalBackground, borderColor: theme.modalBorder }]}
          >
            <Text style={[styles.footerButtonText, { color: theme.modalText }]}>CANCEL</Text>
          </TouchableOpacity>
          {selectedDate && (
            <>
              <View style={{ width: 12 }} />
              <TouchableOpacity
                onPress={() => {
                  onDateSelect(selectedDate);
                  onClose();
                }}
                style={[styles.footerButton, { backgroundColor: theme.headerBackground, borderColor: theme.headerBorder }]}
              >
                <Text style={[styles.footerButtonText, { color: theme.headerText }]}>SELECT</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  calendarContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 8,
    borderWidth: 3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  navButton: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
  },
  monthYearContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthYearText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
  dayNamesRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  dayNameCell: {
    width: '14.2857%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNameText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateCell: {
    width: '14.2857%',
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
    marginVertical: 2,
  },
  dateCellEmpty: {
    borderWidth: 0,
  },
  dateCellDisabled: {
    opacity: 0.3,
  },
  dateText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
  },
  footer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 2,
    justifyContent: 'center',
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
  },
});

