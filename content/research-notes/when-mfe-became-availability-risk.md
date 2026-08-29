---
title: "When an MFE calculation became an availability risk"
date: "2026-06-27"
updated: "2026-08-29"
status: "Engineering note"
category: "Reliability & Release"
summary: "Two plausible debugging theories were wrong. A traceback showed that an unbounded cubic-time folding call was the real cause."
evidenceScope: "Software reliability investigation"
featured: true
bookSection: "Reliability and release engineering"
bookOrder: 1
---

## Two plausible explanations

A large but valid input made an optimization request appear to stop forever. The
first hypothesis blamed a synonymous-codon loop. The second blamed a sequence
scanner whose runtime might have grown unexpectedly.

Both explanations fit the surrounding code. Neither matched the captured stack.

Delayed traceback capture showed the request spending its time inside an RNA
minimum-free-energy calculation. This was not an infinite loop. It was a legitimate
algorithm with roughly cubic growth being called without an application-level
length boundary. A request could therefore remain within the API's sequence-length
limit while still creating an impractical folding workload.

## The fix was a boundary, not a faster guess

The immediate correction was to stop invoking the full-length calculation above a
documented limit and return an explicit “not computed” state. That distinction
matters. Missing evidence must not silently become a favorable score, and a skipped
calculation must not look like a failed biological check.

The investigation also revealed duplicate computation: the same expensive path was
being called for scoring and again for provenance. That performance issue was kept
separate from the availability fix so the root-cause correction could remain small
and reviewable.

## The broader lesson

Input validation is not only about malformed data. Valid inputs can still trigger
unsafe algorithmic cost. Scientific libraries often expose computations whose
complexity is reasonable for one scale and hazardous for another; the product layer
must define the supported scale explicitly.

There is also a scientific design question left open. Windowed or local MFE may be
more useful than a full-transcript value for some review tasks, but changing the
measurement changes its interpretation and any calibrated thresholds. That belongs
to a separate evidence-backed contract, not a quiet performance patch.

