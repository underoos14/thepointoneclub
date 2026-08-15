import bcrypt from 'bcryptjs';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

export interface SafeUser {
  id: Types.ObjectId;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
  toSafeJSON(): SafeUser;
}

export type UserDoc = HydratedDocument<IUser, UserMethods> & {
  createdAt?: Date;
  updatedAt?: Date;
};

type UserModel = Model<IUser, {}, UserMethods, {}, UserDoc>;

const userSchema = new mongoose.Schema<IUser, UserModel, UserMethods, {}, {}, {}, UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email'],
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(this: UserDoc) {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

userSchema.methods.comparePassword = function comparePassword(
  this: UserDoc,
  candidate: string
) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.methods.toSafeJSON = function toSafeJSON(this: UserDoc): SafeUser {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt!,
  };
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
