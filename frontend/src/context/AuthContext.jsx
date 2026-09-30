import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './contexts';
import { setSessionExpiredHandler } from '../services/api';
import * as authService from '../services/authService';

/** Holds the signed-in user. The session is restored from the refresh cookie on load. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setSessionExpiredHandler(() => setUser(null));
    authService.restoreSession().then((restored) => {
      if (!active) return;
      setUser(restored);
      setStatus('ready');
    });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const signedIn = await authService.login(credentials);
    setUser(signedIn);
    return signedIn;
  }, []);

  const register = useCallback(async (details) => {
    const created = await authService.register(details);
    setUser(created);
    return created;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (details) => {
    const updated = await authService.updateProfile(details);
    setUser(updated);
    return updated;
  }, []);

  const value = useMemo(
    () => ({ user, isReady: status === 'ready', login, register, logout, updateProfile }),
    [user, status, login, register, logout, updateProfile],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export default AuthProvider;
