import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import ResearchNoteCard from "@/app/components/ResearchNoteCard";
import { getAllResearchNotes } from "@/app/lib/research-notes";

export const metadata: Metadata = {
  title: "Research Notes — eijex",
  description:
    "Engineering decisions, computational observations, incomplete experiments, and lessons from building the Eijex research software stack.",
  alternates: {
    canonical: "/research-notes",
    types: { "application/rss+xml": "/research-notes/feed.xml" },
  },
};

export default function ResearchNotesPage() {
  const notes = getAllResearchNotes();
  const sectionOrder = [
    "Architecture and direction",
    "Design and validation",
    "Evidence and governance",
    "Models and comparative evaluation",
    "Reliability and release engineering",
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Nav />
      <header className="border-b border-slate-200 bg-white px-6 py-20 dark:border-slate-800 dark:bg-slate-900 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-400">
            Eijex editorial archive
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-7xl">
            Research Notes
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            What we learned while building reproducible, evidence-aware bio-design
            software—including investigations that failed, assumptions that changed, and
            work that remains incomplete.
          </p>
        </div>
      </header>
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl space-y-20">
          {sectionOrder.map((section, sectionIndex) => {
            const sectionNotes = notes
              .filter((note) => note.bookSection === section)
              .sort((a, b) => a.bookOrder - b.bookOrder);
            if (sectionNotes.length === 0) return null;

            return (
              <section key={section} id={`section-${sectionIndex + 1}`}>
                <div className="mb-8 flex items-baseline gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
                  <span className="text-sm font-extrabold text-teal-700 dark:text-teal-400">
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                    {section}
                  </h2>
                  <span className="ml-auto text-xs font-semibold text-slate-400">
                    {sectionNotes.length} {sectionNotes.length === 1 ? "note" : "notes"}
                  </span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {sectionNotes.map((note) => (
                    <ResearchNoteCard key={note.slug} note={note} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
      <Footer />
    </main>
  );
}
