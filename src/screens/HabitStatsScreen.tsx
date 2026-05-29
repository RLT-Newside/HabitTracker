import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useRoute, RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-gifted-charts';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Card } from '../components/ui/Card';
import { statsEngine } from '../services/statsEngine';
import { habitRepository } from '../db/repositories/habitRepository';
import { StatsStackParamList } from '../types/navigation';
import { HabitStats } from '../types/stats';
import { HabitWithGoals } from '../types/habit';
import { colors, spacing, typography } from '../theme';
import { FREQUENCY_LABELS } from '../utils/constants';

type Route = RouteProp<StatsStackParamList, 'HabitStats'>;
const SCREEN_WIDTH = Dimensions.get('window').width;

export function HabitStatsScreen() {
  const route = useRoute<Route>();
  const nav = useNavigation();
  const { habitId } = route.params;

  const [habit, setHabit] = useState<HabitWithGoals | null>(null);
  const [stats, setStats] = useState<HabitStats | null>(null);

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
      const s = await statsEngine.getHabitStats(habitId);
      setStats(s);
    }
  }

  if (!habit || !stats) return null;

  const monthlyData = Object.entries(stats.completionsByMonth)
    .slice(-6)
    .map(([month, count]) => ({
      value: count,
      label: month.slice(5),
      frontColor: habit.color,
    }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.overviewRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalCompletions}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={20} color={colors.streakAmber} />
            <Text style={styles.statValue}>{stats.streakInfo.current}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={20} color={colors.secondary} />
            <Text style={styles.statValue}>{stats.streakInfo.longest}</Text>
            <Text style={styles.statLabel}>Best</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.averagePerWeek}</Text>
            <Text style={styles.statLabel}>Avg/Week</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Goal Progress</Text>
      {stats.goalProgress.map((gp) => (
        <Card key={gp.goalId}>
          <View style={styles.goalRow}>
            <View style={styles.goalInfo}>
              <Text style={styles.goalFreq}>{FREQUENCY_LABELS[gp.frequency]}</Text>
              <Text style={styles.goalCount}>{gp.currentCount} / {gp.targetCount}</Text>
              <View style={[styles.badge, { backgroundColor: gp.onTrack ? colors.progressGreen : colors.destructive }]}>
                <Text style={styles.badgeText}>{gp.onTrack ? 'On Track' : 'Behind'}</Text>
              </View>
            </View>
            <ProgressRing percentage={gp.percentage} size={56} strokeWidth={5} color={habit.color} />
          </View>
        </Card>
      ))}

      {monthlyData.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Monthly Completions</Text>
          <Card>
            <BarChart
              data={monthlyData}
              width={SCREEN_WIDTH - spacing.lg * 4 - 40}
              height={160}
              barWidth={28}
              spacing={16}
              roundedTop
              noOfSections={4}
              yAxisColor="transparent"
              xAxisColor={colors.border}
              yAxisTextStyle={{ color: colors.mutedForeground, fontSize: 11 }}
              xAxisLabelTextStyle={{ color: colors.mutedForeground, fontSize: 11 }}
              hideRules
            />
          </Card>
        </>
      )}
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
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...typography.h3,
    color: colors.foreground,
  },
  statLabel: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.foreground,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalInfo: {
    gap: 4,
  },
  goalFreq: {
    ...typography.label,
    color: colors.foreground,
  },
  goalCount: {
    ...typography.bodySmall,
    color: colors.mutedForeground,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
