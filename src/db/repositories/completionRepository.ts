import { v4 as uuid } from 'uuid';
import { getDatabase } from '../database';
import { Completion } from '../../types/habit';

function rowToCompletion(row: any): Completion {
  return {
    id: row.id,
    habitId: row.habit_id,
    date: row.date,
    value: row.value ?? 1,
    notes: row.notes ?? '',
    createdAt: row.created_at,
  };
}

export const completionRepository = {
  async getByHabitAndDate(habitId: string, date: string): Promise<Completion | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync(
      'SELECT * FROM completions WHERE habit_id = ? AND date = ?',
      [habitId, date]
    );
    return row ? rowToCompletion(row) : null;
  },

  async getByDate(date: string): Promise<Completion[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync(
      'SELECT * FROM completions WHERE date = ?',
      [date]
    );
    return rows.map(rowToCompletion);
  },

  async getByHabitInRange(habitId: string, startDate: string, endDate: string): Promise<Completion[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync(
      'SELECT * FROM completions WHERE habit_id = ? AND date >= ? AND date <= ? ORDER BY date',
      [habitId, startDate, endDate]
    );
    return rows.map(rowToCompletion);
  },

  async getCountInRange(habitId: string, startDate: string, endDate: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM completions WHERE habit_id = ? AND date >= ? AND date <= ?',
      [habitId, startDate, endDate]
    );
    return result?.count ?? 0;
  },

  async getCompletedHabitIdsForDate(date: string): Promise<string[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ habit_id: string }>(
      'SELECT DISTINCT habit_id FROM completions WHERE date = ?',
      [date]
    );
    return rows.map((r) => r.habit_id);
  },

  async getCompletionDatesInRange(startDate: string, endDate: string): Promise<Record<string, string[]>> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ habit_id: string; date: string }>(
      'SELECT DISTINCT habit_id, date FROM completions WHERE date >= ? AND date <= ? ORDER BY date',
      [startDate, endDate]
    );
    const map: Record<string, string[]> = {};
    for (const row of rows) {
      if (!map[row.date]) map[row.date] = [];
      map[row.date].push(row.habit_id);
    }
    return map;
  },

  async toggle(habitId: string, date: string): Promise<boolean> {
    const existing = await this.getByHabitAndDate(habitId, date);
    if (existing) {
      const db = await getDatabase();
      await db.runAsync('DELETE FROM completions WHERE id = ?', [existing.id]);
      return false;
    }
    await this.create(habitId, date);
    return true;
  },

  async create(habitId: string, date: string, value: number = 1, notes: string = ''): Promise<string> {
    const db = await getDatabase();
    const id = uuid();
    await db.runAsync(
      `INSERT INTO completions (id, habit_id, date, value, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [id, habitId, date, value, notes]
    );
    return id;
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM completions WHERE id = ?', [id]);
  },

  async getAllDatesForHabit(habitId: string): Promise<string[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ date: string }>(
      'SELECT DISTINCT date FROM completions WHERE habit_id = ? ORDER BY date DESC',
      [habitId]
    );
    return rows.map((r) => r.date);
  },

  async getMonthlyCountsForHabit(habitId: string): Promise<Record<string, number>> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ month: string; count: number }>(
      `SELECT strftime('%Y-%m', date) as month, COUNT(*) as count
       FROM completions WHERE habit_id = ?
       GROUP BY month ORDER BY month`,
      [habitId]
    );
    const map: Record<string, number> = {};
    for (const row of rows) {
      map[row.month] = row.count;
    }
    return map;
  },
};
