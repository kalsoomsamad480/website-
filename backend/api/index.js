// Vercel serverless entry. Local development still uses src/server.js.
import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectDB } from '../src/db/connection.js';
import logger from '../src/utils/logger.js';

// Reuse one MongoDB connection across warm invocations
let connecting = null;

export default async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    connecting ??= connectDB().finally(() => {
      connecting = null;
    });
    try {
      await connecting;
    } catch (error) {
      logger.error('Database connection failed:', error.message);
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, message: 'The database is not reachable right now.' }));
      return;
    }
  }
  app(req, res);
}
