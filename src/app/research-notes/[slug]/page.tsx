import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import { getAllResearchNotes, getResearchNote } from "@/app/lib/research-notes";

type NotePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllResearchNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getResearchNote(slug);
  if (!note) return {};

  return {
    title: `${note.title} — Eijex Research Notes`,
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

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Nav />
      <article>
        <header className="border-b border-slate-200 bg-slate-50 px-6 py-16 dark:border-slate-800 dark:bg-slate-900 sm:py-24">
          <div className="mx-auto max-w-4xl">
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
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
          <div className="research-note-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
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

