// Historical benchmark — archived FactorForge v3.2.0 run, frozen at time of measurement.
export const HISTORICAL_MEAN_CAI = "0.94";
export const HISTORICAL_AA_IDENTITY = "100%";
export const HISTORICAL_CDS_COUNT = "49,257";
export const HISTORICAL_CAPTION = "FactorForge v3.2.0 · balanced profile · SGN QLD183 v103 corpus · historical packaged codon reference · scoring_contract v1.1";

// Native reference (unoptimized) — same v3.2.0 run, same corpus, no optimization applied.
export const NATIVE_REFERENCE_MEAN_CAI = "0.72";
export const NATIVE_REFERENCE_CDS_COUNT = HISTORICAL_CDS_COUNT;

// Current software — live application configuration, independent of the historical benchmark above.
export const CURRENT_APP_VERSION = "v3.5.11";

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
    generation: "Gen 2",
    engine: "DP v2.2",
    version: "2.2.0",
    status: "Research candidate",
    availability: "Local Python opt-in · initiation-aware reviewed position penalties",
  },
  {
    generation: "Gen 2",
    engine: "DP v2.3",
    version: "2.3.0",
    status: "Research candidate",
    availability: "Local Python opt-in · multi-class structural pause (3DP static & 4DP +35 aa window)",
  },
  {
    generation: "Gen 2",
    engine: "DP v2.4",
    version: "2.4.0",
    status: "Research candidate",
    availability: "Local Python opt-in · tropical semiring matrix recurrence & TASEP buffer smoothing",
  },
  {
    generation: "Gen 2",
    engine: "ConstrainedLocalRewriter",
    version: "1.0.0",
    status: "Research candidate",
    availability: "Local Python opt-in · equivalence-preserving synonymous peephole & paired swap rewriter",
  },
  {
    generation: "Gen 3",
    engine: "sLLM Hybrid",
    version: "0.2.0-preview.1",
    status: "Research preview",
    availability: "Feature gated · restricted deployment",
  },
  {
    generation: "Gen 3",
    engine: "Partial-DP Rescue",
    version: "1.0.0",
    status: "Research preview",
    availability: "Feature gated · restricted deployment",
  },
];

// Workflow modes are not engine generations or independently versioned engine releases.
export const FACTORFORGE_DESIGN_WORKFLOWS = [
  { mode: "1DP", implementation: "Sequence-only baseline", version: "DP v2 / DP v2.1.1 · FactorForge 3.5.11", status: "Public browser testing (synthetic verification)", availability: "Default policy; RNA scan and available initiation MFE" },
  { mode: "3DP", implementation: "Structure-conditioned DP comparison", version: "DP v2.2 · FactorForge 3.5.11", status: "Experimental; direct browser testing", availability: "Uploaded structure + reviewed positions; default policy" },
  { mode: "4DP", implementation: "Space-time exit-tunnel (+35 aa) & TASEP buffer smoothing", version: "DP v2.3 / DP v2.4 · FactorForge 3.5.11", status: "Research candidate (local Python)", availability: "Multi-class pause + TASEP ramp smoothing + local codon rewriter" },
];
