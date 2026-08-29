import Link from "next/link";
import ResearchNoteCard from "./ResearchNoteCard";
import { getFeaturedResearchNotes } from "@/app/lib/research-notes";

export default function ResearchNotesPreview() {
  const notes = getFeaturedResearchNotes(4);

  return (
    <section className="bg-white px-6 py-24 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
              Research Notes
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              The decisions, dead ends, and lessons behind the work.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Engineering investigations and computational observations from building
              reproducible, evidence-aware bio-design software.
            </p>
          </div>
          <Link
            href="/research-notes"
            className="shrink-0 text-sm font-bold text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
          >
            View all Research Notes →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {notes.map((note, index) => (
            <ResearchNoteCard key={note.slug} note={note} featured={index === 0} />
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Research Notes are editorial records, not peer-reviewed publications or
          biological validation evidence. Incomplete and superseded work remains visible
          when it helps explain how a decision changed.
        </p>
      </div>
    </section>
  );
}

