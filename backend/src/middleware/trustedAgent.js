import { timingSafeEqual } from 'node:crypto';
import env from '../config/env.js';

/** Marks requests from the Python assistant (X-Agent-Key header matches AGENT_SECRET). */
export default function trustedAgent(req, _res, next) {
  const key = req.get('x-agent-key');
  const secret = env.agentSecret;
  req.fromAgent = Boolean(
    secret &&
    key &&
    key.length === secret.length &&
    timingSafeEqual(Buffer.from(key), Buffer.from(secret)),
  );
  next();
}
