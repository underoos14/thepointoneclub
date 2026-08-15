import type { EventFilters } from '../../types';

export const CATEGORIES = [
  'All',
  'Run Club',
  'Strength',
  'Yoga',
  'Trek',
  'Hybrid',
  'Workshop',
  'Other',
];

export const STATUS_TABS = [
  { value: 'all', label: 'All events' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'past', label: 'Past' },
];

export const DEFAULT_FILTERS: EventFilters = {
  status: 'all',
  category: 'All',
  from: '',
  to: '',
  q: '',
};
