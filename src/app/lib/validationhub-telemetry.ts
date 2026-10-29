/** Public-safe snapshot projection. Poll success is not worker/registry verification. */
export type TelemetrySnapshot = {
  status: "SNAPSHOT" | "UNAVAILABLE";
  sourceKind: "BUNDLED_SNAPSHOT" | "VOLATILE_PUSH";
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

export function projectSnapshot(input: unknown, now = new Date(), sourceKind: TelemetrySnapshot["sourceKind"] = "BUNDLED_SNAPSHOT"): TelemetrySnapshot {
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
    sourceKind,
    sourceEnvironment: sourceKind === "VOLATILE_PUSH" ? "Unverified pushed summary; process memory only; may disappear or differ across instances" : "Bundled historical summary; no live registry connection",
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

/** Only aggregate observations, never task identifiers, digests or sequence payloads. */
export function validatePush(input: unknown, now = new Date()): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Expected object");
  const record = input as Record<string, unknown>;
  const counters = ["cycleCount", "globalStep", "auditedReceipts", "totalTokensTrained", "quarantineBlocked"];
  const allowed = new Set(["timestamp", "currentLoss", ...counters]);
  if (Object.keys(record).some(key => !allowed.has(key))) throw new Error("Unknown field");
  if (typeof record.timestamp !== "string" || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(record.timestamp)) throw new Error("Timestamp required");
  const age = now.getTime() - Date.parse(record.timestamp);
  if (!Number.isFinite(age) || age < -60_000 || age > 300_000) throw new Error("Stale or future observation");
  for (const key of counters) {
    if (key in record && count(record[key]) === null) throw new Error("Invalid count");
  }
  if ("currentLoss" in record && (typeof record.currentLoss !== "number" || !Number.isFinite(record.currentLoss) || record.currentLoss < 0)) throw new Error("Invalid loss");
  if (!Object.keys(record).some(key => key !== "timestamp")) throw new Error("Observation required");
  return { ...record };
}
