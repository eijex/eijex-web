import { publicDataBoundary, publicLinks } from "@/app/lib/ecosystem";

export default function DataBoundary() {
  return (
    <section className="bg-white px-6 py-16 dark:bg-slate-900" aria-labelledby="data-boundary-heading">
      <div className="mx-auto max-w-5xl rounded-3xl border border-amber-200 bg-amber-50 p-7 dark:border-amber-900 dark:bg-amber-950/30 sm:p-9">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              Open code · permissioned data
            </p>
            <h2 id="data-boundary-heading" className="text-2xl font-bold text-amber-950 dark:text-amber-100">
              Public software does not mean public research records.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-amber-900 dark:text-amber-200">
              {publicDataBoundary}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:max-w-44 md:flex-col">
            <a
              href={publicLinks.agentosSecurity}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-center text-xs font-bold text-amber-900 transition-colors hover:border-amber-500 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-200"
            >
              AgentOS security ↗
            </a>
            <a
              href={publicLinks.validationhubSecurity}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-center text-xs font-bold text-amber-900 transition-colors hover:border-amber-500 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-200"
            >
              ValidationHub security ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

