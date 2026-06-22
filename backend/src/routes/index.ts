import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { TasksController } from '../controllers/tasksController';
import { NotesController } from '../controllers/notesController';
import { EventsController } from '../controllers/eventsController';
import { requireAuth, optionalAuth } from '../middleware/auth';

const router = Router();

// Auth routes
router.post('/auth_register', AuthController.register);
router.post('/auth_login', AuthController.login);
router.get('/auth_status', AuthController.status);
router.post('/auth_logout', AuthController.logout);

// Tasks routes
router.get('/tasks_list', requireAuth, TasksController.list);
router.post('/tasks_add', requireAuth, TasksController.create);
router.post('/tasks_toggle', requireAuth, TasksController.toggle);
router.post('/tasks_delete', requireAuth, TasksController.delete);

// Notes routes
router.get('/notes_list', requireAuth, NotesController.list);
router.post('/notes_add', requireAuth, NotesController.create);
router.post('/notes_delete', requireAuth, NotesController.delete);
router.post('/notes_clear', requireAuth, NotesController.clear);

// Events routes
router.get('/events_list', requireAuth, EventsController.list);
router.post('/events_add', requireAuth, EventsController.create);
router.post('/events_delete', requireAuth, EventsController.delete);
router.post('/events_clear', requireAuth, EventsController.clear);

export default router;
