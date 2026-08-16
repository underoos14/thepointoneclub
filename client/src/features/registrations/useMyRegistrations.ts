import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Registration } from '../../types';
import { useAuth } from '../auth/AuthContext';
import { fetchMyRegistrations } from './registrations.api';

export function useMyRegistrations() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setRegistrations([]);
      return;
    }
    setLoading(true);
    try {
      setRegistrations(await fetchMyRegistrations());
    } catch {
      // Keep whatever we had; callers surface errors through their own UI.
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const registeredIds = useMemo(
    () => new Set(registrations.map((r) => r.event.id)),
    [registrations]
  );

  return { registrations, loading, refresh, registeredIds };
}
