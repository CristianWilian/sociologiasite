export interface Note {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface NoteCreatePayload {
  content: string;
}
