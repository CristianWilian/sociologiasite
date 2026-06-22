import 'express-session';
declare module 'express-session' { interface SessionData { user_id: number; username: string; } }
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static register(req: Request, res: Response): void {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ success: false, error: 'Username e password sao obrigatorios.' });
        return;
      }

      const userSession = AuthService.register({ username, password });
      req.session.user_id = userSession.user_id;
      req.session.username = userSession.username;

      res.json({
        success: true,
        data: userSession,
        error: '',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static login(req: Request, res: Response): void {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ success: false, error: 'Username e password sao obrigatorios.' });
        return;
      }

      const userSession = AuthService.login({ username, password });
      req.session.user_id = userSession.user_id;
      req.session.username = userSession.username;

      res.json({
        success: true,
        data: userSession,
        error: '',
      });
    } catch (error: any) {
      res.status(401).json({ success: false, error: error.message });
    }
  }

  static status(req: Request, res: Response): void {
    const data = {
      logged_in: !!req.session.user_id,
      user_id: req.session.user_id ?? null,
      username: req.session.username ?? null,
    };

    res.json({
      success: true,
      data,
      error: '',
    });
  }

  static logout(req: Request, res: Response): void {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, error: 'Erro ao fazer logout.' });
        return;
      }
      res.json({ success: true, data: null, error: '' });
    });
  }
}
