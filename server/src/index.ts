import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/index.js';

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
