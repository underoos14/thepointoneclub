import { Router } from 'express';
import * as events from '../controllers/event.controller.js';
import { adminOnly, authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', events.listEvents);
router.get('/:id', events.getEvent);
router.post('/', authenticate, adminOnly, events.createEvent);
router.put('/:id', authenticate, adminOnly, events.updateEvent);
router.delete('/:id', authenticate, adminOnly, events.deleteEvent);

export default router;
