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
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    throw new AppError(400, 'Name, username, email and password are required');
  }

  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });
  if (existing) {
    throw new AppError(409, 'An account with this email or username already exists');
  }

  const user = await User.create({ name, username, email, passwordHash: password });
  res.status(201).json(issueAuthResponse(user));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new AppError(400, 'Username and password are required');
  }

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(401, 'Invalid username or password');
  }

  res.json(issueAuthResponse(user));
});

export const checkUsername = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username || typeof username !== 'string') {
    throw new AppError(400, 'Username is required');
  }

  const exists = await User.exists({ username: username.toLowerCase().trim() });
  res.json({ exists: Boolean(exists) });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }
  res.json({ user: req.user.toSafeJSON() });
});
