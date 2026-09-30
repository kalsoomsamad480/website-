import rateLimit from 'express-rate-limit';

const jsonHandler = (_req, res, _next, options) =>
  res.status(options.statusCode).json({ success: false, message: options.message });

const baseOptions = {
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: jsonHandler,
};

export const apiLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 500,
  message: 'Too many requests. Please try again in a few minutes.',
});

// Only failed attempts count, so normal sign-ins are never blocked
export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: 'Too many attempts. Please wait 15 minutes and try again.',
});

// Account creation counts every attempt (successful ones too)
export const registerLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: 'Too many sign-up attempts. Please wait 15 minutes and try again.',
});

export const refreshLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: 'Too many requests. Please sign in again in a few minutes.',
});

export const contactLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'You have sent several messages already. Please try again later.',
});

export const reservationLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  // The assistant books for many guests from one IP; its own chat limit applies instead
  skip: (req) => req.fromAgent === true,
  message: 'You have made several reservations already. Please try again later.',
});

export const chatLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  limit: 20,
  message: 'You are sending messages too quickly. Please wait a moment.',
});
