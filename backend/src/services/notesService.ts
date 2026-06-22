import { getDatabase } from '../models/database';
import { Note, NoteCreatePayload } from '../models/Note';

export class NotesService {
  static list(userId: number): Note[] {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC, id DESC');
    return stmt.all(userId) as Note[];
  }

  static create(userId: number, payload: NoteCreatePayload): Note {
    const db = getDatabase();
    const { content } = payload;

    if (!content || content.trim() === '') {
      throw new Error('Conteudo da anotacao e obrigatorio.');
    }

    const stmt = db.prepare('INSERT INTO notes (user_id, content) VALUES (?, ?)');
    const result = stmt.run(userId, content);
    const noteId = typeof result.lastID === 'number' ? result.lastID : parseInt(String(result.lastID));

    const selectStmt = db.prepare('SELECT * FROM notes WHERE id = ?');
    return selectStmt.get(noteId) as Note;
  }

  static delete(userId: number, noteId: number): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
    const result = stmt.run(noteId, userId);

    return (result.changes ?? 0) > 0;
  }

  static clear(userId: number): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM notes WHERE user_id = ?');
    const result = stmt.run(userId);

    return (result.changes ?? 0) > 0;
  }
}
