import { api } from '../../config/api';
import type { User } from '../../types';

export interface AuthResponse {
  token: string;
  user: User;
}

export async function loginRequest({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post('/api/auth/login', { username, password });
  return data;
}

export async function registerRequest({
  name,
  username,
  email,
  password,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post('/api/auth/register', { name, username, email, password });
  return data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get('/api/auth/me');
  return data.user;
}

export async function checkUsername(username: string): Promise<{ exists: boolean }> {
  const { data } = await api.post('/api/auth/check-username', { username });
  return data;
}
