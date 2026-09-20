---
title: "From a single optimum to governed hypothesis slates"
date: "2026-09-19"
updated: "2026-09-19"
status: "Engineering note"
category: "Models and comparative evaluation"
summary: "Why FactorForge now separates learned exploration, deterministic vetoes, exact suffix rescue, and evidence promotion."
evidenceScope: "Software implementation and computational benchmark records; no wet-lab or biological-performance claim"
featured: true
bookSection: "Models and comparative evaluation"
bookOrder: 4
---

## The limitation of one best-looking sequence

A single optimum is useful when the objective is complete and the constraints are known.
Research often needs a different artifact: several feasible hypotheses that differ for
traceable reasons. FactorForge v3.5.0 introduces a discovery-slate path while retaining
the stable deterministic optimizer as the default.

## Four responsibilities, kept separate

The new path divides work into four layers:

1. Several versioned design contracts create a candidate pool.
2. A feature-gated learned prior can propose synonymous codon-context hypotheses.
3. Deterministic translation, motif, composition, and homopolymer checks retain veto authority.
4. When generation reaches a dead end, exact dynamic programming can repair a suffix
   conditioned on a preserved, already checked prefix.

A suffix optimum conditioned on a fixed prefix is not the same claim as a globally
unconstrained DP optimum. The exported lineage must say which path was requested, which
path actually produced the candidate, and whether rescue occurred.

## Why partial rescue is scientifically interesting

Earlier fallback behavior could discard an entire learned prefix when one later choice made
the sequence infeasible. Partial rescue asks a narrower question: how much verified context
can be preserved while deterministic search restores feasibility? A multi-arm benchmark can
compare unconstrained generation, veto-only generation, global fallback, and partial rescue
without attributing every difference to “AI.”

## The evidence boundary

These artifacts measure computational feasibility, provenance, and sequence diversity.
They do not establish expression, yield, synthesis success, or clinical utility. Prospective
experiments require separate protocols, controls, observations, and promotion gates.
