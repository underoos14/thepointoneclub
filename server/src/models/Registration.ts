import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

export type RegistrationStatus = 'registered' | 'cancelled';

export interface IRegistration {
  user: Types.ObjectId;
  event: Types.ObjectId;
  status: RegistrationStatus;
  registeredAt: Date;
  cancelledAt: Date | null;
}

export interface RegistrationAPI {
  id: Types.ObjectId;
  eventId: Types.ObjectId;
  status: RegistrationStatus;
  registeredAt: Date;
}

export interface RegistrationMethods {
  toAPI(): RegistrationAPI;
}

export type RegistrationDoc = HydratedDocument<IRegistration, RegistrationMethods> & {
  createdAt?: Date;
  updatedAt?: Date;
};

type RegistrationModel = Model<IRegistration, {}, RegistrationMethods, {}, RegistrationDoc>;

const registrationSchema = new mongoose.Schema<
  IRegistration,
  RegistrationModel,
  RegistrationMethods,
  {},
  {},
  {},
  RegistrationDoc
>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    status: {
      type: String,
      enum: ['registered', 'cancelled'],
      default: 'registered',
    },
    registeredAt: { type: Date, default: () => new Date() },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

registrationSchema.index({ user: 1, event: 1 });
registrationSchema.index({ event: 1, status: 1 });

registrationSchema.methods.toAPI = function toAPI(this: RegistrationDoc): RegistrationAPI {
  return {
    id: this._id,
    eventId: this.event,
    status: this.status,
    registeredAt: this.registeredAt,
  };
};

export const Registration = mongoose.model<IRegistration, RegistrationModel>(
  'Registration',
  registrationSchema
);
