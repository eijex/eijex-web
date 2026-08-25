import { researchTracks } from "@/app/lib/ecosystem";

export default function Research() {
  return (
    <section id="research" className="bg-slate-50 px-6 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-400">
            Research program
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Software claims and research evidence advance separately.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Each research track has its own scope, evidence gate, and publication
            path. Neither substitutes computational results for physical observations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {researchTracks.map((track, index) => (
            <article
              key={track.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-extrabold text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                  {index + 1}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {track.label}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-slate-950 dark:text-white">
                {track.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {track.description}
              </p>
              <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                Current status: {track.status}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
