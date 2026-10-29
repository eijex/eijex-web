import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { publicLearningSummary } from '../src/app/lib/public-learning-summary.ts';

const snapshot = JSON.parse(readFileSync(new URL('../src/app/lib/reviewed-learning-summary.json', import.meta.url), 'utf8'));
test('reviewed counts preserve actual source and split accounting', () => {
  const result = publicLearningSummary(snapshot);
  assert.equal(result.counts.candidates, 50);
  assert.equal(result.counts.retainedUniqueProteins, 22);
  assert.equal(result.counts.newProteinsAgainstDeclaredHistory, 19);
  assert.equal(result.validationNll.frequency, 1.031775148042904);
  assert.equal(result.finalTestNll, null);
  assert.equal(result.automaticRefresh, false);
  assert.equal(result.remotePersistenceVerified, false);
});
test('allowlist strips arbitrary metadata at every exported level', () => {
  const result = publicLearningSummary({...snapshot, localPath:'private', taskId:'private', counts:{...snapshot.counts, sequenceHash:'private'}, validationNll:{...snapshot.validationNll, rawSequence:'private'}});
  assert.doesNotMatch(JSON.stringify(result), /private|localPath|sequenceHash|rawSequence|taskId/);
});
for (const [field, value] of [['automaticRefresh',true],['independentAudit',true],['remotePersistenceVerified',true],['finalTestEvaluated',true],['finalTestNll',0.01],['productionModelPromoted',true]]) {
  test(`rejects unsupported claim ${field}`, () => assert.throws(() => publicLearningSummary({...snapshot, [field]:value})));
}
test('invalid values and inconsistent totals are rejected rather than estimated', () => {
  for (const value of [-1, NaN, Infinity, true, '50']) {
    assert.throws(() => publicLearningSummary({...snapshot, counts:{...snapshot.counts, candidates:value}}));
  }
  assert.throws(() => publicLearningSummary({...snapshot, splits:{...snapshot.splits, train:999}}));
});
test('zero loss is preserved without a nonzero fallback', () => {
  assert.equal(publicLearningSummary({...snapshot, validationNll:{...snapshot.validationNll, frequency:0}}).validationNll.frequency, 0);
});
test('UI and legacy route retire old counters and polling', () => {
  const ui = readFileSync(new URL('../src/app/components/ValidationLiveStats.tsx', import.meta.url), 'utf8');
  const route = readFileSync(new URL('../src/app/api/validationhub/stats/route.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(ui, /setInterval|reportedLedgerEntries|totalTokensTrained|currentLoss|3425|310645|0\.0001/);
  assert.match(ui, /learning-summary/);
  assert.doesNotMatch(route, /import snapshot|pushed \|\| snapshot/);
});
