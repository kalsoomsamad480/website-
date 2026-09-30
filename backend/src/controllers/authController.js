import env from '../config/env.js';
import * as authService from '../services/authService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

const REFRESH_COOKIE = 'sm_refresh';

// The refresh token lives in an httpOnly cookie scoped to the auth routes only
const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax',
  path: '/api/v1/auth',
};

function sendSession(res, { user, accessToken, refreshToken }, { statusCode = 200, message }) {
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...cookieOptions,
    maxAge: env.jwt.refreshExpiresDays * 24 * 60 * 60 * 1000,
  });
  return sendSuccess(res, { statusCode, message, data: { user, accessToken } });
}

export const register = asyncHandler(async (req, res) => {
  const session = await authService.registerUser(req.body);
  sendSession(res, session, { statusCode: 201, message: 'Account created.' });
});

export const login = asyncHandler(async (req, res) => {
  const session = await authService.loginUser(req.body);
  sendSession(res, session, { message: 'Signed in.' });
});

export const refresh = asyncHandler(async (req, res) => {
  const session = await authService.refreshSession(req.cookies?.[REFRESH_COOKIE]);
  sendSession(res, session, { message: 'Session refreshed.' });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.cookies?.[REFRESH_COOKIE]);
  res.clearCookie(REFRESH_COOKIE, cookieOptions);
  sendSuccess(res, { message: 'Signed out.' });
});

export const getMe = (req, res) => {
  sendSuccess(res, { data: { user: req.user.toPublicJSON() } });
};

export const updateMe = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user, req.body);
  sendSuccess(res, { message: 'Profile updated.', data: { user } });
});
