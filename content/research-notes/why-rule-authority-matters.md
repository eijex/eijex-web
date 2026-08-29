---
title: "Why rule authority still matters in a language-model system"
date: "2026-08-29"
updated: "2026-08-29"
status: "Current"
category: "Rule/LM Architecture"
summary: "A code-level audit changed the question from whether a language model could replace deterministic design rules to how learned proposals could remain bounded by them."
evidenceScope: "Architecture observation"
featured: true
bookSection: "Architecture and direction"
bookOrder: 1
---

## The expectation

The original direction was easy to describe: train a sequence model, let it learn
host-specific patterns, and use it to generate better coding sequences. That idea
was attractive because it appeared to move beyond hand-authored heuristics.

The implementation audit forced a more precise question. The experimental decoder
path did not yet contain trained-model inference. Without model weights providing
contextual probabilities, it was a deterministic constrained decoder: useful as an
integration scaffold, but not evidence of learned generation.

## What the scaffold still taught us

The gap was not wasted work. It clarified which responsibilities should remain
deterministic even after a trained model exists:

- preserving amino-acid identity;
- rejecting invalid or internal-stop outputs;
- applying explicit assembly constraints;
- recording the reference, configuration, and validator contract; and
- abstaining or falling back when a proposal cannot satisfy the contract.

These are not properties that should depend on a model being confident. They are
properties that can be checked directly.

## The revised position

The production direction is therefore not “rules or a language model.” A future
model may propose or rank candidates, while deterministic rules remain the
feasibility authority and fallback. An LM-only path can remain useful as a research
comparator, but it should not be confused with the reviewed production path.

This distinction also changes how results are reported. A decoder scaffold is
labeled as a scaffold. A trained model requires frozen weights, tokenizer, dataset,
split, configuration, and held-out evaluation before it is described as learned
generation. A computational pass remains a computational result; it does not imply
expression, yield, or biological validation.

## What remains open

The next meaningful milestone is not another architecture label. It is a frozen
comparison in which Rule-only, LM-only, and Rule/LM paths use the same inputs,
validator, metric authority, and provenance record. Until then, the honest result is
the architecture lesson itself: learned proposals can be valuable, but deterministic
feasibility remains independently testable.

