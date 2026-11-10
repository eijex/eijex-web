import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import ResearchEvidenceOverview from "@/app/components/ResearchEvidenceOverview";
import { researchRoadmap } from "@/app/lib/research-progress";

export const metadata: Metadata = {
  title: "FactorForge SLM Lab | Research direction and evidence",
  description: "A research path from mode-conditioned DP design proposals toward outcome-informed candidate ranking and, eventually, condition-specific yield prediction.",
};

export default function FactorForgeSLMPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <Nav />
      <section className="border-b border-teal-100 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 px-6 py-24 text-white sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Link href="/factorforge" className="text-sm font-bold text-teal-300">← FactorForge</Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">SLM Lab · experimental research</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">Learn from designs.<span className="block text-teal-300">Work toward measured outcomes.</span></h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300">The long-term goal is condition-specific yield prediction with uncertainty. The next proposed step is narrower: test whether a small model can learn from deterministic DP design examples and propose eligible candidates efficiently.</p>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-400">Existing local sequence-model experiments do not establish a useful DP booster or a yield predictor. Deterministic design tools remain the available path; model promotion requires separate evidence.</p>
          <div className="mt-8 flex flex-wrap gap-4"><Link href="#research-direction" className="rounded-lg bg-teal-300 px-5 py-3 text-sm font-bold text-slate-950">View the research roadmap</Link><Link href="/validationhub#reviewed-development" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-bold">Inspect reviewed evidence →</Link></div>
        </div>
      </section>

      <section id="research-direction" className="scroll-mt-24 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">Goal, implementation, evidence and plan</p>
          <h2 className="mt-3 text-3xl font-bold">Different stages, explicit states.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">{researchRoadmap.map(item => (
            <article key={item.title} className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700"><p className="text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">{item.state}</p><h3 className="mt-3 text-xl font-bold">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.detail}</p></article>
          ))}</div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-16 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">Next pilot · planned, not executed</p>
          <h2 className="mt-3 text-3xl font-bold">Can a learned proposal help the DP workflow?</h2>
          <ol className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <li><strong>1. Split before generating teacher examples.</strong> Keep related proteins and every design mode for the same protein in the same partition; honor declared protected-test history.</li>
            <li><strong>2. Preserve the design conditions.</strong> Record protein, host, constraints, mode and settings alongside DP outputs and computed scores. A 4DP label is not automatically a better biological answer.</li>
            <li><strong>3. Measure the full workflow.</strong> Compare constraint pass rate, objective gap and total proposal, validation and repair time against DP alone on unseen inputs.</li>
            <li><strong>4. Keep the outcome boundary.</strong> Teacher scores can teach an implemented design policy. Actual expression and yield measurements are needed to evaluate production outcomes.</li>
          </ol>
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">A future 5DP mode is not an established teacher. Local or offline use is also a delivery goal; it does not supply missing biological outcome data.</p>
        </div>
      </section>

      <ResearchEvidenceOverview />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold">What would justify the next step?</h2>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            <article><h3 className="text-lg font-bold">For a design booster</h3><p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">A frozen model and evaluation protocol should show a useful speed–quality tradeoff under the same constraints. A learned proposal cannot exceed an exact optimizer&apos;s optimum for the identical objective; it can aim to reach useful candidates sooner.</p></article>
            <article><h3 className="text-lg font-bold">For yield prediction</h3><p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Specify the measured outcome and units, link CDS and construct identity to host and production conditions, and assess unseen experiments with uncertainty. Sequence likelihood, CAI and predicted RNA energy are not measured yield.</p></article>
          </div>
          <p className="mt-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Models may propose; deterministic tools check defined constraints; human review controls use. Neither a passed check nor an AI explanation is biological validation.</p>
          <div className="mt-7 flex gap-6 text-sm font-bold"><Link href="/factorforge" className="underline">Current FactorForge tools →</Link><Link href="/validationhub" className="underline">Evidence scope →</Link></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
