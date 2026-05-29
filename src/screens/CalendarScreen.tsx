import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { completionRepository } from '../db/repositories/completionRepository';
import { habitRepository } from '../db/repositories/habitRepository';
import { taskRepository } from '../db/repositories/taskRepository';
import { useCalendarStore } from '../stores/useCalendarStore';
import { Card } from '../components/ui/Card';
import { Habit, Completion } from '../types/habit';
import { Task } from '../types/task';
import { colors, spacing, radius, typography } from '../theme';
import { today, monthStart, monthEnd } from '../utils/dates';

export function CalendarScreen() {
  const { selectedDate, setSelectedDate, visibleMonth, setVisibleMonth } = useCalendarStore();
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [dayCompletions, setDayCompletions] = useState<Array<{ habit: Habit; completion: Completion }>>([]);
  const [dayTasks, setDayTasks] = useState<Task[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadMonth(visibleMonth);
    }, [visibleMonth])
  );

  useEffect(() => {
    loadDayDetail(selectedDate);
  }, [selectedDate]);

  async function loadMonth(month: string) {
    const start = monthStart(month + '-01');
    const end = monthEnd(month + '-01');
    const completionMap = await completionRepository.getCompletionDatesInRange(start, end);

    const habits = await habitRepository.getAll();
    const colorMap = new Map(habits.map((h) => [h.id, h.color]));

    const marks: Record<string, any> = {};
    for (const [date, habitIds] of Object.entries(completionMap)) {
      const dots = habitIds.slice(0, 4).map((hid) => ({
        key: hid,
        color: colorMap.get(hid) ?? colors.primary,
      }));
      marks[date] = { dots };
    }

    if (selectedDate) {
      marks[selectedDate] = { ...(marks[selectedDate] || {}), selected: true };
    }

    setMarkedDates(marks);
  }

  async function loadDayDetail(date: string) {
    const completions = await completionRepository.getByDate(date);
    const habits = await habitRepository.getAll(true);
    const habitMap = new Map(habits.map((h) => [h.id, h]));

    const dayData = completions
      .map((c) => ({ habit: habitMap.get(c.habitId)!, completion: c }))
      .filter((d) => d.habit);

    setDayCompletions(dayData);
    setDayTasks(await taskRepository.getByDate(date));
  }

  function handleDayPress(day: DateData) {
    setSelectedDate(day.dateString);
    const newMarks = { ...markedDates };
    Object.keys(newMarks).forEach((d) => { newMarks[d] = { ...newMarks[d], selected: false }; });
    newMarks[day.dateString] = { ...(newMarks[day.dateString] || {}), selected: true };
    setMarkedDates(newMarks);
  }

  function handleMonthChange(month: DateData) {
    setVisibleMonth(month.dateString.slice(0, 7));
  }

  return (
    <View style={styles.container}>
      <Calendar
        current={visibleMonth + '-01'}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markingType="multi-dot"
        markedDates={markedDates}
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.background,
          textSectionTitleColor: colors.mutedForeground,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.onPrimary,
          todayTextColor: colors.primary,
          dayTextColor: colors.foreground,
          textDisabledColor: colors.mutedForeground,
          arrowColor: colors.primary,
          monthTextColor: colors.foreground,
          textMonthFontWeight: '600',
          textDayFontSize: 14,
          textMonthFontSize: 16,
        }}
      />

      <View style={styles.dayDetail}>
        <Text style={styles.dayTitle}>
          {selectedDate === today() ? 'Today' : selectedDate}
        </Text>

        {dayCompletions.length === 0 && dayTasks.length === 0 ? (
          <Text style={styles.emptyText}>No activity on this day</Text>
        ) : (
          <FlatList
            data={[
              ...dayCompletions.map((d) => ({ type: 'completion' as const, ...d })),
              ...dayTasks.map((t) => ({ type: 'task' as const, task: t })),
            ]}
            keyExtractor={(item, idx) => `${item.type}-${idx}`}
            renderItem={({ item }) => {
              if (item.type === 'completion') {
                return (
                  <View style={styles.dayItem}>
                    <View style={[styles.dot, { backgroundColor: item.habit.color }]} />
                    <Text style={styles.dayItemText}>{item.habit.name}</Text>
                    <Ionicons name="checkmark" size={16} color={colors.progressGreen} />
                  </View>
                );
              }
              return (
                <View style={styles.dayItem}>
                  <Ionicons
                    name={item.task.completed ? 'checkbox' : 'square-outline'}
                    size={18}
                    color={item.task.completed ? colors.progressGreen : colors.mutedForeground}
                  />
                  <Text style={[styles.dayItemText, item.task.completed && styles.completedText]}>
                    {item.task.title}
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  dayDetail: {
    flex: 1,
    padding: spacing.lg,
  },
  dayTitle: {
    ...typography.h3,
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dayItemText: {
    ...typography.body,
    color: colors.foreground,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.mutedForeground,
  },
});
