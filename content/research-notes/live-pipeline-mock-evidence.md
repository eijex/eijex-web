---
title: "When a live workflow still depended on mock evidence"
date: "2026-07-05"
updated: "2026-08-29"
status: "Public-redacted case study"
category: "Evidence Infrastructure"
summary: "A tracer workflow completed successfully, but its computational values were fixtures rather than live outputs."
evidenceScope: "Workflow-provenance lesson; private records excluded"
featured: false
bookSection: "Evidence and governance"
bookOrder: 1
---

## Completion was not the same as provenance

A workflow had been built to connect computational review with downstream evidence
records. It ran end to end and produced the expected record shape. A closer look
showed that part of the computational payload came from stored mock fixtures rather
than a live FactorForge execution.

Nothing had crashed. The schema was valid. The pipeline still could not support the
interpretation a reader might naturally assign to it.

## Why fixtures are not the problem

Synthetic fixtures are valuable. They make security tests, contract tests, and
repeatable demonstrations possible without exposing research data. The problem
appears when fixture provenance is not visible at the point of use.

A record should make it possible to distinguish:

- synthetic fixture values;
- replayed values from a frozen artifact;
- newly computed values from a pinned software execution; and
- reviewed experimental observations.

The shape of the JSON is not enough. The origin and authority of each value are part
of its meaning.

## The correction pattern

Replacing mock values with live results requires more than editing a file. The
input identity, software version, configuration, metric authority, output hashes,
and linkage decision must be captured together. Existing fixture history should
remain traceable rather than being silently overwritten.

The general lesson is simple: an end-to-end workflow can demonstrate orchestration
without demonstrating real computational evidence. Both are useful milestones, but
they should be labeled separately.

