---
title: "What a relational migration must preserve besides fields"
date: "2026-07-16"
updated: "2026-08-29"
status: "Engineering note"
category: "Evidence Infrastructure"
summary: "Moving JSON records into tables can silently discard identity, append-only history, approval, and outcome-linkage semantics."
evidenceScope: "Evidence-model architecture observation"
featured: false
bookSection: "Evidence and governance"
bookOrder: 2
---

## The schema was not the whole system

A file-based evidence registry had converged on a small set of JSON schemas. A
relational redesign offered stronger queries and explicit relationships, but it also
created a risk: rebuilding from an idealized diagram could erase behavior already
encoded in the existing records and validation code.

The important semantics included more than field names:

- idempotent registration for the same normalized object and metadata;
- append-only versioning rather than in-place replacement;
- explicit identity states instead of assumed identity;
- approval references that freeze a promotion decision; and
- a complete linkage tuple before an outcome can be attached.

## Map before redesigning

The chosen approach was to freeze a field-and-behavior mapping first, then introduce
new relational concepts. This makes differences deliberate. Without that phase, a
column can look equivalent to a JSON field while enforcing different lifecycle
rules.

Controls were another example. A positive or negative control is not merely optional
metadata on a candidate. It helps determine whether the experiment is interpretable.
A relational model should represent that role directly rather than hiding it in an
unstructured object.

## Avoid inventing the same axis twice

The migration also revealed overlapping vocabularies for evidence level and evidence
boundary. Keeping both without a defined relationship would create two labels for
nearby concepts and invite inconsistent comparisons.

The broader lesson is that migrations move meaning, not only data. A successful
schema compiles and accepts rows. A successful evidence migration also preserves
identity, history, approval, interpretation, and the conditions under which claims
may be promoted.

