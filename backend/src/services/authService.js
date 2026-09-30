import bcrypt from 'bcryptjs';
import User from '../db/models/User.js';
import ApiError from '../utils/ApiError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/generateToken.js';

const SALT_ROUNDS = 12;
// Compared against when the email is unknown, so response time does not reveal which emails exist
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', SALT_ROUNDS);

function issueSession(user) {
  return {
    user: user.toPublicJSON(),
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  };
}

export async function registerUser({ name, email, password, phone }) {
  if (await User.exists({ email })) {
    throw ApiError.conflict('An account with this email already exists.');
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    role: 'customer',
  });
  return issueSession(user);
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash +tokenVersion');
  const isValid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !isValid) throw ApiError.unauthorized('Email or password is incorrect.');
  return issueSession(user);
}

export async function refreshSession(refreshToken) {
  const expired = ApiError.unauthorized('Your session has expired. Please sign in again.');
  if (!refreshToken) throw expired;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw expired;
  }

  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user || user.tokenVersion !== payload.v) throw expired;
  return issueSession(user);
}

/** Revokes every refresh token for the user in the cookie, if it is valid. */
export async function logoutUser(refreshToken) {
  if (!refreshToken) return;
  try {
    const payload = verifyRefreshToken(refreshToken);
    await User.updateOne(
      { _id: payload.sub, tokenVersion: payload.v },
      { $inc: { tokenVersion: 1 } },
    );
  } catch {
    // Already invalid: nothing to revoke
  }
}

export async function updateProfile(user, { name, phone }) {
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  await user.save();
  return user.toPublicJSON();
}
