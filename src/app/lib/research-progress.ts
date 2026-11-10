import evidence from "./reviewed-research-evidence.json";

/** Reviewed public aggregates only. This is not a live registry or a model service. */
export const researchEvidence = evidence;

export const researchRoadmap = [
  { state: "Implemented locally", title: "Traceable design and learning", detail: "Deterministic design checks, declared sequence-exposure history, training preflight checks and checkpoint readback support local experiments." },
  { state: "Partial experiment closed", title: "Measure added model value", detail: "Three of five diagnostic arms were completed. Nine checkpoints were replayed on reused development validation; the remaining two arms are deferred." },
  { state: "Planned · not executed", title: "Learn from DP design examples", detail: "A mode-conditioned model would learn from 1DP, 3DP and 4DP-generated candidates. A small pilot should compare constraint pass rate, objective gap and total proposal-plus-verification time against DP alone." },
  { state: "Long-term goal · unavailable", title: "Predict yield with uncertainty", detail: "Connect actual CDS, construct, host, production conditions and measured outcomes. Computational teacher scores are not experimental yield labels." },
] as const;
