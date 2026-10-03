---
title: "Constraint checks are not biological validation"
date: "2026-10-03"
updated: "2026-10-03"
status: "Current"
category: "Scientific boundaries"
summary: "Why a deterministic sequence check, a user policy and a measured biological outcome must remain different kinds of evidence."
evidenceScope: "Public software architecture and claim boundaries; no private experiment or trained-model evaluation"
featured: true
bookSection: "Scientific boundaries"
bookOrder: 5
---

## A clear computational result is not a biological answer

A sequence-design tool can check translation identity, count specified motifs and
evaluate configured composition limits. Those statements are meaningful only for
the implemented checks, the provided sequence context and the recorded settings.
They do not establish expression, secretion, yield or experimental success.

It is tempting to describe a deterministic solver as proving that a design is
biologically safe. The narrower statement is the useful one: a completed design
can satisfy the constraints actually encoded and checked. An omitted constraint,
an unavailable calculation or an infeasible request must remain visible.

## Three responsibilities

Detection describes a computational finding. Policy describes what a user wants
to do about it. Experimental evidence records what was actually measured.
Changing a warning to a blocking policy does not turn the prediction into a
validated biological fact. Equally, choosing to retain a finding does not erase it.

FactorForge keeps software integrity separate from configurable sequence-review
policy. The user or laboratory owns the experimental interpretation and workflow
decision; an example configuration is not an approved laboratory procedure.

## Learned exploration does not replace explicit checks

A model adapter, a candidate-generator interface and a trained, evaluated model
are different deliverables. FactorForge's constrained model path remains a gated
research preview. Its existence is not evidence of a trained production model or
measured biological improvement. The stable deterministic path remains the default.

A hybrid design may use a model proposal followed by explicit checks or a bounded
deterministic rescue. That describes software composition, not a universal proof
of biological viability. Synthetic fixtures are useful for testing contracts, but
must not be promoted into model-performance results.

## Current position

Record what was checked, what was unavailable and what the policy decided. Preserve
failures and unresolved cases alongside successes. Require separate experimental
evidence before making claims about biological performance. This boundary is more
valuable than an impressive label attached to an unverified result.
