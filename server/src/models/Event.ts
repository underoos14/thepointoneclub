import mongoose, { FilterQuery, HydratedDocument, Model, Types } from 'mongoose';

const { Schema } = mongoose;

export const EVENT_CATEGORIES = [
  'Run Club',
  'Strength',
  'Yoga',
  'Trek',
  'Hybrid',
  'Workshop',
  'Other',
];

export type EventStatus = 'upcoming' | 'ongoing' | 'past';

export interface IEvent {
  title: string;
  tagline: string;
  description: string;
  category: string;
  images: string[];
  startDate: Date;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    mapsUrl: string;
  };
  registrationFee: {
    amount: number;
    currency: string;
    url: string;
  };
  capacity?: number;
  thingsToBring: string[];
  dos: string[];
  donts: string[];
  contacts: Array<{
    name?: string;
    role?: string;
    phone?: string;
    email?: string;
  }>;
  createdBy?: Types.ObjectId;
}

export interface EventAPI {
  id: Types.ObjectId;
  title: string;
  tagline: string;
  description: string;
  category: string;
  images: string[];
  startDate: Date;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  location: IEvent['location'];
  registrationFee: IEvent['registrationFee'];
  capacity?: number;
  thingsToBring: string[];
  dos: string[];
  donts: string[];
  contacts: IEvent['contacts'];
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventMethods {
  toAPI(): EventAPI;
}

export type EventDoc = HydratedDocument<IEvent, EventMethods> & {
  createdAt?: Date;
  updatedAt?: Date;
  status?: EventStatus;
};

type EventModel = Model<IEvent, {}, EventMethods, {}, EventDoc>;

const contactSchema = new Schema(
  {
    name: { type: String, trim: true },
    role: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  { _id: false }
);

const eventSchema = new Schema<IEvent, EventModel, EventMethods, {}, {}, {}, EventDoc>(
  {
    title: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true, default: '' },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: EVENT_CATEGORIES,
      default: 'Run Club',
    },
    images: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    startTime: { type: String, trim: true, default: '' },
    endTime: { type: String, trim: true, default: '' },
    location: {
      name: { type: String, trim: true, default: '' },
      address: { type: String, trim: true, default: '' },
      mapsUrl: { type: String, trim: true, default: '' },
    },
    registrationFee: {
      amount: { type: Number, default: 0, min: 0 },
      currency: { type: String, default: 'INR', trim: true },
      url: { type: String, trim: true, default: '' },
    },
    capacity: { type: Number, min: 0 },
    thingsToBring: [{ type: String, trim: true }],
    dos: [{ type: String, trim: true }],
    donts: [{ type: String, trim: true }],
    contacts: [contactSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

eventSchema.index({ startDate: 1 });
eventSchema.index({ endDate: 1 });
eventSchema.index({ category: 1 });

const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const endOfToday = (): Date => {
  const start = startOfToday();
  return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
};

export { startOfToday, endOfToday };

eventSchema.virtual('status').get(function getStatus(this: EventDoc): EventStatus {
  const todayStart = startOfToday();
  const todayEnd = endOfToday();
  const effectiveEnd = this.endDate ?? this.startDate;

  if (effectiveEnd < todayStart) return 'past';
  if (this.startDate >= todayEnd) return 'upcoming';
  return 'ongoing';
});

eventSchema.methods.toAPI = function toAPI(this: EventDoc): EventAPI {
  return {
    id: this._id,
    title: this.title,
    tagline: this.tagline,
    description: this.description,
    category: this.category,
    images: this.images,
    startDate: this.startDate,
    endDate: this.endDate,
    startTime: this.startTime,
    endTime: this.endTime,
    location: this.location,
    registrationFee: this.registrationFee,
    capacity: this.capacity,
    thingsToBring: this.thingsToBring,
    dos: this.dos,
    donts: this.donts,
    contacts: this.contacts,
    status: this.status!,
    createdAt: this.createdAt!,
    updatedAt: this.updatedAt!,
  };
};

eventSchema.set('toJSON', { virtuals: true });

export const Event = mongoose.model<IEvent, EventModel>('Event', eventSchema);

export function statusQuery(status: string): FilterQuery<IEvent> {
  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  switch (status) {
    case 'upcoming':
      return { startDate: { $gte: todayEnd } };
    case 'past':
      return {
        $or: [
          { endDate: { $ne: null, $lt: todayStart } },
          { endDate: null, startDate: { $lt: todayStart } },
        ],
      };
    case 'ongoing':
      return {
        startDate: { $lt: todayEnd },
        $or: [
          { endDate: { $ne: null, $gte: todayStart } },
          { endDate: null, startDate: { $gte: todayStart } },
        ],
      };
    default:
      return {};
  }
}
