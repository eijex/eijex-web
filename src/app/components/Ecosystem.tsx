import Link from "next/link";

const nodeStyles = {
  agentos:
    "border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100",
  factorforge:
    "border-teal-200 bg-teal-50 text-teal-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-100",
  validationhub:
    "border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
};

function StackNode({
  name,
  role,
  className,
  href,
}: {
  name: string;
  role: string;
  className: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-2xl border p-5 text-center shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
    >
      <h3 className="text-lg font-extrabold">{name}</h3>
      <p className="mt-1 text-sm leading-relaxed opacity-75">{role}</p>
      <span className="mt-3 inline-block text-xs font-bold underline decoration-current/30 underline-offset-4">
        Explore {name}
      </span>
    </Link>
  );
}

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="bg-white px-6 py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
            One stack, separate responsibilities
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Computation, control, and evidence stay distinct.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Eijex connects public research software through canonical identities,
            versioned artifacts, explicit approvals, and traceable handoffs—without
            treating a computational pass as experimental evidence.
          </p>
        </div>

        <div
          className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950 sm:p-8"
          aria-label="Eijex ecosystem responsibility model"
        >
          <div className="mx-auto max-w-md">
            <StackNode
              name="AgentOS"
              role="Control plane · policy · approvals · audit"
              className={nodeStyles.agentos}
              href="/agentos"
            />
          </div>

          <div aria-hidden="true" className="grid grid-cols-2 px-[24%] py-2 text-center text-xl text-slate-300 dark:text-slate-600">
            <span>↙</span>
            <span>↘</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StackNode
              name="FactorForge"
              role="Design candidates · deterministic computational checks"
              className={nodeStyles.factorforge}
              href="/factorforge"
            />
            <StackNode
              name="ValidationHub"
              role="Evidence schemas · reviewed records · registry"
              className={nodeStyles.validationhub}
              href="/validationhub"
            />
          </div>

          <div aria-hidden="true" className="py-2 text-center text-xl text-slate-300 dark:text-slate-600">
            ↘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↙
          </div>

          <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-5 text-center dark:border-amber-800 dark:bg-amber-950/30">
            <p className="font-bold text-amber-950 dark:text-amber-100">
              Shared identity and provenance foundation
            </p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
              Research checkpoint · not a synchronized production database
            </p>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Eijex MCP is a public access surface for supported tools. It does not
          own scientific source-of-truth state.
        </p>
      </div>
    </section>
  );
}
