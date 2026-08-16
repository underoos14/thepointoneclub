import { Router } from 'express';
import type { Request, Response } from 'express';
import { env } from '../config/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { hasDemoAccess, issueDemoCookie } from '../middleware/demoAccess.js';

const router = Router();

router.post(
  '/verify',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body ?? {};
    if (typeof code !== 'string' || !code.trim()) {
      throw new AppError(400, 'Access code is required');
    }
    if (!env.demoAccessCode || code.trim() !== env.demoAccessCode) {
      throw new AppError(401, 'Invalid access code');
    }
    issueDemoCookie(res);
    res.json({ ok: true });
  }),
);

router.get('/status', (_req: Request, res: Response) => {
  res.status(hasDemoAccess(_req) ? 200 : 401).json({ ok: hasDemoAccess(_req) });
});

export default router;
