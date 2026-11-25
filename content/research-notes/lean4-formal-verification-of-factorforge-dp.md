---
title: "Formally verifying FactorForge's discrete dynamic programming model in Lean 4"
date: "2026-11-25"
updated: "2026-11-25"
status: "Engineering note"
category: "Formal verification"
layout: "blueprint"
version: "Technical Monograph v1.0.2 · Lean 4.36.0"
summary: "Complete mathematical blueprint, locked Lean 4.36.0 specifications, inductive proof sketches, 12-state BsaI constructive trace, and sampled Python correspondence for FactorForge's discrete integer DP core."
abstract: "Constraint-aware coding-sequence (CDS) optimization selects synonymous codons preserving a target protein while avoiding forbidden motifs across flanks and inter-codon junctions, satisfying global nucleotide GC bounds, and maximizing an additive codon-fitness objective. Finite unit suites test sampled inputs, whereas informal or unconstrained AI-generated proofs risk silent specification weakening unless checked by an independent proof kernel. Here we present the full mathematical blueprint of FactorForgeFormal, a zero-dependency Lean 4.36.0 formalization (14 modules, >2,500 lines, 0 sorry, verified transitively via leanchecker) proving 20 core theorems, 3 helper lemmas, and 14 concrete witnesses across Tropical max-plus algebra, construct-level DFA safety, the 64-triplet Standard Genetic Code (ValidCodonForAA), constructive backtracking DP optimality (dpOptimizeEndToEnd), exact rational pause-ramp interpolation (ExactRat), and conditional integer perturbation margins—alongside a fail-closed Python correspondence and 8/8 reference-copy mutation suite."
toc:
  - id: "sec-1"
    number: "1"
    title: "Verification Architecture & Role-Separated Trust"
  - id: "sec-2"
    number: "2"
    title: "Tropical Max-Plus Algebra (Spec/Tropical.lean)"
  - id: "sec-3"
    number: "3"
    title: "Construct-Level DFA Safety (Spec/Automaton.lean)"
  - id: "sec-4"
    number: "4"
    title: "64-Triplet Genetic Code & Menu Validity"
  - id: "sec-5"
    number: "5"
    title: "Bellman Optimality & Constructive dpOptimize"
  - id: "sec-6"
    number: "6"
    title: "Exact Rational Kinetics, Tie Orders & Margins"
  - id: "sec-7"
    number: "7"
    title: "12-State BsaI Automaton & Refutation Trace"
  - id: "sec-8"
    number: "8"
    title: "Theorem, Witness, Mutant & F1-F28 Catalogs"
  - id: "sec-9"
    number: "9"
    title: "Exact Proof Boundaries & Replay Protocol"
evidenceScope: "Standalone Lean 4.36.0 proofs and finite Python correspondence tests; no full Python refinement proof and no biological validation"
featured: true
bookSection: "Design and validation"
bookOrder: 4
pdfUrl: "/research-notes/FactorForge_Lean4_Formal_Verification_Technical_Note.pdf"
pdfLabel: "Download Full Technical Monograph v1.0.2 (PDF, 15p)"
bundleUrl: "/research-notes/FactorForge_Lean4_Verification_Package.zip"
bundleLabel: "Download Reproducible Lean 4 + Oracle Archive (.zip)"
---

## 1. Verification Architecture and Role-Separated Trust

Checking a dynamic-programming (DP) coding-sequence compiler solely through finite unit tests verifies input-output agreement on chosen examples, yet cannot prove universal invariants across arbitrary protein lengths $L$, tight integer GC intervals $[g_{\min}, g_{\max}]$, or cross-junction motif bridges spanning $5'$ flanks, coding triplets, and $3'$ stop/terminator tails. Conversely, delegating both specification design and proof authoring to a single unconstrained automated workflow creates two well-known failure modes:

1. **Specification weakening and vacuity:** A formalization can silently omit synonymous translation invariance ($\mathrm{Translate}(D) = P$), trust unverified metadata fields on candidate records (such as a codon record `AAA` claiming `gc = 3`, or a stop triplet `TAA` inside a sense menu), or prove universal implications whose hypotheses are accidentally uninhabited.
2. **Model-to-code conflation:** Proving Bellman optimality for a discrete integer model over $\mathbb{Z} \cup \{-\infty\}$ is not the same claim as proving universal code refinement for an operational Python optimizer that accumulates IEEE-754 binary64 `math.log` floats, applies a `1e-12` intra-state tie tolerance, and reconstructs paths via mutable tuple backpointers.

To guard against silent specification drift and measure runtime boundaries explicitly, `FactorForgeFormal` enforces a four-layer trust separation:

- **Locked Lean 4 specifications (`formal/FactorForgeFormal/Spec/`):** Six modules (`Tropical.lean`, `Automaton.lean`, `GeneticCode.lean`, `ExactDP.lean`, `KineticAndParity.lean`, and aggregator `Spec.lean`) declare all data structures, algorithms, and target propositions (`Prop_*`) with zero `sorry` placeholders, bound to locked file digests in `spec_lock_manifest.json`.
- **Isolated tactic proofs (`formal/FactorForgeFormal/Proofs/`):** Five proof modules import `Spec/` read-only and establish **20 core theorems** plus **3 structural helper lemmas** using structural induction, fold-invariant lifting, kernel reduction (`decide`), and linear integer arithmetic (`omega`), with zero external Mathlib dependencies and zero `native_decide`.
- **Concrete non-vacuity witnesses and kernel axiom audit (`Witnesses.lean`, `Audit.lean`):** Fourteen kernel-checked theorems instantiate the specifications on a 12-state BsaI (`GGTCTC` / `GAGACC`) automaton across construct `"GGTC" + "SL" + "TAA"`, refuting malformed codons and proving constructive selection of `AGCCTG` at quantized score `-357`. `Audit.lean` runs `#print axioms` across all 34 declarations, followed by fresh-process kernel replay via `leanchecker`.
- **Sampled Python correspondence & reference-mutation harness (`tests/`):** Cross-checks the self-contained `factorforge_snapshot/` against an Aho-Corasick-independent substring enumerator (`BruteForceCDSOracle`), an exact integer mirror (`LeanExactMirrorDP`), a 200-instance shrinking fuzzer across four `PYTHONHASHSEED` settings, and an 8-defect reference-copy mutation suite. **Importantly, internal multi-agent adversarial review performed during development is an automated engineering check, not an independent audit by external human mathematicians or software verification specialists.**

## 2. Tropical Max-Plus Algebra (`Spec/Tropical.lean`)

Additive log-CAI maximization over reachable finite states is formalized over the extended integer semiring $\mathrm{Trop}(\mathbb{Z}) = \mathbb{Z} \cup \{-\infty\}$, where unreachable `(gc, state)` cells carry $-\infty$, path extension adds integer step scores, and state relaxation takes the pointwise maximum.

> **Definition 2.1 (Tropical Carrier, Operations, and Partial Order).** For carrier type $\alpha$, inductive type `Trop α` has constructors `negInf` ($-\infty$, additive identity $\mathbb{0}$) and `finite a` (with multiplicative identity $\mathbb{1} = \mathrm{finite}(0)$). Over $\alpha = \mathbb{Z}$, relaxation $\oplus$, extension $\otimes$, and partial order $\le$ are defined by:

$$
x \oplus y := \begin{cases} y & \text{if } x = -\infty, \\ x & \text{if } y = -\infty, \\ \mathrm{finite}(\max(a,b)) & \text{if } x = \mathrm{finite}(a),\; y = \mathrm{finite}(b), \end{cases}
\qquad
x \otimes y := \begin{cases} -\infty & \text{if } x = -\infty \text{ or } y = -\infty, \\ \mathrm{finite}(a + b) & \text{if } x = \mathrm{finite}(a),\; y = \mathrm{finite}(b). \end{cases}
$$

```lean
inductive Trop (alpha : Type u) where
  | negInf : Trop alpha
  | finite : alpha -> Trop alpha
  deriving DecidableEq, Repr

def oplus {alpha : Type u} [Max alpha] : Trop alpha -> Trop alpha -> Trop alpha
  | Trop.negInf, b => b
  | a, Trop.negInf => a
  | Trop.finite a, Trop.finite b => Trop.finite (max a b)

def otimes {alpha : Type u} [Add alpha] : Trop alpha -> Trop alpha -> Trop alpha
  | Trop.negInf, _ => Trop.negInf
  | _, Trop.negInf => Trop.negInf
  | Trop.finite a, Trop.finite b => Trop.finite (a + b)
```

> **Theorem 2.1 (`tropIntSemiringLaws`) & Theorem 2.2 (`tropIntOrderLaws`).** $(\mathrm{Trop}(\mathbb{Z}), \oplus, \otimes, -\infty, 0)$ satisfies all 12 idempotent max-plus semiring identities—associativity, commutativity, idempotence ($a \oplus a = a$), and identity of $\oplus$; associativity, unit $0$, and $-\infty$ annihilation of $\otimes$; left and right distributivity $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$—and $(\mathrm{Trop}(\mathbb{Z}), \le)$ is a partial order for which $\oplus$ is the least upper bound and $\otimes$ is monotone in both arguments.

> **Proof sketch (`Proofs/Tropical.lean`).** Proved by exhaustive 3-way constructor case analysis (`cases a <;> cases b <;> cases c`), reducing finite branches to linear integer `max` and `+` goals closed by `omega` (`#print axioms`: `[propext, Quot.sound]`).

## 3. Construct-Level Finite-State Automaton Safety (`Spec/Automaton.lean`)

Forbidden restriction endonuclease recognition sites (such as BsaI `GGTCTC` and reverse complement `GAGACC`) and sequence motifs can span $5'$-flank-to-CDS junctions, inter-codon boundaries, and CDS-to-stop/terminator junctions. `Spec/Automaton.lean` models bounded nucleotide DFAs over $\Sigma = \{\mathrm{A}, \mathrm{C}, \mathrm{G}, \mathrm{T}\}$.

> **Definition 3.1 (Bounded DFA and Prefix-Safe Stepping).** An `Automaton` $M = (N, q_0, \delta, T, h_0, h_\delta)$ comprises state count $N = \text{numStates}$, initial state $q_0 < N$, state-closed transition map $\delta : \mathbb{N} \times \Sigma \to \mathbb{N}$ ($q < N \implies \delta(q,b) < N$), and forbidden terminal indicator $T : \mathbb{N} \to \mathbb{B}$. Multi-symbol stepping $\delta^* = \text{stepSeq}$ and prefix-wise terminal avoidance $\mathrm{safeSeq}$ recurse over base lists, while `stepCodonSafe` mirrors `CompiledAutomaton.step_codon` by halting immediately with `(s', false)` if any intermediate base visits a terminal state.

```lean
structure Automaton where
  numStates : Nat
  initState : Nat
  stepSym : Nat -> Base -> Nat
  isTerminal : Nat -> Bool
  init_lt : initState < numStates
  step_lt : ∀ s b, s < numStates -> stepSym s b < numStates

def safeSeq (M : Automaton) (s : Nat) : List Base -> Bool
  | [] => true
  | b :: bs =>
    let s' := M.stepSym s b
    if M.isTerminal s' then false else safeSeq M s' bs

def stepCodonSafe (M : Automaton) (s : Nat) (codon : List Base) : Nat × Bool :=
  match codon with
  | [] => (s, true)
  | b :: bs =>
    let s' := M.stepSym s b
    if M.isTerminal s' then (s', false) else stepCodonSafe M s' bs
```

> **Theorems 3.1–3.5 (`stepSeqAppend`, `safeSeqAppend`, `stepCodonSafeSound`, `stepCodonSafeComplete`, `fullConstructSafe`).** Multi-base transitions compose homomorphically ($\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q,u), v)$), prefix safety factors cleanly across intermediate states ($\mathrm{safeSeq}(M, q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(M, q, u) \land \mathrm{safeSeq}(M, \delta^*(q, u), v)$), and `stepCodonSafe` is both sound and complete for `(stepSeq, safeSeq)`. Consequently, for any $5'$ flank $F_L$, codon list $C$, and $3'$ tail $F_R$ with $q_L = \delta^*(q_0, F_L)$ and $q_{\mathrm{end}} = \delta^*(q_L, \mathrm{flatten}(C))$:

$$
\mathrm{safeSeq}(M, q_0, F_L) \;\land\; \mathrm{safeCodonList}(M, q_L, C) \;\land\; \mathrm{safeSeq}(M, q_{\mathrm{end}}, F_R)
\;\Longrightarrow\;
\mathrm{safeSeq}\bigl(M, q_0, F_L \mathbin{\Vert} \mathrm{flatten}(C) \mathbin{\Vert} F_R\bigr).
$$

> **Proof sketch (`Proofs/Automaton.lean`).** Structural list induction on `xs` generalizing starting state `s`, splitting on `M.isTerminal (M.stepSym s b)`. Helper `safeCodonList_implies_safeSeq` lifts `stepCodonSafeSound` across `cds : List (List Base)`, after which `fullConstructSafe` rewrites `List.append_assoc` and applies `safeSeqAppend` twice (`#print axioms`: `[propext]` only).

## 4. Standard 64-Triplet Genetic Code and Synonymous Menu Validity (`Spec/GeneticCode.lean`)

To prevent malformed candidate menus from bypassing amino-acid fidelity or falsifying stored GC counts, `Spec/GeneticCode.lean` encodes all $4^3 = 64$ triplets (`translateTriplet`) and recursive frame-exact sense decoding (`translateDNA`), checked 64-for-64 against Python's `STANDARD_GENETIC_CODE`.

> **Definition 4.1 (`ValidCodonForAA` & `WellFormedMenu`).** A candidate codon record $c = (\mathrm{seq}, \mathrm{gc}, \mathrm{score})$ is valid for target residue $a \in \mathcal{A}$ iff it has exact length 3, nucleotide GC count matching its stored `gc` field, and sense translation equal to $a$:

$$
\mathrm{ValidCodonForAA}(c, a) \;\Longleftrightarrow\;
|c.\mathrm{seq}| = 3 \;\land\;
c.\mathrm{gc} = \mathrm{seqGC}(c.\mathrm{seq}) \;\land\;
\mathrm{translateCodonSeq}(c.\mathrm{seq}) = \mathrm{some}(\mathrm{aa}\;a).
$$

```lean
def ValidCodonForAA (c : CodonSpec) (a : AminoAcid) : Bool :=
  c.seq.length == 3 && c.gc == seqGC c.seq && translateCodonSeq c.seq == some (.aa a)

def WellFormedMenu : List AminoAcid -> List (List CodonSpec) -> Prop
  | [], [] => True
  | a :: as, opts :: rest =>
    (∀ c ∈ opts, ValidCodonForAA c a = true) ∧ WellFormedMenu as rest
  | _, _ => False
```

> **Theorem 4.1 (`geneticCodePartition64`, zero axioms), Lemmas 4.2–4.3 (`validCodonForAA_destruct`, `translateDNA_cons3`), & Theorems 4.4–4.5 (`gcConservation`, `proteinPreservationAndGC`).** Inside Lean's kernel with **zero axioms**, the 64 DNA triplets partition into exactly `61` sense codons and `3` stop codons (`TAA`, `TAG`, `TGA`). Under `WellFormedMenu P L`, every `ValidPath M s0 L C` flattens to coding DNA $D = \mathrm{flatMap}(\mathrm{seq}, C)$ satisfying:

$$
|D| = 3|P|, \qquad
\mathrm{pathGC}(C) = \sum_{i=1}^{|P|} c_i.\mathrm{gc} = \mathrm{seqGC}(D), \qquad
\mathrm{translateDNA}(D) = \mathrm{some}(P),
$$

guaranteeing zero reading-frame shifts and zero internal or terminal stop codons.

## 5. Bellman Optimality and Constructive Witness Extraction (`Spec/ExactDP.lean`)

### 5.1 Tropical Bellman Table vs. Constructive Candidate Solver

Over the discrete state lattice $(g, s) \in \{0,\dots,G_{\max}\} \times \{0,\dots,N-1\}$, `Spec/ExactDP.lean` defines both the Tropical value recurrence `dpEval` / `dpBestScore` and the constructive prefix-tracking solver `dpTrackEval` / `dpOptimize`.

$$
V_i(g', s') := \bigoplus_{s = 0}^{N - 1} \;\bigoplus_{\substack{c \in O_i : \; c.\mathrm{gc} \le g' \\ \mathrm{stepCodonSafe}(M, s, c.\mathrm{seq}) = (s', \mathrm{true})}}
\Bigl(V_{i-1}(g' - c.\mathrm{gc}, s) \otimes \mathrm{finite}(c.\mathrm{score})\Bigr),
\qquad V_0(g, s) = \begin{cases} 0 & (g,s)=(0,s_0), \\ -\infty & \text{otherwise.} \end{cases}
$$

To return an explicit optimal codon list `some (v, cs)` rather than an existential value proof, `DPCandidate := Option (Int × List CodonSpec)` pairs integer scores with prefix codon lists via deterministic relaxation `relaxCand` (retaining first-seen on exact score ties) and `extendCand`.

```lean
def Prop_DPOptimizeEndToEnd : Prop :=
  ∀ (M : Automaton) (leftFlank : List Base) (minGC maxGC : Nat) (tail : List Base)
    (protein : List AminoAcid) (layers : List (List CodonSpec)),
    WellFormedMenu protein layers ->
    let s0 := M.stepSeq M.initState leftFlank
    (M.safeSeq M.initState leftFlank = true ->
      candToTrop (dpOptimize M leftFlank minGC maxGC tail layers) =
        dpBestScore M s0 minGC maxGC tail layers) ∧
    (dpOptimize M leftFlank minGC maxGC tail layers = none ↔
      M.safeSeq M.initState leftFlank = false ∨
      ∀ cs, ¬ FeasibleCDS M s0 minGC maxGC tail layers cs) ∧
    (∀ (v : Int) (cs : List CodonSpec),
      dpOptimize M leftFlank minGC maxGC tail layers = some (v, cs) ->
      let dna := cs.flatMap (·.seq)
      FeasibleCDS M s0 minGC maxGC tail layers cs ∧
      pathScore cs = v ∧
      dna.length = 3 * protein.length ∧
      translateDNA dna = some protein ∧
      minGC ≤ seqGC dna ∧
      seqGC dna ≤ maxGC ∧
      M.safeSeq M.initState (leftFlank ++ dna ++ tail) = true ∧
      ∀ cs', FeasibleCDS M s0 minGC maxGC tail layers cs' -> pathScore cs' ≤ v)
```

### 5.2 Soundness, Completeness, Pruning, and Crown Theorem `dpOptimizeEndToEnd`

> **Theorems 5.1–5.3 (`dpSoundness`, `dpCompleteness`, `exactGlobalOptimality`) & Lemma (`exactOpt_witness_eq`).** For $s_0 < M.\mathrm{numStates}$, every finite entry $V_L(g, s) = \mathrm{finite}(v)$ witnesses an authentic `ValidPath` with matching $(g, s, v)$, and every `ValidPath` is upper-bounded by $V_L(\mathrm{pathGC}(C), \delta^*(s_0, D))$. Terminal projection `dpBestScore` upper-bounds all `FeasibleCDS` paths and attains every finite global optimum.

> **Theorem 5.4 (Crown Theorem: `dpOptimizeEndToEnd`).** Under `WellFormedMenu P L` with $s_0 = \delta^*(q_0, F_L)$:
> 1. **Value refinement:** When $\mathrm{safeSeq}(M, q_0, F_L) = \mathrm{true}$, $\mathrm{candToTrop}(\mathrm{dpOptimize}(\dots)) = \mathrm{dpBestScore}(\dots)$.
> 2. **Complete infeasibility certificate:** $\mathrm{dpOptimize}(\dots) = \mathrm{none}$ if and only if $F_L$ is unsafe or zero `FeasibleCDS` paths exist.
> 3. **8-part constructive sequence optimality:** Whenever $\mathrm{dpOptimize}(\dots) = \mathrm{some}(v, C)$ with $D = \mathrm{flatMap}(\mathrm{seq}, C)$, $C$ is feasible, $\mathrm{pathScore}(C) = v$, $|D| = 3|P|$, $\mathrm{translateDNA}(D) = \mathrm{some}(P)$, $g_{\min} \le \mathrm{seqGC}(D) \le g_{\max}$, the full construct $F_L \mathbin{\Vert} D \mathbin{\Vert} F_R$ is motif-safe from $q_0$, and $\mathrm{pathScore}(C') \le v$ for every feasible competitor $C'$.

> **Theorems 5.5–5.6 (`gcEnvelopeAndPruningAdmissible`, `synonymousEnvelopeUnsat`).** Any feasible split $C = C_{\mathrm{pre}} \mathbin{\Vert} C_{\mathrm{suf}}$ satisfies $g_{\min} \le \mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMaxGC}(\mathcal{L}_{\mathrm{suf}})$ and $\mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMinGC}(\mathcal{L}_{\mathrm{suf}}) \le g_{\max}$, proving suffix GC pruning never drops an optimal completion, and any target window disjoint from $[\mathrm{totalMinGC}(\mathcal{L}), \mathrm{totalMaxGC}(\mathcal{L})]$ has zero feasible solutions.

> **Proof sketch (`Proofs/ExactDP.lean`, 1,225 lines).** Uses snoc-list induction (`list_snoc_rec`) over DP layers and nested fold-invariant lemmas across `List.range M.numStates` and `opts`. Homomorphism lemma `candToTrop_dpTrackEval` proves `candToTrop (dpTrackEval ...) = dpEval ...` via `candToTrop (relaxCand x y) = oplus (candToTrop x) (candToTrop y)`, while `dpTrackSoundness` lifts witness validity to compose `proteinPreservationAndGC`, `fullConstructSafe`, and `exactGlobalOptimality`.

## 6. Exact Rational Kinetics, Tie Orders, and Perturbation Margins (`Spec/KineticAndParity.lean`)

> **Definition 6.1 (`ExactRat` & `rampTau`).** Exact rationals $\mathrm{ExactRat} = \{(p, q) \in \mathbb{Z}^2 : q > 0\}$ compare fractions via cross-multiplication ($a.p \cdot b.q < b.p \cdot a.q$) with zero rounding. Upstream deceleration ramp interpolation $\tau_{\mathrm{ramp}}(\tau_p, d, W) = \tau_p + \frac{d}{W}(1 - \tau_p)$ is represented exactly as:

$$
\mathrm{rampTau}\bigl((p, q), d, W\bigr) := \frac{pW + d(q - p)}{qW}, \qquad (q > 0,\; W > 0).
$$

> **Theorems 6.1–6.4 (`tasepRampBoundsAndMonotonicity`, `zeroWeightParity`, `pathLexTotalOrder`, `approxScoreExactness`).**
> - **Exact ramp interiority & monotonicity:** For $0 < \tau_p < 1$ and $1 \le d < W$, $\tau_p <_{\mathbb{Q}} \mathrm{rampTau}(\tau_p, d, W) <_{\mathbb{Q}} 1$; $\mathrm{rampTau}$ is strictly increasing in $d$ and invariant at $\tau_p = 1$.
> - **Zero-weight pause parity:** When all active pause weights equal $0$, structure-aware `structFitness` collapses identically to baseline fitness across every $(g, s)$ entry of `dpEval`.
> - **Lexicographic strict total order:** Prefix rank comparator `pathLexLt` is irreflexive, transitive, asymmetric, and trichotomous on `List Nat`.
> - **Conditional integer perturbation margin (`List Int`):** If pointwise integer error satisfies $|a_i - t_i| \le \varepsilon$ across $L$ steps, then $\bigl|\sum_{i=1}^L a_i - \sum_{i=1}^L t_i\bigr| \le L\varepsilon$, and $\tilde{S}_{\mathrm{alt}} + 2\Delta < \tilde{S}_{\mathrm{opt}}$ with $|\tilde{S} - S| \le \Delta$ guarantees $S_{\mathrm{alt}} < S_{\mathrm{opt}}$.

> **Runtime boundary (`float` vs. `List Int` / `ExactRat`).** `approxScoreExactness` is a conditional theorem over `List Int` (fixed-point integer quantization), not a binary64 `math.log` floating-point error proof. Likewise, Python's `round(..., 3)` in `TASEPKineticsEngine` collapses strict $< 1.0$ interiority when $\tau_p \ge 0.999$ (for instance, $\tau_p = 0.999, d = 2, W = 3 \mapsto 1.0$).

## 7. Concrete 12-State BsaI Automaton & Constructive Refutation Trace (`Witnesses.lean`)

To prove non-vacuity inside Lean's kernel, `Witnesses.lean` encodes the deterministic 12-state Aho-Corasick automaton for BsaI (`GGTCTC` $\to$ terminal state `6`; reverse complement `GAGACC` $\to$ terminal state `11`) and optimizes dipeptide `"SL"` (`[.S, .L]`) across $5'$ flank `"GGTC"`, $3'$ stop tail `"TAA"`, and GC window `[2, 4]`:

1. **Flank stepping (`witness_leftFlank_safe`):** `"GGTC"` transitions $0 \xrightarrow{\mathrm{G}} 1 \xrightarrow{\mathrm{G}} 2 \xrightarrow{\mathrm{T}} 3 \xrightarrow{\mathrm{C}} 4$ safely (`s0 = 4`).
2. **Junction violation refutation (`witness_tct_rejected`):** Highest-scoring Serine codon `TCT` (quantized score `-223`) steps $4 \xrightarrow{\mathrm{T}} 5 \xrightarrow{\mathrm{C}} \mathbf{6}$, completing `"GGTCTC"` across the $5'$ junction and halting with `(6, false)`.
3. **Malformed candidate refutation (`witness_malformed_codon_rejected`):** Kernel `decide` rejects `AAA` claiming `gc = 3`, `AAA` claiming Serine `.S`, and stop triplet `TAA` claiming Tyrosine `.Y`.
4. **Constructive global optimum (`witness_dpOptimize_sl_end_to_end`):** `dpOptimize` selects `AGC` ($4 \to 0 \to 1 \to 0$, score `-357`, `gc = 2`) followed by `CTG` ($0 \to 0 \to 0 \to 1$, score `0`, `gc = 2`) and safe stop tail `"TAA"` ($1 \to 0 \to 0 \to 0$), outputting `some (-357, [AGC, CTG])` (`"AGCCTG"`, `seqGC = 4`).

```lean
theorem witness_malformed_codon_rejected :
    ValidCodonForAA ⟨[.A, .A, .A], 3, 100⟩ .K = false ∧
    ValidCodonForAA ⟨[.A, .A, .A], 0, 100⟩ .S = false ∧
    ValidCodonForAA ⟨[.T, .A, .A], 0, 0⟩ .Y = false := by
  decide

theorem witness_dpOptimize_sl_end_to_end :
    ∃ cs : List CodonSpec,
      dpOptimize bsaiAutomaton leftFlankGGTC 2 4 tailStopTAA slLayers = some (-357, cs) ∧
      translateDNA (cs.flatMap (·.seq)) = some [.S, .L] ∧
      2 ≤ seqGC (cs.flatMap (·.seq)) ∧
      seqGC (cs.flatMap (·.seq)) ≤ 4 ∧
      bsaiAutomaton.safeSeq bsaiAutomaton.initState
        (leftFlankGGTC ++ cs.flatMap (·.seq) ++ tailStopTAA) = true
```

## 8. Complete Theorem, Witness, Mutation, and Coverage Catalogs

### 8.1 All 20 Audited Core Theorems + 3 Structural Helper Lemmas (`Audit.lean`)

Axiom legend from `lake env lean FactorForgeFormal/Audit.lean`: **`none`** = zero axioms; **`P`** = `[propext]`; **`P, Q`** = `[propext, Quot.sound]`; **`P, C, Q`** = `[propext, Classical.choice, Quot.sound]` (zero `sorryAx` and zero custom axioms).

| Module | Lean Theorem / Lemma Identifier | `#print axioms` | Verified Mathematical Statement |
| --- | --- | --- | --- |
| `Tropical` | `tropIntSemiringLaws` | `P, Q` | 12 idempotent max-plus semiring laws over $\mathrm{Trop}(\mathbb{Z})$. |
| `Tropical` | `tropIntOrderLaws` | `P, Q` | Partial order, least upper bound, and $\oplus$/$\otimes$ monotonicity. |
| `Automaton` | `stepSeqAppend` | `P` | $\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q, u), v)$ for all base lists $u, v$. |
| `Automaton` | `safeSeqAppend` | `P` | $\mathrm{safeSeq}(q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(q, u) \land \mathrm{safeSeq}(\delta^*(q, u), v)$. |
| `Automaton` | `stepCodonSafeSound` | `P` | `stepCodonSafe(q, c) = (q', true)` implies $\delta^*(q, c) = q'$ and `safeSeq(q, c)`. |
| `Automaton` | `stepCodonSafeComplete` | `P` | `safeSeq(q, c) = true` implies `stepCodonSafe(q, c) = (stepSeq(q, c), true)`. |
| `Automaton` | `fullConstructSafe` | `P` | Safe $5'$ flank, safe codons, and safe $3'$ tail yield safe full construct. |
| `GeneticCode` | `geneticCodePartition64` | `none` | 64 DNA triplets partition into 61 sense codons and 3 stop codons. |
| `GeneticCode` | `validCodonForAA_destruct` *(helper)* | `P, C, Q` | Decomposes `ValidCodonForAA` into 3 bases, exact GC, and sense AA. |
| `GeneticCode` | `translateDNA_cons3` *(helper)* | `P` | Sense triplet prefix preserves recursive `translateDNA` decoding. |
| `ExactDP` | `gcConservation` | `P, C, Q` | Sum of well-formed codon `gc` fields equals flattened nucleotide `seqGC`. |
| `ExactDP` | `proteinPreservationAndGC` | `P, C, Q` | Valid paths over `WellFormedMenu` preserve length $3|P|$, `seqGC`, and `some P`. |
| `ExactDP` | `dpSoundness` | `P, C, Q` | Every finite `dpEval` entry witnesses an authentic `ValidPath` at $(g, s, v)$. |
| `ExactDP` | `dpCompleteness` | `P, C, Q` | Every `ValidPath` score is upper-bounded by `dpEval` at $(g, s)$. |
| `ExactDP` | `exactGlobalOptimality` | `P, C, Q` | `dpBestScore` upper-bounds all `FeasibleCDS` and attains finite optima. |
| `ExactDP` | `exactOpt_witness_eq` *(helper)* | `P, C, Q` | Feasible witness upper-bounding all feasible competitors equals `dpBestScore`. |
| `ExactDP` | `dpOptimizeEndToEnd` | `P, C, Q` | Constructive `dpOptimize` value parity, `none`-iff-unsat, and 8-part optimality. |
| `ExactDP` | `gcEnvelopeAndPruningAdmissible` | `P, C, Q` | Achievable suffix GC bounds $[G_{\min}, G_{\max}]$ preserve all feasible completions. |
| `ExactDP` | `synonymousEnvelopeUnsat` | `P, C, Q` | Target GC bands disjoint from $[G_{\min}, G_{\max}]$ admit zero feasible paths. |
| `KineticAndParity` | `tasepRampBoundsAndMonotonicity` | `P, Q` | Exact rational ramp interiority $(\tau_p, 1)$, strict monotonicity, and $\tau_p = 1$ invariance. |
| `KineticAndParity` | `zeroWeightParity` | `P, Q` | Zero-weight pause maps collapse step fitness and full DP tables to baseline. |
| `KineticAndParity` | `pathLexTotalOrder` | `P, Q` | Irreflexivity, transitivity, asymmetry, and trichotomy of `pathLexLt`. |
| `KineticAndParity` | `approxScoreExactness` | `P, Q` | Conditional `List Int` error bound $L\varepsilon$ and $2\Delta$ strict argmax preservation. |

### 8.2 All 14 Concrete Witness & Refutation Theorems (`Witnesses.lean`)

| Witness Theorem Identifier | `#print axioms` | Concrete Kernel-Verified Property |
| --- | --- | --- |
| `witness_malformed_codon_rejected` | `P` | Rejects `AAA` claiming `gc = 3`, `AAA` for `.S`, and stop `TAA` for `.Y`. |
| `witness_sl_wellFormedMenu` | `P` | Certifies 6 Serine + 6 Leucine options satisfy `WellFormedMenu [.S, .L]`. |
| `witness_leftFlank_safe` | `P, Q` | Left flank `"GGTC"` is safe on 12-state BsaI DFA and reaches state `4`. |
| `witness_sl_feasible` | `P, Q` | Path `AGCCTG` satisfies `FeasibleCDS` across `"GGTC" + "SL" + "TAA"`. |
| `witness_dpBest_sl_exact` | `P, C, Q` | Proves `dpBestScore(...) = finite (-357)` via `exactOpt_witness_eq`. |
| `witness_dpOptimize_sl_end_to_end` | `P, C, Q` | Constructively extracts `some (-357, cs)` translating to `[.S, .L]`. |
| `witness_tct_rejected` | `P, Q` | Proves Serine codon `TCT` from state `4` hits forbidden BsaI state `6`. |
| `witness_gc_and_protein_preservation` | `P, C, Q` | Instantiates `proteinPreservationAndGC` on `optPathSL` (`AGCCTG`). |
| `witness_gc_pruning_admissible` | `P, C, Q` | Verifies prefix `AGC` + suffix Leucine GC envelope bounds `[2, 4]`. |
| `witness_tasep_ramp` | `P, Q` | Certifies $\frac{7}{20} < \mathrm{rampTau}(\frac{7}{20}, 1, 3) < 1$ in `ExactRat`. |
| `witness_zero_weight_parity` | `P, Q` | Confirms zero-weight pause entries preserve score `-357` identically. |
| `witness_path_lex_order` | `P, Q` | Certifies `[14, 19] < [15, 19] < [48, 19] => [14, 19] < [48, 19]`. |
| `witness_approx_margin_exactness` | `P, Q` | Certifies 2-codon margin $-511 + 2(2) < -357 \implies -510 < -356$. |
| `witness_unsat_gc` | `P, C, Q` | Certifies zero feasible paths exist when target GC band is `[5, 6] > 4`. |

### 8.3 Reference-Copy Mutation Audit (`8/8` Injected Semantic Defects Killed)

Across 200 seeded random instances repeated over `PYTHONHASHSEED` $\in \{0, 1, 2, 3\}$, operational `DPV2Optimizer` matched `BruteForceCDSOracle` on feasibility, amino-acid translation, motif safety, and optimal score, while exposing a concrete tie-breaking difference on homodipeptides (`FF`: `TTTTTC` vs `TTCTTT`, identical score at `(g = 1, s = 0)`). In `test_mutation_detection_audit.py`, eight semantic defects were injected into an instrumented reference solver copy:

| Mutant ID | Audit Outcome | Injected Defect & Killing Oracle Assertion |
| --- | --- | --- |
| `M1_WRONG_SYNONYMOUS_CODON` | **Killed** | Injects Lysine `AAA` (`gc = 0`) into Serine menu on `"SL"` (`[0.30, 0.67]` GC); caught by `translate_dna(seq) != "SL"`. |
| `M2_GC_COUNT_DROP_C` | **Killed** | Counts only `'G'` instead of `'G' + 'C'` on `"TT"` (`[0.66, 0.67]` GC); caught by nucleotide GC window & oracle set check. |
| `M3_DROP_REVERSE_COMPLEMENT` | **Killed** | Omits reverse complement `GAGACC` on `"GA" + "DL"`; emits junction `GAGACC`, caught by raw substring check. |
| `M4_IGNORE_LEFT_FLANK` | **Killed** | Starts at `s0 = 0` instead of `step("GGTC") = 4` on `"GGTC" + "SL" + "TAA"`; emits `TCT` (`GGTCTC`), caught by substring check. |
| `M5_IGNORE_RIGHT_FLANK` | **Killed** | Skips terminal right-flank transition on `"" + "G" + "CTC"`; emits `GGT` (`GGTCTC`), caught by substring check. |
| `M6_OFF_BY_ONE_MAX_GC` | **Killed** | Replaces `g <= max_gc` with `g < max_gc` on `"TT"` (`min_gc = max_gc = 4`); falsely raises `No in-band candidate`. |
| `M7_MIN_INSTEAD_OF_MAX` | **Killed** | Minimizes rather than maximizes log-CAI during state relaxation; caught by optimal score check against `BruteForceCDSOracle`. |
| `M8_CORRUPT_BACKPOINTER` | **Killed** | Stores `prev_g = g + 1` in forward pass; fails backtracking with `KeyError` or mismatched sequence. |

### 8.4 Mathematical Formulation Coverage Matrix (`F1`–`F28`)

Tiers: **L1** = Lean 4 kernel proof; **O1** = brute-force/fuzzer/mutation suite in this archive; **C1** = deterministic unit tests in the main repository; **(B)** = documented runtime divergence.

| ID | Formulation | Lean 4 / Python Anchor | Verification Tier | Scope Note |
| --- | --- | --- | --- | --- |
| `F1` | Codon frequency $f(c)$ | `load_codon_usage_table` | `C1` | Table loader |
| `F2` | Relative adaptiveness $w(c)$ | `_build_codon_weights` | `C1 + O1` | Clamped at $10^{-6}$ |
| `F3` | Geometric CAI & log sum | `pathScore`, `approxScoreExactness` | `L1 + O1 (B)` | `Int` vs binary64 `float` |
| `F4` | Nucleotide GC count & percent | `seqGC`, `gcConservation` | `L1 + O1` | Exact integer GC |
| `F5` | 64-triplet Genetic Code | `translateTriplet`, `geneticCodePartition64` | `L1 + O1` | 64/64 bijection |
| `F6` | Sense translation $\mathrm{Translate}(D)=P$ | `ValidCodonForAA`, `proteinPreservationAndGC` | `L1 + O1` | Menu soundness |
| `F7` | Forbidden motif + RC closure | `Automaton`, `AutomatonCompiler` | `L1 + O1 (B)` | Supplied DFA table |
| `F8` | Full-construct junction safety | `fullConstructSafe` | `L1 + O1` | Arbitrary flanks |
| `F9` | Feasible CDS set $\mathcal{F}(P,\theta)$ | `FeasibleCDS`, `synonymousEnvelopeUnsat` | `L1 + O1` | Integer GC band |
| `F10`–`F14` | Random, Greedy, Balanced, GC-target, SOP / local rewriter | `reverse_translator.py`, `sop_balancer.py`, `local_rewriter.py` | `C1` | Non-DP heuristics |
| `F15` | Tropical max-plus semiring | `tropIntSemiringLaws`, `tropIntOrderLaws` | `L1 + O1` | $\mathbb{Z}\cup\{-\infty\}$ algebra |
| `F16` | Forward Bellman layer step | `dpStep`, `dpSoundness`, `dpCompleteness` | `L1 + O1 (B)` | $5'$ ramp outside Lean |
| `F17` | Terminal filter & global optimum | `dpBestScore`, `exactGlobalOptimality` | `L1 + O1 (B)` | Fallback in `O1` |
| `F18` | Constructive backtracking & ties | `dpOptimizeEndToEnd`, `pathLexTotalOrder` | `L1 + O1 (B)` | 3 distinct tie rules |
| `F19` | Suffix GC pruning & TASEP ramp | `gcEnvelopeAndPruningAdmissible`, `tasepRampBoundsAndMonotonicity` | `L1 + O1 (B)` | `round(..., 3)` near $1.0$ |
| `F20`–`F26` | Candidate pass gate, window GC, homopolymer, dinucleotide, means | `SharedEvaluator`, `BenchmarkRunner` | `C1 (+ O1)` | Descriptive metrics |
| `F27` | Manifest file-integrity binding | `verify_all.py`, `REPRODUCIBILITY_MANIFEST.json` | `O1` | 229-file lock |
| `F28` | Epistemic classification gate | `UNVERIFIED_PUBLIC_CORPUS` | `Governance` | Zero wet-lab claim |

## 9. Exact Proof Boundaries and Fail-Closed Replay Protocol

This milestone proves the mathematical soundness of FactorForge's **explicitly specified discrete integer DP model**, not a universal formal verification of the entire Python software stack:

| Scope Area | Current Status | Exact Technical Boundary |
| --- | --- | --- |
| **Discrete integer DP core & 64-codon translation (`FactorForgeFormal`)** | **Verified in Lean 4** | 20 core theorems + 3 helper lemmas, 14 witnesses, 34 `#print axioms` checks (`0 sorry`), `leanchecker` verified. Optimality is relative to supplied `WellFormedMenu` menus (menu soundness; full 61-codon completeness is checked against Python's `AA_TO_CODONS`). |
| **Sampled Python DP correspondence & reproducible archive** | **Completed (finite suite)** | 28 `pytest` checks, 4 `PYTHONHASHSEED` runs, `8/8` reference-copy mutant kills, and 229-file manifest integrity checks (`python verify_all.py`). |
| **Universal Python-to-Lean refinement & backpointer proof** | **Not proved (future scope)** | Lean's `dpOptimize` tracks prefix lists; operational Python reconstructs mutable `(prev_g, prev_s)` backpointers and is not extracted from Lean. |
| **IEEE-754 `float` & `1e-12` epsilon error bounds** | **Not proved (future scope)** | Operational DP accumulates binary64 `math.log` floats with a non-transitive `1e-12` intra-state tie window (`relaxCand` first-seen, `LeanExactMirrorDP` `PathRank`, and operational `DPV2Optimizer` last-codon tie-breaking follow three distinct tie policies). `approxScoreExactness` is conditional over `List Int`. |
| **General substring motif compiler & non-DP heuristics** | **Not proved in Lean** | Lean assumes a supplied DFA transition table rather than proving general Aho-Corasick fail-link compilation for arbitrary motif sets; `AutomatonCompiler` permutes internal state IDs with `PYTHONHASHSEED`; Python `round(..., 3)` collapses ramp strictness near $1.0$; $5'$ initiation clamping and heuristics lie outside `ExactDP.lean`. |
| **Biological expression & wet-lab performance** | **Not available** | `UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE`. Mathematical optimization correctness implies zero wet-lab expression, folding, or yield guarantee. |

To replay the entire verification archive locally from clean state (with Python 3.11+, `pytest`, `ruff`, and `elan` `leanprover/lean4:v4.36.0` installed), unpack `FactorForge_Lean4_Verification_Package.zip` to a short directory path and run:

```bash
python verify_all.py
```
