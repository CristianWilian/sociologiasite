import { getDatabase, seedDefaultTasks } from '../models/database';
import { User, UserCreatePayload, UserLoginPayload, UserSession } from '../models/User';
import bcryptjs from 'bcryptjs';

export class AuthService {
  static register(payload: UserCreatePayload): UserSession {
    const db = getDatabase();
    const { username, password } = payload;

    if (username.length < 3 || password.length < 4) {
      throw new Error('Usuario minimo 3 caracteres e senha minima 4 caracteres.');
    }

    const checkStmt = db.prepare('SELECT id FROM users WHERE username = ?');
    if (checkStmt.get(username.toLowerCase())) {
      throw new Error('Usuario ja existe.');
    }

    const passwordHash = bcryptjs.hashSync(password, 10);
    const insertStmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    const result = insertStmt.run(username.toLowerCase(), passwordHash);

    const userId = typeof result.lastID === 'number' ? result.lastID : parseInt(String(result.lastID));
    seedDefaultTasks(userId);

    return { user_id: userId, username: username.toLowerCase() };
  }

  static login(payload: UserLoginPayload): UserSession {
    const db = getDatabase();
    const { username, password } = payload;

    const selectStmt = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?');
    const user = selectStmt.get(username.toLowerCase()) as User | undefined;

    if (!user || !bcryptjs.compareSync(password, user.password_hash)) {
      throw new Error('Usuario ou senha invalidos.');
    }

    seedDefaultTasks(user.id);

    return { user_id: user.id, username: user.username };
  }
}
