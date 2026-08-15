import type { Request, Response } from 'express';
import type { FilterQuery, PipelineStage } from 'mongoose';
import { endOfToday, Event, startOfToday, statusQuery } from '../models/Event.js';
import type { IEvent } from '../models/Event.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const PER_PAGE = 12;

export const listEvents = asyncHandler(async (req: Request, res: Response) => {
  const { status, category, q, from, to, page, limit } = req.query as Record<
    string,
    string | undefined
  >;

  const filter: FilterQuery<IEvent> = {
    ...statusQuery(status || 'all'),
    ...(category && category !== 'All' ? { category } : {}),
    ...(from ? { startDate: { $gte: new Date(from) } } : {}),
    ...(to ? { startDate: { $lte: new Date(to) } } : {}),
  };

  if (q) {
    const rx = new RegExp(q.trim(), 'i');
    filter.$or = [{ title: rx }, { tagline: rx }, { description: rx }, { 'location.name': rx }];
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || PER_PAGE));

  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  // Order by status (upcoming -> ongoing -> past), then by date.
  // Upcoming and ongoing run soonest-first; past events run most-recent-first.
  const pipeline: PipelineStage[] = [
    { $match: filter },
    {
      $addFields: {
        statusKey: {
          $cond: [
            { $lt: [{ $ifNull: ['$endDate', '$startDate'] }, todayStart] },
            2,
            { $cond: [{ $gte: ['$startDate', todayEnd] }, 0, 1] },
          ],
        },
        sortDate: {
          $cond: [
            { $lt: [{ $ifNull: ['$endDate', '$startDate'] }, todayStart] },
            { $multiply: [{ $toLong: '$startDate' }, -1] },
            { $toLong: '$startDate' },
          ],
        },
      },
    },
    { $sort: { statusKey: 1, sortDate: 1 } },
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum },
  ];

  const [total, docs] = await Promise.all([
    Event.countDocuments(filter),
    Event.aggregate(pipeline),
  ]);

  res.json({
    events: docs.map((doc) => new Event(doc).toAPI()),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 0,
    },
  });
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new AppError(404, 'Event not found');
  }
  res.json({ event: event.toAPI() });
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }
  const event = await Event.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ event: event.toAPI() });
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { ...req.body, createdBy: req.user._id },
    { new: true, runValidators: true }
  );
  if (!event) {
    throw new AppError(404, 'Event not found');
  }
  res.json({ event: event.toAPI() });
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    throw new AppError(404, 'Event not found');
  }
  res.status(204).end();
});
