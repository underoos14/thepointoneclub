import { useCallback, useEffect, useRef, useState } from 'react';
import type { ClubEvent, EventFilters, Pagination } from '../../types';
import { DEFAULT_FILTERS } from './event.constants';
import { fetchEvents } from './events.api';
import { getErrorMessage } from '../../config/api';

export function useEvents() {
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const run = useCallback(async (params: Record<string, string | number>, mode: 'replace' | 'append') => {
    const id = ++requestId.current;
    if (mode === 'replace') setLoading(true);
    else setLoadingMore(true);
    try {
      const data = await fetchEvents(params);
      if (id !== requestId.current) return;
      setEvents((prev) => (mode === 'append' ? [...prev, ...data.events] : data.events));
      setPagination(data.pagination);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(getErrorMessage(err, 'Could not load events.'));
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    run({ ...filters, page: 1, limit: 9 }, 'replace');
  }, [filters, run]);

  const setFilter = useCallback((patch: Partial<EventFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const loadMore = useCallback(() => {
    if (!pagination || pagination.page >= pagination.totalPages) return;
    run({ ...filters, page: pagination.page + 1, limit: 9 }, 'append');
  }, [pagination, filters, run]);

  return {
    filters,
    setFilter,
    events,
    pagination,
    loading,
    loadingMore,
    error,
    loadMore,
  };
}
