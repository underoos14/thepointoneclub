import { app } from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';
import { env } from '../server/src/config/index.js';

let dbPromise: Promise<void> | null = null;

function ensureDb(): Promise<void> {
  if (!dbPromise) {
    dbPromise = connectDB(env.mongoUri).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

export default async function handler(req: any, res: any) {
  await ensureDb();
  app(req, res);
}
