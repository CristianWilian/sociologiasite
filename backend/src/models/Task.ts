export interface Task {
  id: number;
  user_id: number;
  title: string;
  is_important: number;
  is_done: number;
  due_date: string | null;
  created_at: string;
}

export interface TaskCreatePayload {
  title: string;
  is_important?: boolean;
  due_date?: string | null;
}

export interface TaskUpdatePayload {
  is_done?: boolean;
}
