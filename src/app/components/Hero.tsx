import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="py-20 px-6 text-center bg-gradient-to-br from-teal-50 via-slate-50 to-green-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center gap-2 mb-6">
          <span className="inline-block bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-xs font-extrabold px-3 py-1 rounded-full tracking-widest uppercase">
            AI-Assisted DBTL Infrastructure
          </span>
          <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 text-xs font-extrabold px-3 py-1 rounded-full tracking-widest uppercase">
            Plant Molecular Expression
          </span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-5">
          Reproducible DBTL Platform for Plant Bio-Design.
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          From protein sequence to reviewable CDS candidates and pre-synthesis sequence review.<br />
          Open-source, reproducible, and citable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/factorforge"
            className="bg-teal-600 text-white px-7 py-3.5 rounded-full text-base font-bold hover:bg-teal-700 transition-colors"
          >
            Explore FactorForge →
          </Link>
          <a
            href="https://github.com/eijex/factorforge-cds"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-7 py-3.5 rounded-full text-base font-semibold hover:border-slate-400 dark:hover:border-slate-400 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
