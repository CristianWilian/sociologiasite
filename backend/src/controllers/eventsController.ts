import { Request, Response } from 'express';
import { EventsService } from '../services/eventsService';

export class EventsController {
  static list(req: Request, res: Response): void {
    try {
      const userId = req.session.user_id!;
      const events = EventsService.list(userId);

      res.json({
        success: true,
        data: events,
        error: '',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static create(req: Request, res: Response): void {
    try {
      const userId = req.session.user_id!;
      const event = EventsService.create(userId, req.body);

      res.json({
        success: true,
        data: event,
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
        res.status(400).json({ success: false, error: 'ID do evento e obrigatorio.' });
        return;
      }

      const deleted = EventsService.delete(userId, id);

      if (!deleted) {
        res.status(404).json({ success: false, error: 'Evento nao encontrado.' });
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
      EventsService.clear(userId);

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
