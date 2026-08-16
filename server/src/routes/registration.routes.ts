import { Router } from 'express';
import * as registrations from '../controllers/registration.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, registrations.registerForEvent);
router.get('/mine', authenticate, registrations.myRegistrations);
router.delete('/:id', authenticate, registrations.cancelRegistration);

export default router;
