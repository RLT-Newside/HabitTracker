import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../stores/useHabitStore';
import { HabitCard } from '../components/habits/HabitCard';
import { EmptyState } from '../components/ui/EmptyState';
import { HomeStackParamList } from '../types/navigation';
import { HabitWithProgress } from '../types/habit';
import { colors, spacing, typography } from '../theme';
import { today, formatDisplay } from '../utils/dates';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>;

export function DashboardScreen() {
  const nav = useNavigation<Nav>();
  const { habits, loading, loadHabits, toggleCompletion } = useHabitStore();

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const completedCount = habits.filter((h) => h.todayCompleted).length;
  const totalCount = habits.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = useCallback((id: string) => toggleCompletion(id), [toggleCompletion]);
  const handlePress = useCallback((id: string) => nav.navigate('HabitDetail', { habitId: id }), [nav]);

  const renderItem = useCallback(({ item }: { item: HabitWithProgress }) => (
    <HabitCard habit={item} onToggle={handleToggle} onPress={handlePress} />
  ), [handleToggle, handlePress]);

  const keyExtractor = useCallback((item: HabitWithProgress) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={habits.length === 0 ? styles.emptyContainer : styles.list}
        ListHeaderComponent={
          totalCount > 0 ? (
            <View style={styles.header}>
              <Text style={styles.dateText}>{formatDisplay(today(), 'long')}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${completionPct}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {completedCount}/{totalCount} completed today
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="add-circle-outline"
              title="No habits yet"
              subtitle="Tap + to create your first habit"
            />
          ) : null
        }
      />
      <Pressable
        style={styles.fab}
        onPress={() => nav.navigate('AddEditHabit', {})}
      >
        <Ionicons name="add" size={28} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  dateText: {
    ...typography.bodySmall,
    color: colors.mutedForeground,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.progressGreen,
    borderRadius: 3,
  },
  progressText: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
