import { api } from '../../config/api';
import type { MyRegistrationsResponse, Registration } from '../../types';

export async function registerForEvent(eventId: string): Promise<Registration> {
  const { data } = await api.post('/api/registrations', { eventId });
  return data.registration;
}

export async function fetchMyRegistrations(): Promise<Registration[]> {
  const { data } = await api.get<MyRegistrationsResponse>('/api/registrations/mine');
  return data.registrations;
}

export async function cancelRegistration(registrationId: string): Promise<Registration> {
  const { data } = await api.delete(`/api/registrations/${registrationId}`);
  return data.registration;
}
