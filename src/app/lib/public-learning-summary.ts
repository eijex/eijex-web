/** Public aggregate projection. No data paths, task identities or sequence-level hashes. */
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid summary");
  return value as Record<string, unknown>;
}

function count(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error("Invalid count");
  return value;
}

function metric(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw new Error("Invalid metric");
  return value;
}

export function publicLearningSummary(input: unknown) {
  const data = object(input);
  if (data.schemaVersion !== "1.0" || data.sourceKind !== "REVIEWED_DEVELOPMENT_SNAPSHOT" || data.executionEnvironment !== "LOCAL_WINDOWS_CPU" || data.automaticRefresh !== false || data.finalTestEvaluated !== false || data.finalTestNll !== null || data.independentAudit !== false || data.remotePersistenceVerified !== false || data.productionModelPromoted !== false || data.biologicalValidation !== "NOT_AVAILABLE" || data.evidenceClassification !== "UNVERIFIED_PUBLIC_CORPUS" || data.artifactReadbackChecked !== true) throw new Error("Unsupported evidence boundary");
  if (typeof data.observedAt !== "string" || !Number.isFinite(Date.parse(data.observedAt)) || Date.parse(data.observedAt) > Date.now() + 60_000) throw new Error("Invalid observation time");
  const c = object(data.counts), s = object(data.splits), m = object(data.validationNll);
  const counts = { candidates: count(c.candidates), sourceMatched: count(c.sourceMatched), sourceRejectedOrUnavailable: count(c.sourceRejectedOrUnavailable), retainedUniqueProteins: count(c.retainedUniqueProteins), duplicatesRemoved: count(c.duplicatesRemoved), quarantinedByLimitedPanel: count(c.quarantinedByLimitedPanel), newProteinsAgainstDeclaredHistory: count(c.newProteinsAgainstDeclaredHistory), historicalReferenceUniqueProteins: count(c.historicalReferenceUniqueProteins), homologyGroups: count(c.homologyGroups) };
  const splits = { train: count(s.train), validation: count(s.validation), finalTestReserved: count(s.finalTestReserved) };
  if (counts.candidates !== counts.sourceMatched + counts.sourceRejectedOrUnavailable || counts.sourceMatched !== counts.retainedUniqueProteins + counts.duplicatesRemoved + counts.quarantinedByLimitedPanel || splits.train + splits.validation + splits.finalTestReserved !== counts.retainedUniqueProteins || counts.newProteinsAgainstDeclaredHistory > counts.retainedUniqueProteins || counts.homologyGroups > counts.retainedUniqueProteins) throw new Error("Inconsistent accounting");
  return {
    schemaVersion: "1.0" as const, sourceKind: "REVIEWED_DEVELOPMENT_SNAPSHOT" as const,
    observedAt: new Date(data.observedAt).toISOString(), executionEnvironment: "LOCAL_WINDOWS_CPU" as const,
    automaticRefresh: false as const, counts, splits,
    validationNll: { frequency: metric(m.frequency), bigram: metric(m.bigram), transformerMean: metric(m.transformerMean) },
    finalTestEvaluated: false as const, finalTestNll: null,
    artifactReadbackChecked: true as const, independentAudit: false as const,
    remotePersistenceVerified: false as const, productionModelPromoted: false as const,
    historyCoverage: "DECLARED_PUBLIC_REFERENCES_ONLY" as const,
    trainingReadiness: "RESEARCH_ONLY" as const,
    evidenceClassification: "UNVERIFIED_PUBLIC_CORPUS" as const,
    biologicalValidation: "NOT_AVAILABLE" as const,
  };
}

export type PublicLearningSummary = ReturnType<typeof publicLearningSummary>;
