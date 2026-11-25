import FactorForgeFormal.Spec.ExactDP

/-!
Locked Specification: TASEP Ramp Interpolation Bounds, Zero-Weight/No-Smoothing Parity,
Canonical LexRank Total Order, and Quantized/Perturbed Score Margin Exactness
(`dp_v2_4.py`, `dp_v2_3.py`, `quantization.py`).
-/

namespace FactorForgeFormal.Spec

/-- Exact rational representation `(num / den)` with strictly positive denominator. -/
structure ExactRat where
  num : Int
  den : Int
  den_pos : 0 < den
  deriving DecidableEq, Repr

namespace ExactRat

/-- Strict inequality `a < b` via cross-multiplication (exact, no rounding). -/
def lt (a b : ExactRat) : Prop :=
  a.num * b.den < b.num * a.den

/-- Non-strict inequality `a <= b` via cross-multiplication. -/
def le (a b : ExactRat) : Prop :=
  a.num * b.den ≤ b.num * a.den

/-- Embed integer into `ExactRat`. -/
def ofInt (n : Int) : ExactRat :=
  ⟨n, 1, by omega⟩

/-- Rational `1`. -/
def one : ExactRat := ofInt 1

/-- Exact TASEP upstream deceleration ramp interpolation (`dp_v2_4.py:24, 76-78`):
`rampTau(tau_p, d, W) = tau_p + (d / W) * (1 - tau_p) = (p * W + d * (q - p)) / (q * W)`. -/
def rampTau (tauP : ExactRat) (d W : Nat) (hW : 0 < W) : ExactRat :=
  ⟨tauP.num * (W : Int) + (d : Int) * (tauP.den - tauP.num),
   tauP.den * (W : Int),
   Int.mul_pos tauP.den_pos (by omega)⟩

/-- Strict interiority & monotonicity of `TASEPKineticsEngine` ramp interpolation. -/
def Prop_TASEPRampBoundsAndMonotonicity : Prop :=
  (∀ (tauP : ExactRat) (d W : Nat) (hW : 0 < W),
    0 < tauP.num -> tauP.num < tauP.den -> 1 ≤ d -> d < W ->
    lt tauP (rampTau tauP d W hW) ∧ lt (rampTau tauP d W hW) one) ∧
  (∀ (tauP : ExactRat) (d1 d2 W : Nat) (hW : 0 < W),
    tauP.num < tauP.den -> d1 < d2 ->
    lt (rampTau tauP d1 W hW) (rampTau tauP d2 W hW)) ∧
  (∀ (tauP : ExactRat) (d W : Nat) (hW : 0 < W),
    tauP.num = tauP.den ->
    (rampTau tauP d W hW).num = (rampTau tauP d W hW).den)

end ExactRat

/-- Pause annotation entry `(penaltyWeight, targetTau)`. -/
structure PauseEntry where
  weight : Int
  targetTau : Int
  deriving DecidableEq, Repr

/-- Piecewise codon fitness combining base fitness and active pause penalty (`dp_v2_4.py:382-415`). -/
def structFitness (baseScore : Int) (codonWeight : Int) (entries : List PauseEntry) : Int :=
  let penalty :=
    (entries.map (fun e => e.weight * (Int.natAbs (codonWeight - e.targetTau) : Int))).sum
  baseScore - penalty

/-- Universal zero-weight / no-smoothing parity (`dp_v2_4.py` docstring line 8 & `dp_v2_3.py`).
When all pause weights are `0` or no pause positions are active, `structFitness` equals `baseScore`
and the resulting DP table agrees identically with the unpenalized baseline DP. -/
def Prop_ZeroWeightParity : Prop :=
  (∀ (baseScore codonWeight : Int) (entries : List PauseEntry),
    (∀ e ∈ entries, e.weight = 0) ->
    structFitness baseScore codonWeight entries = baseScore) ∧
  (∀ (M : Automaton) (s0 : Nat)
    (baseLayers : List (List (List Base × Nat × Int)))
    (codonWeightFn : Nat -> List Base -> Int)
    (pauseMap : Nat -> List PauseEntry),
    (∀ i e, e ∈ pauseMap i -> e.weight = 0) ->
    let toBase := fun (xs : List (List Base × Nat × Int)) =>
      xs.map (fun (seq, gc, b) => CodonSpec.mk seq gc b)
    let toStruct := fun (i : Nat) (xs : List (List Base × Nat × Int)) =>
      xs.map (fun (seq, gc, b) =>
        CodonSpec.mk seq gc (structFitness b (codonWeightFn i seq) (pauseMap i)))
    let baseOptLayers := baseLayers.map toBase
    let structOptLayers := (List.range baseLayers.length).zipWith toStruct baseLayers
    ∀ g s, dpEval M s0 structOptLayers g s = dpEval M s0 baseOptLayers g s)

/-- Lexicographic codon-path comparator (`quantization.py`: `PathRank.compare_prefix_paths`). -/
def pathLexLt : List Nat -> List Nat -> Bool
  | [], [] => false
  | [], _ :: _ => true
  | _ :: _, [] => false
  | a :: as, b :: bs => if a < b then true else if b < a then false else pathLexLt as bs

/-- Strict total order laws for `pathLexLt` (`PathRank` deterministic tie-breaking). -/
def Prop_PathLexTotalOrder : Prop :=
  (∀ p : List Nat, pathLexLt p p = false) ∧
  (∀ p q r : List Nat, pathLexLt p q = true -> pathLexLt q r = true -> pathLexLt p r = true) ∧
  (∀ p q : List Nat, pathLexLt p q = true -> pathLexLt q p = false) ∧
  (∀ p q : List Nat, pathLexLt p q = true ∨ pathLexLt q p = true ∨ p = q)

/-- Pointwise bounded perturbation predicate `|approx_i - true_i| <= eps` along a codon path. -/
def BoundedStepError (eps : Nat) : List Int -> List Int -> Prop
  | [], [] => True
  | t :: ts, a :: as => Int.natAbs (a - t) ≤ eps ∧ BoundedStepError eps ts as
  | _, _ => False

/-- Certified Quantization / Floating-Point Margin Exactness (`quantization.py` vs float DP):
    (1) Per-codon rounding/quantization error `<= eps` across `L` codons accumulates to at most
        `L * eps` on total path scores.
    (2) Whenever a candidate's approximate score exceeds a competitor's by more than `2 * delta`
        (where `delta = L * eps`), the candidate is strictly superior under the true unperturbed
        objective as well—guaranteeing zero argmax inversion outside the `2 * L * eps` band. -/
def Prop_ApproxScoreExactness : Prop :=
  (∀ (eps : Nat) (trueTerms approxTerms : List Int),
    BoundedStepError eps trueTerms approxTerms ->
    Int.natAbs (approxTerms.sum - trueTerms.sum) ≤ trueTerms.length * eps) ∧
  (∀ (trueOpt approxOpt trueAlt approxAlt : Int) (delta : Nat),
    Int.natAbs (approxOpt - trueOpt) ≤ delta ->
    Int.natAbs (approxAlt - trueAlt) ≤ delta ->
    approxAlt + 2 * (delta : Int) < approxOpt ->
    trueAlt < trueOpt)

end FactorForgeFormal.Spec
