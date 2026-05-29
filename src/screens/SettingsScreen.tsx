import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase } from '../db/database';
import { colors, spacing, radius, typography } from '../theme';

export function SettingsScreen() {
  async function handleExport() {
    try {
      const db = await getDatabase();
      const habits = await db.getAllAsync('SELECT * FROM habits');
      const goals = await db.getAllAsync('SELECT * FROM goals');
      const completions = await db.getAllAsync('SELECT * FROM completions');
      const tasks = await db.getAllAsync('SELECT * FROM tasks');

      const data = JSON.stringify({ habits, goals, completions, tasks, exportedAt: new Date().toISOString() }, null, 2);
      Alert.alert('Export Ready', `Data exported: ${habits.length} habits, ${completions.length} completions, ${tasks.length} tasks.\n\n(Share functionality requires expo-sharing — coming soon)`);
    } catch (e) {
      Alert.alert('Export Failed', 'Could not export data.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <Pressable style={styles.row} onPress={handleExport}>
          <Ionicons name="download-outline" size={22} color={colors.foreground} />
          <Text style={styles.rowText}>Export Data (JSON)</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.row}>
          <Ionicons name="information-circle-outline" size={22} color={colors.foreground} />
          <Text style={styles.rowText}>Version</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
      </View>

      <Text style={styles.footer}>JHabits - Build better habits, one day at a time.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  rowText: {
    ...typography.body,
    color: colors.foreground,
    flex: 1,
  },
  rowValue: {
    ...typography.bodySmall,
    color: colors.mutedForeground,
  },
  footer: {
    ...typography.caption,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 'auto',
  },
});
