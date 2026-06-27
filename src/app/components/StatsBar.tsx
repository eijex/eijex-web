const stats = [
  { value: "0.94", label: "mean CAI" },
  { value: "100%", label: "AA identity" },
  { value: "49,257", label: "CDS benchmarked" },
  { value: "v3.2.6", label: "latest release" },
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
        Benchmark: v3.2.0 balanced profile · N. benthamiana SGN CDS · N=49,257
      </p>
    </div>
  );
}
