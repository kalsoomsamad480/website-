// A tiny promise cache for read-only API data, designed for React's use() + Suspense.
// Each key is fetched once per page load; a failed request is dropped so "Try again" refetches.

const cache = new Map();

export function cached(key, loader) {
  if (!cache.has(key)) {
    const promise = loader();
    promise.catch(() => cache.delete(key));
    cache.set(key, promise);
  }
  return cache.get(key);
}

/** Drops cached entries whose key starts with `prefix` (used after admin edits). */
export function invalidate(prefix) {
  [...cache.keys()].forEach((key) => {
    if (key.startsWith(prefix)) cache.delete(key);
  });
}
