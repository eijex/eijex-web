import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import LeanBlueprintDiagram from "@/app/components/LeanBlueprintDiagram";
import { getAllResearchNotes, getResearchNote } from "@/app/lib/research-notes";

type NotePageProps = { params: Promise<{ slug: string }> };

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return extractText(props?.children);
  }
  return "";
}

function headingIdFromText(text: string): string {
  const secMatch = text.trim().match(/^(\d+)\.\s+/);
  if (secMatch) return `sec-${secMatch[1]}`;
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const blueprintComponents: Components = {
  h2({ children }) {
    const id = headingIdFromText(extractText(children));
    return (
      <h2 id={id} className="scroll-mt-24 border-b border-slate-200 pb-2.5 dark:border-slate-800">
        {children}
      </h2>
    );
  },
  h3({ children }) {
    const id = headingIdFromText(extractText(children));
    return (
      <h3 id={id} className="scroll-mt-24">
        {children}
      </h3>
    );
  },
  blockquote({ children }) {
    const text = extractText(children).trim();
    const isFormalBlock =
      /^(Definition|Theorem|Lemma|Corollary|Proof sketch|Runtime boundary)\b/i.test(text);
    if (!isFormalBlock) {
      return <blockquote>{children}</blockquote>;
    }
    const isProof = /^Proof sketch\b/i.test(text);
    const isBoundary = /^Runtime boundary\b/i.test(text);
    const toneClass = isBoundary
      ? "border-amber-500/80 bg-amber-50/70 dark:border-amber-500/70 dark:bg-amber-950/25"
      : isProof
        ? "border-slate-400 bg-slate-50/90 dark:border-slate-600 dark:bg-slate-900/60"
        : "border-teal-600 bg-teal-50/45 dark:border-teal-400 dark:bg-slate-900/80";

    return <div className={`blueprint-callout ${toneClass}`}>{children}</div>;
  },
  table({ children }) {
    return (
      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="!my-0">{children}</table>
      </div>
    );
  },
};

export function generateStaticParams() {
  return getAllResearchNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getResearchNote(slug);
  if (!note) return {};

  return {
    title: `${note.title} - Eijex Research Notes`,
    description: note.summary,
    alternates: { canonical: `/research-notes/${note.slug}` },
    openGraph: {
      type: "article",
      title: note.title,
      description: note.summary,
      publishedTime: note.date,
      modifiedTime: note.updated,
      images: [],
    },
    twitter: {
      card: "summary",
      title: note.title,
      description: note.summary,
      images: [],
    },
  };
}

export default async function ResearchNotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getResearchNote(slug);
  if (!note) notFound();

  const isBlueprint = note.layout === "blueprint";

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Nav />
      <article>
        <header className="border-b border-slate-200 bg-slate-50 px-6 py-14 dark:border-slate-800 dark:bg-slate-900 sm:py-20">
          <div className={isBlueprint ? "mx-auto max-w-5xl" : "mx-auto max-w-4xl"}>
            <Link
              href="/research-notes"
              className="text-sm font-bold text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
            >
              ← All Research Notes
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
              <span className="rounded-full bg-teal-100 px-3 py-1.5 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                {note.category}
              </span>
              <span className="text-slate-500 dark:text-slate-400">{note.status}</span>
              {note.version && (
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-mono text-[11px] normal-case text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {note.version}
                </span>
              )}
            </div>
            <h1
              className={
                isBlueprint
                  ? "mt-5 text-3xl font-extrabold leading-[1.12] tracking-[-0.03em] text-slate-950 dark:text-white sm:text-5xl"
                  : "mt-6 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl"
              }
            >
              {note.title}
            </h1>
            <p className="mt-5 max-w-4xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {note.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {isBlueprint && (
                <span className="text-slate-800 dark:text-slate-200">Mun-Kyu Kim (Eijex Research)</span>
              )}
              <time dateTime={note.date}>{note.date}</time>
              <span>{note.readingMinutes} min read</span>
              <span>{note.evidenceScope}</span>
            </div>
            {(note.pdfUrl || note.bundleUrl) && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {note.pdfUrl && (
                  <a
                    href={note.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-600"
                  >
                    <span>📄</span>
                    <span>{note.pdfLabel ?? "Download Technical Monograph (PDF)"}</span>
                  </a>
                )}
                {note.bundleUrl && (
                  <a
                    href={note.bundleUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    <span>📦</span>
                    <span>{note.bundleLabel ?? "Download Reproducible Verification Bundle (.zip)"}</span>
                  </a>
                )}
              </div>
            )}

            {isBlueprint && note.abstract && (
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
                  {note.abstract}
                </p>
              </div>
            )}
          </div>
        </header>

        <div className={isBlueprint ? "mx-auto max-w-5xl px-6 py-12 sm:py-16" : "mx-auto max-w-4xl px-6 py-14 sm:py-20"}>
          {isBlueprint && note.toc && note.toc.length > 0 && (
            <nav
              aria-label="Blueprint table of contents"
              className="mb-10 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
            >
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Contents · Formal Blueprint &amp; Proof Architecture
              </p>
              <ol className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                {note.toc.map((item) => (
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

          {isBlueprint && <LeanBlueprintDiagram />}

          <div className="research-note-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={isBlueprint ? blueprintComponents : undefined}
            >
              {note.content}
            </ReactMarkdown>
          </div>

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
      <Footer />
    </main>
  );
}
