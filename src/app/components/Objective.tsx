const roadmap = [
  "Reproducible CDS design and reviewable sequence-analysis artifacts",
  "Benchmark governance with explicit evidence boundaries",
  "Pre-synthesis review harnesses for synthesis, cloning, and experimental planning",
  "Validation-data capture, audit trails, and documented research decisions",
  "Human-supervised AI-assisted Design-Build-Test-Learn workflows",
];

export default function Objective() {
  return (
    <section id="objective" className="py-16 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
        <div>
          <p className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-3">
            DBTL Platform Objective
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            End-to-End DBTL Infrastructure for Plant Expression.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Eijex is building an open-source, evidence-bounded
            Design–Build–Test–Learn (DBTL) stack for plant molecular expression
            research: FactorForge for reproducible CDS design and review, AgentOS
            for human-supervised workflow integrity, and ValidationHub for curated
            validation evidence.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The software, schemas, and synthetic examples are intended to be
            openly available. Proprietary sequences, partner records, and other
            permissioned research data remain governed separately from the
            public code.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Capability roadmap
          </p>
          <ol className="space-y-3">
            {roadmap.map((item, i) => (
              <li key={item} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
