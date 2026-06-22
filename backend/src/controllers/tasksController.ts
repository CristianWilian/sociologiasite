import { Request, Response } from 'express';
import { TasksService } from '../services/tasksService';

export class TasksController {
  static list(req: Request, res: Response): void {
    try {
      const userId = req.session.user_id!;
      const tasks = TasksService.list(userId);

      res.json({
        success: true,
        data: tasks,
        error: '',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static create(req: Request, res: Response): void {
    try {
      const userId = req.session.user_id!;
      const task = TasksService.create(userId, req.body);

      res.json({
        success: true,
        data: task,
        error: '',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static toggle(req: Request, res: Response): void {
    try {
      const userId = req.session.user_id!;
      const { id } = req.body;

      if (!id) {
        res.status(400).json({ success: false, error: 'ID da atividade e obrigatorio.' });
        return;
      }

      const updated = TasksService.update(userId, id, { is_done: true });

      if (!updated) {
        res.status(404).json({ success: false, error: 'Atividade nao encontrada.' });
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

  static delete(req: Request, res: Response): void {
    try {
      const userId = req.session.user_id!;
      const { id } = req.body;

      if (!id) {
        res.status(400).json({ success: false, error: 'ID da atividade e obrigatorio.' });
        return;
      }

      const deleted = TasksService.delete(userId, id);

      if (!deleted) {
        res.status(404).json({ success: false, error: 'Atividade nao encontrada.' });
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
}
