import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { projectSnapshot } from '../src/app/lib/validationhub-telemetry.ts';

const now = new Date('2026-10-25T06:30:00Z');

test('missing snapshot stays unavailable without invented metrics', () => {
  const result = projectSnapshot(null, now);
  assert.equal(result.status, 'UNAVAILABLE');
  assert.equal(result.currentLoss, null);
  assert.equal(result.totalTokensTrained, null);
  assert.equal(result.auditedReceipts, null);
  assert.equal(result.observedAt, null);
});

test('historical running flag cannot masquerade as live', () => {
  const result = projectSnapshot({ status: 'RUNNING', timestamp: '2026-10-25T03:02:31Z', auditedReceipts: 782 }, now);
  assert.equal(result.status, 'SNAPSHOT');
  assert.equal(result.stale, true);
  assert.equal(result.reportedLedgerEntries, 782);
  assert.equal(result.auditVerified, false);
  assert.equal(result.remotePersistenceVerified, false);
});

test('zero observations stay zero rather than fallback estimates', () => {
  const result = projectSnapshot({ timestamp: now.toISOString(), totalTokensTrained: 0, currentLoss: 0, cycleCount: 0 }, now);
  assert.equal(result.totalTokensTrained, 0);
  assert.equal(result.currentLoss, 0);
  assert.equal(result.cycleCount, 0);
});

test('invalid numeric fields are unavailable', () => {
  for (const value of [-1, NaN, Infinity, '73508', true]) {
    const result = projectSnapshot({ timestamp: now.toISOString(), totalTokensTrained: value, currentLoss: value }, now);
    assert.equal(result.totalTokensTrained, null);
    assert.equal(result.currentLoss, null);
  }
});

test('request time never replaces source observation time', () => {
  const result = projectSnapshot({ timestamp: '2026-10-25T03:02:31Z' }, now);
  assert.equal(result.observedAt, '2026-10-25T03:02:31.000Z');
  assert.equal(result.servedAt, now.toISOString());
});

test('malformed or future observation is not fresh', () => {
  for (const timestamp of ['not-a-date', '2027-01-01T00:00:00Z']) {
    const result = projectSnapshot({ timestamp }, now);
    assert.equal(result.status, 'UNAVAILABLE');
    assert.equal(result.stale, true);
  }
});

test('public projection removes task identity, digest and arbitrary fields', () => {
  const result = projectSnapshot({ timestamp: now.toISOString(), lastTaskId: 'PRIVATE_TASK', lastHash: 'sensitive-digest', apiKey: 'fake' }, now);
  assert.equal(Object.hasOwn(result, 'lastTaskId'), false);
  assert.equal(Object.hasOwn(result, 'lastHash'), false);
  assert.equal(Object.hasOwn(result, 'apiKey'), false);
});

test('public stats route has no private filesystem or hardcoded success fallback', () => {
  const source = readFileSync(new URL('../src/app/api/validationhub/stats/route.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /readFileSync|existsSync|eijex-workspace|620|0\.0023/);
  assert.match(source, /projectSnapshot/);
});
test('public stats route defines authenticated POST endpoint', () => {
  const source = readFileSync(new URL('../src/app/api/validationhub/stats/route.ts', import.meta.url), 'utf8');
  assert.match(source, /export async function POST/);
  assert.match(source, /x-telemetry-token/);
});
