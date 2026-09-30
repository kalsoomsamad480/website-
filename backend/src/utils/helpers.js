/** Returns a copy of `source` containing only the listed keys that are defined. */
export function pick(source, keys) {
  return keys.reduce((result, key) => {
    if (source?.[key] !== undefined) result[key] = source[key];
    return result;
  }, {});
}

/** Rounds to 2 decimal places for money values. */
export const roundMoney = (value) => Math.round(value * 100) / 100;

/** Escapes user text before using it inside a RegExp. */
export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const isObjectId = (value) => /^[a-f\d]{24}$/i.test(String(value));
