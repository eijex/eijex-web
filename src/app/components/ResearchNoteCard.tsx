import Link from "next/link";
import type { ResearchNote } from "@/app/lib/research-notes";

const categoryTone: Record<string, string> = {
  "Rule/LM Architecture": "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  "Design & Validation": "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
  "Evidence Infrastructure": "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  "Reliability & Release": "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  "External Models": "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
};

export default function ResearchNoteCard({
  note,
  featured = false,
}: {
  note: ResearchNote;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${
        featured ? "md:p-9" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider ${
            categoryTone[note.category] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {note.category}
        </span>
        <span className="text-xs font-semibold text-slate-400">{note.status}</span>
      </div>
      <h3
        className={`mt-5 font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white ${
          featured ? "text-3xl sm:text-4xl" : "text-xl"
        }`}
      >
        <Link href={`/research-notes/${note.slug}`} className="after:absolute after:inset-0">
          {note.title}
        </Link>
      </h3>
      <p className={`mt-4 leading-relaxed text-slate-600 dark:text-slate-300 ${featured ? "text-base" : "text-sm"}`}>
        {note.summary}
      </p>
      <div className="relative mt-auto flex items-center justify-between gap-4 pt-7 text-xs font-semibold text-slate-400">
        <span><time dateTime={note.date}>{note.date}</time> · {note.readingMinutes} min</span>
        <span className="transition group-hover:text-slate-700 dark:group-hover:text-slate-200">Read note →</span>
      </div>
    </article>
  );
}
