export default function Hero() {
  return (
    <section
      className="py-20 px-6 text-center"
      style={{
        background: "linear-gradient(160deg, #f0fdfa 0%, #f8fafc 55%, #f0fdf4 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full tracking-widest mb-6">
          OPEN SOURCE · PLANT SYNTHETIC BIOLOGY
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
          Open tools for<br />plant synthetic biology.
        </h1>
        <p className="text-base text-slate-500 mb-10 leading-relaxed">
          From sequence to expression — reproducibly.<br />
          Open-source, citable, and benchmarked.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="https://factorforge.eijex.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-teal-700 transition-colors"
          >
            Explore FactorForge →
          </a>
          <a
            href="https://github.com/eijex/factorforge-cds"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-300 text-slate-600 px-6 py-3 rounded-full text-sm font-semibold hover:border-slate-400 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
