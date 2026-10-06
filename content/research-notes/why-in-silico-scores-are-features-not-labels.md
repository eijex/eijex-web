---
title: "Why in-silico scores are features, not learning labels"
date: "2026-10-06"
updated: "2026-10-06"
status: "Current"
category: "Models and comparative evaluation"
summary: "Why sequence-optimization metrics belong in the input feature space while closed-loop surrogate models must train on normalized experimental outcomes."
evidenceScope: "Public software architecture and learning contract boundaries; no private experiment or trained-model evaluation"
featured: true
bookSection: "Models and comparative evaluation"
bookOrder: 5
---

## The trap of predicting computational scores

When applying machine learning to sequence design, it is tempting to train models to predict established in-silico metrics such as the Codon Adaptation Index (CAI), GC percentage bounds, or predicted minimum free energy (MFE) proxies.

This approach creates an unproductive feedback loop. A neural network trained on deterministic compiler outputs merely learns to imitate existing heuristic rules, inheriting their systematic blind spots without gaining genuine biological insight. Computational scores describe how an algorithm constructed a candidate sequence; they do not measure how an organism expresses it.

## Separating inputs from empirical targets

A rigorous closed-loop optimization framework maintains a strict boundary between what the model observes and what it predicts:

- **Domain input features ($X$):** Explicit, reproducible sequence properties calculated directly from candidate coding sequences. These include global and local GC fractions, codon entropy, run-length metrics, and specific synonymous balance indicators. These values are deterministic inputs to the learner.
- **Empirical learning targets ($y$):** Actual physical measurements obtained from laboratory assays (such as quantitative ELISA readouts). These readouts reflect biological reality rather than algorithmic expectations.

## Normalizing experimental batch effects

Laboratory measurements fluctuate across experimental runs due to growth conditions, infiltration differences, and reagent variations. Evaluating candidates purely on raw absolute readouts introduces confounding batch effects.

A sound data contract preserves the unmanipulated distribution of technical and biological replicates while calculating normalized relative performance against concurrent baseline controls. Relying on logarithmic fold change relative to identical-batch baselines provides numerical stability and prevents batch-level artifacts from distorting model acquisition.

## Decoupling biological principles from local policy

Sequence features should distinguish between general biological indicators and organization-specific workflow policies. For example, the normalized entropy across all synonymous codons for an amino acid reflects natural diversity, whereas adherence to a specific fixed-ratio guideline is an operational choice.

Conflating the two conceals why a design succeeds or fails. By decoupling general sequence metrics from workflow-specific rules, the learning system can evaluate whether an empirical performance change arose from biological mechanisms or merely from strict adherence to local conventions.

## Lean modeling over unnecessary complexity

In early closed-loop rounds where experimental sample counts are modest ($N = 6 \text{ to } 30$), training massive neural architectures or large language models invites severe overfitting and unnecessary compute overhead.

A lightweight surrogate model, such as a Gaussian process with uncertainty quantification running locally on a CPU, provides sub-second turnaround while delivering calibrated prediction intervals. The resulting predictive uncertainty guides active learning exploration without requiring specialized hardware clusters.
