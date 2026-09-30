import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({ baseURL, withCredentials: true, timeout: 12000 });
// Separate client for the refresh call so it never loops through the interceptors
const refreshClient = axios.create({ baseURL, withCredentials: true, timeout: 12000 });

// The access token lives in memory only; the refresh token is an httpOnly cookie
let accessToken = null;
let onSessionExpired = () => {};
let refreshing = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

/** Gets a new access token from the refresh cookie. Parallel callers share one request. */
export function refreshSession() {
  if (!refreshing) {
    refreshing = refreshClient
      .post('/auth/refresh')
      .then((response) => {
        setAccessToken(response.data.data.accessToken);
        return response.data.data;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

function toFriendlyError(error) {
  const body = error.response?.data;
  let message = body?.message;
  if (!message) {
    message =
      error.code === 'ECONNABORTED'
        ? 'The server took too long to respond. Please try again.'
        : 'We could not reach the server. Please check your connection and try again.';
  }
  const normalized = new Error(message);
  normalized.status = error.response?.status;
  normalized.fieldErrors = body?.errors || [];
  return normalized;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Unwraps { success, message, data }. On 401, refreshes the session once and retries.
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;
    const isAuthCall = /^\/auth\/(login|register|refresh|logout)$/.test(original?.url || '');

    if (error.response?.status === 401 && accessToken && !original._retried && !isAuthCall) {
      original._retried = true;
      try {
        await refreshSession();
        return api(original);
      } catch {
        setAccessToken(null);
        onSessionExpired();
      }
    }
    return Promise.reject(toFriendlyError(error));
  },
);

export default api;
