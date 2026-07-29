import {
  HISTORICAL_MEAN_CAI,
  HISTORICAL_CDS_COUNT,
  NATIVE_REFERENCE_MEAN_CAI,
  NATIVE_REFERENCE_CDS_COUNT,
} from "../../lib/site-stats";
import BenchmarkChart from "./BenchmarkChart";

const benchmarks = [
  {
    name: "FactorForge",
    value: HISTORICAL_MEAN_CAI,
    sample: `n=${HISTORICAL_CDS_COUNT} CDS`,
    tone: "border-teal-300 bg-teal-50 dark:border-teal-700 dark:bg-teal-950/40",
    valueTone: "text-teal-700 dark:text-teal-300",
  },
  {
    name: "Native reference (unoptimized)",
    value: NATIVE_REFERENCE_MEAN_CAI,
    sample: `n=${NATIVE_REFERENCE_CDS_COUNT} CDS`,
    tone: "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800",
    valueTone: "text-slate-700 dark:text-slate-200",
  },
];

export default function BenchmarkStats() {
  return (
    <section aria-labelledby="benchmark-heading" className="py-16 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-8">
          <p className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-2">
            Scientific benchmark
          </p>
          <h2 id="benchmark-heading" className="text-3xl font-bold text-slate-900 dark:text-white">
            CAI optimization, reported with its corpus size.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Static benchmark figures are shown for technical context. They are not experimental validation or a claim of biological performance.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {benchmarks.map((benchmark) => (
            <div key={benchmark.name} className={`rounded-2xl border p-7 ${benchmark.tone}`}>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{benchmark.name}</p>
              <div className={`mt-3 text-6xl font-extrabold tracking-tight ${benchmark.valueTone}`}>{benchmark.value}</div>
              <p className="mt-2 font-mono text-sm text-slate-500 dark:text-slate-400">Mean CAI · {benchmark.sample}</p>
            </div>
          ))}
        </div>
        <BenchmarkChart />
      </div>
    </section>
  );
}
