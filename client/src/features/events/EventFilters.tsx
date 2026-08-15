import { useEffect, useState } from 'react';
import type { EventFilters } from '../../types';
import { CATEGORIES, STATUS_TABS } from './event.constants';

const inputClass =
  'w-full rounded-sm border border-ink/15 bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-green-700 focus:ring-2 focus:ring-green-700/20';

export function EventFilters({
  filters,
  setFilter,
}: {
  filters: EventFilters;
  setFilter: (patch: Partial<EventFilters>) => void;
}) {
  const [query, setQuery] = useState(filters.q);

  useEffect(() => {
    const t = setTimeout(() => {
      if (query !== filters.q) setFilter({ q: query });
    }, 350);
    return () => clearTimeout(t);
  }, [query, filters.q, setFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {STATUS_TABS.map((tab) => {
          const active = filters.status === tab.value;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter({ status: tab.value })}
              className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                active
                  ? 'bg-green-700 text-white'
                  : 'bg-surface text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <input
            id="event-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events…"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="event-category" className="sr-only">
            Category
          </label>
          <select
            id="event-category"
            value={filters.category}
            onChange={(e) => setFilter({ category: e.target.value })}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All categories' : c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="event-from" className="sr-only">
            From date
          </label>
          <input
            id="event-from"
            type="date"
            value={filters.from}
            onChange={(e) => setFilter({ from: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="event-to" className="sr-only">
            To date
          </label>
          <input
            id="event-to"
            type="date"
            value={filters.to}
            onChange={(e) => setFilter({ to: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
