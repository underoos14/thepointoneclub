import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ClubEvent } from '../../types';
import { Button } from '../../components/Button';
import { CategoryTag, StatusBadge } from '../../components/Badge';
import { PageLoader } from '../../components/Spinner';
import { getErrorMessage } from '../../config/api';
import { formatDateShort } from '../../utils/format';
import { deleteEvent, fetchEvents } from '../events/events.api';

function EventRow({
  event,
  onDelete,
}: {
  event: ClubEvent;
  onDelete: (event: ClubEvent) => void;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-3 rounded-xl bg-surface p-4 shadow-card sm:grid-cols-[2fr_auto_auto_auto] sm:gap-4">
      <div className="min-w-0">
        <p className="display-heading truncate text-lg leading-tight text-ink">{event.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <CategoryTag label={event.category} className="tracking-[0.12em]" />
          <span className="text-sm text-ink-muted">
            {formatDateShort(event.startDate)}
            {event.endDate ? ` – ${formatDateShort(event.endDate)}` : ''}
          </span>
        </div>
      </div>

      <span className="justify-self-start sm:justify-self-end">
        <StatusBadge status={event.status} />
      </span>

      <div className="flex items-center gap-2 justify-self-start sm:justify-self-end">
        <Link to={`/admin/events/${event.id}/edit`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
        <Button variant="dangerOutline" size="sm" onClick={() => onDelete(event)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(q) || event.category.toLowerCase().includes(q)
    );
  }, [events, query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchEvents({ limit: 100 });
      setEvents(data.events);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load events.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(event: ClubEvent) {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    try {
      await deleteEvent(event.id);
      await load();
    } catch (err) {
      alert(getErrorMessage(err, 'Could not delete the event.'));
    }
  }

  return (
    <div className="container-site py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-heading text-4xl text-ink">Admin</h1>
          <p className="mt-2 text-ink-muted">Manage every event on the calendar.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="admin-event-search" className="sr-only">
            Search events
          </label>
          <input
            id="admin-event-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events…"
            className="w-full rounded-sm border border-ink/15 bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-green-700 focus:ring-2 focus:ring-green-700/20 sm:w-64"
          />
          <Link to="/admin/events/new">
            <Button variant="secondary">+ New event</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {loading ? (
          <PageLoader label="Loading events…" />
        ) : error ? (
          <p className="rounded-sm bg-red-100 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
        ) : events.length === 0 ? (
          <p className="rounded-xl border border-dashed border-green-300 bg-surface px-6 py-16 text-center text-ink-muted">
            No events yet. Create your first one.
          </p>
        ) : filteredEvents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-green-300 bg-surface px-6 py-16 text-center text-ink-muted">
            No events match your search.
          </p>
        ) : (
          filteredEvents.map((event) => (
            <EventRow key={event.id} event={event} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
