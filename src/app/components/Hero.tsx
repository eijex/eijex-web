import Link from "next/link";
import { publicLinks } from "@/app/lib/ecosystem";

export default function Hero() {
  return (
    <section
      className="overflow-hidden bg-gradient-to-br from-teal-50 via-slate-50 to-green-50 px-6 py-20 text-center dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 sm:py-24"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-7 flex justify-center">
          <span className="inline-block rounded-full border border-teal-200 bg-white/70 px-4 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-teal-800 shadow-sm backdrop-blur dark:border-teal-800 dark:bg-slate-900/70 dark:text-teal-300">
            Open evidence infrastructure for plant expression
          </span>
        </div>
        <h1 className="mb-6 text-5xl font-extrabold leading-[1.04] tracking-tight text-slate-950 dark:text-white sm:text-7xl">
          Design sequences.<br />Govern workflows.<br />Preserve evidence.
        </h1>
        <p className="mx-auto mb-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
          Eijex develops open-source, human-supervised research software connecting
          reproducible plant CDS design with reviewable evidence infrastructure.
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          FactorForge is available now. Shared database integration remains a
          research checkpoint.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="#ecosystem"
            className="bg-teal-600 text-white px-7 py-3.5 rounded-full text-base font-bold hover:bg-teal-700 transition-colors"
          >
            Explore the stack ↓
          </Link>
          <a
            href={publicLinks.factorforgeApp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-300 px-7 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:border-slate-500 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400"
          >
            Try FactorForge ↗
          </a>
        </div>
        <a
          href={publicLinks.eijexGitHub}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-800 dark:text-slate-400 dark:decoration-slate-600 dark:hover:text-white"
        >
          View Eijex on GitHub
        </a>
      </div>
    </section>
  );
}
