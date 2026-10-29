"use client";

import { useEffect, useState } from "react";
import { publicLearningSummary, type PublicLearningSummary } from "@/app/lib/public-learning-summary";

export default function ValidationLiveStats() {
  const [stats, setStats] = useState<PublicLearningSummary | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    fetch("/api/validationhub/learning-summary", { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Unavailable"); return response.json(); })
      .then(data => { if (active) setStats(publicLearningSummary(data)); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; controller.abort(); };
  }, []);
  return (
    <section className="border-b border-violet-100 bg-slate-50 px-6 py-12 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">Reviewed development snapshot · manually published</p>
        <h2 className="mt-2 text-2xl font-bold">Public-corpus development results</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">A bounded public-data research run with local artifact readback. These results are not a live registry audit, biological validation or a production model release.</p>
        {!stats && <p role="status" className="mt-4 text-sm">{failed ? "Reviewed results are unavailable. No metrics are substituted." : "Loading reviewed results…"}</p>}
        {stats && <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[["UniProt candidates", stats.counts.candidates], ["Retained unique proteins", stats.counts.retainedUniqueProteins], ["New vs declared public history", stats.counts.newProteinsAgainstDeclaredHistory], ["Final-test records reserved", stats.splits.finalTestReserved]].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-xl font-bold">{value}</p></div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-600 dark:text-slate-300">Source-matched: {stats.counts.sourceMatched}; unavailable/rejected: {stats.counts.sourceRejectedOrUnavailable}; quarantined by the limited panel: {stats.counts.quarantinedByLimitedPanel}. Novelty is relative to {stats.counts.historicalReferenceUniqueProteins} declared historical public proteins, not every database.</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm"><caption className="mb-3 text-left font-semibold">Development validation NLL — lower is better</caption><thead><tr className="border-b border-slate-300 dark:border-slate-700"><th className="py-2">Frequency</th><th>Previous-codon bigram</th><th>Small Transformer · 3-seed mean</th></tr></thead><tbody><tr><td className="py-3">{stats.validationNll.frequency.toFixed(4)}</td><td>{stats.validationNll.bigram.toFixed(4)}</td><td>{stats.validationNll.transformerMean.toFixed(4)}</td></tr></tbody></table>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">Training {stats.splits.train} / validation {stats.splits.validation} / reserved final test {stats.splits.finalTestReserved}. Validation was used for selection; this is not an unbiased final performance estimate. The Transformer did not outperform the frequency baseline in this development comparison. Final test: not evaluated.</p>
          <dl className="mt-6 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div><dt className="inline font-semibold">Source observation: </dt><dd className="inline">{new Intl.DateTimeFormat("ko-KR", {timeZone:"Asia/Seoul",dateStyle:"medium",timeStyle:"medium"}).format(new Date(stats.observedAt))} KST (UTC+9)</dd></div>
            <div><dt className="inline font-semibold">Execution: </dt><dd className="inline">Local Windows CPU · bounded batch · automatic refresh disabled</dd></div>
            <div><dt className="inline font-semibold">Evidence: </dt><dd className="inline">Local artifact readback checked; independent audit and remote persistence not verified</dd></div>
          </dl>
          <a href="/api/validationhub/learning-summary" className="mt-4 inline-block text-sm underline">View public aggregate JSON</a>
        </>}
        <p className="mt-4 text-xs">UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE</p>
      </div>
    </section>
  );
}
