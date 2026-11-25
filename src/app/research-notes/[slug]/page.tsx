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
import LocalizedBlueprintArticle from "@/app/components/LocalizedBlueprintArticle";
import {
  getAllResearchNotes,
  getLeanFormalModules,
  getResearchNote,
  getResearchNoteTranslations,
} from "@/app/lib/research-notes";

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

const CALLOUT_PREFIX =
  /^(Definition|Theorem|Lemma|Corollary|Proof sketch|Runtime boundary|정의|정리|보조정리|증명 스케치|실행 경계|定義|定理|補題|証明スケッチ|ランタイム境界|定义|引理|证明概要|运行边界|Définition|Théorème|Lemme|Esquisse de preuve|Limite d'exécution|Definición|Teorema|Lema|Bosquejo de prueba|Límite de ejecución|Определение|Теорема|Лемма|Схема доказательства|Граница выполнения|Satz|Beweisskizze|Laufzeitgrenze)\b/i;
const PROOF_PREFIX =
  /^(Proof sketch|증명 스케치|証明スケッチ|证明概要|Esquisse de preuve|Bosquejo de prueba|Схема доказательства|Beweisskizze)\b/i;
const BOUNDARY_PREFIX =
  /^(Runtime boundary|실행 경계|ランタイム境界|运行边界|Limite d'exécution|Límite de ejecución|Граница выполнения|Laufzeitgrenze)\b/i;

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
    if (!CALLOUT_PREFIX.test(text)) {
      return <blockquote>{children}</blockquote>;
    }
    const isProof = PROOF_PREFIX.test(text);
    const isBoundary = BOUNDARY_PREFIX.test(text);
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
  const translations = isBlueprint ? getResearchNoteTranslations(note) : [];
  const fullModules = isBlueprint ? getLeanFormalModules() : [];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Nav />
      {isBlueprint && translations.length > 1 ? (
        <LocalizedBlueprintArticle
          category={note.category}
          status={note.status}
          date={note.date}
          readingMinutes={note.readingMinutes}
          pdfUrl={note.pdfUrl}
          fullPdfUrl={note.fullPdfUrl}
          fullPdfLabel={note.fullPdfLabel}
          bundleUrl={note.bundleUrl}
          fullModules={fullModules}
          locales={translations.map((loc) => ({
            lang: loc.lang,
            langLabel: loc.langLabel,
            title: loc.title,
            summary: loc.summary,
            version: loc.version,
            evidenceScope: loc.evidenceScope,
            abstract: loc.abstract,
            pdfLabel: loc.pdfLabel,
            bundleLabel: loc.bundleLabel,
            toc: loc.toc,
            renderedBody: (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={blueprintComponents}
              >
                {loc.content}
              </ReactMarkdown>
            ),
          }))}
        />
      ) : (
        <article>
          <header className="border-b border-slate-200 bg-slate-50 px-6 py-16 dark:border-slate-800 dark:bg-slate-900 sm:py-24">
            <div className={isBlueprint ? "mx-auto max-w-5xl" : "mx-auto max-w-4xl"}>
              <Link
                href="/research-notes"
                className="text-sm font-bold text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
              >
                ← All Research Notes
              </Link>
              <div className="mt-10 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
                <span className="rounded-full bg-teal-100 px-3 py-1.5 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {note.category}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{note.status}</span>
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl">
                {note.title}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {note.summary}
              </p>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <time dateTime={note.date}>{note.date}</time>
                <span>{note.readingMinutes} min read</span>
                <span>{note.evidenceScope}</span>
              </div>
              {(note.pdfUrl || note.bundleUrl) && (
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {note.pdfUrl && (
                    <a
                      href={note.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-600"
                    >
                      <span>📄</span>
                      <span>{note.pdfLabel ?? "Download Technical Note (PDF)"}</span>
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
            </div>
          </header>

          <div className={isBlueprint ? "mx-auto max-w-5xl px-6 py-12 sm:py-16" : "mx-auto max-w-4xl px-6 py-14 sm:py-20"}>
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
      )}
      <Footer />
    </main>
  );
}
