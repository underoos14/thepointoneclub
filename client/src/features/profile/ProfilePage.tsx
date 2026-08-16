import { useMemo, useState } from 'react';
import type { Registration } from '../../types';
import { Button } from '../../components/Button';
import { CategoryTag, StatusBadge } from '../../components/Badge';
import { EmptyState, PageLoader } from '../../components/Spinner';
import { ExternalIcon } from '../../components/icons';
import { getErrorMessage } from '../../config/api';
import { formatDateRange, formatDateShort, formatFee } from '../../utils/format';
import { useAuth } from '../auth/AuthContext';
import { cancelRegistration } from '../registrations/registrations.api';
import { useMyRegistrations } from '../registrations/useMyRegistrations';

type Tab = 'upcoming' | 'past';

function RegistrationRow({
  registration,
  onCancel,
  busy,
}: {
  registration: Registration;
  onCancel: (registration: Registration) => void;
  busy: boolean;
}) {
  const { event } = registration;
  const fee = formatFee(event.registrationFee);

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryTag label={event.category} className="tracking-[0.12em]" />
          <StatusBadge status={event.status} />
        </div>
        <h3 className="display-heading mt-1 truncate text-xl leading-tight text-ink">{event.title}</h3>
        <div className="mt-1 flex flex-col gap-0.5 text-sm text-ink-muted">
          <span>{formatDateRange(event.startDate, event.endDate)}</span>
          <span>
            Registered {formatDateShort(registration.registeredAt)}
            {fee !== 'Free' && ` · ${fee}`}
          </span>
        </div>
      </div>

      {event.status !== 'past' && (
        <div className="flex shrink-0 items-center gap-2">
          {event.registrationFee?.url && (
            <a
              href={event.registrationFee.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm">
                {fee === 'Free' ? 'Details' : 'Payment link'}
                <ExternalIcon />
              </Button>
            </a>
          )}
          <Button variant="dangerOutline" size="sm" disabled={busy} onClick={() => onCancel(registration)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const { registrations, loading, refresh } = useMyRegistrations();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [cancelling, setCancelling] = useState(false);

  const upcoming = useMemo(
    () => registrations.filter((r) => r.event.status !== 'past'),
    [registrations]
  );
  const past = useMemo(
    () => registrations.filter((r) => r.event.status === 'past'),
    [registrations]
  );

  const active = tab === 'upcoming' ? upcoming : past;

  async function handleCancel(registration: Registration) {
    if (!window.confirm(`Cancel your registration for "${registration.event.title}"?`)) return;
    setCancelling(true);
    try {
      await cancelRegistration(registration.id);
      await refresh();
    } catch (err) {
      alert(getErrorMessage(err, 'Could not cancel the registration.'));
    } finally {
      setCancelling(false);
    }
  }

  if (!user) return null;

  const tabClass = (isActive: boolean) =>
    `rounded-sm px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
      isActive ? 'bg-green-700 text-white' : 'text-ink-muted hover:bg-green-100 hover:text-ink'
    }`;

  return (
    <div className="container-site py-12">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-xl bg-surface p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-700">Profile</p>
          <h1 className="display-heading mt-2 text-4xl leading-tight text-ink">{user.name}</h1>
          <p className="mt-1 text-ink-muted">@{user.username}</p>

          <dl className="mt-6 flex flex-col gap-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Email</dt>
              <dd className="mt-0.5 text-ink">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Member since</dt>
              <dd className="mt-0.5 text-ink">{formatDateShort(user.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Role</dt>
              <dd className="mt-0.5 text-ink">{user.role}</dd>
            </div>
          </dl>
        </aside>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="display-heading text-4xl text-ink">My events</h2>
              <p className="mt-2 text-ink-muted">Everything you’ve signed up for, past and present.</p>
            </div>
            <div className="flex gap-1 rounded-sm bg-paper p-1">
              <button type="button" className={tabClass(tab === 'upcoming')} onClick={() => setTab('upcoming')}>
                Upcoming
              </button>
              <button type="button" className={tabClass(tab === 'past')} onClick={() => setTab('past')}>
                Past
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {loading ? (
              <PageLoader label="Loading your events…" />
            ) : active.length === 0 ? (
              <EmptyState
                title={tab === 'upcoming' ? 'Nothing booked yet.' : 'No history yet.'}
                message={
                  tab === 'upcoming'
                    ? 'Pick a session from the events page and bring the discipline.'
                    : 'Once you’ve run with us, your past events will show up here.'
                }
              />
            ) : (
              active.map((registration) => (
                <RegistrationRow
                  key={registration.id}
                  registration={registration}
                  onCancel={handleCancel}
                  busy={cancelling}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
