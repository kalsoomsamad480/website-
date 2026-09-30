import mongoose from 'mongoose';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/** Converts known library errors into ApiErrors with friendly messages. */
function normalize(err) {
  if (err instanceof ApiError) return err;

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiError.unprocessable('Please check the highlighted fields.', errors);
  }
  if (err instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for ${err.path}.`);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return ApiError.conflict(
      field ? `That ${field} is already in use.` : 'That value is already in use.',
    );
  }
  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Your session has expired. Please sign in again.');
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
    return ApiError.unauthorized('Invalid session. Please sign in again.');
  }
  if (err.type === 'entity.parse.failed')
    return ApiError.badRequest('The request body is not valid JSON.');
  if (err.type === 'entity.too.large') return new ApiError(413, 'The request body is too large.');

  return null;
}

export default function errorHandler(err, req, res, _next) {
  const known = normalize(err);
  const statusCode = known?.statusCode || 500;

  if (!known) logger.error(`${req.method} ${req.originalUrl}`, err);

  const body = {
    success: false,
    message:
      known?.message ||
      (env.isProduction ? 'Something went wrong. Please try again later.' : err.message),
  };
  if (known?.errors) body.errors = known.errors;
  if (!known && !env.isProduction) body.stack = err.stack;

  res.status(statusCode).json(body);
}
