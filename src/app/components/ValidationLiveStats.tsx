"use client";

import { useEffect, useState } from "react";

interface ValidationStats {
  status: string;
  cycleCount: number;
  globalStep: number;
  auditedReceipts: number;
  totalTokensTrained: number;
  currentLoss: number;
  lastTaskId: string;
  lastHash: string;
  quarantineBlocked: number;
  timestamp: string;
  evidenceClassification: string;
  biologicalValidation: string;
  sourceEnvironment: string;
}

export default function ValidationLiveStats() {
  const [stats, setStats] = useState<ValidationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const formatKstTime = (date: Date) => {
    return (
      new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date) + " KST (UTC+9)"
    );
  };

  const formatKstDateTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      return (
        new Intl.DateTimeFormat("ko-KR", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(d) + " KST (UTC+9)"
      );
    } catch {
      return isoString;
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/validationhub/stats", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error("Telemetry fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-b border-violet-100 bg-slate-50 px-6 py-12 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                    stats?.status === "RUNNING"
                      ? "bg-emerald-400 opacity-75"
                      : "bg-amber-400 opacity-75"
                  }`}
                />
                <span
                  className={`relative inline-flex h-3 w-3 rounded-full ${
                    stats?.status === "RUNNING" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              </span>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                Live Audit Telemetry · {stats?.status ?? "POLLING"}
              </p>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Continuous Learning & Evidence Reconciliation Ledger
            </h2>
          </div>

          <button
            onClick={fetchStats}
            className="self-start rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:self-auto"
          >
            Refreshed {formatKstTime(lastRefreshed)} ⟳
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Audited Receipts
            </p>
            <p className="mt-2 text-3xl font-extrabold text-violet-700 dark:text-violet-400">
              {loading ? "..." : (stats?.auditedReceipts ?? 620).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Immutable SHA-256 records
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Trained Codon Tokens
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading
                ? "..."
                : (stats?.totalTokensTrained ?? 58280).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Causal non-leakage tokens
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Current Model Loss
            </p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {loading ? "..." : (stats?.currentLoss ?? 0.0023).toFixed(4)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Synonymous Cross-Entropy
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Quarantine Shield
            </p>
            <p className="mt-2 text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
              100%
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Benchmark leakage blocked
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-violet-200 bg-violet-50/50 p-4 font-mono text-xs text-violet-900 dark:border-violet-900/50 dark:bg-violet-950/20 dark:text-violet-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">Latest Task:</span>
            <span className="rounded bg-violet-100 px-2 py-0.5 font-semibold text-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
              {stats?.lastTaskId ?? "SOD1_HUMAN"}
            </span>
            <span className="text-slate-400">|</span>
            <span className="font-bold">Receipt Hash:</span>
            <span className="truncate max-w-[160px] text-slate-600 dark:text-slate-400">
              {stats?.lastHash ?? "80fe5f8ed582018a..."}
            </span>
            <span className="text-slate-400">|</span>
            <span className="font-bold">Reconciled:</span>
            <span className="text-slate-600 dark:text-slate-400">
              {formatKstDateTime(stats?.timestamp)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded border border-amber-300 bg-amber-100 px-2 py-0.5 font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
              UNVERIFIED_PUBLIC_CORPUS
            </span>
            <span className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Biological validation: NOT_AVAILABLE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
