import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import Nav from "@/app/components/Nav";
import { CURRENT_APP_VERSION, FACTORFORGE_ENGINE_VERSIONS } from "@/app/lib/site-stats";

export const metadata: Metadata = {
  title: "Product Version Registry — eijex",
  description: "Public product and component version registry for Eijex software.",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Nav />
      <section className="border-b border-slate-200 bg-slate-50 px-6 py-20 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-700 dark:text-teal-300">Products · version registry</p>
          <h1 className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white sm:text-6xl">One product version. Independently versioned engines.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            This registry is the public, human-readable version contract. FactorForge product releases describe an integrated distribution; engine versions identify the implementations that produced an output.
          </p>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-950/30">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">Current integrated product</p>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">FactorForge</h2>
              <span className="font-mono text-2xl font-bold text-teal-800 dark:text-teal-200">{CURRENT_APP_VERSION}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Discovery slates, constrained-sLLM research integration, and adaptive partial-DP rescue. Stable DP v2 remains the default feasibility path.</p>
          </div>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"><tr>{["Generation", "Component", "Version", "Status", "Availability"].map((label) => <th key={label} className="px-5 py-4 font-extrabold">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {FACTORFORGE_ENGINE_VERSIONS.map((item) => <tr key={item.engine}><td className="px-5 py-4 font-bold text-teal-700 dark:text-teal-300">{item.generation}</td><td className="px-5 py-4 font-bold text-slate-900 dark:text-white">{item.engine}</td><td className="px-5 py-4 font-mono text-slate-700 dark:text-slate-300">{item.version}</td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{item.status}</td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{item.availability}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            Version numbers describe software state, not biological validation. DP v2.1.1, sLLM, and Partial-DP Rescue remain computational research surfaces with explicit evidence boundaries.
          </div>
          <div className="mt-8 flex gap-3"><Link href="/factorforge" className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-teal-700">FactorForge details</Link><a href="https://github.com/eijex/factorforge-cds/releases" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 dark:border-slate-600 dark:text-slate-200">Release history ↗</a></div>
          <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">Machine-readable mirror: <a className="font-mono font-bold text-teal-700 dark:text-teal-300" href="/api/versions">/api/versions</a>. Authoritative component metadata remains in the FactorForge repository version manifest.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
