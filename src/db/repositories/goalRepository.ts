import { v4 as uuid } from 'uuid';
import { getDatabase } from '../database';
import { Goal, FrequencyType } from '../../types/habit';

function rowToGoal(row: any): Goal {
  return {
    id: row.id,
    habitId: row.habit_id,
    frequency: row.frequency,
    targetCount: row.target_count,
    active: !!row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const goalRepository = {
  async getByHabitId(habitId: string): Promise<Goal[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync(
      'SELECT * FROM goals WHERE habit_id = ? AND active = 1 ORDER BY frequency',
      [habitId]
    );
    return rows.map(rowToGoal);
  },

  async create(habitId: string, frequency: FrequencyType, targetCount: number): Promise<string> {
    const db = await getDatabase();
    const id = uuid();
    await db.runAsync(
      `INSERT INTO goals (id, habit_id, frequency, target_count)
       VALUES (?, ?, ?, ?)`,
      [id, habitId, frequency, targetCount]
    );
    return id;
  },

  async update(id: string, fields: Partial<Pick<Goal, 'targetCount' | 'active'>>): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const values: any[] = [];

    if (fields.targetCount !== undefined) { sets.push('target_count = ?'); values.push(fields.targetCount); }
    if (fields.active !== undefined) { sets.push('active = ?'); values.push(fields.active ? 1 : 0); }

    if (sets.length === 0) return;
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.runAsync(`UPDATE goals SET ${sets.join(', ')} WHERE id = ?`, values);
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM goals WHERE id = ?', [id]);
  },

  async deleteByHabitId(habitId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM goals WHERE habit_id = ?', [habitId]);
  },
};
