import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';

interface ErrorWithStatus extends Error {
  status?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, 'Route not found'));
}

export function errorHandler(err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.status ? err.message : 'Something went wrong on the server';

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors ?? {}).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier' });
  }

  if (status >= 500) {
    console.error('[error]', err);
  }

  res.status(status).json({ message });
}
