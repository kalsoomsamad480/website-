import User from '../db/models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/generateToken.js';

function readBearerToken(req) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

/** Requires a valid access token and attaches the user to req.user. */
export const protect = asyncHandler(async (req, _res, next) => {
  const token = readBearerToken(req);
  if (!token) throw ApiError.unauthorized();

  const payload = verifyAccessToken(token);
  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('Your account no longer exists.');

  req.user = user;
  next();
});

/** Attaches req.user when a valid token is sent, but never blocks the request. */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = readBearerToken(req);
  if (token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = (await User.findById(payload.sub)) || undefined;
    } catch {
      req.user = undefined;
    }
  }
  next();
});
