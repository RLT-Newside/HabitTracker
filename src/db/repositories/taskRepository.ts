import { v4 as uuid } from 'uuid';
import { getDatabase } from '../database';
import { Task, CreateTaskInput } from '../../types/task';

function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    dueDate: row.due_date,
    dueTime: row.due_time,
    completed: !!row.completed,
    completedAt: row.completed_at,
    priority: row.priority ?? 0,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const taskRepository = {
  async getAll(includeCompleted = false): Promise<Task[]> {
    const db = await getDatabase();
    const query = includeCompleted
      ? 'SELECT * FROM tasks ORDER BY completed, priority DESC, sort_order, created_at'
      : 'SELECT * FROM tasks WHERE completed = 0 ORDER BY priority DESC, sort_order, created_at';
    const rows = await db.getAllAsync(query);
    return rows.map(rowToTask);
  },

  async getByDate(date: string): Promise<Task[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync(
      'SELECT * FROM tasks WHERE due_date = ? ORDER BY completed, priority DESC, sort_order',
      [date]
    );
    return rows.map(rowToTask);
  },

  async getById(id: string): Promise<Task | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?', [id]);
    return row ? rowToTask(row) : null;
  },

  async create(input: CreateTaskInput): Promise<string> {
    const db = await getDatabase();
    const id = uuid();
    const maxOrder = await db.getFirstAsync<{ max_order: number | null }>(
      'SELECT MAX(sort_order) as max_order FROM tasks'
    );
    const sortOrder = (maxOrder?.max_order ?? -1) + 1;

    await db.runAsync(
      `INSERT INTO tasks (id, title, description, due_date, due_time, priority, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, input.title, input.description ?? '', input.dueDate ?? null, input.dueTime ?? null, input.priority ?? 0, sortOrder]
    );
    return id;
  },

  async update(id: string, fields: Partial<Pick<Task, 'title' | 'description' | 'dueDate' | 'dueTime' | 'priority' | 'sortOrder'>>): Promise<void> {
    const db = await getDatabase();
    const sets: string[] = [];
    const values: any[] = [];

    if (fields.title !== undefined) { sets.push('title = ?'); values.push(fields.title); }
    if (fields.description !== undefined) { sets.push('description = ?'); values.push(fields.description); }
    if (fields.dueDate !== undefined) { sets.push('due_date = ?'); values.push(fields.dueDate); }
    if (fields.dueTime !== undefined) { sets.push('due_time = ?'); values.push(fields.dueTime); }
    if (fields.priority !== undefined) { sets.push('priority = ?'); values.push(fields.priority); }
    if (fields.sortOrder !== undefined) { sets.push('sort_order = ?'); values.push(fields.sortOrder); }

    if (sets.length === 0) return;
    sets.push("updated_at = datetime('now')");
    values.push(id);

    await db.runAsync(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`, values);
  },

  async toggleComplete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const task = await this.getById(id);
    if (!task) return false;
    const newCompleted = !task.completed;
    await db.runAsync(
      `UPDATE tasks SET completed = ?, completed_at = ?, updated_at = datetime('now') WHERE id = ?`,
      [newCompleted ? 1 : 0, newCompleted ? new Date().toISOString() : null, id]
    );
    return newCompleted;
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  },
};
