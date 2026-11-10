import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const aggregate = JSON.parse(read('public/evidence/slm-development-2026-10-29.json'));

test('published and rendered evidence agree and account for partial closure', () => {
  assert.deepEqual(aggregate, JSON.parse(read('src/app/lib/reviewed-research-evidence.json')));
  assert.equal(aggregate.status, 'PARTIAL_CLOSED');
  assert.equal(aggregate.completedArms + aggregate.deferredArms, aggregate.plannedArms);
  assert.equal(aggregate.checkpointsReplayed, 9);
  assert.deepEqual(aggregate.splits, { train: 98, developmentValidation: 7, reservedTest: 13 });
  assert.equal(aggregate.validationDesignation, 'REUSED_DEVELOPMENT_VALIDATION');
});

test('unavailable outcomes remain distinct from finite development metrics', () => {
  for (const key of ['finalTestEvaluated', 'productionModelPromoted', 'yieldPredictionAvailable', 'independentAudit', 'liveRegistryConnection']) assert.equal(aggregate[key], false);
  assert.equal(aggregate.finalTestNll, null);
  assert.equal(aggregate.evidenceClassification, 'UNVERIFIED_PUBLIC_CORPUS');
  assert.equal(aggregate.biologicalValidation, 'NOT_AVAILABLE');
  for (const value of Object.values(aggregate.validationNll)) assert(Number.isFinite(value) && value > 0);
  assert(aggregate.validationNll.standardMean > aggregate.validationNll.frequency);
  assert(Math.abs(aggregate.validationNll.residualMean - aggregate.validationNll.frequency) < 0.001);
});

test('public evidence uses only the reviewed aggregate schema', () => {
  assert.deepEqual(Object.keys(aggregate).sort(), ['schemaVersion','researchId','seriesDate','reviewedDate','publicationMode','status','plannedArms','completedArms','deferredArms','checkpointsReplayed','splits','validationDesignation','validationNll','finalTestEvaluated','finalTestNll','productionModelPromoted','yieldPredictionAvailable','independentAudit','liveRegistryConnection','evidenceClassification','biologicalValidation'].sort());
  assert(!/C:\\|LOCALAPPDATA|protein_aa|checkpoint_sha256|accession|file:\/\/|\b[ACGT]{45,}\b/i.test(JSON.stringify(aggregate)));
});

test('pages share evidence and initial pilot remains explicitly historical', () => {
  for (const page of ['slm','validationhub']) assert(read(`src/app/${page}/page.tsx`).includes('<ResearchEvidenceOverview />'));
  const historical = read('src/app/components/ValidationLiveStats.tsx');
  assert(historical.includes('Archived pilot snapshot'));
  assert(historical.includes('later development reused'));
  assert(historical.includes('not current totals'));
  assert(read('src/app/lib/research-progress.ts').includes('Planned · not executed'));
});
