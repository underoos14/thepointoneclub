import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { ClubEvent, EventInput } from '../../types';
import { PageLoader } from '../../components/Spinner';
import { getErrorMessage } from '../../config/api';
import { createEvent, fetchEvent, updateEvent } from '../events/events.api';
import { EventForm } from './EventForm';

export function EventFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [initial, setInitial] = useState<ClubEvent | null>(null);
  const [loading, setLoading] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing || !id) return;
    let active = true;
    fetchEvent(id)
      .then((event) => active && setInitial(event))
      .catch((err) => active && setError(getErrorMessage(err, 'Could not load event.')))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [editing, id]);

  async function handleSubmit(payload: EventInput) {
    setSubmitting(true);
    setError('');
    try {
      if (editing && id) {
        await updateEvent(id, payload);
      } else {
        await createEvent(payload);
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save the event.'));
      setSubmitting(false);
    }
  }

  return (
    <div className="container-site max-w-3xl py-12">
      <Link to="/admin" className="text-sm font-semibold text-green-700 hover:text-green-900">
        ← Back to dashboard
      </Link>
      <h1 className="display-heading mt-4 text-4xl text-ink">
        {editing ? 'Edit event' : 'New event'}
      </h1>
      <p className="mt-2 text-ink-muted">
        {editing ? 'Update the details below — changes go live immediately.' : 'Add the next session to the calendar.'}
      </p>

      <div className="mt-8">
        {loading ? (
          <PageLoader label="Loading event…" />
        ) : error && !initial ? (
          <p className="rounded-sm bg-red-100 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
        ) : (
          <>
            {error && (
              <p className="mb-4 rounded-sm bg-red-100 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </p>
            )}
            <EventForm
              key={editing ? id : 'new'}
              initialEvent={initial}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitLabel={editing ? 'Save changes' : 'Create event'}
            />
          </>
        )}
      </div>
    </div>
  );
}
