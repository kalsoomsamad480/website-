import app from './app.js';
import env from './config/env.js';
import { connectDB, disconnectDB } from './db/connection.js';
import { seedDatabase } from './db/seeds/seed.js';
import { rebuildSlotCounters } from './services/reservationService.js';
import logger from './utils/logger.js';

async function start() {
  try {
    const { isMemory } = await connectDB();
    if (isMemory) await seedDatabase();
    // Keep seat counters in sync with reservations (e.g. after manual database edits)
    const slots = await rebuildSlotCounters();
    logger.info(`Seat counters ready for ${slots} booked slots.`);

    const server = app.listen(env.port, () => {
      logger.info(`API ready at http://localhost:${env.port}/api/v1 (${env.nodeEnv})`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received, shutting down.`);
      server.close();
      await disconnectDB();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Failed to start the server:', error.message);
    if (!env.useMemoryDb) {
      logger.error(
        'Is MongoDB running? Set MONGO_URI in backend/.env to a local or Atlas connection string, or set USE_MEMORY_DB=true for a temporary database.',
      );
    }
    process.exit(1);
  }
}

start();
