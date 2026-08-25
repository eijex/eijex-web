import Link from "next/link";

const stepStyles = {
  factorforge: {
    badge:
      "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300",
    card:
      "border-teal-200/80 hover:border-teal-400 dark:border-teal-900 dark:hover:border-teal-700",
    link: "text-teal-700 dark:text-teal-300",
  },
  agentos: {
    badge:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
    card:
      "border-cyan-200/80 hover:border-cyan-400 dark:border-cyan-900 dark:hover:border-cyan-700",
    link: "text-cyan-700 dark:text-cyan-300",
  },
  validationhub: {
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300",
    card:
      "border-violet-200/80 hover:border-violet-400 dark:border-violet-900 dark:hover:border-violet-700",
    link: "text-violet-700 dark:text-violet-300",
  },
};

function WorkflowStep({
  number,
  action,
  name,
  description,
  href,
  styles,
}: {
  number: string;
  action: string;
  name: string;
  description: string;
  href: string;
  styles: (typeof stepStyles)[keyof typeof stepStyles];
}) {
  return (
    <li className="relative flex h-full flex-col items-center">
      <span
        className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-sm font-extrabold shadow-sm dark:border-slate-900 ${styles.badge}`}
      >
        {number}
      </span>
      <Link
        href={href}
        className={`group mt-5 flex h-full w-full flex-col rounded-3xl border bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 dark:bg-slate-950 ${styles.card}`}
      >
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          {action}
        </p>
        <h3 className="mt-3 text-xl font-extrabold text-slate-950 dark:text-white">
          {name}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {description}
        </p>
        <span className={`mt-6 text-sm font-bold ${styles.link}`}>
          Learn about {name} <span aria-hidden="true">→</span>
        </span>
      </Link>
    </li>
  );
}

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="scroll-mt-20 bg-white px-6 py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
            From design to evidence
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            One workflow. Clear responsibility at every step.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            FactorForge creates reviewable design candidates, AgentOS guides
            human-supervised decisions, and ValidationHub preserves the evidence
            behind each handoff.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-teal-300 via-cyan-300 to-violet-300 dark:from-teal-800 dark:via-cyan-800 dark:to-violet-800 md:block"
          />
          <ol className="relative grid gap-6 md:grid-cols-3">
            <WorkflowStep
              number="01"
              action="Design"
              name="FactorForge"
              description="Create reproducible CDS candidates and run deterministic computational checks."
              href="/factorforge"
              styles={stepStyles.factorforge}
            />
            <WorkflowStep
              number="02"
              action="Review"
              name="AgentOS"
              description="Apply policies, record approvals, and keep human judgment in control."
              href="/agentos"
              styles={stepStyles.agentos}
            />
            <WorkflowStep
              number="03"
              action="Preserve"
              name="ValidationHub"
              description="Store reviewed evidence as structured, traceable research records."
              href="/validationhub"
              styles={stepStyles.validationhub}
            />
          </ol>
        </div>

        <div className="mx-auto mt-8 max-w-5xl rounded-3xl bg-slate-100 px-6 py-6 text-center dark:bg-slate-950 sm:px-10">
          <p className="text-base font-bold text-slate-900 dark:text-white">
            One identity and provenance trail connects the entire workflow.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Shared infrastructure is being validated as a research checkpoint—not
            presented as a completed production database.
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Eijex MCP provides public access to supported tools while scientific
          source-of-truth records remain with their owning systems.
        </p>
      </div>
    </section>
  );
}
