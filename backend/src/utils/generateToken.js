import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpires,
  });
}

// `v` ties the refresh token to user.tokenVersion so logout can revoke it
export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, v: user.tokenVersion }, env.jwt.refreshSecret, {
    expiresIn: `${env.jwt.refreshExpiresDays}d`,
  });
}

export const verifyAccessToken = (token) => jwt.verify(token, env.jwt.accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwt.refreshSecret);
