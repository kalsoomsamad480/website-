// API tests that need no database: validation, auth guards, security headers, and error handling.
// Requests that pass validation would reach MongoDB, so they are not exercised here.
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../src/app.js';
import env from '../src/config/env.js';

mongoose.set('bufferCommands', false);
let server;
let base;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
});

after(() => server.close());

async function call(method, path, { body, token, raw } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(base + path, { method, headers, body: raw ?? (body ? JSON.stringify(body) : undefined) });
  return { status: res.status, headers: res.headers, json: await res.json() };
}

test('health check and security headers', async () => {
  const res = await call('GET', '/health');
  assert.equal(res.status, 200);
  assert.equal(res.json.success, true);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('x-powered-by'), null);
});

test('cafe info is served without a database', async () => {
  const res = await call('GET', '/info');
  assert.equal(res.status, 200);
  assert.equal(res.json.data.hours.length, 7);
});

test('unknown routes return a JSON 404', async () => {
  const res = await call('GET', '/does-not-exist');
  assert.equal(res.status, 404);
  assert.equal(res.json.success, false);
});

test('registration is validated field by field', async () => {
  const res = await call('POST', '/auth/register', { body: { name: 'A', email: 'nope', password: 'short' } });
  assert.equal(res.status, 422);
  assert.deepEqual(res.json.errors.map((e) => e.field).sort(), ['email', 'name', 'password']);
});

test('NoSQL operators in login are rejected', async () => {
  const res = await call('POST', '/auth/login', { body: { email: { $gt: '' }, password: { $gt: '' } } });
  assert.equal(res.status, 422);
});

test('malformed JSON returns 400', async () => {
  const res = await call('POST', '/auth/login', { raw: '{bad json' });
  assert.equal(res.status, 400);
});

test('protected and admin routes require a valid token', async () => {
  assert.equal((await call('GET', '/auth/me')).status, 401);
  assert.equal((await call('POST', '/orders', { body: {} })).status, 401);
  assert.equal((await call('GET', '/admin/stats')).status, 401);
  assert.equal((await call('GET', '/auth/me', { token: 'abc.def.ghi' })).status, 401);

  const forged = jwt.sign({ sub: 'x', role: 'admin' }, 'not-the-secret');
  assert.equal((await call('GET', '/admin/stats', { token: forged })).status, 401);

  const expired = jwt.sign({ sub: 'x', role: 'admin' }, env.jwt.accessSecret, { expiresIn: -10 });
  const res = await call('GET', '/auth/me', { token: expired });
  assert.equal(res.status, 401);
  assert.match(res.json.message, /expired/);
});

test('reservation and menu queries are validated', async () => {
  assert.equal((await call('GET', '/reservations/availability?date=soon&seatType=table')).status, 422);
  assert.equal((await call('GET', '/reservations/availability?date=2026-10-01&seatType=sofa')).status, 422);
  assert.equal((await call('GET', '/menu?tag=spicy')).status, 422);

  const res = await call('POST', '/reservations', { body: { name: 'A', guests: 12, seatType: 'sofa' } });
  assert.equal(res.status, 422);
  assert.ok(res.json.errors.some((e) => e.field === 'guests'));
});

test('chat messages are validated before reaching the agent', async () => {
  assert.equal((await call('POST', '/agent/chat', { body: { sessionId: 'x', message: '' } })).status, 422);
});
