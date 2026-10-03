---
title: "A release is more than a version label"
date: "2026-10-03"
updated: "2026-10-03"
status: "Engineering note"
category: "Reproducibility and delivery"
summary: "What the v3.5.4 maintenance work taught us about standalone installs, recorded UI explanations and deployment evidence."
evidenceScope: "Published software maintenance and tested web behavior; no experimental outcome"
featured: true
bookSection: "Reproducibility and delivery"
bookOrder: 6
---

## A development machine can hide a missing dependency

Software that works in a developer's workspace can still fail in a clean package
installation. Local source paths, optional infrastructure and private integration
fixtures must not quietly become dependencies of the public default workflow.

FactorForge v3.5.4 was checked through clean package installs and remote tests on
supported Python and operating-system combinations. Shared persistence remains
separately configured and experimental; the public design endpoint is stateless.
These are software checks, not a production database or biological certification.

## Interfaces must show recorded facts

The web interface should expose recorded computational findings and provenance,
not invent a plausible explanation for every codon change. When a generation trace
is absent, that absence is part of the result. A polished visualization cannot
substitute for a missing record.

The maintenance review also found that visual policy-builder scaffolding had been
described too strongly. The incomplete modal path was withheld. The verified
workflow uses policy-file upload and collapsed advanced settings. A named feature
is not complete merely because a button or an earlier release note mentions it.

## Documentation is part of the delivered interface

An empty historical release-note entry made a real maintenance release look as
though it contained no changes. The missing summary was filled from the recorded
changelog and covered by a regression test. This changed presentation, not the
engine, reference data or product version.

The more general lesson is to distinguish implementation, tests, publication and
live verification. A completion flag is a navigation aid, not a replacement for
those artifacts. Optional infrastructure and model previews keep their own gates.

## Public reference

The published maintenance release is [FactorForge v3.5.4](https://github.com/eijex/factorforge-cds/releases/tag/v3.5.4),
with its [version-specific software archive](https://doi.org/10.5281/zenodo.23076954).
Its package version remains independent of individual engine versions and any
historical computational evaluation.
