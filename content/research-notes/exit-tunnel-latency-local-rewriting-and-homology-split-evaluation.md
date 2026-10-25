---
title: "Ribosome exit-tunnel latency, local codon rewriting, and configured homology evaluation"
date: "2026-10-24"
updated: "2026-10-24"
status: "Computational observation"
category: "Architecture and direction"
summary: "A positional 4DP hypothesis, local rewriting limits, and stored public-corpus comparisons under configured homology separation."
evidenceScope: "Public software architecture and bounded in-silico evaluation on public sequences; no biological validation or wet-lab performance claim"
featured: true
bookSection: "Architecture and direction"
bookOrder: 4
---

## Accounting for a positional exit-tunnel hypothesis

The local 4DP research path shifts selected heuristic pause-score windows by a configurable offset, currently +35 residues. This changes a codon objective; it does not demonstrate a physical pause, folding improvement or calibrated translation dynamics. A boundary is 1-based. Its shifted interval is intersected with [1, N]; an interval entirely beyond the sequence is empty, rather than being forced onto its final residue. Tensor indices are converted to 0-based only after intersection.

## Exact dynamic programming versus local rewriting

ConstrainedLocalRewriter shares configured objective and constraint checks with the DP reference. Coupled two-site GC-neutral changes can escape some local traps. Reported score changes are software-objective observations, not biological benefits. Separate replay estimates are not matched execution budgets, and feasible-domain agreement must be checked before treating DP as a comparison reference.

## Negative results under configured homology separation

The stored public-corpus evaluation contains 31 retained CDS across 29 operational clusters. Graph links use amino-acid identity at least 40%; configured separation between splits is below 40%. This does not establish universal absence of relatedness or prior exposure.

- Training: 22 CDS, 20 clusters, 6,894 tokens.
- Validation: 5 CDS, 5 clusters, 1,691 tokens.
- Test: 4 CDS, 4 clusters, 1,052 tokens.

Stored validation NLL is 1.060267 (Frequency), 1.088938 (Bigram), and 1.060169 (sLLM). Stored test NLL is 1.113339, 1.128064, and 1.132609, respectively. Frequency is an empirical count model, not a zero-parameter model. These results establish no neural test advantage and do not by themselves diagnose overfitting. This review checked aggregate records, without replaying host-data training or inference.

## Why evidence boundaries govern product defaults

Deterministic DP remains the default; neural decoding and shifted-window research remain opt-in. AlphaFold prediction metadata availability is distinct from sequence-bound residue confidence or PAE features actually consumed by a model. The current exploratory trainer uses sequence-derived flags; per-residue AlphaFold conditioning is not established.

Local telemetry tables and a storage-client reconciliation interface do not prove deployment into remote services. Reconciliation must verify a stable local inventory and durable remote content before any caller authorizes deletion. VM deletion, storage retention and cloud billing require separate checks; zero cost and automatic retention are not guaranteed.

UNVERIFIED_PUBLIC_CORPUS. Biological validation: NOT_AVAILABLE.
