// Strips MongoDB operator keys ($gt, $where, "a.b") from request bodies to block NoSQL injection.
// Query strings use Express 5's simple parser, which never produces nested objects.

function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith('$') && !key.includes('.'))
        .map(([key, nested]) => [key, clean(nested)]),
    );
  }
  return value;
}

export default function sanitizeBody(req, _res, next) {
  if (req.body && typeof req.body === 'object') req.body = clean(req.body);
  next();
}
