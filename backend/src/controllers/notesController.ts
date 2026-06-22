import { Request, Response } from 'express';
import { NotesService } from '../services/notesService';

export class NotesController {
  static list(req: Request, res: Response): void {
    try {
      const userId = req.session.user_id!;
      const notes = NotesService.list(userId);

      res.json({
        success: true,
        data: notes,
        error: '',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static create(req: Request, res: Response): void {
    try {
      const userId = req.session.user_id!;
      const note = NotesService.create(userId, req.body);

      res.json({
        success: true,
        data: note,
        error: '',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static delete(req: Request, res: Response): void {
    try {
      const userId = req.session.user_id!;
      const { id } = req.body;

      if (!id) {
        res.status(400).json({ success: false, error: 'ID da anotacao e obrigatorio.' });
        return;
      }

      const deleted = NotesService.delete(userId, id);

      if (!deleted) {
        res.status(404).json({ success: false, error: 'Anotacao nao encontrada.' });
        return;
      }

      res.json({
        success: true,
        data: null,
        error: '',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static clear(req: Request, res: Response): void {
    try {
      const userId = req.session.user_id!;
      NotesService.clear(userId);

      res.json({
        success: true,
        data: null,
        error: '',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
