---
title: "Model selection is not the same as model capability"
date: "2026-08-02"
updated: "2026-08-29"
status: "Superseded"
category: "Rule/LM Architecture"
summary: "An early architecture note assigned models to future roles before the runtime and evidence needed to support those roles existed."
evidenceScope: "Superseded planning reflection"
featured: false
bookSection: "Architecture and direction"
bookOrder: 2
---

## The early plan

An earlier architecture sketch mapped general-purpose language models to intake,
claim review, and development assistance, while assigning biological language models
to sequence scoring and future prediction. The diagram was tidy. The implementation
state was not yet equivalent to the diagram.

Several named runtime components were proposed rather than deployed. A future
yield-prediction path did not have the volume or quality of reviewed outcome labels
needed for a trained production model. The sequence decoder path also had to be
distinguished from actual learned inference.

## What the plan got right

The boundary principle remains useful:

- general-purpose models may help structure text under strict output contracts;
- deterministic code should compute scientific metrics;
- raw sequence and private evidence should not be sent to an external model by
  default; and
- public claims require human review and evidence provenance.

Those are architectural responsibilities, independent of a specific provider or
model name.

## Why this note is preserved

The original model assignments are no longer presented as current implementation.
They are retained as a superseded planning record because they show how quickly a
system diagram can outrun the code and data beneath it.

The revised practice is to describe capabilities only after verifying the active
code path, model artifact, data authority, evaluation contract, and public exposure.
Provider selection can then change without changing the scientific boundary.

