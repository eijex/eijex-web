import {
  MEAN_CAI,
  AA_IDENTITY,
  CDS_BENCHMARKED,
  LIVE_APP_VERSION,
  BENCHMARK_CAPTION,
} from "../lib/site-stats";

const stats = [
  { value: MEAN_CAI, label: "mean CAI" },
  { value: AA_IDENTITY, label: "AA identity" },
  { value: CDS_BENCHMARKED, label: "CDS benchmarked" },
  { value: LIVE_APP_VERSION, label: "live app" },
];

export default function StatsBar() {
  return (
    <div
      className="py-7 px-6"
      style={{ background: "linear-gradient(90deg, #134e4a, #14532d)" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {stats.map((stat, i) => (
          <div key={i}>
            <div className="text-2xl font-extrabold text-teal-300 mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-teal-200/70">{stat.label}</div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-teal-200/40 mt-4">
        {BENCHMARK_CAPTION}
      </p>
    </div>
  );
}
