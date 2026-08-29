---
title: "What a decoder comparison can—and cannot—show"
date: "2026-08-26"
updated: "2026-08-29"
status: "Superseded"
category: "External Models"
summary: "An early comparison was labeled as ML benchmarking before the experimental decoder actually consumed trained-model logits."
evidenceScope: "Corrected computational comparison"
featured: false
bookSection: "Models and comparative evaluation"
bookOrder: 2
---

## The attractive interpretation

Two codon-selection paths produced synonymous CDS candidates with preserved
translation. Their codon choices, nucleotide identity, CAI, and GC values differed.
It was tempting to call this a Rule-versus-ML comparison and attribute the difference
to learned sequence context.

The code-level audit did not support that interpretation. The experimental decoder
was operating without trained-model logits. It selected among synonymous codons
through deterministic scaffold logic and masks. The numerical comparison was real;
the label attached to its cause was not.

## What remains valid

The run can still demonstrate several integration properties:

- both paths can preserve amino-acid identity;
- two deterministic policies can choose different synonymous codons;
- the shared metrics can describe those candidates; and
- hard masks can prevent selected forbidden outputs in the exercised path.

It cannot demonstrate learned contextual generation, model superiority, expression
potential, or biological ground truth.

## Why the superseded result stays visible

Deleting the earlier interpretation would hide the most useful lesson: output
differences do not reveal the mechanism that caused them. Mechanism claims require
inspection of the active code path and provenance of the model artifact.

A future Rule/LM comparison must show that frozen model weights are actually loaded
and used, then evaluate Rule-only, LM-only, and hybrid paths under the same validator,
metric authority, inputs, and held-out protocol. Until then, this note remains a
corrected scaffold comparison.

