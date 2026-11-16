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
    id: "paper-1-v2",
    track: "Preprint · Preprints.org (v2)",
    statusBadge: "Published Preprint v2",
    statusClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300",
    title:
      "Constraint-Aware Coding-Sequence Design for Nicotiana benthamiana: A 49,257-Record Benchmark and Codon-Reference Sensitivity Analysis",
    authors: "Mun-Kyu Kim (Sole Author)",
    date: "16 November 2026",
    doi: "10.20944/preprints202610.3128.v2",
    doiUrl: "https://doi.org/10.20944/preprints202610.3128.v2",
    pdfUrl: "/papers/FactorForge_Preprint_v1.1.8.pdf",
    version: "v2 (Preprint v1.1.8)",
    abstract:
      "Synonymous coding sequence (CDS) design for plant molecular pharming requires simultaneously satisfying strict sequence-level synthesis constraints, global GC distributions, and host codon adaptation. Evaluated across 49,257 SGN QLD183 records and a FactorForge v3.6.4 2x2 factorial sensitivity analysis crossing legacy vs. NbeV1.1 codon references with GC target windows (55-65% vs. 40-47%), this preprint establishes reproducible computational baselines (1DP) without claiming unverified in vivo expression.",
    highlights: [
      "49,257-record SGN QLD183 benchmark and v3.6.4 2x2 codon-reference x GC factorial sensitivity analysis",
      "Assembly-friendly combined pass rate shifts from 0.00% to 9.39% when GC window aligns with NbeV1.1",
      "Explicit separation of computational pass rates from empirical wet-lab expression evidence",
    ],
    nextRevisionNote: "Version 2 published (DOI: 10.20944/preprints202610.3128.v2), superseding Version 1.",
  },
  {
    id: "paper-1-v1",
    track: "Preprint · Preprints.org (v1)",
    statusBadge: "Published Preprint v1 (Archived)",
    statusClass: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-300",
    title:
      "Constraint-Aware Coding-Sequence Design for Nicotiana benthamiana: A 49,257-Record Benchmark and Codon-Reference Sensitivity Analysis",
    authors: "Mun-Kyu Kim (Sole Author)",
    date: "28 October 2026",
    doi: "10.20944/preprints202610.3128.v1",
    doiUrl: "https://doi.org/10.20944/preprints202610.3128.v1",
    pdfUrl: "/papers/FactorForge_Preprint_v1.2.14.pdf",
    version: "v1 (Preprint v1.2.14, 45 pages)",
    abstract:
      "Initial open-access preprint establishing the FactorForge v3.2.0 preset benchmark and matched v3.3.0 dynamic programming evaluation across 49,257 Nicotiana benthamiana transcript records.",
    highlights: [
      "Sole-authored, 45-page initial benchmark monograph",
      "Matched evaluation across 49,257 SGN QLD183 CDS records",
      "Preserved as the original citable Version 1 snapshot",
    ],
    nextRevisionNote: "Original Version 1 snapshot (DOI: 10.20944/preprints202610.3128.v1); see Version 2 above for the latest revision.",
  },
  {
    id: "paper-5",
    track: "PRISM Monograph Series · Paper 5",
    statusBadge: "Working Revision (v0.2.23)",
    statusClass: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-300",
    title:
      "Exact Synonymous Optimization with Bounded Dinucleotide and Positional Constraints: The FactorForge Assembly Compiler",
    authors: "Mun-Kyu Kim",
    date: "November 2026",
    doi: "In Preparation",
    doiUrl: null,
    pdfUrl: null,
    version: "v0.2.23",
    abstract:
      "Formalizes the mathematical state-space formulation of the FactorForge 1DP sequence compiler. Demonstrates exact finite-state dynamic programming across multi-constraint lattices, proving conditional optimality while preserving Type IIS restriction assembly invariants.",
    highlights: [
      "Rigorous O(N · |S|) DP algorithmic complexity analysis",
      "Exact finite-state automaton verification for boundary-spanning motifs",
      "Benchmark comparison against heuristic codon optimizers (DNA Chisel)",
    ],
    nextRevisionNote: "Under review within the PRISM monograph series.",
  },
  {
    id: "paper-6",
    track: "PRISM Monograph Series · Paper 6",
    statusBadge: "Working Revision (v0.2.12)",
    statusClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300",
    title:
      "Cotranslational Domain Folding and Ribosome Exit-Tunnel Latency in Plant Molecular Pharming",
    authors: "Mun-Kyu Kim",
    date: "November 2026",
    doi: "In Preparation",
    doiUrl: null,
    pdfUrl: null,
    version: "v0.2.12",
    abstract:
      "Formulates the 3DP and 4DP biophysical hypotheses for eukaryotic translation. Investigates whether synchronizing codon elongation rates with the secondary-structure-dependent (+30/+35/+40 aa) 80S ribosome exit-tunnel emergence latency alters cotranslational folding fidelity for complex biotherapeutics.",
    highlights: [
      "Matched comparative framework (1DP vs 3DP vs 4DP)",
      "Strict separation between crystallographic coordinates and translational hypotheses",
      "Formal evidence chain from in-silico metrics to prospective wet-lab readouts",
    ],
    nextRevisionNote: "Matched Adalimumab wet-lab benchmark protocol integration in progress.",
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
              Peer-reviewed manuscripts, official open-access preprints, and versioned research monographs supporting the Eijex bio-design platform. All publications are tied to reproducible code, open benchmark datasets, and auditable evidence bundles.
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
                      <span>📥</span> Download Full Monograph PDF (45 Pages)
                    </a>
                  )}
                  {!paper.doiUrl && (
                    <span className="text-xs text-slate-400 italic">
                      Manuscript undergoing PRISM internal peer review. Previews available upon academic request.
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
