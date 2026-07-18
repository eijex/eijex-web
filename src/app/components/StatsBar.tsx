import {
  HISTORICAL_MEAN_CAI,
  HISTORICAL_AA_IDENTITY,
  HISTORICAL_CDS_COUNT,
  HISTORICAL_CAPTION,
  CURRENT_APP_VERSION,
  CURRENT_CODON_REFERENCE,
  CURRENT_CODON_REFERENCE_ID,
  CURRENT_GC_POLICY,
  CURRENT_CAPTION,
} from "../lib/site-stats";

const historicalStats = [
  {
    value: HISTORICAL_MEAN_CAI,
    label: "Historical mean CAI",
    detail:
      "Mean CAI from the archived FactorForge v3.2.0 balanced-profile benchmark on the SGN QLD183 v103 corpus.",
  },
  {
    value: HISTORICAL_AA_IDENTITY,
    label: "Historical AA identity",
    detail:
      "Amino-acid identity observed in that same archived v3.2.0 benchmark run, not a wet-lab validation result.",
  },
  {
    value: HISTORICAL_CDS_COUNT,
    label: "QLD183 benchmark records",
    detail:
      "Unique filtered CDS records used as the historical benchmark input corpus.",
  },
];

const currentStats = [
  {
    value: CURRENT_APP_VERSION,
    label: "Live application",
    detail: "Current released version of the FactorForge application.",
  },
  {
    value: CURRENT_CODON_REFERENCE,
    label: "Current codon reference",
    detail: `NbeV1.1 high-confidence CDS-derived codon reference used by the current FactorForge software configuration (${CURRENT_CODON_REFERENCE_ID}).`,
  },
  {
    value: CURRENT_GC_POLICY,
    label: "Default GC policy",
    detail: "Default target GC-content range applied by the current software configuration.",
  },
];

function StatGroup({
  heading,
  stats,
  caption,
}: {
  heading: string;
  stats: { value: string; label: string; detail: string }[];
  caption: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold text-teal-200/60 uppercase tracking-widest mb-4 text-center sm:text-left">
        {heading}
      </p>
      <div className="grid grid-cols-3 gap-4 text-center">
        {stats.map((stat) => (
          <div key={stat.label} title={stat.detail}>
            <div className="text-2xl font-extrabold text-teal-300 mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-teal-200/70">{stat.label}</div>
            <span className="sr-only"> {stat.detail}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-teal-200/40 mt-4 text-center sm:text-left leading-relaxed">
        {caption}
      </p>
    </div>
  );
}

export default function StatsBar() {
  return (
    <div
      className="py-7 px-6"
      style={{ background: "linear-gradient(90deg, #134e4a, #14532d)" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6 sm:divide-x sm:divide-teal-100/10">
        <div className="sm:pr-6">
          <StatGroup heading="Historical benchmark" stats={historicalStats} caption={HISTORICAL_CAPTION} />
        </div>
        <div className="sm:pl-6">
          <StatGroup heading="Current software" stats={currentStats} caption={CURRENT_CAPTION} />
        </div>
      </div>
    </div>
  );
}
