import { api } from '../../config/api';

export async function fetchDemoStatus(): Promise<boolean> {
  try {
    const { data } = await api.get('/api/demo/status');
    return data.ok === true;
  } catch {
    return false;
  }
}

export async function verifyDemoAccess(code: string): Promise<void> {
  await api.post('/api/demo/verify', { code });
}
