export type EventStatus = 'upcoming' | 'ongoing' | 'past';

export interface Location {
  name: string;
  address: string;
  mapsUrl: string;
}

export interface RegistrationFee {
  amount: number;
  currency: string;
  url: string;
}

export interface Contact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  images: string[];
  startDate: string;
  endDate: string | null;
  startTime: string;
  endTime: string;
  location: Location;
  registrationFee: RegistrationFee;
  capacity?: number;
  thingsToBring: string[];
  dos: string[];
  donts: string[];
  contacts: Contact[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  title: string;
  tagline: string;
  description: string;
  category: string;
  images: string[];
  startDate: string | null;
  endDate: string | null;
  startTime: string;
  endTime: string;
  location: Location;
  registrationFee: RegistrationFee;
  capacity?: number;
  thingsToBring: string[];
  dos: string[];
  donts: string[];
  contacts: Contact[];
}

export interface EventFilters {
  status: string;
  category: string;
  from: string;
  to: string;
  q: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventsResponse {
  events: ClubEvent[];
  pagination: Pagination;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export type RegistrationStatus = 'registered' | 'cancelled';

export interface Registration {
  id: string;
  status: RegistrationStatus;
  registeredAt: string;
  event: ClubEvent;
}

export interface MyRegistrationsResponse {
  registrations: Registration[];
}
