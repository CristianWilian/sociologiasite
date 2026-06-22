import { getDatabase } from '../models/database';
import { Task, TaskCreatePayload, TaskUpdatePayload } from '../models/Task';

export class TasksService {
  static list(userId: number): Task[] {
    const db = getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY COALESCE(due_date, "9999-12-31") ASC, id DESC'
    );
    return stmt.all(userId) as Task[];
  }

  static create(userId: number, payload: TaskCreatePayload): Task {
    const db = getDatabase();
    const { title, is_important = true, due_date = null } = payload;

    if (!title || title.trim() === '') {
      throw new Error('Titulo da atividade e obrigatorio.');
    }

    const stmt = db.prepare(
      'INSERT INTO tasks (user_id, title, is_important, due_date) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(userId, title, is_important ? 1 : 0, due_date || null);
    const taskId = typeof result.lastID === 'number' ? result.lastID : parseInt(String(result.lastID));

    const selectStmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    return selectStmt.get(taskId) as Task;
  }

  static update(userId: number, taskId: number, payload: TaskUpdatePayload): boolean {
    const db = getDatabase();
    const { is_done = false } = payload;

    const stmt = db.prepare('UPDATE tasks SET is_done = ? WHERE id = ? AND user_id = ?');
    const result = stmt.run(is_done ? 1 : 0, taskId, userId);

    return (result.changes ?? 0) > 0;
  }

  static delete(userId: number, taskId: number): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
    const result = stmt.run(taskId, userId);

    return (result.changes ?? 0) > 0;
  }
}
