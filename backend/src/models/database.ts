import Database from 'better-sqlite3';

import path from 'path';
import fs from 'fs';

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'sociologia.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      is_important INTEGER NOT NULL DEFAULT 1,
      is_done INTEGER NOT NULL DEFAULT 0,
      due_date TEXT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_date TEXT NOT NULL,
      detail TEXT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

export function getDatabase(): Database.Database {
  return db;
}

export function seedDefaultTasks(userId: number): void {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?');
  const result = countStmt.get(userId) as { count: number };

  if (result.count > 0) return;

  const insertStmt = db.prepare(
    'INSERT INTO tasks (user_id, title, is_important, due_date) VALUES (?, ?, ?, ?)'
  );

  insertStmt.run(userId, 'Revisar teoria de Emile Durkheim', 1, null);
  insertStmt.run(userId, 'Entregar trabalho sobre desigualdade social', 1, null);
  insertStmt.run(userId, 'Estudar para prova bimestral de Sociologia', 1, null);
  insertStmt.run(userId, 'Atualizar mapa mental da unidade', 0, null);
}
