import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { habitRepository } from '../db/repositories/habitRepository';
import { statsEngine } from '../services/statsEngine';
import { StatsStackParamList } from '../types/navigation';
import { HabitWithGoals, GoalProgress } from '../types/habit';
import { colors, spacing, radius, typography } from '../theme';
import { FREQUENCY_LABELS } from '../utils/constants';

type Nav = NativeStackNavigationProp<StatsStackParamList, 'StatsOverview'>;

interface HabitStatSummary {
  habit: HabitWithGoals;
  streak: number;
  primaryGoal: GoalProgress | null;
}

export function StatsScreen() {
  const nav = useNavigation<Nav>();
  const [summaries, setSummaries] = useState<HabitStatSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  async function loadStats() {
    setLoading(true);
    const habits = await habitRepository.getAllWithGoals();
    const results: HabitStatSummary[] = [];

    for (const habit of habits) {
      const goalProgress = await statsEngine.calculateGoalProgress(habit.id);
      const streak = await statsEngine.getCurrentStreak(habit.id);
      results.push({
        habit,
        streak,
        primaryGoal: goalProgress[0] ?? null,
      });
    }

    results.sort((a, b) => (b.streak - a.streak));
    setSummaries(results);
    setLoading(false);
  }

  if (!loading && summaries.length === 0) {
    return (
      <EmptyState
        icon="stats-chart"
        title="No stats yet"
        subtitle="Create habits and start tracking to see statistics"
      />
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={summaries}
      keyExtractor={(item) => item.habit.id}
      renderItem={({ item }) => (
        <Pressable onPress={() => nav.navigate('HabitStats', { habitId: item.habit.id })}>
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.habit.name}</Text>
                <View style={styles.meta}>
                  {item.streak > 0 && (
                    <View style={styles.streakBadge}>
                      <Ionicons name="flame" size={14} color={colors.streakAmber} />
                      <Text style={styles.streakText}>{item.streak}d streak</Text>
                    </View>
                  )}
                  {item.primaryGoal && (
                    <Text style={styles.goalText}>
                      {item.primaryGoal.currentCount}/{item.primaryGoal.targetCount}{' '}
                      {FREQUENCY_LABELS[item.primaryGoal.frequency].toLowerCase()}
                    </Text>
                  )}
                </View>
              </View>
              {item.primaryGoal && (
                <ProgressRing
                  percentage={item.primaryGoal.percentage}
                  size={56}
                  strokeWidth={5}
                  color={item.habit.color}
                />
              )}
            </View>
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.foreground,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  streakText: {
    ...typography.caption,
    color: colors.streakAmber,
    fontWeight: '600',
  },
  goalText: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
});
