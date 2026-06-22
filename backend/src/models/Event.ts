export interface Event {
  id: number;
  user_id: number;
  title: string;
  event_type: string;
  event_date: string;
  detail: string | null;
  created_at: string;
}

export interface EventCreatePayload {
  title: string;
  event_type?: string;
  event_date: string;
  detail?: string;
}
