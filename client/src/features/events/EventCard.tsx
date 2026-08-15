import type { ReactNode } from 'react';
import type { ClubEvent } from '../../types';
import { Button } from '../../components/Button';
import { CategoryTag, StatusBadge } from '../../components/Badge';
import { CalendarIcon, ClockIcon, ExternalIcon, MapPinIcon } from '../../components/icons';
import { formatDateRange, formatFee, formatTime } from '../../utils/format';

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-ink-muted">
      {icon}
      {children}
    </span>
  );
}

export function EventCard({
  event,
  onOpen,
}: {
  event: ClubEvent;
  onOpen: (event: ClubEvent) => void;
}) {
  const { title, category, images, status, startDate, endDate, startTime, endTime, location, registrationFee } = event;
  const cover = images?.[0];
  const fee = formatFee(registrationFee);
  const registerUrl = registrationFee?.url;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-xl shadow-card transition-shadow hover:shadow-modal ${
        status === 'past' ? 'bg-gray-card' : 'bg-surface'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(event)}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-green-900 text-left"
        aria-label={`View details for ${title}`}
      >
        {cover ? (
          <img
            src={cover}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4">
            <p className="display-heading text-2xl text-paper/70">{title}</p>
          </div>
        )}
        <span className="absolute left-3 top-3">
          <StatusBadge status={status} />
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="mb-1.5">
            <CategoryTag label={category} className="tracking-[0.22em]" />
          </div>
          <h3 className="display-heading text-xl leading-tight text-ink">{title}</h3>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-ink/10 pt-3">
          <Meta icon={<CalendarIcon />}>
            {formatDateRange(startDate, endDate)}
          </Meta>
          {(startTime || endTime) && (
            <Meta icon={<ClockIcon />}>
              {formatTime(startTime)}
              {endTime ? ` – ${formatTime(endTime)}` : ''}
            </Meta>
          )}
          {location?.name && <Meta icon={<MapPinIcon />}>{location.name}</Meta>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className={`font-display text-2xl leading-none ${fee === 'Free' ? 'text-green-700' : 'text-ink'}`}>
            {fee}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpen(event)}>
              Details
            </Button>
            {registerUrl && (
              <a
                href={registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="primary" size="sm">
                  Register
                  <ExternalIcon />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
