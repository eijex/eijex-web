---
title: "The circular dependency hiding in codon references and GC targets"
date: "2026-06-27"
updated: "2026-08-29"
status: "Engineering note"
category: "Design & Validation"
summary: "A reference table shaped the outputs, and those same outputs had been used to justify the range that judged them."
evidenceScope: "Computational design-contract observation"
featured: false
bookSection: "Design and validation"
bookOrder: 1
---

## The question that exposed the loop

A codon-reference update raised a seemingly small question: should the existing
GC target remain unchanged? The answer could not be separated from the reference
itself.

The earlier target had not been anchored independently and then applied to the
optimizer. It had been calibrated in part from outputs produced by the earlier
reference table. The loop was therefore:

1. choose a codon table;
2. generate sequences with that table;
3. observe the output distribution; and
4. use that distribution to justify the range that later judges the outputs.

Changing only the reference caused the new outputs to be rejected by the old
range. Changing only the range caused the old reference path to miss the new
target. Either half-change made the other half look wrong.

## The decision

The reference transition and the target-range revision had to be treated as one
contract change. Historical results were not erased. They remained attached to
the contract under which they were produced, while forward results used the new
reference and target definition.

This led to a durable rule: a metric threshold should record its independent
authority, not merely agree with the outputs of the system it evaluates.

## Why this matters beyond GC

The same circularity can hide in other metrics. A CAI threshold, risk score, or
ranking cutoff can appear objective while quietly inheriting assumptions from the
generator. Separating generation authority from evaluation authority makes those
dependencies visible and makes historical replay possible.

The native-composition range is also not the only legitimate design strategy.
Explicit high-GC or other experimental profiles can remain available when labeled
as non-default objectives. The important point is not that one range is universally
correct; it is that the reason for selecting it is independently traceable.

