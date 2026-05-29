import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithProgress } from '../../types/habit';
import { ProgressRing } from '../ui/ProgressRing';
import { colors, spacing, radius, typography } from '../../theme';
import { FREQUENCY_LABELS } from '../../utils/constants';

interface HabitCardProps {
  habit: HabitWithProgress;
  onToggle: (habitId: string) => void;
  onPress: (habitId: string) => void;
}

export const HabitCard = React.memo(function HabitCard({ habit, onToggle, onPress }: HabitCardProps) {
  const handleToggle = useCallback(() => onToggle(habit.id), [habit.id, onToggle]);
  const handlePress = useCallback(() => onPress(habit.id), [habit.id, onPress]);

  const primaryGoal = habit.goalProgress[0];

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <Pressable onPress={handleToggle} style={styles.checkbox} hitSlop={12}>
        <Ionicons
          name={habit.todayCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={32}
          color={habit.todayCompleted ? habit.color : colors.mutedForeground}
        />
      </Pressable>

      <View style={styles.content}>
        <Text style={[styles.name, habit.todayCompleted && styles.completedName]}>{habit.name}</Text>
        <View style={styles.meta}>
          {habit.currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={14} color={colors.streakAmber} />
              <Text style={styles.streakText}>{habit.currentStreak}d</Text>
            </View>
          )}
          {primaryGoal && (
            <Text style={styles.goalText}>
              {primaryGoal.currentCount}/{primaryGoal.targetCount} {FREQUENCY_LABELS[primaryGoal.frequency]}
            </Text>
          )}
        </View>
      </View>

      {primaryGoal && (
        <ProgressRing
          percentage={primaryGoal.percentage}
          size={48}
          strokeWidth={5}
          color={habit.color}
          showLabel={false}
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  checkbox: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.foreground,
  },
  completedName: {
    textDecorationLine: 'line-through',
    color: colors.mutedForeground,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
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
