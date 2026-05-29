export interface Migration {
  version: number;
  statements: string[];
}

export const migrations: Migration[] = [
  {
    version: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        icon TEXT DEFAULT 'check-circle',
        color TEXT DEFAULT '#D97706',
        sort_order INTEGER DEFAULT 0,
        archived INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )`,
      `CREATE INDEX IF NOT EXISTS idx_habits_archived ON habits(archived)`,
      `CREATE INDEX IF NOT EXISTS idx_habits_sort ON habits(sort_order)`,

      `CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
        frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
        target_count INTEGER NOT NULL DEFAULT 1,
        active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        UNIQUE(habit_id, frequency)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_goals_habit ON goals(habit_id)`,

      `CREATE TABLE IF NOT EXISTS completions (
        id TEXT PRIMARY KEY,
        habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        value REAL DEFAULT 1.0,
        notes TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      )`,
      `CREATE INDEX IF NOT EXISTS idx_completions_habit_date ON completions(habit_id, date)`,
      `CREATE INDEX IF NOT EXISTS idx_completions_date ON completions(date)`,

      `CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        due_date TEXT,
        due_time TEXT,
        completed INTEGER DEFAULT 0,
        completed_at TEXT,
        priority INTEGER DEFAULT 0 CHECK (priority IN (0, 1, 2, 3)),
        sort_order INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )`,
      `CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)`,
      `CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed)`,

      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )`,
    ],
  },
];
