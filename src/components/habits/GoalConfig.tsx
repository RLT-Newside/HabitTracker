import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FrequencyType, CreateGoalInput } from '../../types/habit';
import { colors, spacing, radius, typography } from '../../theme';
import { FREQUENCY_LABELS } from '../../utils/constants';

interface GoalConfigProps {
  goals: CreateGoalInput[];
  onChange: (goals: CreateGoalInput[]) => void;
}

const FREQUENCIES: FrequencyType[] = ['daily', 'weekly', 'monthly', 'yearly'];

export function GoalConfig({ goals, onChange }: GoalConfigProps) {
  const usedFrequencies = new Set(goals.map((g) => g.frequency));
  const availableFrequencies = FREQUENCIES.filter((f) => !usedFrequencies.has(f));

  function addGoal() {
    if (availableFrequencies.length === 0) return;
    onChange([...goals, { frequency: availableFrequencies[0], targetCount: 1 }]);
  }

  function removeGoal(index: number) {
    onChange(goals.filter((_, i) => i !== index));
  }

  function updateGoal(index: number, field: keyof CreateGoalInput, value: any) {
    const updated = [...goals];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Goals</Text>
      {goals.map((goal, index) => (
        <View key={index} style={styles.goalRow}>
          <View style={styles.frequencyPicker}>
            {FREQUENCIES.filter((f) => f === goal.frequency || !usedFrequencies.has(f)).map((freq) => (
              <Pressable
                key={freq}
                onPress={() => updateGoal(index, 'frequency', freq)}
                style={[styles.freqChip, goal.frequency === freq && styles.freqChipActive]}
              >
                <Text style={[styles.freqText, goal.frequency === freq && styles.freqTextActive]}>
                  {FREQUENCY_LABELS[freq]}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.targetRow}>
            <TextInput
              style={styles.targetInput}
              value={String(goal.targetCount)}
              onChangeText={(t) => updateGoal(index, 'targetCount', Math.max(1, parseInt(t) || 1))}
              keyboardType="number-pad"
              selectTextOnFocus
            />
            <Text style={styles.targetLabel}>times / {goal.frequency.replace('ly', '')}</Text>
            {goals.length > 1 && (
              <Pressable onPress={() => removeGoal(index)} hitSlop={8}>
                <Ionicons name="close-circle" size={22} color={colors.destructive} />
              </Pressable>
            )}
          </View>
        </View>
      ))}
      {availableFrequencies.length > 0 && (
        <Pressable onPress={addGoal} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.addText}>Add Goal</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.foreground,
  },
  goalRow: {
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  frequencyPicker: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  freqChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  freqChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  freqText: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
  freqTextActive: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  targetInput: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 60,
    textAlign: 'center',
    ...typography.body,
    fontWeight: '600',
    color: colors.foreground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  targetLabel: {
    ...typography.bodySmall,
    color: colors.mutedForeground,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  addText: {
    ...typography.label,
    color: colors.primary,
  },
});
