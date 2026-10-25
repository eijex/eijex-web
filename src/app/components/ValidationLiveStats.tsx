"use client";

import { useEffect, useState } from "react";
import type { TelemetrySnapshot } from "@/app/lib/validationhub-telemetry";

function formatTime(value: string | null) {
  if (!value || !Number.isFinite(Date.parse(value))) return "Not available";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(new Date(value)) + " KST (UTC+9)";
}

export default function ValidationLiveStats() {
  const [stats, setStats] = useState<TelemetrySnapshot | null>(null);
  const [error, setError] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const poll = async () => {
      try {
        const response = await fetch("/api/validationhub/stats", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Snapshot unavailable");
        const data = await response.json();
        if (data.sourceKind !== "BUNDLED_SNAPSHOT" || data.auditVerified !== false || data.remotePersistenceVerified !== false) {
          throw new Error("Unsupported snapshot contract");
        }
        if (active) { setStats(data); setError(false); setCheckedAt(new Date().toISOString()); }
      } catch {
        if (active) setError(true);
      }
    };
    void poll();
    const interval = setInterval(() => void poll(), 10000);
    return () => { active = false; controller.abort(); clearInterval(interval); };
  }, []);
  const number = (value: number | null | undefined) => typeof value === "number" && Number.isFinite(value) ? value.toLocaleString() : "Not available";
  return (
    <section className="border-b border-violet-100 bg-slate-50 px-6 py-12 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">
          Historical snapshot · {error ? "FETCH FAILED" : stats?.stale ? "STALE" : stats?.status ?? "LOADING"}
        </p>
        <h2 className="mt-2 text-2xl font-bold">Training telemetry snapshot</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          These are reported training-summary values, not a live evidence-registry connection or independently audited receipts.
          Repeated token processing is not unique corpus growth. Training loss does not establish held-out model quality or biological performance.
        </p>
        {error && <p role="alert" className="mt-3 text-sm text-amber-700">Snapshot refresh failed. Previously displayed values may be stale.</p>}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Reported ledger entries", number(stats?.reportedLedgerEntries)],
            ["Reported processed tokens", number(stats?.totalTokensTrained)],
            ["Reported training loss", typeof stats?.currentLoss === "number" ? stats.currentLoss.toFixed(4) : "Not available"],
            ["Benchmark isolation", "Not verified"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
        <dl className="mt-6 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div><dt className="inline font-semibold">Source observation: </dt><dd className="inline">{formatTime(stats?.observedAt ?? null)}</dd></div>
          <div><dt className="inline font-semibold">Page fetch checked: </dt><dd className="inline">{formatTime(checkedAt)} (does not refresh the source observation)</dd></div>
          <div><dt className="inline font-semibold">Remote persistence / training readiness: </dt><dd className="inline">Not verified</dd></div>
        </dl>
        <p className="mt-4 text-xs">UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE</p>
      </div>
    </section>
  );
}
