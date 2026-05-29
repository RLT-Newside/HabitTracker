import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Card } from '../components/ui/Card';
import { useHabitStore } from '../stores/useHabitStore';
import { habitRepository } from '../db/repositories/habitRepository';
import { statsEngine } from '../services/statsEngine';
import { HomeStackParamList } from '../types/navigation';
import { HabitWithGoals, GoalProgress } from '../types/habit';
import { StreakInfo } from '../types/stats';
import { colors, spacing, typography } from '../theme';
import { FREQUENCY_LABELS } from '../utils/constants';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'HabitDetail'>;
type Route = RouteProp<HomeStackParamList, 'HabitDetail'>;

export function HabitDetailScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { habitId } = route.params;
  const { deleteHabit, archiveHabit } = useHabitStore();

  const [habit, setHabit] = useState<HabitWithGoals | null>(null);
  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([]);
  const [streak, setStreak] = useState<StreakInfo>({ current: 0, longest: 0, lastCompletedDate: null });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [habitId])
  );

  async function loadData() {
    const h = await habitRepository.getWithGoals(habitId);
    setHabit(h);
    if (h) {
      nav.setOptions({ title: h.name });
      const progress = await statsEngine.calculateGoalProgress(habitId);
      setGoalProgress(progress);
      const streakInfo = await statsEngine.getStreakInfo(habitId);
      setStreak(streakInfo);
    }
  }

  function handleEdit() {
    nav.navigate('AddEditHabit', { habitId });
  }

  function handleArchive() {
    Alert.alert('Archive Habit', 'This habit will be hidden from your dashboard.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Archive', onPress: async () => { await archiveHabit(habitId); nav.goBack(); } },
    ]);
  }

  function handleDelete() {
    Alert.alert('Delete Habit', 'This will permanently delete this habit and all its data. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteHabit(habitId); nav.goBack(); } },
    ]);
  }

  if (!habit) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.streakCard}>
        <View style={styles.streakRow}>
          <View style={styles.streakItem}>
            <Ionicons name="flame" size={24} color={colors.streakAmber} />
            <Text style={styles.streakValue}>{streak.current}</Text>
            <Text style={styles.streakLabel}>Current Streak</Text>
          </View>
          <View style={styles.streakItem}>
            <Ionicons name="trophy" size={24} color={colors.secondary} />
            <Text style={styles.streakValue}>{streak.longest}</Text>
            <Text style={styles.streakLabel}>Best Streak</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Goal Progress</Text>
      {goalProgress.map((gp) => (
        <Card key={gp.goalId} style={styles.goalCard}>
          <View style={styles.goalRow}>
            <View style={styles.goalInfo}>
              <Text style={styles.goalFrequency}>{FREQUENCY_LABELS[gp.frequency]}</Text>
              <Text style={styles.goalCount}>{gp.currentCount} / {gp.targetCount}</Text>
              <View style={[styles.trackBadge, { backgroundColor: gp.onTrack ? colors.progressGreen : colors.destructive }]}>
                <Text style={styles.trackText}>{gp.onTrack ? 'On Track' : 'Behind'}</Text>
              </View>
            </View>
            <ProgressRing percentage={gp.percentage} size={64} strokeWidth={6} color={habit.color} />
          </View>
        </Card>
      ))}

      {habit.description ? (
        <>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{habit.description}</Text>
        </>
      ) : null}

      <View style={styles.actions}>
        <Pressable onPress={handleEdit} style={styles.actionButton}>
          <Ionicons name="pencil" size={20} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
        </Pressable>
        <Pressable onPress={handleArchive} style={styles.actionButton}>
          <Ionicons name="archive" size={20} color={colors.mutedForeground} />
          <Text style={styles.actionText}>Archive</Text>
        </Pressable>
        <Pressable onPress={handleDelete} style={styles.actionButton}>
          <Ionicons name="trash" size={20} color={colors.destructive} />
          <Text style={[styles.actionText, { color: colors.destructive }]}>Delete</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: 40,
  },
  streakCard: {
    backgroundColor: colors.card,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakItem: {
    alignItems: 'center',
    gap: 4,
  },
  streakValue: {
    ...typography.h2,
    color: colors.foreground,
  },
  streakLabel: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.foreground,
  },
  goalCard: {},
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalInfo: {
    gap: 4,
  },
  goalFrequency: {
    ...typography.label,
    color: colors.foreground,
  },
  goalCount: {
    ...typography.body,
    color: colors.mutedForeground,
  },
  trackBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  trackText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  description: {
    ...typography.body,
    color: colors.mutedForeground,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
});
