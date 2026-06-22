import { getDatabase } from '../models/database';
import { Event, EventCreatePayload } from '../models/Event';

export class EventsService {
  static list(userId: number): Event[] {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM events WHERE user_id = ? ORDER BY event_date ASC, id DESC');
    return stmt.all(userId) as Event[];
  }

  static create(userId: number, payload: EventCreatePayload): Event {
    const db = getDatabase();
    const { title, event_type = 'Evento', event_date, detail = null } = payload;

    if (!title || !event_date) {
      throw new Error('Titulo e data do evento sao obrigatorios.');
    }

    const stmt = db.prepare(
      'INSERT INTO events (user_id, title, event_type, event_date, detail) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(userId, title, event_type, event_date, detail);
    const eventId = typeof result.lastID === 'number' ? result.lastID : parseInt(String(result.lastID));

    const selectStmt = db.prepare('SELECT * FROM events WHERE id = ?');
    return selectStmt.get(eventId) as Event;
  }

  static delete(userId: number, eventId: number): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM events WHERE id = ? AND user_id = ?');
    const result = stmt.run(eventId, userId);

    return (result.changes ?? 0) > 0;
  }

  static clear(userId: number): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM events WHERE user_id = ?');
    const result = stmt.run(userId);

    return (result.changes ?? 0) > 0;
  }
}
