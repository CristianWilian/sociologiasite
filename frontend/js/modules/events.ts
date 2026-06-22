import { apiRequest } from './api';

export interface Event {
  id: number;
  user_id: number;
  title: string;
  event_type: string;
  event_date: string;
  detail: string | null;
  created_at: string;
}

let eventsCache: Event[] = [];

export async function loadEvents(): Promise<Event[]> {
  eventsCache = await apiRequest<Event[]>('events_list');
  return eventsCache;
}

export async function addEvent(
  title: string,
  eventDate: string,
  eventType: string = 'Evento',
  detail: string | null = null
): Promise<Event> {
  const event = await apiRequest<Event>('events_add', {
    method: 'POST',
    payload: { title, event_date: eventDate, event_type: eventType, detail },
  });
  eventsCache.push(event);
  return event;
}

export async function deleteEvent(id: number): Promise<void> {
  await apiRequest('events_delete', {
    method: 'POST',
    payload: { id },
  });
  eventsCache = eventsCache.filter((e) => e.id !== id);
}

export async function clearAllEvents(): Promise<void> {
  await apiRequest('events_clear', { method: 'POST' });
  eventsCache = [];
}

export function getEventsCache(): Event[] {
  return eventsCache;
}

export function getEventsForMonth(year: number, month: number): Event[] {
  return eventsCache.filter((e) => {
    const eventDate = new Date(e.event_date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
}

export function getEventsForDate(dateStr: string): Event[] {
  return eventsCache.filter((e) => e.event_date === dateStr);
}

export function hasEventsInRange(startDate: Date, endDate: Date): boolean {
  return eventsCache.some((e) => {
    const eventDate = new Date(e.event_date);
    return eventDate >= startDate && eventDate <= endDate;
  });
}
