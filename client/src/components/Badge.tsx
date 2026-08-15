import type { EventStatus } from '../types';

const STATUS_STYLES: Record<EventStatus, string> = {
  upcoming: 'bg-green-100 text-green-700',
  ongoing: 'bg-green-700 text-white',
  past: 'bg-black/10 text-ink-muted',
};

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
        STATUS_STYLES[status]
      }`}
    >
      {status}
    </span>
  );
}

export function CategoryTag({ label, className = '' }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-block text-[11px] font-semibold uppercase text-green-700 ${className}`}
    >
      {label}
    </span>
  );
}
