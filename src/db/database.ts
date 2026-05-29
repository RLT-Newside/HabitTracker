import * as SQLite from 'expo-sqlite';
import { DB_NAME } from '../utils/constants';
import { migrations } from './migrations';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync('PRAGMA journal_mode=WAL');
  await db.execAsync('PRAGMA foreign_keys=ON');
  await runMigrations(db);
  return db;
}

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  const result = await database.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version ?? 0;

  const pending = migrations.filter((m) => m.version > currentVersion);
  if (pending.length === 0) return;

  for (const migration of pending) {
    await database.withTransactionAsync(async () => {
      for (const stmt of migration.statements) {
        await database.execAsync(stmt);
      }
      await database.execAsync(`PRAGMA user_version = ${migration.version}`);
    });
  }
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
