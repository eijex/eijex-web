import { implementationStatus } from "@/app/lib/ecosystem";

const toneStyles = {
  emerald: {
    border: "border-emerald-200 dark:border-emerald-900",
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-900",
    badge:
      "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },
  slate: {
    border: "border-slate-200 dark:border-slate-700",
    badge:
      "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  },
} as const;

export default function ImplementationStatus() {
  return (
    <section id="status" className="bg-slate-50 px-6 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
            Implementation status
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            What exists today—and what still has to be proven.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Public software availability and database integration are different
            milestones. This view keeps them separate.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {implementationStatus.map((column) => {
            const styles = toneStyles[column.tone];
            return (
              <article
                key={column.label}
                className={`rounded-2xl border bg-white p-6 dark:bg-slate-900 ${styles.border}`}
              >
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-wider ${styles.badge}`}
                >
                  {column.label}
                </span>
                <ul className="mt-5 space-y-3">
                  {column.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                    >
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center text-sm leading-relaxed text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          These checkpoints show that implementation has begun. They do not
          establish a synchronized production database, a completed evidence
          ledger, or biological performance.
        </div>
      </div>
    </section>
  );
}

