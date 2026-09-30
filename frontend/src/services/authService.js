import api, { refreshSession, setAccessToken } from './api';

// Non-sensitive hint that a refresh cookie probably exists, so signed-out visitors
// skip the restore request (and its expected 401) entirely
const SESSION_HINT = 'studymind.session';
const setHint = (on) => {
  try {
    if (on) localStorage.setItem(SESSION_HINT, '1');
    else localStorage.removeItem(SESSION_HINT);
  } catch {
    // Storage blocked: sessions still work, restore just always runs
  }
};
const hasHint = () => {
  try {
    return localStorage.getItem(SESSION_HINT) === '1';
  } catch {
    return true;
  }
};

async function startSession(request) {
  const response = await request;
  setAccessToken(response.data.accessToken);
  setHint(true);
  return response.data.user;
}

export const login = (credentials) => startSession(api.post('/auth/login', credentials));

export const register = (details) => startSession(api.post('/auth/register', details));

/** Restores a session from the refresh cookie. Resolves to the user, or null when signed out. */
export async function restoreSession() {
  if (!hasHint()) return null;
  try {
    const { user } = await refreshSession();
    return user;
  } catch {
    setAccessToken(null);
    setHint(false);
    return null;
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    setAccessToken(null);
    setHint(false);
  }
}

export const updateProfile = (details) =>
  api.put('/auth/me', details).then((response) => response.data.user);
