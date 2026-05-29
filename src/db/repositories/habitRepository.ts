import { v4 as uuid } from 'uuid';
import { getDatabase } from '../database';
import { Habit, HabitWithGoals, CreateHabitInput } from '../../types/habit';
import { goalRepository } from './goalRepository';

function rowToHabit(row: any): Habit {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    icon: row.icon ?? 'check-circle',
    color: row.color ?? '#D97706',
    sortOrder: row.sort_order ?? 0,
    archived: !!row.archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const habitRepository = {
  async getAll(includeArchived = false): Promise<Habit[]> {
    const db = await getDatabase();
    const query = includeArchived
      ? 'SELECT * FROM habits ORDER BY sort_order, created_at'
      : 'SELECT * FROM habits WHERE archived = 0 ORDER BY sort_order, created_at';
    const rows = await db.getAllAsync(query);
    return rows.map(rowToHabit);
  },

  async getById(id: string): Promise<Habit | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync('SELECT * FROM habits WHERE id = ?', [id]);
    return row ? rowToHabit(row) : null;
  },

  async getWithGoals(id: string): Promise<HabitWithGoals | null> {
    const habit = await this.getById(id);
    if (!habit) return null;
    const goals = await goalRepository.getByHabitId(id);
    return { ...habit, goals };
  },

  async getAllWithGoals(includeArchived = false): Promise<HabitWithGoals[]> {
    const habits = await this.getAll(includeArchived);
    const results: HabitWithGoals[] = [];
    for (const habit of habits) {
      const goals = await goalRepository.getByHabitId(habit.id);
      results.push({ ...habit, goals });
    }
    return results;
  },

  async create(input: CreateHabitInput): Promise<string> {
    const db = await getDatabase();
    const id = uuid();
    const maxOrder = await db.getFirstAsync<{ max_order: number | null }>(
      'SELECT MAX(sort_order) as max_order FROM habits'
    );
    const sortOrder = (maxOrder?.max_order ?? -1) + 1;

    await db.runAsync(
      `INSERT INTO habits (id, name, description, icon, color, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, input.name, input.description ?? '', input.icon ?? 'check-circle', input.color ?? '#D97706', sortOrder]
    );

    for (const goal of input.goals) {
      await goalRepository.create(id, goal.frequency, goal.targetCount);
    }

    return id;
  },

  async update(id: string, fields: Partial<Pick<Habit, 'name' | 'description' | 'icon' | 'color' | 'sortOrder' | 'archived'>>): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const values: any[] = [];

    if (fields.name !== undefined) { sets.push('name = ?'); values.push(fields.name); }
    if (fields.description !== undefined) { sets.push('description = ?'); values.push(fields.description); }
    if (fields.icon !== undefined) { sets.push('icon = ?'); values.push(fields.icon); }
    if (fields.color !== undefined) { sets.push('color = ?'); values.push(fields.color); }
    if (fields.sortOrder !== undefined) { sets.push('sort_order = ?'); values.push(fields.sortOrder); }
    if (fields.archived !== undefined) { sets.push('archived = ?'); values.push(fields.archived ? 1 : 0); }

    if (sets.length === 0) return;
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.runAsync(`UPDATE habits SET ${sets.join(', ')} WHERE id = ?`, values);
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM habits WHERE id = ?', [id]);
  },

  async archive(id: string): Promise<void> {
    await this.update(id, { archived: true });
  },

  async unarchive(id: string): Promise<void> {
    await this.update(id, { archived: false });
  },
};
