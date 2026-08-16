import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { AppError } from '../utils/AppError.js';

export const DEMO_COOKIE = 'tp1_demo';

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
}

export function issueDemoCookie(res: Response): void {
  const token = jwt.sign({ demo: true }, env.jwtSecret, {
    expiresIn: env.demoAccessExpiresIn as jwt.SignOptions['expiresIn'],
  });
  const secure = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `${DEMO_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`,
  );
}

export function hasDemoAccess(req: Request): boolean {
  const token = readCookie(req, DEMO_COOKIE);
  if (!token) return false;
  try {
    const payload = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
    return payload.demo === true;
  } catch {
    return false;
  }
}

export function requireDemoAccess(req: Request, _res: Response, next: NextFunction) {
  if (env.demoAccessCode && !hasDemoAccess(req)) {
    return next(new AppError(401, 'Demo access required'));
  }
  next();
}
