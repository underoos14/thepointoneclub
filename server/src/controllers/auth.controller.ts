import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import type { SafeUser, UserDoc } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/jwt.js';

function issueAuthResponse(user: UserDoc) {
  return {
    token: signToken({ sub: user._id.toString(), role: user.role }),
    user: user.toSafeJSON() satisfies SafeUser,
  };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError(400, 'Name, email and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError(409, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, passwordHash: password });
  res.status(201).json(issueAuthResponse(user));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(401, 'Invalid email or password');
  }

  res.json(issueAuthResponse(user));
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }
  res.json({ user: req.user.toSafeJSON() });
});
