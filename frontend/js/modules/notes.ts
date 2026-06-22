import { apiRequest } from './api';

export interface Note {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
}

let notesCache: Note[] = [];

export async function loadNotes(): Promise<Note[]> {
  notesCache = await apiRequest<Note[]>('notes_list');
  return notesCache;
}

export async function addNote(content: string): Promise<Note> {
  const note = await apiRequest<Note>('notes_add', {
    method: 'POST',
    payload: { content },
  });
  notesCache.unshift(note);
  return note;
}

export async function deleteNote(id: number): Promise<void> {
  await apiRequest('notes_delete', {
    method: 'POST',
    payload: { id },
  });
  notesCache = notesCache.filter((n) => n.id !== id);
}

export async function clearAllNotes(): Promise<void> {
  await apiRequest('notes_clear', { method: 'POST' });
  notesCache = [];
}

export function getNotesCache(): Note[] {
  return notesCache;
}

export function searchNotes(query: string): Note[] {
  const lowerQuery = query.toLowerCase();
  return notesCache.filter((n) => n.content.toLowerCase().includes(lowerQuery));
}
