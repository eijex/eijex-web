import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Academic Papers & Preprints — eijex",
  description:
    "Peer-reviewed manuscripts, open-access preprints, and reproducible evidence artifacts from the Eijex bio-design research consortium.",
};

const PAPERS = [
  {
    id: "paper-1-v3",
    track: "Preprint · Preprints.org (v3)",
    statusBadge: "Published Preprint v3",
    statusClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300",
    title:
      "Constraint-Aware Coding-Sequence Design for Nicotiana benthamiana: A 49,257-Record Benchmark and Codon-Reference Sensitivity Analysis",
    authors: "Mun-Kyu Kim (Sole Author)",
    date: "19 November 2026",
    doi: "10.20944/preprints202610.3128.v3",
    doiUrl: "https://doi.org/10.20944/preprints202610.3128.v3",
    pdfUrl: "/papers/FactorForge_Preprint_v1.2.2.pdf",
    version: "Version 3",
    abstract:
      "Synonymous coding sequence (CDS) design for plant molecular pharming requires simultaneously satisfying strict sequence-level synthesis constraints, global GC distributions, and host codon adaptation. Preserving the 49,257-record SGN QLD183 benchmark and FactorForge v3.6.4 2x2 factorial sensitivity analysis unchanged, Version 3 adds explicit prior-art positioning relative to exact and multicriteria dynamic-programming codon optimization (Condon and Thachuk, COSMO) and CoDOn alongside expanded provenance and audit-bundle documentation.",
    highlights: [
      "Explicit prior-art positioning vs. Condon & Thachuk, COSMO, and CoDOn (Sections 1.2, 2.4, 3.5, 5.2; Table 9)",
      "49,257-record SGN QLD183 benchmark and v3.6.4 2x2 codon-reference x GC factorial sensitivity analysis preserved",
      "Explicit three-execution software boundary (v3.2.0, v3.3.0, v3.6.4) with computational-only evidence separation",
    ],
    nextRevisionNote: "Version 3 published (DOI: 10.20944/preprints202610.3128.v3), superseding Version 2.",
    previousVersions: [
      {
        version: "Version 2",
        date: "16 November 2026",
        doi: "10.20944/preprints202610.3128.v2",
        doiUrl: "https://doi.org/10.20944/preprints202610.3128.v2",
        summary: "Added FactorForge v3.6.4 2x2 codon-reference x GC factorial sensitivity analysis and High-CAI contract reconciliation.",
      },
      {
        version: "Version 1 (45 pages)",
        date: "28 October 2026",
        doi: "10.20944/preprints202610.3128.v1",
        doiUrl: "https://doi.org/10.20944/preprints202610.3128.v1",
        summary: "Initial open-access benchmark across 49,257 SGN QLD183 CDS records (FactorForge v3.2.0 presets and v3.3.0 DP).",
      },
    ],
  },
];

export default function PapersPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      <div>
        <Nav />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-semibold text-teal-800 dark:text-teal-300">
              <span>📄</span> Academic Literature &amp; Evidence Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Papers &amp; Preprints
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Official open-access preprints and peer-reviewed publications supporting the Eijex bio-design platform. All published works are tied to reproducible code, open benchmark datasets, and auditable evidence bundles.
            </p>
          </div>

          {/* Papers List */}
          <div className="space-y-8">
            {PAPERS.map((paper) => (
              <article
                key={paper.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-5"
              >
                {/* Meta Badge Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      {paper.track}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {paper.version}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${paper.statusClass}`}
                  >
                    {paper.statusBadge}
                  </span>
                </div>

                {/* Title & Author */}
                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                    {paper.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{paper.authors}</span> · {paper.date}
                  </p>
                </div>

                {/* Abstract */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {paper.abstract}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Key Scientific Findings &amp; Evidence
                  </h3>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
                    {paper.highlights.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </div>

                {/* Revision Note */}
                {paper.nextRevisionNote && (
                  <div className="text-[11px] text-teal-800 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/30 px-3 py-2 rounded-lg border border-teal-100 dark:border-teal-900">
                    <span className="font-bold">Next Horizon:</span> {paper.nextRevisionNote}
                  </div>
                )}

                {/* Action Links */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {paper.doiUrl && (
                    <a
                      href={paper.doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-4 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5 transition-all"
                    >
                      <span>🌐</span> View on Preprints.org (DOI: {paper.doi})
                    </a>
                  )}
                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs inline-flex items-center gap-1.5 transition-all"
                    >
                      <span>📥</span> Download Preprint PDF
                    </a>
                  )}
                </div>

                {/* Collapsible Previous Versions */}
                {paper.previousVersions && paper.previousVersions.length > 0 && (
                  <details className="group pt-4 border-t border-slate-100 dark:border-slate-800">
                    <summary className="cursor-pointer list-none flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 select-none">
                      <span>
                        Previous Versions ({paper.previousVersions.length}) ·{" "}
                        {paper.previousVersions.map((p) => p.version.split(" ")[0]).join(", ")}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 group-open:hidden">
                        Show ▾
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 hidden group-open:inline">
                        Hide ▴
                      </span>
                    </summary>
                    <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                      {paper.previousVersions.map((prev) => (
                        <li
                          key={prev.doi}
                          className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                                {prev.version}
                              </span>
                              <span className="text-slate-300 dark:text-slate-700">·</span>
                              <span className="text-slate-500 dark:text-slate-400">
                                {prev.date}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {prev.summary}
                            </p>
                          </div>
                          <a
                            href={prev.doiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] text-teal-700 dark:text-teal-400 hover:underline shrink-0"
                          >
                            DOI: {prev.doi} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
