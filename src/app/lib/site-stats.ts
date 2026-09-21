// Historical benchmark — archived FactorForge v3.2.0 run, frozen at time of measurement.
export const HISTORICAL_MEAN_CAI = "0.94";
export const HISTORICAL_AA_IDENTITY = "100%";
export const HISTORICAL_CDS_COUNT = "49,257";
export const HISTORICAL_CAPTION = "FactorForge v3.2.0 · balanced profile · SGN QLD183 v103 corpus · historical packaged codon reference · scoring_contract v1.1";

// Native reference (unoptimized) — same v3.2.0 run, same corpus, no optimization applied.
export const NATIVE_REFERENCE_MEAN_CAI = "0.72";
export const NATIVE_REFERENCE_CDS_COUNT = HISTORICAL_CDS_COUNT;

// Current software — live application configuration, independent of the historical benchmark above.
export const CURRENT_APP_VERSION = "v3.5.1";

export const FACTORFORGE_ENGINE_VERSIONS = [
  {
    generation: "Gen 1",
    engine: "Rule / Profile",
    version: "1.0.0",
    status: "Stable",
    availability: "Public · default comparison engine",
  },
  {
    generation: "Gen 2",
    engine: "DP v2",
    version: "2.0.1",
    status: "Stable",
    availability: "Public · default feasibility path",
  },
  {
    generation: "Gen 2",
    engine: "DP v2.1.1",
    version: "2.1.1",
    status: "Research candidate",
    availability: "Public opt-in · calibration complete / holdout pending",
  },
  {
    generation: "Gen 3",
    engine: "sLLM Hybrid",
    version: "3.0.0-alpha",
    status: "Research preview",
    availability: "Feature gated · restricted deployment",
  }
];
