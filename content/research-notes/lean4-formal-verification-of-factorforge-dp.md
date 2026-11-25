---
title: "Formally verifying FactorForge's discrete dynamic programming model in Lean 4"
date: "2026-11-25"
updated: "2026-11-25"
status: "Engineering note"
category: "Formal verification"
summary: "How we proved soundness, completeness, genetic-code translation preservation, and constructive optimality for FactorForge's discrete integer DP model in Lean 4—and where the verified model ends relative to the floating-point Python optimizer."
evidenceScope: "Standalone Lean 4.36.0 proofs and finite Python correspondence tests; no full Python refinement proof and no biological validation"
featured: true
bookSection: "Design and validation"
bookOrder: 4
pdfUrl: "/research-notes/FactorForge_Lean4_Formal_Verification_Technical_Note.pdf"
pdfLabel: "Download Technical Note (PDF)"
bundleUrl: "/research-notes/FactorForge_Lean4_Verification_Package.zip"
bundleLabel: "Download Reproducible Lean 4 + Oracle Package (.zip)"
---

## Why unit tests were not enough—and why an AI proof alone isn't either

Unit tests check whether a dynamic programming (DP) solver matches brute-force enumeration on small sampled inputs. They cannot prove that a Bellman recurrence holds for arbitrary construct lengths, or that hard forbidden-motif invariants hold across every possible codon junction.

At the same time, asking a single AI agent to write both theorem statements and proofs introduces two well-known failure modes:

1. **Specification weakening:** an agent can quietly weaken a theorem, omit synonymous amino-acid preservation ($\mathrm{Translate}(c) = a$), or allow malformed codon records (such as `AAA` claiming `gc = 3`).
2. **Model-to-code drift:** proving that an abstract discrete recurrence is optimal is not the same claim as proving that every execution of the operational Python optimizer satisfies that specification.

To guard against specification drift, we structured a standalone Lean 4.36.0 verification and Python correspondence package around separated specification files (`Spec/`), isolated proofs (`Proofs/`, `Witnesses.lean`), a fail-closed brute-force and reference-mutation test harness (`tests/`), and automated adversarial review. **Importantly, multi-agent review is an internal automated check, not an independent audit by external human mathematicians or software verification specialists.** Rather than asking readers to trust an automated review, we publish the full Lean 4 package and Python verifier above so any reader can inspect the specifications and replay the kernel checks directly.

## What the Lean 4 kernel verified (explicit discrete model)

All **20 core theorems** and **14 constructive witnesses and refutations** compile from a clean state under `lake build` and pass the independent kernel checker `leanchecker` across all 14 modules, using only standard Lean axioms (`propext`, `Classical.choice`, `Quot.sound`) with zero `sorry`s, zero `native_decide`s, and zero custom axioms:

- **Standard 64-triplet genetic code & synonymous validity (`Spec/GeneticCode.lean`, `ExactDP.lean`):** Encodes all 64 DNA triplets (`61` sense codons + `3` stop codons, checked 64-for-64 against Python's `STANDARD_GENETIC_CODE`). `ValidCodonForAA` enforces $|c.\mathrm{seq}| = 3$, exact nucleotide GC ($c.\mathrm{gc} = \mathrm{seqGC}(c.\mathrm{seq})$), and sense translation $\mathrm{Translate}(c.\mathrm{seq}) = \mathrm{some}(\mathrm{aa}\;a)$, refuting malformed entries such as `AAA` with `gc = 3` and stop codons inside Lean's kernel (`witness_malformed_codon_rejected`).
- **Protein preservation & true nucleotide GC conservation (`proteinPreservationAndGC`):** Proves that every valid path over a well-formed synonymous menu (`WellFormedMenu`) has exact length $3 \cdot |\text{protein}|$, true nucleotide GC count matching its accumulated DP coordinate, and sense translation equal to the input protein with zero internal or terminal stop codons.
- **Construct-level automaton safety (`Automaton.lean`):** Proves for any supplied deterministic finite automaton (`Automaton`) that safe left-flank transitions, safe per-codon transitions, and safe stop/right-flank transitions guarantee zero forbidden terminal-state visits across the concatenated construct `leftFlank ++ cds ++ tail`.
- **Constructive end-to-end DP optimality (`dpOptimizeEndToEnd`):** Beyond Tropical max-plus value optimality (`dpSoundness`, `dpCompleteness`, `exactGlobalOptimality` over $\mathbb{Z} \cup \{-\infty\}$), formalizes the constructive path-returning solver `dpOptimize` and proves that it returns `none` if and only if no feasible path exists (or the left flank is unsafe), and that any returned `some (v, cs)` simultaneously translates to the target protein, satisfies nucleotide GC bounds, avoids forbidden automaton states across flanks and junctions, and achieves the maximum integer score over the supplied menu.
- **Exact rational ramp bounds & conditional integer perturbation margin (`KineticAndParity.lean`):** Proves strict interiority and monotonicity of $\tau_p + \frac{d}{W}(1 - \tau_p)$ over exact rationals (`ExactRat`), universal zero-weight pause parity, strict total ordering of lexicographic rank lists (`pathLexLt`), and conditional integer perturbation bounds (`approxScoreExactness`: if per-step integer error is bounded by $\varepsilon$ across $L$ steps, total path error is at most $L\varepsilon$, and margins exceeding $2\Delta$ preserve strict ordering).

## Sampled correspondence with the operational Python optimizer

Because Lean's kernel verifies the declared discrete integer model rather than executing Python code, the companion `tests/` suite cross-checks the operational `FactorForge` source snapshot on finite inputs:

1. **Exhaustive brute-force substring oracle (`BruteForceCDSOracle`):** Enumerates the Cartesian product of synonymous codons on short peptides and checks forbidden motifs and reverse complements via raw substring search (independently of Aho-Corasick trie compilation) across GC integer boundaries, all amino-acid degeneracy classes (`1, 2, 3, 4, 6`), flank-to-CDS-to-flank bridge motifs, equal-score ties, and unsatisfiable constraints.
2. **200-instance shrinking fuzzer & integer mirror (`LeanExactMirrorDP`):** Evaluates 200 seeded random instances across four `PYTHONHASHSEED` settings (`0..3`), confirming 100% amino-acid preservation, motif safety, GC feasibility agreement, and optimal score agreement on the sampled cases—while exposing a concrete tie-breaking difference on homodipeptides (`FF`: `TTTTTC` vs `TTCTTT`), where both paths share the exact same score at state `(g = 1, s = 0)`.
3. **Reference-copy mutation checks (`8/8` predefined defects killed):** Injects eight semantic defects into an instrumented reference solver copy (`_run_instrumented_dp`)—wrong synonymous codon, dropped `'C'` in GC count, omitted reverse complement, ignored left/right flanks, off-by-one `max_gc`, `min`-for-`max` relaxation, and corrupted backpointers—confirming that the oracle assertions catch all eight defects.
4. **Formulation coverage matrix (`F1`–`F28`):** Categorizes 28 FactorForge mathematical formulations across five groups so definitional metrics, heuristic generators, kernel-proved discrete DP theorems, and benchmark summary statistics are never conflated.

## Exact proof boundary and scope summary

This verification milestone establishes the mathematical soundness of FactorForge's **specified discrete DP core**, not a universal formal verification of the entire Python software stack:

| Scope Area | Current Status | Technical Detail |
| --- | --- | --- |
| **Discrete integer DP core & 64-codon translation (`FactorForgeFormal`)** | **Verified in Lean 4** | 20 theorems, 14 witnesses, 34 `#print axioms` checks (`0 sorry`), `leanchecker` verified. Optimality is relative to supplied `WellFormedMenu` menus (menu soundness; full synonymous completeness is supplied by Python's `AA_TO_CODONS` table). |
| **Sampled Python DP correspondence & reproducible bundle** | **Completed (finite suite)** | 28 pytest checks, 4 hash-seed runs, 8/8 reference-copy mutant kills, and 229-file manifest integrity checks (`python verify_all.py`). |
| **Universal Python-to-Lean refinement & backpointer proof** | **Not proved (future scope)** | Lean's `dpOptimize` stores prefix lists; operational Python reconstructs stored `(prev_g, prev_s)` backpointers and is not extracted from Lean. |
| **IEEE-754 `float` & `1e-12` epsilon error bounds** | **Not proved (future scope)** | Operational DP accumulates binary64 `math.log` floats with a non-transitive `1e-12` intra-state tie window (`relaxCand`, `PathRank`, and operational last-codon tie-breaking follow three distinct tie policies). `approxScoreExactness` is a conditional theorem over `List Int`, not a binary64 float certificate. |
| **General substring motif compiler & non-DP heuristics** | **Not proved in Lean** | Lean assumes a supplied DFA transition table rather than proving general Aho-Corasick compilation for arbitrary motif sets; `AutomatonCompiler` permutes internal state IDs with `PYTHONHASHSEED`; Python `round(..., 3)` collapses ramp strictness near $1.0$ (e.g., $\tau_p = 0.999, W = 3$); 5' ramp clamping and heuristic baselines (`balanced`, `gc_target`, `SOP`) lie outside `ExactDP.lean`. |
| **Biological expression & wet-lab performance** | **Not available** | `UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE`. Mathematical optimization correctness implies zero wet-lab expression, folding, or yield guarantee. |
