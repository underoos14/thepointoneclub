import { useMemo, useState } from 'react';
import type { ClubEvent } from '../../types';
import { Button } from '../../components/Button';
import { ArrowRightIcon } from '../../components/icons';
import { EmptyState, PageLoader, Spinner } from '../../components/Spinner';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';
import { EventModal } from './EventModal';
import { useEvents } from './useEvents';

export function EventsPage() {
  const {
    filters,
    setFilter,
    events,
    pagination,
    loading,
    loadingMore,
    error,
    loadMore,
  } = useEvents();

  const [selected, setSelected] = useState<ClubEvent | null>(null);

  const hasActiveFilters = useMemo(
    () => filters.status !== 'all' || filters.category !== 'All' || filters.from || filters.to || filters.q,
    [filters]
  );

  const hasMore = pagination && pagination.page < pagination.totalPages;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-paper">
        <div className="container-site py-20 sm:py-28">
          <h1 className="display-heading max-w-4xl text-5xl leading-[0.95] text-ink sm:text-7xl">
            The 1% is crowded<span className="text-red-500">.</span>
            <br />
            We&rsquo;re looking for the
            <span className="text-green-700"> fraction</span>
            <span className="text-red-500">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            Runs, treks, strength and yoga across Hyderabad. Physical endurance is the entry point.
            Show up once, and we&rsquo;ll take care of the mindset.
          </p>
          <a href="#events" className="mt-8 inline-flex">
            <Button variant="secondary" size="lg">
              See upcoming events
              <ArrowRightIcon />
            </Button>
          </a>
        </div>
      </section>

      {/* Motto */}
      <section id="motto" className="bg-green-900">
        <div className="container-site py-16 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-green-300">
            Our motto
          </p>
          <blockquote className="max-w-3xl text-lg leading-relaxed text-paper sm:text-xl">
            This isn&rsquo;t just a run club, and this definitely isn&rsquo;t just about fitness.
            Physical endurance is simply our entry point — the baseline where we test our
            discipline. The real work happens in the mindset, the ambition, the skill, and the
            relentless drive to elevate every single aspect of our lives.
          </blockquote>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="container-site scroll-mt-20 py-16 sm:py-20">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="display-heading text-4xl text-ink sm:text-5xl">Events</h2>
          <p className="text-ink-muted">
            Pick a session. Bring the discipline. Leave the excuses at home.
          </p>
        </div>

        <EventFilters filters={filters} setFilter={setFilter} />

        <div className="mt-10">
          {loading ? (
            <PageLoader label="Finding your next session…" />
          ) : error ? (
            <EmptyState title="Something broke." message={error} />
          ) : events.length === 0 ? (
            <EmptyState
              title={hasActiveFilters ? 'No events match.' : 'Nothing scheduled yet.'}
              message={
                hasActiveFilters
                  ? 'Try widening your filters or clearing the date range.'
                  : 'New sessions are being lined up. Check back soon.'
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} onOpen={setSelected} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <Button variant="outline" size="lg" onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Loading…
                      </>
                    ) : (
                      'Load more events'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <EventModal event={selected} onClose={() => setSelected(null)} />
    </>
  );
}
