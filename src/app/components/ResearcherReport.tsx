import Link from "next/link";
import { publicLinks } from "@/app/lib/ecosystem";

const reportLayers = [
  {
    number: "01",
    title: "Decide",
    body: "See the automated disposition, unresolved checks, and the next review action before reading the full metrics.",
  },
  {
    number: "02",
    title: "Verify",
    body: "Compare requested settings with the settings recorded by the run, then inspect checks and provenance.",
  },
  {
    number: "03",
    title: "Hand off",
    body: "Download the sequence-bearing report separately from the sequence-free evidence record for downstream review.",
  },
] as const;

export default function ResearcherReport() {
  return (
    <section className="bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-300">
            FactorForge report
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            A result should tell a researcher what to do next.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
            The Researcher Decision Report leads with the run&apos;s recorded
            decision, turns unresolved computational checks into bounded review
            actions, and keeps full evidence available without making the summary
            read like a regulatory submission.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={publicLinks.factorforgeApp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-teal-500 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-teal-400"
            >
              Generate a report ↗
            </a>
            <Link
              href="/evidence-toolkit"
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-slate-400"
            >
              See the evidence contract
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-teal-950/30">
          <div className="border-b border-slate-700 px-6 py-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Researcher Decision Report
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-2xl font-black text-amber-300">Conditional pass</p>
                <p className="mt-1 text-sm text-slate-300">Review warnings before candidate selection.</p>
              </div>
              <p className="text-sm font-bold text-slate-400">0 required fails · 2 warnings</p>
            </div>
          </div>
          <ol className="divide-y divide-slate-800">
            {reportLayers.map((item) => (
              <li key={item.number} className="grid grid-cols-[2.5rem_1fr] gap-4 px-6 py-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-black text-teal-300">
                  {item.number}
                </span>
                <div>
                  <h3 className="font-extrabold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="border-t border-slate-700 bg-slate-950/60 px-6 py-4 text-sm leading-relaxed text-slate-400">
            The report supports research review. It does not establish expression,
            biological performance, regulatory acceptance, or experimental validity.
          </p>
        </div>
      </div>
    </section>
  );
}
