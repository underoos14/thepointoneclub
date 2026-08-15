import { api } from '../../config/api';
import type { User } from '../../types';

export interface AuthResponse {
  token: string;
  user: User;
}

export async function loginRequest({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

export async function registerRequest({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post('/api/auth/register', { name, email, password });
  return data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get('/api/auth/me');
  return data.user;
}
