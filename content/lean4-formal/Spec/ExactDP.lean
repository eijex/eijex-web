import FactorForgeFormal.Spec.Tropical
import FactorForgeFormal.Spec.Automaton
import FactorForgeFormal.Spec.GeneticCode

/-!
Locked Specification: Exact Finite-State Dynamic Programming, Synonymous Codon Validity,
and Constructive Backtracking (`dp_v2.py`..`dp_v2_4.py`).

Formalizes:
1. Codon candidate menus per residue position, plus strict biological well-formedness
   `ValidCodonForAA` (`|seq| = 3`, `gc = seqGC seq`, `translateCodonSeq seq = some (.aa a)`)
   and protein-anchored option menus `WellFormedMenu`.
2. The exact brute-force admissible path space `ValidPath` with automaton safety and
   cumulative GC conservation.
3. Both the Tropical Bellman value table `dpEval` / `dpBestScore` and the constructive
   path-extracting DP solver `dpTrackEval` / `dpOptimize` (modeling forward relaxation +
   backtracking to a concrete `List CodonSpec` and DNA sequence).
4. Soundness, Completeness, Exact Global Optimality, Protein Translation Preservation,
   Constructive End-to-End Sequence Optimality, Suffix GC Pruning Admissibility, and
   Synonymous GC Envelope Unsatisfiability.
-/

namespace FactorForgeFormal.Spec

/-- Candidate codon option at a single residue position. -/
structure CodonSpec where
  seq : List Base
  gc : Nat
  score : Int
  deriving DecidableEq, Repr

/-- Exact GC count of a nucleotide sequence. -/
def seqGC (bs : List Base) : Nat :=
  (bs.map Base.gcCount).sum

/-- Well-formed codon option (`3` bases and `gc` matches `seqGC seq`). -/
def CodonSpec.wellFormed (c : CodonSpec) : Bool :=
  c.seq.length == 3 && c.gc == seqGC c.seq

/-- Strict synonymous codon validity for target residue `a`:
    `|c.seq| = 3 ∧ c.gc = seqGC c.seq ∧ translateCodonSeq c.seq = some (.aa a)`. -/
def ValidCodonForAA (c : CodonSpec) (a : AminoAcid) : Bool :=
  c.seq.length == 3 && c.gc == seqGC c.seq && translateCodonSeq c.seq == some (.aa a)

/-- Every residue layer in `layers` contains only valid synonymous sense codons for `protein`. -/
def WellFormedMenu : List AminoAcid -> List (List CodonSpec) -> Prop
  | [], [] => True
  | a :: as, opts :: rest =>
    (∀ c ∈ opts, ValidCodonForAA c a = true) ∧ WellFormedMenu as rest
  | _, _ => False

/-- Cumulative GC count of a codon path. -/
def pathGC (cs : List CodonSpec) : Nat :=
  (cs.map (·.gc)).sum

/-- Total additive objective score of a codon path (in fixed-point or integer units). -/
def pathScore (cs : List CodonSpec) : Int :=
  (cs.map (·.score)).sum

/-- Exact predicate for an automaton-admissible synonymous path from `s0`. -/
def ValidPath (M : Automaton) : Nat -> List (List CodonSpec) -> List CodonSpec -> Prop
  | _, [], [] => True
  | s, opts :: rest, c :: cs =>
    c ∈ opts ∧
    (M.stepCodonSafe s c.seq).2 = true ∧
    ValidPath M (M.stepCodonSafe s c.seq).1 rest cs
  | _, _, _ => False

/-- Maximum possible GC contribution from a single residue option menu. -/
def layerMaxGC (opts : List CodonSpec) : Nat :=
  opts.foldl (fun acc c => max acc c.gc) 0

/-- Minimum possible GC contribution from a non-empty option menu (`0` if empty). -/
def layerMinGC : List CodonSpec -> Nat
  | [] => 0
  | c :: cs => cs.foldl (fun acc x => min acc x.gc) c.gc

/-- Total maximum achievable GC across a list of codon option layers. -/
def totalMaxGC (layers : List (List CodonSpec)) : Nat :=
  (layers.map layerMaxGC).sum

/-- Total minimum achievable GC across a list of codon option layers. -/
def totalMinGC (layers : List (List CodonSpec)) : Nat :=
  (layers.map layerMinGC).sum

/-- Base DP table at layer 0: `(0, s0) |-> 0`, all other states `-inf`. -/
def dpBase (s0 : Nat) : Nat -> Nat -> Trop Int :=
  fun g s => if g == 0 && s == s0 then Trop.one else Trop.zero

/-- One forward Bellman DP layer transition over `(gc_count, automaton_state)`. -/
def dpStep (M : Automaton) (maxGC : Nat) (opts : List CodonSpec)
    (prev : Nat -> Nat -> Trop Int) : Nat -> Nat -> Trop Int :=
  fun g' s' =>
    if g' ≤ maxGC ∧ s' < M.numStates then
      (List.range M.numStates).foldl
        (fun acc s =>
          opts.foldl
            (fun acc2 c =>
              if c.gc ≤ g' then
                let res := M.stepCodonSafe s c.seq
                if res.2 && res.1 == s' then
                  Trop.oplus acc2 (Trop.otimes (prev (g' - c.gc) s) (Trop.finite c.score))
                else acc2
              else acc2)
            acc)
        Trop.zero
    else
      Trop.zero

/-- Forward DP evaluation via left fold over `layers`, tracking cumulative GC bound. -/
def dpEval (M : Automaton) (s0 : Nat) (layers : List (List CodonSpec)) :
    Nat -> Nat -> Trop Int :=
  (layers.foldl
    (fun (acc : Nat × (Nat -> Nat -> Trop Int)) opts =>
      let newMax := acc.1 + layerMaxGC opts
      (newMax, dpStep M newMax opts acc.2))
    (0, dpBase s0)).2

/-- Tail-compatible and GC-in-band final best score computed by DP. -/
def dpBestScore (M : Automaton) (s0 minGC maxGC : Nat) (tail : List Base)
    (layers : List (List CodonSpec)) : Trop Int :=
  let table := dpEval M s0 layers
  let capGC := totalMaxGC layers
  (List.range (capGC + 1)).foldl
    (fun acc g =>
      if minGC ≤ g && g ≤ maxGC then
        (List.range M.numStates).foldl
          (fun acc2 s =>
            if M.safeSeq s tail then Trop.oplus acc2 (table g s) else acc2)
          acc
      else acc)
    Trop.zero

/-- Constructive candidate state `(score, chosenCodons)` for path extraction / backtracking. -/
abbrev DPCandidate := Option (Int × List CodonSpec)

/-- Project a constructive `DPCandidate` onto its Tropical score. -/
def candToTrop : DPCandidate -> Trop Int
  | none => Trop.zero
  | some (v, _) => Trop.finite v

/-- Deterministic relaxation of two constructive DP candidates (retaining first-seen on ties). -/
def relaxCand : DPCandidate -> DPCandidate -> DPCandidate
  | none, y => y
  | some x, none => some x
  | some (v1, p1), some (v2, p2) =>
    if v1 < v2 then some (v2, p2) else some (v1, p1)

/-- Extend a constructive DP prefix candidate by appending codon `c`. -/
def extendCand (prev : DPCandidate) (c : CodonSpec) : DPCandidate :=
  match prev with
  | none => none
  | some (v, cs) => some (v + c.score, cs ++ [c])

/-- Constructive base DP table at layer 0: `(0, s0) |-> some (0, [])`. -/
def dpTrackBase (s0 : Nat) : Nat -> Nat -> DPCandidate :=
  fun g s => if g == 0 && s == s0 then some (0, []) else none

/-- One constructive forward DP layer transition tracking witness paths. -/
def dpTrackStep (M : Automaton) (maxGC : Nat) (opts : List CodonSpec)
    (prev : Nat -> Nat -> DPCandidate) : Nat -> Nat -> DPCandidate :=
  fun g' s' =>
    if g' ≤ maxGC ∧ s' < M.numStates then
      (List.range M.numStates).foldl
        (fun acc s =>
          opts.foldl
            (fun acc2 c =>
              if c.gc ≤ g' then
                let res := M.stepCodonSafe s c.seq
                if res.2 && res.1 == s' then
                  relaxCand acc2 (extendCand (prev (g' - c.gc) s) c)
                else acc2
              else acc2)
            acc)
        none
    else
      none

/-- Constructive forward DP table evaluation over `layers`. -/
def dpTrackEval (M : Automaton) (s0 : Nat) (layers : List (List CodonSpec)) :
    Nat -> Nat -> DPCandidate :=
  (layers.foldl
    (fun (acc : Nat × (Nat -> Nat -> DPCandidate)) opts =>
      let newMax := acc.1 + layerMaxGC opts
      (newMax, dpTrackStep M newMax opts acc.2))
    (0, dpTrackBase s0)).2

/-- Constructive end-to-end DP optimizer returning `some (bestScore, chosenCodons)` or `none`. -/
def dpOptimize (M : Automaton) (leftFlank : List Base) (minGC maxGC : Nat)
    (tail : List Base) (layers : List (List CodonSpec)) : DPCandidate :=
  if M.safeSeq M.initState leftFlank then
    let s0 := M.stepSeq M.initState leftFlank
    let table := dpTrackEval M s0 layers
    let capGC := totalMaxGC layers
    (List.range (capGC + 1)).foldl
      (fun acc g =>
        if minGC ≤ g && g ≤ maxGC then
          (List.range M.numStates).foldl
            (fun acc2 s =>
              if M.safeSeq s tail then relaxCand acc2 (table g s) else acc2)
            acc
        else acc)
      none
  else
    none

/-- A path is construct-feasible if valid from `s0`, safe on `tail`, and GC is in `[minGC, maxGC]`. -/
def FeasibleCDS (M : Automaton) (s0 minGC maxGC : Nat) (tail : List Base)
    (layers : List (List CodonSpec)) (cs : List CodonSpec) : Prop :=
  ValidPath M s0 layers cs ∧
  M.safeSeq (M.stepSeq s0 (cs.flatMap (·.seq))) tail = true ∧
  minGC ≤ pathGC cs ∧
  pathGC cs ≤ maxGC

/-- GC Conservation: well-formed codons guarantee `pathGC cs = seqGC (cs.flatMap seq)`. -/
def Prop_GCConservation : Prop :=
  ∀ cs : List CodonSpec,
    (∀ c ∈ cs, c.wellFormed = true) ->
    pathGC cs = seqGC (cs.flatMap (·.seq))

/-- Protein Preservation & True Nucleotide GC Exactness under `WellFormedMenu`:
    any `ValidPath` over a well-formed synonymous menu has exact DNA length `3 * |protein|`,
    exact nucleotide GC count `pathGC cs = seqGC dna`, and translates back to `some protein`
    with zero internal or terminal stop codons. -/
def Prop_ProteinPreservationAndGC : Prop :=
  ∀ (M : Automaton) (s0 : Nat) (protein : List AminoAcid)
    (layers : List (List CodonSpec)) (cs : List CodonSpec),
    WellFormedMenu protein layers ->
    ValidPath M s0 layers cs ->
    let dna := cs.flatMap (·.seq)
    dna.length = 3 * protein.length ∧
    pathGC cs = seqGC dna ∧
    translateDNA dna = some protein

/-- DP Soundness: every finite DP entry witnesses an actual `ValidPath` with matching `(g, s, score)`. -/
def Prop_DPSoundness : Prop :=
  ∀ (M : Automaton) (s0 : Nat) (_hs0 : s0 < M.numStates)
    (layers : List (List CodonSpec)) (g s : Nat) (v : Int),
    dpEval M s0 layers g s = Trop.finite v ->
    ∃ cs : List CodonSpec,
      ValidPath M s0 layers cs ∧
      pathGC cs = g ∧
      M.stepSeq s0 (cs.flatMap (·.seq)) = s ∧
      pathScore cs = v

/-- DP Completeness: every `ValidPath` is bounded above by the DP table at its `(g, s)`. -/
def Prop_DPCompleteness : Prop :=
  ∀ (M : Automaton) (s0 : Nat) (_hs0 : s0 < M.numStates)
    (layers : List (List CodonSpec)) (cs : List CodonSpec),
    ValidPath M s0 layers cs ->
    Trop.finite (pathScore cs) ≤
      dpEval M s0 layers (pathGC cs) (M.stepSeq s0 (cs.flatMap (·.seq)))

/-- Exact Global Optimality: DP attains `>=` every feasible path AND any finite optimum is achieved. -/
def Prop_ExactGlobalOptimality : Prop :=
  ∀ (M : Automaton) (s0 : Nat) (_hs0 : s0 < M.numStates)
    (minGC maxGC : Nat) (tail : List Base) (layers : List (List CodonSpec)),
    (∀ cs, FeasibleCDS M s0 minGC maxGC tail layers cs ->
      Trop.finite (pathScore cs) ≤ dpBestScore M s0 minGC maxGC tail layers) ∧
    (∀ v : Int, dpBestScore M s0 minGC maxGC tail layers = Trop.finite v ->
      ∃ cs, FeasibleCDS M s0 minGC maxGC tail layers cs ∧ pathScore cs = v)

/-- Constructive End-to-End DP Optimality, Protein Preservation & Full-Construct Safety:
    connects `dpOptimize` directly to exact nucleotide GC, `translateDNA dna = some protein`,
    `safeSeq` across `leftFlank ++ dna ++ tail`, and global optimality over all feasible paths. -/
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

/-- Synonymous GC Envelope & Suffix Pruning Admissibility (`dp_v2_4.py:474-492`). -/
def Prop_GCEnvelopeAndPruningAdmissible : Prop :=
  ∀ (M : Automaton) (s0 : Nat) (prefixLayers suffixLayers : List (List CodonSpec))
    (pre suf : List CodonSpec),
    ValidPath M s0 prefixLayers pre ->
    ValidPath M (M.stepSeq s0 (pre.flatMap (·.seq))) suffixLayers suf ->
    totalMinGC suffixLayers ≤ pathGC suf ∧
    pathGC suf ≤ totalMaxGC suffixLayers ∧
    (∀ minGC maxGC : Nat,
      minGC ≤ pathGC (pre ++ suf) -> pathGC (pre ++ suf) ≤ maxGC ->
      minGC ≤ pathGC pre + totalMaxGC suffixLayers ∧
      pathGC pre + totalMinGC suffixLayers ≤ maxGC)

/-- Unsatisfiability Certificate: out-of-envelope GC band has zero feasible paths. -/
def Prop_SynonymousEnvelopeUnsat : Prop :=
  ∀ (M : Automaton) (s0 minGC maxGC : Nat) (tail : List Base)
    (layers : List (List CodonSpec)),
    (maxGC < totalMinGC layers ∨ totalMaxGC layers < minGC) ->
    ∀ cs, ¬ FeasibleCDS M s0 minGC maxGC tail layers cs

end FactorForgeFormal.Spec
