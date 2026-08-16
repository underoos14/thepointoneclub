import { Router } from 'express';
import * as auth from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/check-username', auth.checkUsername);
router.get('/me', authenticate, auth.me);

export default router;
