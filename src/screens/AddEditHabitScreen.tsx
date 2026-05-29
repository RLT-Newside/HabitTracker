import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHabitStore } from '../stores/useHabitStore';
import { habitRepository } from '../db/repositories/habitRepository';
import { goalRepository } from '../db/repositories/goalRepository';
import { GoalConfig } from '../components/habits/GoalConfig';
import { Button } from '../components/ui/Button';
import { HomeStackParamList } from '../types/navigation';
import { CreateGoalInput } from '../types/habit';
import { colors, spacing, radius, typography } from '../theme';
import { HABIT_COLORS } from '../utils/constants';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'AddEditHabit'>;
type Route = RouteProp<HomeStackParamList, 'AddEditHabit'>;

export function AddEditHabitScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const editId = route.params?.habitId;
  const { createHabit, loadHabits } = useHabitStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(HABIT_COLORS[0]);
  const [goals, setGoals] = useState<CreateGoalInput[]>([{ frequency: 'daily', targetCount: 1 }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editId) {
      nav.setOptions({ title: 'Edit Habit' });
      loadExisting();
    }
  }, [editId]);

  async function loadExisting() {
    if (!editId) return;
    const habit = await habitRepository.getById(editId);
    if (!habit) return;
    setName(habit.name);
    setDescription(habit.description);
    setSelectedColor(habit.color);
    const existingGoals = await goalRepository.getByHabitId(editId);
    if (existingGoals.length > 0) {
      setGoals(existingGoals.map((g) => ({ frequency: g.frequency, targetCount: g.targetCount })));
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter a habit name.');
      return;
    }
    if (goals.length === 0) {
      Alert.alert('Goal Required', 'Add at least one goal.');
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        await habitRepository.update(editId, { name: name.trim(), description: description.trim(), color: selectedColor });
        await goalRepository.deleteByHabitId(editId);
        for (const goal of goals) {
          await goalRepository.create(editId, goal.frequency, goal.targetCount);
        }
        await loadHabits();
      } else {
        await createHabit({ name: name.trim(), description: description.trim(), color: selectedColor, goals });
      }
      nav.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save habit.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Read 30 minutes"
          placeholderTextColor={colors.mutedForeground}
          autoFocus={!editId}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Why this habit matters to you"
          placeholderTextColor={colors.mutedForeground}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorRow}>
          {HABIT_COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setSelectedColor(c)}
              style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotActive]}
            />
          ))}
        </View>
      </View>

      <GoalConfig goals={goals} onChange={setGoals} />

      <Button title={editId ? 'Save Changes' : 'Create Habit'} onPress={handleSave} loading={saving} style={styles.saveButton} />
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
    gap: spacing.xl,
    paddingBottom: 40,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.foreground,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.foreground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  colorRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorDotActive: {
    borderWidth: 3,
    borderColor: colors.foreground,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});
