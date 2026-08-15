import { api } from '../../config/api';
import type { ClubEvent, EventInput, EventsResponse } from '../../types';

export async function fetchEvents(params: Record<string, string | number>): Promise<EventsResponse> {
  const { data } = await api.get('/api/events', { params });
  return data;
}

export async function fetchEvent(id: string): Promise<ClubEvent> {
  const { data } = await api.get(`/api/events/${id}`);
  return data.event;
}

export async function createEvent(payload: EventInput): Promise<ClubEvent> {
  const { data } = await api.post('/api/events', payload);
  return data.event;
}

export async function updateEvent(id: string, payload: EventInput): Promise<ClubEvent> {
  const { data } = await api.put(`/api/events/${id}`, payload);
  return data.event;
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/api/events/${id}`);
}
