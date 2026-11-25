"use client";

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import LeanBlueprintDiagram from "./LeanBlueprintDiagram";

export type BlueprintLocaleEntry = {
  lang: string;
  langLabel: string;
  title: string;
  summary: string;
  version?: string;
  evidenceScope: string;
  abstract?: string;
  pdfLabel?: string;
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
  bundleUrl?: string;
  locales: BlueprintLocaleEntry[];
};

const LANG_CHANGE_EVENT = "eijex-blueprint-lang-change";

function subscribeToLang(callback: () => void): () => void {
  window.addEventListener("popstate", callback);
  window.addEventListener(LANG_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(LANG_CHANGE_EVENT, callback);
  };
}

function readLangFromLocation(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get("lang")?.toLowerCase() ?? "en";
}

export default function LocalizedBlueprintArticle({
  category,
  status,
  date,
  readingMinutes,
  pdfUrl,
  bundleUrl,
  locales,
}: LocalizedBlueprintArticleProps) {
  const requestedLang = useSyncExternalStore(
    subscribeToLang,
    readLangFromLocation,
    () => "en",
  );
  const current = locales.find((item) => item.lang === requestedLang) ?? locales[0];

  function selectLanguage(lang: string) {
    const url = new URL(window.location.href);
    if (lang === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", lang);
    }
    window.history.replaceState(null, "", url.toString());
    window.dispatchEvent(new Event(LANG_CHANGE_EVENT));
  }

  return (
    <article lang={current.lang}>
      <header className="border-b border-slate-200 bg-slate-50 px-6 py-14 dark:border-slate-800 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/research-notes"
              className="text-sm font-bold text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
            >
              ← All Research Notes
            </Link>

            <nav
              aria-label="Language selector"
              className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-xs dark:border-slate-700 dark:bg-slate-950"
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

          {(pdfUrl || bundleUrl) && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-600"
                >
                  <span>📄</span>
                  <span>{current.pdfLabel ?? "Download Technical Monograph (PDF)"}</span>
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
            </ol>
          </nav>
        )}

        <LeanBlueprintDiagram />

        <div className="research-note-prose">{current.renderedBody}</div>

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
