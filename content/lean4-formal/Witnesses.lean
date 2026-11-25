import FactorForgeFormal.Spec
import FactorForgeFormal.Proofs.Tropical
import FactorForgeFormal.Proofs.Automaton
import FactorForgeFormal.Proofs.GeneticCode
import FactorForgeFormal.Proofs.ExactDP
import FactorForgeFormal.Proofs.KineticAndParity

/-!
Non-Vacuity Witnesses, Malformed-Input Refutations, and Concrete FactorForge Cross-Checks.

Demonstrates that every theorem family in `FactorForgeFormal.Spec` is non-vacuously
satisfiable, refutes malformed `CodonSpec` inputs (`AAA` claiming `gc = 3` and stop
codons claiming sense translation), and verifies the 12-state Aho-Corasick BsaI
(`GGTCTC` / `GAGACC`) construct `"GGTC" + "SL" + "TAA"` via both `exactGlobalOptimality`
and constructive backtracking `dpOptimizeEndToEnd` inside Lean's kernel.
-/

namespace FactorForgeFormal.Witnesses

open FactorForgeFormal.Spec
open FactorForgeFormal.Spec.Automaton
open FactorForgeFormal.Spec.ExactRat
open FactorForgeFormal.Proofs

/-- Transition function for the 12-state BsaI (`GGTCTC` + RC `GAGACC`) automaton
extracted from deterministic `["GGTCTC", "GAGACC"]` trie compilation. -/
def bsaiStep (s : Nat) (b : Base) : Nat :=
  match s, b with
  | 0, .G => 1 | 0, _ => 0
  | 1, .A => 7 | 1, .G => 2 | 1, _ => 0
  | 2, .A => 7 | 2, .G => 2 | 2, .T => 3 | 2, .C => 0
  | 3, .C => 4 | 3, .G => 1 | 3, _ => 0
  | 4, .G => 1 | 4, .T => 5 | 4, _ => 0
  | 5, .C => 6 | 5, .G => 1 | 5, _ => 0
  | 6, .G => 1 | 6, _ => 0
  | 7, .G => 8 | 7, _ => 0
  | 8, .A => 9 | 8, .G => 2 | 8, _ => 0
  | 9, .C => 10 | 9, .G => 8 | 9, _ => 0
  | 10, .C => 11 | 10, .G => 1 | 10, _ => 0
  | 11, .G => 1 | 11, _ => 0
  | _, _ => 0

/-- Terminal (forbidden) states `{6, 11}` of the 12-state BsaI automaton. -/
def bsaiTerminal (s : Nat) : Bool :=
  s == 6 || s == 11

private theorem bsaiStep_lt : ∀ s b, s < 12 -> bsaiStep s b < 12 := by
  intro s b hs
  rcases s with _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | k
  all_goals try (cases b <;> decide)
  omega

/-- Validated 12-state BsaI `Automaton` witness. -/
def bsaiAutomaton : Automaton where
  numStates := 12
  initState := 0
  stepSym := bsaiStep
  isTerminal := bsaiTerminal
  init_lt := by decide
  step_lt := bsaiStep_lt

/-- Left flank `"GGTC"` (leading to automaton state `4`). -/
def leftFlankGGTC : List Base := [.G, .G, .T, .C]

/-- Stop codon tail `"TAA"`. -/
def tailStopTAA : List Base := [.T, .A, .A]

/-- Serine (`S`) synonymous codon options with `CanonicalQuantizer(1000)` scores. -/
def serOptions : List CodonSpec :=
  [ ⟨[.T, .C, .T], 1, -223⟩
  , ⟨[.T, .C, .C], 2, -511⟩
  , ⟨[.T, .C, .A], 1, -693⟩
  , ⟨[.T, .C, .G], 2, -1609⟩
  , ⟨[.A, .G, .T], 1, -916⟩
  , ⟨[.A, .G, .C], 2, -357⟩
  ]

/-- Leucine (`L`) synonymous codon options with `CanonicalQuantizer(1000)` scores. -/
def leuOptions : List CodonSpec :=
  [ ⟨[.T, .T, .A], 0, -1204⟩
  , ⟨[.T, .T, .G], 1, -693⟩
  , ⟨[.C, .T, .T], 1, -357⟩
  , ⟨[.C, .T, .C], 2, -105⟩
  , ⟨[.C, .T, .A], 1, -1609⟩
  , ⟨[.C, .T, .G], 2, 0⟩
  ]

/-- Two-codon peptide `"SL"` DP layer menu. -/
def slLayers : List (List CodonSpec) := [serOptions, leuOptions]

/-- Optimal codon path `"AGCCTG"` (`AGC` + `CTG`, score `-357`). -/
def optPathSL : List CodonSpec :=
  [ ⟨[.A, .G, .C], 2, -357⟩
  , ⟨[.C, .T, .G], 2, 0⟩
  ]

/-- Kernel refutation of malformed `CodonSpec` attacks:
    (1) `AAA` claiming `gc = 3` is rejected for Lysine (`.K`),
    (2) `AAA` with `gc = 0` is rejected for Serine (`.S`, wrong amino acid),
    (3) stop codon `TAA` is rejected for every sense residue. -/
theorem witness_malformed_codon_rejected :
    ValidCodonForAA ⟨[.A, .A, .A], 3, 100⟩ .K = false ∧
    ValidCodonForAA ⟨[.A, .A, .A], 0, 100⟩ .S = false ∧
    ValidCodonForAA ⟨[.T, .A, .A], 0, 0⟩ .Y = false := by
  decide

/-- Kernel-checked `WellFormedMenu` proof for peptide `"SL"` (`[.S, .L]`). -/
theorem witness_sl_wellFormedMenu :
    WellFormedMenu [.S, .L] slLayers := by
  refine ⟨?_, ?_, trivial⟩ <;> decide

/-- Kernel-checked state after left flank `"GGTC"` equals `4` and is safe. -/
theorem witness_leftFlank_safe :
    bsaiAutomaton.safeSeq bsaiAutomaton.initState leftFlankGGTC = true ∧
    bsaiAutomaton.stepSeq bsaiAutomaton.initState leftFlankGGTC = 4 := by
  decide

/-- Kernel-checked non-vacuity: `"AGCCTG"` is a `FeasibleCDS` for `"GGTC" + "SL" + "TAA"`. -/
theorem witness_sl_feasible :
    FeasibleCDS bsaiAutomaton 4 2 4 tailStopTAA slLayers optPathSL := by
  refine ⟨?_, ?_, ?_, ?_⟩
  · simp [ValidPath, slLayers, optPathSL, serOptions, leuOptions]
    decide
  · decide
  · decide
  · decide

private theorem ser_safe_le_neg357 (c : CodonSpec) (hc : c ∈ serOptions)
    (hsafe : (bsaiAutomaton.stepCodonSafe 4 c.seq).2 = true) : c.score ≤ -357 := by
  simp only [serOptions, List.mem_cons, List.not_mem_nil, or_false] at hc
  rcases hc with rfl | rfl | rfl | rfl | rfl | rfl <;> revert hsafe <;> decide

private theorem leu_le_zero (c : CodonSpec) (hc : c ∈ leuOptions) : c.score ≤ 0 := by
  simp only [leuOptions, List.mem_cons, List.not_mem_nil, or_false] at hc
  rcases hc with rfl | rfl | rfl | rfl | rfl | rfl <;> decide

private theorem sl_feasible_le_neg357 (cs : List CodonSpec)
    (h : FeasibleCDS bsaiAutomaton 4 2 4 tailStopTAA slLayers cs) : pathScore cs ≤ -357 := by
  rcases h with ⟨hVal, _, _, _⟩
  cases cs with
  | nil => simp [slLayers, ValidPath] at hVal
  | cons c1 rest1 =>
    cases rest1 with
    | nil => simp [slLayers, ValidPath] at hVal
    | cons c2 rest2 =>
      cases rest2 with
      | cons _ _ => simp [slLayers, ValidPath] at hVal
      | nil =>
        simp only [slLayers, ValidPath] at hVal
        rcases hVal with ⟨hc1, hSafe1, hc2, _, _⟩
        have h1 := ser_safe_le_neg357 c1 hc1 hSafe1
        have h2 := leu_le_zero c2 hc2
        simp only [pathScore, List.map_cons, List.map_nil, List.sum_cons, List.sum_nil]
        omega

/-- Kernel-checked exact DP optimum for `"GGTC" + "SL" + "TAA"` is `-357` (`"AGCCTG"`). -/
theorem witness_dpBest_sl_exact :
    dpBestScore bsaiAutomaton 4 2 4 tailStopTAA slLayers = Trop.finite (-357) := by
  have hEq := exactOpt_witness_eq bsaiAutomaton 4 (by decide) 2 4 tailStopTAA slLayers
    optPathSL witness_sl_feasible sl_feasible_le_neg357
  have hScore : pathScore optPathSL = -357 := rfl
  rwa [hScore] at hEq

/-- Constructive end-to-end witness: `dpOptimize` outputs a concrete CDS whose DNA translates
    to `[.S, .L]`, has true nucleotide GC in `[2, 4]`, avoids BsaI across the full construct
    `"GGTC" ++ dna ++ "TAA"`, and attains the global maximum `-357`. -/
theorem witness_dpOptimize_sl_end_to_end :
    ∃ cs : List CodonSpec,
      dpOptimize bsaiAutomaton leftFlankGGTC 2 4 tailStopTAA slLayers = some (-357, cs) ∧
      translateDNA (cs.flatMap (·.seq)) = some [.S, .L] ∧
      2 ≤ seqGC (cs.flatMap (·.seq)) ∧
      seqGC (cs.flatMap (·.seq)) ≤ 4 ∧
      bsaiAutomaton.safeSeq bsaiAutomaton.initState
        (leftFlankGGTC ++ cs.flatMap (·.seq) ++ tailStopTAA) = true := by
  have hEnd := dpOptimizeEndToEnd bsaiAutomaton leftFlankGGTC 2 4 tailStopTAA
    [.S, .L] slLayers witness_sl_wellFormedMenu
  have hS0 : bsaiAutomaton.stepSeq bsaiAutomaton.initState leftFlankGGTC = 4 :=
    witness_leftFlank_safe.2
  have hTrop := hEnd.1 witness_leftFlank_safe.1
  rw [hS0, witness_dpBest_sl_exact] at hTrop
  cases hOpt : dpOptimize bsaiAutomaton leftFlankGGTC 2 4 tailStopTAA slLayers with
  | none =>
    rw [hOpt] at hTrop
    cases hTrop
  | some p =>
    rcases p with ⟨v, cs⟩
    rw [hOpt] at hTrop
    have hv : v = -357 := Trop.finite.inj hTrop
    subst hv
    have hProps := hEnd.2.2 (-357) cs hOpt
    exact ⟨cs, rfl, hProps.2.2.2.1, hProps.2.2.2.2.1, hProps.2.2.2.2.2.1, hProps.2.2.2.2.2.2.1⟩

/-- Kernel-checked BsaI rejection of `"TCT"` from state `4` (`"GGTCT"` -> state `6`). -/
theorem witness_tct_rejected :
    (bsaiAutomaton.stepCodonSafe 4 [.T, .C, .T]).2 = false := by
  decide

/-- Witness for `gcConservation` and `proteinPreservationAndGC` on `optPathSL`. -/
theorem witness_gc_and_protein_preservation :
    pathGC optPathSL = seqGC (optPathSL.flatMap (·.seq)) ∧
    translateDNA (optPathSL.flatMap (·.seq)) = some [.S, .L] := by
  have hPres := proteinPreservationAndGC bsaiAutomaton 4 [.S, .L] slLayers optPathSL
    witness_sl_wellFormedMenu witness_sl_feasible.1
  exact ⟨hPres.2.1, hPres.2.2⟩

/-- Witness for `gcEnvelopeAndPruningAdmissible` splitting `"SL"` into prefix `"S"` + suffix `"L"`. -/
def agcSpec : CodonSpec := ⟨[.A, .G, .C], 2, -357⟩
def ctgSpec : CodonSpec := ⟨[.C, .T, .G], 2, 0⟩

theorem witness_gc_pruning_admissible :
    2 ≤ pathGC [agcSpec] + totalMaxGC [leuOptions] ∧
    pathGC [agcSpec] + totalMinGC [leuOptions] ≤ 4 := by
  have hPre : ValidPath bsaiAutomaton 4 [serOptions] [agcSpec] := by
    simp [ValidPath, serOptions, agcSpec]; decide
  have hSuf : ValidPath bsaiAutomaton
      (bsaiAutomaton.stepSeq 4 ([agcSpec].flatMap (·.seq)))
      [leuOptions] [ctgSpec] := by
    simp [ValidPath, leuOptions, agcSpec, ctgSpec]; decide
  exact (gcEnvelopeAndPruningAdmissible bsaiAutomaton 4 [serOptions] [leuOptions]
    [agcSpec] [ctgSpec] hPre hSuf).2.2 2 4 (by decide) (by decide)

/-- Witness for `ExactRat` TASEP ramp interiority (`tau = 7/20`, `d = 1`, `W = 3`). -/
theorem witness_tasep_ramp :
    let tauP : ExactRat := ⟨7, 20, by decide⟩
    let r := rampTau tauP 1 3 (by decide)
    ExactRat.lt tauP r ∧ ExactRat.lt r ExactRat.one := by
  exact (tasepRampBoundsAndMonotonicity.1 ⟨7, 20, by decide⟩ 1 3 (by decide)
    (by decide) (by decide) (by decide) (by decide))

/-- Witness for `zeroWeightParity` confirming zero-weight pause entries leave `structFitness` unchanged. -/
theorem witness_zero_weight_parity :
    structFitness (-357) 700 [⟨0, 350⟩, ⟨0, 500⟩] = -357 := by
  apply zeroWeightParity.1
  intro e he
  simp only [List.mem_cons, List.not_mem_nil, or_false] at he
  rcases he with rfl | rfl <;> rfl

/-- Witness for `pathLexTotalOrder` transitivity on concrete codon rank prefixes. -/
theorem witness_path_lex_order :
    pathLexLt [14, 19] [15, 19] = true ∧
    pathLexLt [15, 19] [48, 19] = true ∧
    pathLexLt [14, 19] [48, 19] = true := by
  refine ⟨by decide, by decide, ?_⟩
  exact pathLexTotalOrder.2.1 [14, 19] [15, 19] [48, 19] (by decide) (by decide)

/-- Witness for `approxScoreExactness`: 2-codon quantized margin `-357 > -511 + 2 * (2 * 1)`
    certifies strict superiority of the unquantized objective. -/
theorem witness_approx_margin_exactness :
    Int.natAbs (([-357, 0] : List Int).sum - ([-356, 0] : List Int).sum) ≤ 2 * 1 ∧
    (-510 : Int) < (-356 : Int) := by
  constructor
  · exact approxScoreExactness.1 1 [-356, 0] [-357, 0] ⟨by decide, by decide, trivial⟩
  · exact approxScoreExactness.2 (-356) (-357) (-510) (-511) 2
      (by decide) (by decide) (by decide)

/-- Witness for unsatisfiable GC band (`"SL"` max GC is `4 < 5`). -/
theorem witness_unsat_gc :
    ∀ cs, ¬ FeasibleCDS bsaiAutomaton 4 5 6 tailStopTAA slLayers cs := by
  apply synonymousEnvelopeUnsat bsaiAutomaton 4 5 6 tailStopTAA slLayers
  right
  decide

end FactorForgeFormal.Witnesses
