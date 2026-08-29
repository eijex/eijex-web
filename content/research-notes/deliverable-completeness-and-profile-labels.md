---
title: "A complete run can still produce an incomplete deliverable"
date: "2026-08-06"
updated: "2026-08-29"
status: "Public-redacted case study"
category: "Reliability & Release"
summary: "Throughput counters said every combination had run, while a required artifact was absent and a profile label overstated what its output achieved."
evidenceScope: "Public-redacted pipeline lesson"
featured: false
bookSection: "Reliability and release engineering"
bookOrder: 2
---

## The full loop found what unit counts missed

A digital-pilot pipeline produced candidate files, native review records, comparison
tables, integrity summaries, and deliberately broken fixtures used to test the
validator. Its completion counters were green: every requested candidate/profile
combination ran, and every negative fixture exercised the expected path.

A manual comparison against the written requirement list found a missing artifact
category. The pipeline had never generated an annotated record required by the
deliverable specification. Row counts could not reveal the omission because they
measured completed executions, not required artifact types.

## A profile name is an intention

The same review exposed a second problem. A profile whose name suggested an
assembly-oriented result still produced a candidate with a restriction-site finding.
Elsewhere, outputs with reassuring labels contained advisory motifs that mattered
more than the warning attached to a plain default profile.

The label described what the profile tried to optimize. It was not evidence that
the independent validator had accepted every relevant property.

## Two checks, two questions

The correction separated two forms of completeness:

- **execution completeness:** did every requested run finish?
- **contract completeness:** did every required artifact and validation category
  appear?

It also established a decision rule: read the final candidate's per-criterion
results rather than infer quality from the profile name or top-line count.

This lesson generalizes beyond sequence design. Automation should compare produced
artifact categories against the specification, and product labels should never
substitute for independent outcome checks.

