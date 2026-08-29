---
title: "What an incomplete HalluCodon trial still taught us"
date: "2026-07-13"
updated: "2026-08-29"
status: "Incomplete experiment"
category: "External Models"
summary: "The external model never produced a candidate in this trial, but the failure exposed practical reproducibility costs that benchmark tables often omit."
evidenceScope: "Incomplete external-model execution log"
featured: false
bookSection: "Models and comparative evaluation"
bookOrder: 1
---

## The intended comparison

The goal was a low-cost zero-shot trial of HalluCodon, a plant-focused framework
that combines protein and RNA language-model components with species-specific
scoring. Because the target host was not included among the available pretrained
species, the closest supported tobacco model was selected as an explicit proxy.

The trial followed the project's documented initialization and hallucination-based
optimization path. The relevant sources are the
[HalluCodon preprint](https://doi.org/10.64898/2026.03.31.715573) and its
[official repository](https://github.com/YuxuanLou/HalluCodon).

## What actually happened

The experiment moved between free GPU environments. Large model downloads,
temporary storage, archive extraction, and session lifetime repeatedly competed
with one another. A run eventually began but was interrupted before an optimized
candidate or result table was written.

Warnings about GPU context initially looked like the likely cause. The raw log
showed something less exotic: the process had been interrupted externally. That
distinction only became clear when the original output was examined rather than a
summary of it.

## An incomplete run is not a benchmark result

No candidate means there was no naturalness score, expression score, sequence
comparison, or performance conclusion. The correct status is therefore
“incomplete experiment,” not a negative result for the model.

Even so, the trial exposed real evaluation costs: weight acquisition, environment
reconstruction, proxy-host choice, session durability, and artifact persistence.
Those conditions belong in a reproducibility record because they influence whether
an advertised workflow can be independently exercised.

## What a future rerun must freeze

A meaningful comparison should pin the source commit, model-weight identifiers and
checksums, proxy-host rationale, container or environment lock, command line, random
state, and every output artifact. Until that package exists, the useful result is the
execution lesson—not a claim about model quality.

