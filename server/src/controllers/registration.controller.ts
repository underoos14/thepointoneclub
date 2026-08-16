import type { Request, Response } from 'express';
import { Event } from '../models/Event.js';
import type { EventDoc } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const registerForEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }

  const { eventId } = req.body;
  if (!eventId) {
    throw new AppError(400, 'eventId is required');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  if (event.status === 'past') {
    throw new AppError(400, 'This event has already ended');
  }

  if (event.capacity != null) {
    const activeCount = await Registration.countDocuments({
      event: event._id,
      status: 'registered',
    });
    if (activeCount >= event.capacity) {
      throw new AppError(409, 'This event is full');
    }
  }

  const existing = await Registration.findOne({ user: req.user._id, event: event._id });
  if (existing && existing.status === 'registered') {
    throw new AppError(409, 'You are already registered for this event');
  }

  let registration;
  if (existing) {
    existing.status = 'registered';
    existing.registeredAt = new Date();
    existing.cancelledAt = null;
    registration = await existing.save();
  } else {
    registration = await Registration.create({ user: req.user._id, event: event._id });
  }

  res.status(201).json({ registration: registration.toAPI() });
});

export const myRegistrations = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }

  const docs = await Registration.find({
    user: req.user._id,
    status: 'registered',
  })
    .populate('event')
    .sort({ registeredAt: -1 });

  res.json({
    registrations: docs.map((reg) => {
      const api = reg.toAPI();
      return {
        id: api.id,
        status: api.status,
        registeredAt: api.registeredAt,
        event: (reg.event as unknown as EventDoc).toAPI(),
      };
    }),
  });
});

export const cancelRegistration = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }

  const registration = await Registration.findById(req.params.id).populate('event');
  if (!registration) {
    throw new AppError(404, 'Registration not found');
  }

  if (!registration.user.equals(req.user._id)) {
    throw new AppError(403, 'You can only cancel your own registrations');
  }

  if (registration.status === 'cancelled') {
    throw new AppError(409, 'This registration is already cancelled');
  }

  const event = registration.event as unknown as EventDoc;
  if (event.status === 'past') {
    throw new AppError(400, 'You cannot cancel a registration for a past event');
  }

  registration.status = 'cancelled';
  registration.cancelledAt = new Date();
  await registration.save();

  res.json({ registration: registration.toAPI() });
});
