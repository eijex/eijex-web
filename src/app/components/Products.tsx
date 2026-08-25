import AccessOptions from "@/app/components/AccessOptions";
import { products } from "@/app/lib/ecosystem";
import Link from "next/link";

const accentStyles = {
  teal: {
    tag: "text-teal-700 dark:text-teal-300",
    code: "text-teal-700 dark:text-teal-300",
    button: "bg-teal-600 hover:bg-teal-700",
  },
  slate: {
    tag: "text-slate-700 dark:text-slate-300",
    code: "text-slate-700 dark:text-slate-300",
    button: "bg-slate-800 hover:bg-slate-700",
  },
  cyan: {
    tag: "text-cyan-700 dark:text-cyan-300",
    code: "text-cyan-700 dark:text-cyan-300",
    button: "bg-cyan-700 hover:bg-cyan-800",
  },
  violet: {
    tag: "text-violet-700 dark:text-violet-300",
    code: "text-violet-700 dark:text-violet-300",
    button: "bg-violet-700 hover:bg-violet-800",
  },
} as const;

export default function Products() {
  return (
    <section id="products" className="bg-white px-6 py-20 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Open-source stack
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Public tools with explicit responsibility boundaries.
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Public software releases are staged independently from permissioned research data.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {products.map((p) => {
            const accent = accentStyles[p.accent];
            return (
            <div
              key={p.id}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">{p.name}</h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {p.status}
                </span>
              </div>
              <p className={`text-sm font-semibold uppercase tracking-wide mb-3 ${accent.tag}`}>
                {p.tag}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{p.description}</p>
              <code className={`block bg-slate-100 dark:bg-slate-900 rounded-md px-3 py-2 text-sm mb-5 ${accent.code}`}>
                {p.code}
              </code>
              {p.primary && p.secondary ? (
                <div className="flex gap-2">
                  {p.primary.href.startsWith("/") ? (
                    <Link
                      href={p.primary.href}
                      className={`flex-1 text-center text-white text-sm font-bold py-2.5 rounded-lg transition-colors ${accent.button}`}
                    >
                      {p.primary.label}
                    </Link>
                  ) : (
                    <a
                      href={p.primary.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center text-white text-sm font-bold py-2.5 rounded-lg transition-colors ${accent.button}`}
                    >
                      {p.primary.label}
                    </a>
                  )}
                  <a
                    href={p.secondary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm py-2.5 rounded-lg hover:border-slate-300 dark:hover:border-slate-500 transition-colors"
                  >
                    {p.secondary.label}
                  </a>
                </div>
              ) : null}
            </div>
            );
          })}
        </div>
        <AccessOptions />
      </div>
    </section>
  );
}
