import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Session {
      user_id?: number;
      username?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.user_id) {
    res.status(401).json({ success: false, error: 'Nao autenticado.' });
    return;
  }
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  next();
}
