import Link from "next/link";
import { researchEvidence as evidence } from "@/app/lib/research-progress";

export default function ResearchEvidenceOverview() {
  const rows = [
    ["Frequency baseline", evidence.validationNll.frequency],
    ["Previous-codon bigram", evidence.validationNll.bigram],
    ["Standard sLLM · 3-seed mean", evidence.validationNll.standardMean],
    ["Frequency + residual sLLM · 3-seed mean", evidence.validationNll.residualMean],
    ["Zeroed codon context · 3-seed mean", evidence.validationNll.zeroedCodonMean],
  ] as const;
  return (
    <section id="reviewed-development" className="scroll-mt-24 border-b border-violet-100 bg-slate-50 px-6 py-14 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">Reviewed partial experiment · manually published</p>
        <h2 className="mt-3 text-3xl font-bold">What the completed evidence supports</h2>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Snapshot <strong>{evidence.researchId}</strong> · experiment series {evidence.seriesDate} · reviewed {evidence.reviewedDate}. This is one experiment, not a cumulative platform counter or a live evidence connection.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[["Training proteins", evidence.splits.train], ["Reused validation proteins", evidence.splits.developmentValidation], ["Reserved test proteins", evidence.splits.reservedTest]].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>
          ))}
        </div>
        <p className="mt-5 text-sm"><strong>{evidence.completedArms} of {evidence.plannedArms} arms completed; {evidence.deferredArms} deferred.</strong> {evidence.checkpointsReplayed} checkpoints replayed. Partial closure does not mean the full experiment was completed.</p>
        <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><caption className="mb-3 text-left font-semibold">Reused development validation NLL · lower is better</caption><thead><tr className="border-b border-slate-300 dark:border-slate-700"><th scope="col" className="py-2">Model</th><th scope="col">NLL</th></tr></thead><tbody>{rows.map(([label, value]) => <tr key={label} className="border-b border-slate-200 dark:border-slate-800"><th scope="row" className="py-3 font-normal">{label}</th><td>{value.toFixed(6)}</td></tr>)}</tbody></table></div>
        <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">The residual mean is slightly lower than frequency on this reused development set. A practical or independently confirmed benefit has not been established. These results do not prove that context is useless. Final-test model inference was not performed.</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Local artifact and checkpoint replay checks support this snapshot. They are not an independent audit, an operational service connection or biological validation. Yield prediction is a long-term goal, not an available feature.</p>
        <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold"><a href="/evidence/slm-development-2026-10-29.json" className="underline">Inspect this public aggregate JSON</a><Link href="/slm#research-direction" className="underline">Research direction and next experiment →</Link></div>
        <p className="mt-5 text-xs">UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE</p>
      </div>
    </section>
  );
}
