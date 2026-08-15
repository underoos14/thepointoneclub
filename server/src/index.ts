import cors from 'cors';
import express from 'express';
import { connectDB } from './config/db.js';
import { env } from './config/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/event.routes.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB(env.mongoUri);
  app.listen(env.port, () => {
    console.log(`[api] listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error('[api] failed to start', err);
  process.exit(1);
});
