import { useState } from 'react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import type { ClubEvent, Contact, EventInput, Location } from '../../types';
import { Button } from '../../components/Button';
import { Field, FieldList, Select, TextArea, TextField } from '../../components/Field';
import { CATEGORIES } from '../events/event.constants';

const EMPTY_CONTACT: Contact = { name: '', role: '', phone: '', email: '' };

interface EventFormState {
  title: string;
  tagline: string;
  description: string;
  category: string;
  images: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: Location;
  registrationFee: { amount: number | string; currency: string; url: string };
  capacity: string;
  thingsToBring: string[];
  dos: string[];
  donts: string[];
  contacts: Contact[];
}

function emptyForm(): EventFormState {
  return {
    title: '',
    tagline: '',
    description: '',
    category: 'Run Club',
    images: [''],
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: { name: '', address: '', mapsUrl: '' },
    registrationFee: { amount: 0, currency: 'INR', url: '' },
    capacity: '',
    thingsToBring: [''],
    dos: [''],
    donts: [''],
    contacts: [{ ...EMPTY_CONTACT }],
  };
}

function shapeForServer(f: EventFormState): EventInput {
  return {
    title: f.title.trim(),
    tagline: f.tagline.trim(),
    description: f.description.trim(),
    category: f.category,
    images: f.images.map((s) => s.trim()).filter(Boolean),
    startDate: f.startDate ? new Date(f.startDate).toISOString() : null,
    endDate: f.endDate ? new Date(f.endDate).toISOString() : null,
    startTime: f.startTime,
    endTime: f.endTime,
    location: {
      name: f.location.name.trim(),
      address: f.location.address.trim(),
      mapsUrl: f.location.mapsUrl.trim(),
    },
    registrationFee: {
      amount: Number(f.registrationFee.amount) || 0,
      currency: f.registrationFee.currency.trim() || 'INR',
      url: f.registrationFee.url.trim(),
    },
    capacity: f.capacity ? Number(f.capacity) : undefined,
    thingsToBring: f.thingsToBring.map((s) => s.trim()).filter(Boolean),
    dos: f.dos.map((s) => s.trim()).filter(Boolean),
    donts: f.donts.map((s) => s.trim()).filter(Boolean),
    contacts: f.contacts
      .filter((c) => c.name.trim())
      .map((c) => ({
        name: c.name.trim(),
        role: c.role.trim(),
        phone: c.phone.trim(),
        email: c.email.trim(),
      })),
  };
}

function shapeFromServer(e: ClubEvent): EventFormState {
  const isoDate = (v?: string | null) => (v ? v.slice(0, 10) : '');
  return {
    title: e.title || '',
    tagline: e.tagline || '',
    description: e.description || '',
    category: e.category || 'Run Club',
    images: e.images?.length ? e.images : [''],
    startDate: isoDate(e.startDate),
    endDate: isoDate(e.endDate),
    startTime: e.startTime || '',
    endTime: e.endTime || '',
    location: {
      name: e.location?.name || '',
      address: e.location?.address || '',
      mapsUrl: e.location?.mapsUrl || '',
    },
    registrationFee: {
      amount: e.registrationFee?.amount ?? 0,
      currency: e.registrationFee?.currency || 'INR',
      url: e.registrationFee?.url || '',
    },
    capacity: e.capacity != null ? String(e.capacity) : '',
    thingsToBring: e.thingsToBring?.length ? e.thingsToBring : [''],
    dos: e.dos?.length ? e.dos : [''],
    donts: e.donts?.length ? e.donts : [''],
    contacts: e.contacts?.length ? e.contacts : [{ ...EMPTY_CONTACT }],
  };
}

function ContactFields({
  contacts,
  onChange,
}: {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}) {
  const update = (idx: number, patch: Partial<Contact>) => {
    onChange(contacts.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };
  const remove = (idx: number) => onChange(contacts.filter((_, i) => i !== idx));

  return (
    <Field label="Point of contact" hint="Only entries with a name are saved.">
      <div className="flex flex-col gap-4">
        {contacts.map((contact, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 gap-2 rounded-lg border border-ink/10 bg-paper p-3 sm:grid-cols-2"
          >
            <TextField
              label="Name"
              value={contact.name}
              onChange={(e) => update(idx, { name: e.target.value })}
            />
            <TextField
              label="Role"
              value={contact.role}
              onChange={(e) => update(idx, { role: e.target.value })}
            />
            <TextField
              label="Phone"
              value={contact.phone}
              onChange={(e) => update(idx, { phone: e.target.value })}
            />
            <TextField
              label="Email"
              value={contact.email}
              onChange={(e) => update(idx, { email: e.target.value })}
            />
            {contacts.length > 1 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                className="justify-self-end rounded-sm border border-red-500 px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white sm:col-span-2"
              >
                Remove contact
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...contacts, { ...EMPTY_CONTACT }])}
          className="self-start rounded-sm border border-green-700 px-3 py-1.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100"
        >
          + Add contact
        </button>
      </div>
    </Field>
  );
}

export function EventForm({
  initialEvent,
  onSubmit,
  submitting,
  submitLabel,
}: {
  initialEvent: ClubEvent | null;
  onSubmit: (payload: EventInput) => void | Promise<void>;
  submitting: boolean;
  submitLabel: string;
}) {
  const [form, setForm] = useStateFrom(initialEvent);
  const set = (patch: Partial<EventFormState>) => setForm((f) => ({ ...f, ...patch }));
  const setNested =
    (key: 'location' | 'registrationFee') =>
    (patch: Partial<EventFormState[typeof key]>) =>
      setForm((f) => ({ ...f, [key]: { ...f[key], ...patch } }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(shapeForServer(form));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 rounded-xl bg-surface p-6 shadow-card">
        <h3 className="display-heading text-xl text-ink">Basics</h3>
        <TextField
          id="title"
          label="Title"
          required
          value={form.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="5K Dawn Run — Tank Bund"
        />
        <TextField
          id="tagline"
          label="Tagline"
          value={form.tagline}
          onChange={(e) => set({ tagline: e.target.value })}
          placeholder="Start the day faster than yesterday."
        />
        <TextArea
          id="description"
          label="Description"
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
        />
        <Select
          id="category"
          label="Category"
          value={form.category}
          onChange={(e) => set({ category: e.target.value })}
        >
          {CATEGORIES.filter((c) => c !== 'All').map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <FieldList
          label="Images (URLs)"
          values={form.images}
          onChange={(images) => set({ images })}
          placeholder="https://…/photo.jpg"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl bg-surface p-6 shadow-card sm:grid-cols-2">
        <h3 className="display-heading col-span-full text-xl text-ink">Schedule</h3>
        <TextField
          id="startDate"
          label="Start date"
          type="date"
          required
          value={form.startDate}
          onChange={(e) => set({ startDate: e.target.value })}
        />
        <TextField
          id="endDate"
          label="End date"
          type="date"
          value={form.endDate}
          onChange={(e) => set({ endDate: e.target.value })}
          hint="Leave blank for a single-day event."
        />
        <TextField
          id="startTime"
          label="Start time"
          type="time"
          value={form.startTime}
          onChange={(e) => set({ startTime: e.target.value })}
        />
        <TextField
          id="endTime"
          label="End time"
          type="time"
          value={form.endTime}
          onChange={(e) => set({ endTime: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl bg-surface p-6 shadow-card">
        <h3 className="display-heading text-xl text-ink">Location</h3>
        <TextField
          id="locationName"
          label="Venue name"
          value={form.location.name}
          onChange={(e) => setNested('location')({ name: e.target.value })}
          placeholder="Tank Bund Steps"
        />
        <TextField
          id="locationAddress"
          label="Address"
          value={form.location.address}
          onChange={(e) => setNested('location')({ address: e.target.value })}
        />
        <TextField
          id="mapsUrl"
          label="Maps link"
          value={form.location.mapsUrl}
          onChange={(e) => setNested('location')({ mapsUrl: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl bg-surface p-6 shadow-card sm:grid-cols-3">
        <h3 className="display-heading col-span-full text-xl text-ink">Registration</h3>
        <TextField
          id="feeAmount"
          label="Fee amount (₹)"
          type="number"
          min="0"
          value={form.registrationFee.amount}
          onChange={(e) => setNested('registrationFee')({ amount: e.target.value })}
          hint="0 = free."
        />
        <TextField
          id="feeCurrency"
          label="Currency"
          value={form.registrationFee.currency}
          onChange={(e) => setNested('registrationFee')({ currency: e.target.value })}
        />
        <TextField
          id="capacity"
          label="Capacity"
          type="number"
          min="1"
          value={form.capacity}
          onChange={(e) => set({ capacity: e.target.value })}
        />
        <TextField
          id="registerUrl"
          label="Registration link"
          className="sm:col-span-3"
          value={form.registrationFee.url}
          onChange={(e) => setNested('registrationFee')({ url: e.target.value })}
          placeholder="https://…/register"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 rounded-xl bg-surface p-6 shadow-card">
        <h3 className="display-heading text-xl text-ink">Details &amp; rules</h3>
        <FieldList
          label="Things to bring"
          values={form.thingsToBring}
          onChange={(thingsToBring) => set({ thingsToBring })}
          placeholder="Running shoes"
        />
        <FieldList
          label="Do's"
          values={form.dos}
          onChange={(dos) => set({ dos })}
          placeholder="Arrive 15 minutes early"
        />
        <FieldList
          label="Don'ts"
          values={form.donts}
          onChange={(donts) => set({ donts })}
          placeholder="No headphones on the run"
        />
        <ContactFields contacts={form.contacts} onChange={(contacts) => set({ contacts })} />
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button variant="secondary" size="lg" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function useStateFrom(
  initialEvent: ClubEvent | null
): [EventFormState, Dispatch<SetStateAction<EventFormState>>] {
  const [state, setState] = useState<EventFormState>(() =>
    initialEvent ? shapeFromServer(initialEvent) : emptyForm()
  );
  return [state, setState];
}
