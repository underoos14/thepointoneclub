import type { ReactNode } from 'react';
import type { ClubEvent } from '../../types';
import { Button } from '../../components/Button';
import { CategoryTag, StatusBadge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  CrossIcon,
  ExternalIcon,
  MapPinIcon,
  PriceIcon,
} from '../../components/icons';
import { formatDateRange, formatFee, formatTime } from '../../utils/format';

function MetaRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-sm text-ink-muted">
      {icon}
      {children}
    </span>
  );
}

function ListBlock({ title, items, tone = 'check' }: { title: string; items?: string[]; tone?: 'check' | 'cross' }) {
  if (!items?.length) return null;
  const Icon = tone === 'check' ? CheckIcon : CrossIcon;
  const iconClass =
    tone === 'check' ? 'text-green-700' : 'text-red-500';
  return (
    <div>
      <h4 className="display-heading text-lg text-ink">{title}</h4>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EventModal({ event, onClose }: { event: ClubEvent | null; onClose: () => void }) {
  if (!event) return null;

  const {
    title,
    description,
    category,
    images,
    status,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    registrationFee,
    thingsToBring,
    dos,
    donts,
    contacts,
  } = event;

  const cover = images?.[0];
  const fee = formatFee(registrationFee);
  const registerUrl = registrationFee?.url;

  return (
    <Modal open onClose={onClose} labelledBy="event-modal-title" maxWidth="max-w-3xl">
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close event details"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-white transition-colors hover:bg-ink"
        >
          <CloseIcon />
        </button>

        <div className="relative h-64 w-full overflow-hidden bg-green-900 sm:h-80">
          {cover ? (
            <img src={cover} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-6">
              <p className="display-heading text-3xl text-paper/70">{title}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
            <h2 id="event-modal-title" className="display-heading text-3xl leading-tight text-white sm:text-4xl">
              {title}
            </h2>
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <CategoryTag label={category} className="tracking-[0.22em]" />
            <MetaRow icon={<CalendarIcon />}>{formatDateRange(startDate, endDate)}</MetaRow>
            {(startTime || endTime) && (
              <MetaRow icon={<ClockIcon />}>
                {formatTime(startTime)}
                {endTime ? ` – ${formatTime(endTime)}` : ''}
              </MetaRow>
            )}
            <MetaRow icon={<PriceIcon />}>
              <span className={`font-semibold ${fee === 'Free' ? 'text-green-700' : 'text-ink'}`}>{fee}</span>
            </MetaRow>
          </div>

          {description && <p className="whitespace-pre-line leading-relaxed text-ink">{description}</p>}

          {location && (location.name || location.address || location.mapsUrl) && (
            <div className="rounded-lg bg-paper p-4">
              <MetaRow icon={<MapPinIcon />}>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-ink">{location.name || 'Venue'}</span>
                  {location.address && <span>{location.address}</span>}
                  {location.mapsUrl && (
                    <a
                      href={location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-900"
                    >
                      Get directions <ExternalIcon />
                    </a>
                  )}
                </div>
              </MetaRow>
            </div>
          )}

          <div className="grid gap-8 border-t border-ink/10 pt-6 sm:grid-cols-2">
            <ListBlock title="Things to bring" items={thingsToBring} tone="check" />
            <div className="flex flex-col gap-8 sm:gap-8">
              <ListBlock title="Do's" items={dos} tone="check" />
              <ListBlock title="Don'ts" items={donts} tone="cross" />
            </div>
          </div>

          {contacts?.length > 0 && (
            <div className="border-t border-ink/10 pt-6">
              <h4 className="display-heading text-lg text-ink">Point of contact</h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {contacts.map((person, idx) => (
                  <div key={idx} className="rounded-lg border border-green-300 bg-paper p-4">
                    <p className="font-semibold text-ink">{person.name}</p>
                    {person.role && <p className="text-sm text-green-700">{person.role}</p>}
                    <div className="mt-2 flex flex-col gap-0.5 text-sm text-ink-muted">
                      {person.phone && <span>{person.phone}</span>}
                      {person.email && (
                        <a href={`mailto:${person.email}`} className="text-green-700 hover:text-green-900">
                          {person.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {registerUrl && (
            <div className="sticky bottom-0 -mx-6 -mb-6 mt-auto flex items-center justify-between gap-4 rounded-b-xl bg-green-900 p-5 sm:-mx-8 sm:-mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-paper/60">Registration</p>
                <p className="font-display text-2xl text-white">
                  {fee}
                  <span className="ml-2 font-body text-sm font-medium text-paper/70">per person</span>
                </p>
              </div>
              <a
                href={registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="primary" size="lg">
                  Register now
                  <ExternalIcon />
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
