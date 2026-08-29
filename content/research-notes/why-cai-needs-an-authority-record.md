---
title: "Why every CAI value needs an authority record"
date: "2026-07-04"
updated: "2026-08-29"
status: "Engineering note"
category: "Design & Validation"
summary: "Two CAI values for the same sequence were both mathematically correct—and still misleading when shown without their references."
evidenceScope: "Metric-provenance observation"
featured: true
bookSection: "Design and validation"
bookOrder: 2
---

## The apparent discrepancy

The same output sequence received different CAI values in two evaluation paths.
The formulas were not broken. Each calculation used a different codon reference.

One path evaluated against an expression-oriented reference. Another evaluated
against the working table used during generation. Without a label, both numbers
appeared under the same field name and invited a comparison they could not support.

## From a number to a record

The corrective action was additive: preserve the numerical result and attach its
authority. A useful authority record answers at least four questions:

- Which reference was used?
- What role did that reference play?
- Was it distinct from the generation reference?
- Was a fallback used?

An initial two-state model—preferred reference or fallback—was still incomplete. It
could not represent the valid case where a caller intentionally selects one
reference for both generation and evaluation. The final relationship therefore
needed three states: distinct, intentionally the same, and fallback to the generation
reference.

## Why labels are part of the result

Metric provenance is not administrative decoration. A CAI value without its
reference cannot be reproduced or interpreted reliably, and two unlabeled CAI
values may measure different relationships while looking identical in a table.

The same principle applies to model-derived scores and validation summaries. A
result should identify the authority that produced it and the relationship between
that authority and the candidate-generation path. Otherwise, later readers are
forced to reconstruct meaning from implementation details.

