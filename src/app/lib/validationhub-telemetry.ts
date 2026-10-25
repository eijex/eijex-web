/** Public-safe snapshot projection. Poll success is not worker/registry verification. */
export type TelemetrySnapshot = {
  status: "SNAPSHOT" | "UNAVAILABLE";
  sourceKind: "BUNDLED_SNAPSHOT";
  sourceEnvironment: string;
  observedAt: string | null;
  servedAt: string;
  ageSeconds: number | null;
  stale: boolean;
  cycleCount: number | null;
  globalStep: number | null;
  reportedLedgerEntries: number | null;
  totalTokensTrained: number | null;
  currentLoss: number | null;
  quarantineBlocked: number | null;
  auditedReceipts: null;
  auditVerified: false;
  remotePersistenceVerified: false;
  trainingReadiness: "NOT_VERIFIED";
  biologicalValidation: "NOT_AVAILABLE";
  evidenceClassification: "UNVERIFIED_PUBLIC_CORPUS";
};

function count(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

export function projectSnapshot(input: unknown, now = new Date()): TelemetrySnapshot {
  const record = input && typeof input === "object" && !Array.isArray(input)
    ? input as Record<string, unknown> : {};
  const rawTime = typeof record.timestamp === "string" ? Date.parse(record.timestamp) : NaN;
  const validTime = Number.isFinite(rawTime) && rawTime <= now.getTime() + 60_000;
  const ageSeconds = validTime ? Math.max(0, Math.floor((now.getTime() - rawTime) / 1000)) : null;
  const observedAt = validTime ? new Date(rawTime).toISOString() : null;
  const loss = typeof record.currentLoss === "number" && Number.isFinite(record.currentLoss)
    && record.currentLoss >= 0 ? record.currentLoss : null;
  return {
    status: observedAt ? "SNAPSHOT" : "UNAVAILABLE",
    sourceKind: "BUNDLED_SNAPSHOT",
    sourceEnvironment: "Bundled historical summary; no live registry connection",
    observedAt,
    servedAt: now.toISOString(),
    ageSeconds,
    stale: ageSeconds === null || ageSeconds > 300,
    cycleCount: count(record.cycleCount),
    globalStep: count(record.globalStep),
    reportedLedgerEntries: count(record.auditedReceipts),
    totalTokensTrained: count(record.totalTokensTrained),
    currentLoss: loss,
    quarantineBlocked: count(record.quarantineBlocked),
    auditedReceipts: null,
    auditVerified: false,
    remotePersistenceVerified: false,
    trainingReadiness: "NOT_VERIFIED",
    biologicalValidation: "NOT_AVAILABLE",
    evidenceClassification: "UNVERIFIED_PUBLIC_CORPUS",
  };
}
