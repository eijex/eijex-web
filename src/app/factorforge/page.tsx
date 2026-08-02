import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import BenchmarkStats from "@/app/components/factorforge/BenchmarkStats";

export const metadata: Metadata = {
  title: "FactorForge | Deterministic Bio-Design Engine — eijex",
  description: "Technical whitepaper for FactorForge's CPU-first deterministic CDS design core.",
};

export default function FactorForgePage() {
  return (
    <main className="bg-white dark:bg-slate-900">
      <Nav />
      <section className="border-b border-teal-100 bg-gradient-to-br from-teal-50 via-white to-green-50 px-6 py-24 dark:border-teal-900/50 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/30">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm font-bold text-teal-700 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-200">← eijex home</Link>
          <p className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-teal-700 dark:text-teal-300">FactorForge technical whitepaper</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-7xl">
            Deterministic CPU-First Core.
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">
            Reproducible CDS design with explicit constraints, reviewable outputs, and a production path that removes biological hallucination risks from the optimization engine.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-sm font-bold">
            <span className="rounded-full bg-teal-600 px-4 py-2 text-white">DBTL Design Anchor</span>
            <span className="rounded-full bg-teal-800 px-4 py-2 text-white">CPU deterministic DP</span>
            <span className="rounded-full border border-slate-300 px-4 py-2 text-slate-600 dark:border-slate-600 dark:text-slate-300">RSPA-aligned evidence boundaries</span>
          </div>
        </div>
      </section>

      <BenchmarkStats />

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Architecture & transparency</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Two lanes, one evidence boundary.</h2>
            <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-800 dark:bg-teal-950/30">
                <h3 className="font-extrabold text-teal-800 dark:text-teal-200">Production (Deterministic)</h3>
                <p className="mt-2">The CPU-first dynamic-programming path produces the same result for the same inputs and constraints. Provenance is part of every payload and rendered result.</p>
              </div>
              <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-5 dark:border-purple-800 dark:bg-purple-950/30">
                <h3 className="font-extrabold text-purple-800 dark:text-purple-200">Exploratory Lab (ML)</h3>
                <p className="mt-2">ML/AI comparisons are isolated as non-deterministic exploration. Any sequence from this lane must pass through Production validation before wet-lab synthesis.</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Output provenance</p>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-6 text-sm leading-7 text-teal-300 shadow-xl"><code>{`{
  "generator": "cpu_deterministic_dp",
  "lane": "production",
  "validation": "required"
}`}</code></pre>
            <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">The generator flag makes the execution lane auditable in exported JSON and review packages.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 px-6 py-20 dark:border-slate-800">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Algorithm</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Constrained CAI maximization, computed exactly.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            For a fixed protein and a configured GC% target range, <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">feasibility_best</code> searches every synonymous CDS that encodes the protein and returns the one with the highest Codon Adaptation Index inside that range — an exact dynamic-programming solution, not a heuristic approximation.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Objective</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Among all synonymous codon sequences whose GC% falls within the configured range, choose the one that maximizes CAI.</p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-6 text-teal-300"><code>{`maximize   CAI(C)
subject to GC_low <= GC%(C) <= GC_high
over       C in synonymous(protein)`}</code></pre>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Recurrence</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Each state is (codon position, cumulative GC-base count). The DP keeps only the highest-scoring path into every reachable state.</p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-6 text-teal-300"><code>{`D[i][h] = max over codon c
  of D[i-1][h - gc(c)] + log(weight(c))`}</code></pre>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Fallback</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">If no synonymous sequence satisfies the configured GC window, the DP returns the highest-CAI sequence with no GC constraint applied — a defined fallback, not a constraint failure.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Tie-breaking</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Equal-scoring paths keep the first codon encountered in the reference table&apos;s fixed order — deterministic by construction, not by chance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-16 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Read the implementation notes</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">FactorForge documents its scoring contract, codon reference, and review boundaries so benchmark context stays attached to the software that produced it.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://eijex.github.io/factorforge-cds/" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-teal-700">Documentation ↗</a>
            <a href="https://github.com/eijex/factorforge-cds" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:text-slate-200">Source on GitHub ↗</a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
