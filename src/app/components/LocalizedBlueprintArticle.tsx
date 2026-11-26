"use client";

import type { ReactNode } from "react";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import LeanBlueprintDiagram from "./LeanBlueprintDiagram";
import type { LeanFormalModule } from "@/app/lib/research-notes";

export type BlueprintLocaleEntry = {
  lang: string;
  langLabel: string;
  title: string;
  summary: string;
  version?: string;
  evidenceScope: string;
  abstract?: string;
  pdfLabel?: string;
  fullPdfLabel?: string;
  bundleLabel?: string;
  toc?: Array<{ id: string; number: string; title: string }>;
  renderedBody: ReactNode;
};

type LocalizedBlueprintArticleProps = {
  category: string;
  status: string;
  date: string;
  readingMinutes: number;
  pdfUrl?: string;
  fullPdfUrl?: string;
  fullPdfLabel?: string;
  bundleUrl?: string;
  locales: BlueprintLocaleEntry[];
  fullModules: LeanFormalModule[];
};

const STATE_CHANGE_EVENT = "eijex-blueprint-state-change";

function subscribeToLocation(callback: () => void): () => void {
  window.addEventListener("popstate", callback);
  window.addEventListener(STATE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(STATE_CHANGE_EVENT, callback);
  };
}

function readLangFromLocation(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get("lang")?.toLowerCase() ?? "en";
}

function readViewFromLocation(): "summary" | "full" {
  const params = new URLSearchParams(window.location.search);
  return params.get("view")?.toLowerCase() === "full" ? "full" : "summary";
}

export default function LocalizedBlueprintArticle({
  category,
  status,
  date,
  readingMinutes,
  pdfUrl,
  fullPdfUrl,
  fullPdfLabel,
  bundleUrl,
  locales,
  fullModules,
}: LocalizedBlueprintArticleProps) {
  const requestedLang = useSyncExternalStore(
    subscribeToLocation,
    readLangFromLocation,
    () => "en",
  );
  const viewMode = useSyncExternalStore(
    subscribeToLocation,
    readViewFromLocation,
    () => "summary" as const,
  );
  const [expandAllModules, setExpandAllModules] = useState<boolean | null>(null);

  const current = locales.find((item) => item.lang === requestedLang) ?? locales[0];
  const leanModuleCount = fullModules.filter((m) => m.path.endsWith(".lean")).length;
  const totalLeanLines = fullModules
    .filter((m) => m.path.endsWith(".lean"))
    .reduce((acc, m) => acc + m.lines, 0);

  function selectLanguage(lang: string) {
    const url = new URL(window.location.href);
    if (lang === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", lang);
    }
    window.history.replaceState(null, "", url.toString());
    window.dispatchEvent(new Event(STATE_CHANGE_EVENT));
  }

  function selectView(nextView: "summary" | "full") {
    const url = new URL(window.location.href);
    if (nextView === "summary") {
      url.searchParams.delete("view");
    } else {
      url.searchParams.set("view", "full");
    }
    window.history.replaceState(null, "", url.toString());
    window.dispatchEvent(new Event(STATE_CHANGE_EVENT));
  }

  const moduleGroups: Array<LeanFormalModule["group"]> = [
    "Locked Spec (Spec/)",
    "Kernel Proofs (Proofs/)",
    "Package Root, Witnesses & Audit",
    "Kernel Output",
  ];

  return (
    <article lang={current.lang}>
      <header className="border-b border-slate-200 bg-slate-50 px-6 py-14 dark:border-slate-800 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/research-notes"
              className="text-sm font-bold text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
            >
              ← All Research Notes
            </Link>

            <div className="flex flex-wrap items-center gap-2.5">
              {fullModules.length > 0 && (
                <div
                  role="group"
                  aria-label="Edition view selector"
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  <button
                    type="button"
                    onClick={() => selectView("summary")}
                    aria-pressed={viewMode === "summary"}
                    className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      viewMode === "summary"
                        ? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-950"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    type="button"
                    onClick={() => selectView("full")}
                    aria-pressed={viewMode === "full"}
                    className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      viewMode === "full"
                        ? "bg-teal-700 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    Full Proof ({totalLeanLines.toLocaleString()} lines)
                  </button>
                </div>
              )}

              <nav
                aria-label="Language selector"
                className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xs dark:border-slate-700 dark:bg-slate-950"
              >
                {locales.map((item) => {
                  const selected = item.lang === current.lang;
                  return (
                    <button
                      key={item.lang}
                      type="button"
                      onClick={() => selectLanguage(item.lang)}
                      aria-pressed={selected}
                      className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        selected
                          ? "bg-teal-700 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`}
                    >
                      {item.langLabel}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
            <span className="rounded-full bg-teal-100 px-3 py-1.5 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              {category}
            </span>
            <span className="text-slate-500 dark:text-slate-400">{status}</span>
            {current.version && (
              <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-mono text-[11px] normal-case text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {current.version}
              </span>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-[1.12] tracking-[-0.03em] text-slate-950 dark:text-white sm:text-5xl">
            {current.title}
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            {current.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span className="text-slate-800 dark:text-slate-200">Mun-Kyu Kim (Eijex Research)</span>
            <time dateTime={date}>{date}</time>
            <span>{readingMinutes} min read</span>
            <span>{current.evidenceScope}</span>
          </div>

          {(pdfUrl || fullPdfUrl || bundleUrl) && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-600"
                >
                  <span>📄</span>
                  <span>{current.pdfLabel ?? "Download Summary Monograph (PDF)"}</span>
                </a>
              )}
              {fullPdfUrl && (
                <a
                  href={fullPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-teal-950 dark:text-teal-200 dark:ring-1 dark:ring-teal-700 dark:hover:bg-teal-900"
                >
                  <span>📚</span>
                  <span>
                    {current.fullPdfLabel ??
                      fullPdfLabel ??
                      "Download Full Verification Monograph (PDF)"}
                  </span>
                </a>
              )}
              {bundleUrl && (
                <a
                  href={bundleUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  <span>📦</span>
                  <span>{current.bundleLabel ?? "Download Reproducible Verification Bundle (.zip)"}</span>
                </a>
              )}
            </div>
          )}

          {current.abstract && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950/80 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Abstract &amp; Formal Verification Scope
                </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  leanprover/lean4:v4.36.0 · 20+3 Theorems · 14 Witnesses · 0 sorry
                </span>
              </div>
              <p className="mt-3.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-[15px]">
                {current.abstract}
              </p>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {current.toc && current.toc.length > 0 && (
          <nav
            aria-label="Blueprint table of contents"
            className="mb-10 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
          >
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Contents · Formal Blueprint &amp; Proof Architecture
            </p>
            <ol className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
              {current.toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="group flex items-baseline gap-2.5 rounded-lg py-1 text-slate-700 transition hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300"
                  >
                    <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                      §{item.number}
                    </span>
                    <span className="font-medium group-hover:underline">{item.title}</span>
                  </a>
                </li>
              ))}
              {viewMode === "full" && (
                <li>
                  <a
                    href="#full-proof-appendix"
                    className="group flex items-baseline gap-2.5 rounded-lg py-1 text-teal-700 transition hover:text-teal-900 dark:text-teal-300"
                  >
                    <span className="font-mono text-xs font-bold">§A-D</span>
                    <span className="font-bold group-hover:underline">
                      Complete Lean 4 Source &amp; Axiom Audit ({totalLeanLines.toLocaleString()} lines)
                    </span>
                  </a>
                </li>
              )}
            </ol>
          </nav>
        )}

        <LeanBlueprintDiagram />

        <div className="research-note-prose">{current.renderedBody}</div>

        {viewMode === "summary" && fullModules.length > 0 && (
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-teal-50/60 p-6 dark:border-teal-900 dark:bg-teal-950/30">
            <div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                Want to inspect all {totalLeanLines.toLocaleString()} lines of Lean 4 specifications &amp; tactic proofs?
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Switch to Full Proof mode to browse all {leanModuleCount} modules (including FactorForgeFormal.lean, Spec/, Proofs/, Witnesses.lean, Audit.lean) and the 34 #print axioms kernel outputs inline, or download the Complete Full Monograph PDF.
              </p>
            </div>
            <button
              type="button"
              onClick={() => selectView("full")}
              className="cursor-pointer rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-600"
            >
              Open Full Proof Appendix →
            </button>
          </div>
        )}

        {viewMode === "full" && fullModules.length > 0 && (
          <section
            id="full-proof-appendix"
            className="mt-16 scroll-mt-24 border-t border-slate-200 pt-12 dark:border-slate-800"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Appendices A-D · Complete Kernel Source
                </span>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  Full Lean 4.36.0 Verification Modules ({leanModuleCount} modules, {totalLeanLines.toLocaleString()} lines)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setExpandAllModules((prev) => !prev)}
                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {expandAllModules ? "Collapse all modules" : `Expand all ${leanModuleCount} Lean modules and audit output`}
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Source characters are preserved from the pinned verification archive. Use the ZIP
              for the executable Lake project and Python checks. The audit output directly lists
              20 core theorems and 14 witnesses; the three helper lemmas are present in the proof modules.
            </p>
            <div className="mt-8 space-y-10">
              {moduleGroups.map((group) => {
                const groupItems = fullModules.filter((m) => m.group === group);
                if (groupItems.length === 0) return null;
                return (
                  <div key={group} className="space-y-3">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {group} ({groupItems.length}{" "}
                      {groupItems.length === 1 ? "file" : "files"})
                    </h3>
                    <div className="space-y-3">
                      {groupItems.map((mod, idx) => (
                        <details
                          key={mod.id}
                          open={expandAllModules ?? (group === "Locked Spec (Spec/)" && idx === 0)}
                          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:text-white dark:hover:bg-slate-900">
                            <span className="font-mono text-xs sm:text-sm">{mod.path}</span>
                            <span className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                              <span>{mod.lines} lines</span>
                              <span className="font-mono group-open:hidden">Show ▾</span>
                              <span className="hidden font-mono group-open:inline">Hide ▴</span>
                            </span>
                          </summary>
                          <div className="border-t border-slate-200 bg-slate-950 p-4 dark:border-slate-800">
                            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-slate-100">
                              <code>{mod.code}</code>
                            </pre>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <aside className="mt-16 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100 sm:p-8">
          <p className="font-extrabold">About this note</p>
          <p className="mt-2">
            Research Notes preserve engineering decisions, computational observations,
            incomplete experiments, and corrected interpretations. They are not
            peer-reviewed publications or biological validation evidence. Public-redacted
            cases omit partner identity, raw sequences, private records, and infrastructure
            identifiers.
          </p>
        </aside>
      </div>
    </article>
  );
}
