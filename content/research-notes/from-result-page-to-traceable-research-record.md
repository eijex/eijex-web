---
title: "From a result page to a traceable research record"
date: "2026-09-10"
updated: "2026-09-10"
status: "Engineering note"
category: "Evidence Architecture"
summary: "Why FactorForge now separates researcher decisions, sequence-bearing reports, and sequence-free evidence—and what must exist before that history becomes a controlled audit trail."
evidenceScope: "Implemented report boundary and development-stage activity-log contract; no experimental or regulatory claim"
featured: true
bookSection: "Evidence architecture"
bookOrder: 1
---

## The missing question after a successful run

A CDS design tool can return metrics, checks, and an optimized candidate while
leaving the researcher with a practical question: what should I do next?

The earlier result view made CAI, GC content, Type IIS checks, domestication, MFE
availability, candidate comparison, and the optimized sequence visible. Those
outputs were useful, but they competed for attention. A result page is not yet a
decision record, and a decision record is not yet a traceable research history.

## Three artifacts, three purposes

The revised FactorForge report separates three responsibilities:

1. The computational result records metrics, checks, and the API-provided decision.
2. The Researcher Decision Report leads with unresolved items and bounded next actions.
3. The sequence-free evidence record preserves identities, settings, decisions,
   provenance, and artifact references for later validation.

This separation also clarifies data handling. The standalone HTML report can contain
the optimized sequence for the researcher handling the design. The evidence JSON
does not carry raw DNA or protein sequence. Requested settings are shown beside the
settings recorded by the run so a mismatch remains visible before a candidate is
selected or compared.

## Traceability without overstating maturity

The next design step is an append-oriented Research Activity Log. Its proposed
timeline begins with input registration and settings resolution, then records
candidate generation, computational review, researcher disposition, corrections,
and artifact exports.

That log would make a run easier to reconstruct, but its first browser-local form
would not be a regulatory audit trail. It would not establish verified identity,
trusted time, immutability, validated retention, or electronic signature. A
computational PASS would still not demonstrate expression, synthesis success,
biological performance, or experimental validity.

The practical goal is submission-preparable traceability: preserve structured
context now so a future evidence package does not have to reconstruct the design
history from screenshots and filenames.

## Connected contracts, separate authority

The workflow does not require every repository to write to one database.

- FactorForge owns the design execution and computational review.
- AgentOS owns workflow decisions, policy results, and approval references.
- ValidationHub owns experimental-evidence identity, lineage, and review state.
- Reference assets own dataset identity, version, source, and digest.
- The Evidence Toolkit verifies package structure, checksums, and cross-links.
- MCP exposes bounded operations without becoming the system of record.

Shared identifiers and versioned contracts can connect these records while each
system remains authoritative only for what it produced.

## What remains before the workflow is live

The Researcher Decision Report and the first sequence-free package contract exist.
The activity log itself remains a development contract. The next gates are a tested
FactorForge event producer, an Evidence Toolkit validator and synthetic fixture,
then separate reference-asset, AgentOS, ValidationHub, and MCP adapters. Only after
a synthetic end-to-end lineage test should the public workflow be described as a
live integration.

Identity, signatures, trusted timestamps, retention, controlled storage, and system
validation belong to a later intended-use program. Building those controls before
the intended use is defined would create the appearance of regulatory readiness
without the evidence needed to support it.
