export default function Hero() {
  return (
    <section
      className="py-20 px-6 text-center bg-gradient-to-br from-teal-50 via-slate-50 to-green-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
    >
      <div className="max-w-2xl mx-auto">
        <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 text-sm font-bold px-4 py-1.5 rounded-full tracking-widest mb-6">
          OPEN SOURCE · PLANT MOLECULAR EXPRESSION
        </span>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-5">
          Open tools for<br />reproducible CDS design.
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          From protein sequence to reviewable CDS candidates — reproducibly.<br />
          Open-source, reproducible, and citable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="https://factorforge.eijex.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-600 text-white px-7 py-3.5 rounded-full text-base font-bold hover:bg-teal-700 transition-colors"
          >
            Explore FactorForge →
          </a>
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
