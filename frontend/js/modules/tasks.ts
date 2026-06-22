import { apiRequest } from './api';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  is_important: number;
  is_done: number;
  due_date: string | null;
  created_at: string;
}

let tasksCache: Task[] = [];

export async function loadTasks(): Promise<Task[]> {
  tasksCache = await apiRequest<Task[]>('tasks_list');
  return tasksCache;
}

export async function addTask(title: string, isImportant: boolean = true): Promise<Task> {
  const task = await apiRequest<Task>('tasks_add', {
    method: 'POST',
    payload: { title, is_important: isImportant },
  });
  tasksCache.unshift(task);
  return task;
}

export async function toggleTask(id: number): Promise<void> {
  await apiRequest('tasks_toggle', {
    method: 'POST',
    payload: { id },
  });
  const task = tasksCache.find((t) => t.id === id);
  if (task) {
    task.is_done = task.is_done ? 0 : 1;
  }
}

export async function deleteTask(id: number): Promise<void> {
  await apiRequest('tasks_delete', {
    method: 'POST',
    payload: { id },
  });
  tasksCache = tasksCache.filter((t) => t.id !== id);
}

export function getTasksCache(): Task[] {
  return tasksCache;
}

export function getFilteredTasks(mode: 'all' | 'pending' | 'done'): Task[] {
  if (mode === 'pending') return tasksCache.filter((t) => t.is_done === 0);
  if (mode === 'done') return tasksCache.filter((t) => t.is_done === 1);
  return tasksCache;
}

export function getTasksSummary(): { total: number; pending: number; urgent: number } {
  return {
    total: tasksCache.length,
    pending: tasksCache.filter((t) => t.is_done === 0).length,
    urgent: tasksCache.filter((t) => t.is_important === 1 && t.is_done === 0).length,
  };
}
