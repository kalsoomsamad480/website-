import mongoose from 'mongoose';
import env from '../config/env.js';
import logger from '../utils/logger.js';

let memoryServer = null;

async function resolveUri() {
  if (!env.useMemoryDb) return env.mongoUri;

  // Dev-only fallback so the API runs without a MongoDB install
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  logger.warn('Using in-memory MongoDB. Data resets when the server stops.');
  return memoryServer.getUri('study_mind');
}

export async function connectDB() {
  mongoose.set('strictQuery', true);
  const uri = await resolveUri();
  // Generous timeout: Atlas over a slow connection can take several seconds to answer
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  logger.info(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  return { isMemory: Boolean(memoryServer) };
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}
