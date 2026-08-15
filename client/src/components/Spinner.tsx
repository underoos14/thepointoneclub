export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-ink-muted">
      <Spinner className="h-8 w-8 text-green-700" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-green-300 bg-surface px-6 py-16 text-center">
      <p className="display-heading text-2xl text-ink">{title}</p>
      {message && <p className="max-w-sm text-sm text-ink-muted">{message}</p>}
    </div>
  );
}
