import { useCallback, useEffect, useEffectEvent, useState } from 'react';

/**
 * Loads admin data and reloads it on demand or when `key` changes (e.g. a filter).
 * Unlike the public pages, admin screens always fetch fresh data.
 */
export default function useAdminData(loader, key = '') {
  const [state, setState] = useState({ data: null, error: null, key: null });
  const [version, setVersion] = useState(0);
  const load = useEffectEvent(() => loader());

  useEffect(() => {
    let active = true;
    load()
      .then((result) => active && setState({ data: result, error: null, key: `${key}:${version}` }))
      .catch((error) => active && setState((s) => ({ ...s, error, key: `${key}:${version}` })));
    return () => {
      active = false;
    };
  }, [key, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  // Local edits (optimistic updates) without a round trip
  const setData = useCallback(
    (updater) =>
      setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater })),
    [],
  );

  return {
    data: state.data,
    error: state.error,
    loading: state.key !== `${key}:${version}`,
    reload,
    setData,
  };
}
