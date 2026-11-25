import FactorForgeFormal.Spec.KineticAndParity

/-!
Proofs: TASEP Ramp Interpolation Bounds, Zero-Weight/No-Smoothing Parity,
Canonical LexRank Total Order, and Quantized/Perturbed Score Margin Exactness
(`FactorForgeFormal.Spec.KineticAndParity`).
-/

namespace FactorForgeFormal.Proofs

open FactorForgeFormal.Spec
open FactorForgeFormal.Spec.ExactRat

/-- Proof of strict interiority, monotonicity, and boundary behavior of `rampTau`. -/
theorem tasepRampBoundsAndMonotonicity : Prop_TASEPRampBoundsAndMonotonicity := by
  refine ⟨?_, ?_, ?_⟩
  · intro tauP d W hW hNumPos hNumLt hD1 hDLtW
    have hq : 0 < tauP.den := tauP.den_pos
    have hw : (0 : Int) < (W : Int) := by omega
    have hdPos : (0 : Int) < (d : Int) := by omega
    have hGapPos : (0 : Int) < tauP.den - tauP.num := by omega
    have hWMinusDPos : (0 : Int) < (W : Int) - (d : Int) := by omega
    constructor
    · simp only [ExactRat.lt, rampTau]
      have hMul : 0 < (d : Int) * (tauP.den - tauP.num) * tauP.den :=
        Int.mul_pos (Int.mul_pos hdPos hGapPos) hq
      have hEq1 : tauP.num * (tauP.den * (W : Int)) = (tauP.num * (W : Int)) * tauP.den := by
        rw [Int.mul_assoc, Int.mul_comm (W : Int) tauP.den, ← Int.mul_assoc]
      have hEq2 : (tauP.num * (W : Int) + (d : Int) * (tauP.den - tauP.num)) * tauP.den =
          (tauP.num * (W : Int)) * tauP.den + (d : Int) * (tauP.den - tauP.num) * tauP.den := by
        rw [Int.add_mul]
      omega
    · simp only [ExactRat.lt, rampTau, one, ofInt]
      have hMul : 0 < ((W : Int) - (d : Int)) * (tauP.den - tauP.num) :=
        Int.mul_pos hWMinusDPos hGapPos
      have h1 : (W : Int) * (tauP.den - tauP.num) = (W : Int) * tauP.den - (W : Int) * tauP.num :=
        Int.mul_sub _ _ _
      have h2 : ((W : Int) - (d : Int)) * (tauP.den - tauP.num) =
          (W : Int) * (tauP.den - tauP.num) - (d : Int) * (tauP.den - tauP.num) :=
        Int.sub_mul _ _ _
      have hComm1 : tauP.den * (W : Int) = (W : Int) * tauP.den := Int.mul_comm _ _
      have hComm2 : tauP.num * (W : Int) = (W : Int) * tauP.num := Int.mul_comm _ _
      omega
  · intro tauP d1 d2 W hW hNumLt hD12
    have hq : 0 < tauP.den := tauP.den_pos
    have hw : (0 : Int) < (W : Int) := by omega
    have hQW : 0 < tauP.den * (W : Int) := Int.mul_pos hq hw
    have hGapPos : 0 < tauP.den - tauP.num := by omega
    have hDiffPos : (0 : Int) < (d2 : Int) - (d1 : Int) := by omega
    simp only [ExactRat.lt, rampTau]
    have hStep : ((d1 : Int) * (tauP.den - tauP.num)) < ((d2 : Int) * (tauP.den - tauP.num)) := by
      have hPos : 0 < ((d2 : Int) - (d1 : Int)) * (tauP.den - tauP.num) :=
        Int.mul_pos hDiffPos hGapPos
      rw [Int.sub_mul] at hPos
      omega
    have hSum :
        tauP.num * (W : Int) + (d1 : Int) * (tauP.den - tauP.num) <
        tauP.num * (W : Int) + (d2 : Int) * (tauP.den - tauP.num) := by
      omega
    exact Int.mul_lt_mul_of_pos_right hSum hQW
  · intro tauP d W hW hEq
    simp only [rampTau]
    rw [hEq, Int.sub_self, Int.mul_zero, Int.add_zero]

/-- Proof of universal zero-weight / no-smoothing parity. -/
theorem zeroWeightParity : Prop_ZeroWeightParity := by
  constructor
  · intro baseScore codonWeight entries hZero
    simp only [structFitness]
    have hSumZero :
        (entries.map (fun e => e.weight * (Int.natAbs (codonWeight - e.targetTau) : Int))).sum =
        0 := by
      induction entries with
      | nil => rfl
      | cons e es ih =>
        have he : e.weight = 0 := hZero e (by simp)
        have hes : ∀ e' ∈ es, e'.weight = 0 := fun e' h => hZero e' (by simp [h])
        simp [he, ih hes]
    omega
  · intro M s0 baseLayers codonWeightFn pauseMap hZero
    dsimp only
    have hZeroStruct :
        ∀ baseScore codonWeight (entries : List PauseEntry),
          (∀ e ∈ entries, e.weight = 0) ->
          structFitness baseScore codonWeight entries = baseScore := by
      intro bs cw es hz
      simp only [structFitness]
      have hs :
          (es.map (fun e => e.weight * (Int.natAbs (cw - e.targetTau) : Int))).sum = 0 := by
        induction es with
        | nil => rfl
        | cons e rest ih =>
          have he := hz e (by simp)
          have hrest := ih (fun e' h => hz e' (by simp [h]))
          simp [he, hrest]
      omega
    have hLayersEq :
        (List.range baseLayers.length).zipWith
          (fun i xs =>
            xs.map (fun (seq, gc, b) =>
              CodonSpec.mk seq gc (structFitness b (codonWeightFn i seq) (pauseMap i))))
          baseLayers =
        baseLayers.map (fun xs => xs.map (fun (seq, gc, b) => CodonSpec.mk seq gc b)) := by
      apply List.ext_getElem
      · simp
      · intro i hi1 hi2
        simp only [List.getElem_zipWith, List.getElem_range, List.getElem_map]
        apply List.map_congr_left
        intro ⟨seq, gc, b⟩ _
        simp [hZeroStruct b (codonWeightFn i seq) (pauseMap i) (hZero i)]
    intro g s
    rw [hLayersEq]

/-- Proof that `pathLexLt` is a strict total order on codon rank lists. -/
theorem pathLexTotalOrder : Prop_PathLexTotalOrder := by
  refine ⟨?_, ?_, ?_, ?_⟩
  · intro p
    induction p with
    | nil => rfl
    | cons a as ih => simp [pathLexLt, ih]
  · intro p
    induction p with
    | nil =>
      intro q r hpq hqr
      cases q with
      | nil => simp [pathLexLt] at hpq
      | cons _ _ =>
        cases r with
        | nil => simp [pathLexLt] at hqr
        | cons _ _ => rfl
    | cons a as ih =>
      intro q r hpq hqr
      cases q with
      | nil => simp [pathLexLt] at hpq
      | cons b bs =>
        cases r with
        | nil => simp [pathLexLt] at hqr
        | cons c cs =>
          simp only [pathLexLt] at hpq hqr ⊢
          by_cases hab : a < b
          · simp only [hab, ↓reduceIte] at hpq
            by_cases hbc : b < c
            · have hac : a < c := Nat.lt_trans hab hbc
              simp [hac]
            · by_cases hcb : c < b
              · simp only [hbc, ↓reduceIte, hcb] at hqr
                cases hqr
              · have hEq : b = c := by omega
                subst hEq
                simp [hab]
          · by_cases hba : b < a
            · simp only [hab, ↓reduceIte, hba] at hpq
              cases hpq
            · have hEqAB : a = b := by omega
              subst hEqAB
              simp only [Nat.lt_irrefl, ↓reduceIte] at hpq
              by_cases hbc : a < c
              · simp [hbc]
              · by_cases hcb : c < a
                · simp only [hbc, ↓reduceIte, hcb] at hqr
                  cases hqr
                · have hEqAC : a = c := by omega
                  subst hEqAC
                  simp only [Nat.lt_irrefl, ↓reduceIte] at hqr ⊢
                  exact ih bs cs hpq hqr
  · intro p
    induction p with
    | nil =>
      intro q hpq
      cases q with
      | nil => rfl
      | cons _ _ => simp [pathLexLt]
    | cons a as ih =>
      intro q hpq
      cases q with
      | nil => simp [pathLexLt] at hpq
      | cons b bs =>
        simp only [pathLexLt] at hpq ⊢
        by_cases hab : a < b
        · have hba : ¬ (b < a) := by omega
          simp [hab, hba]
        · by_cases hba : b < a
          · simp only [hab, ↓reduceIte, hba] at hpq
            cases hpq
          · have hEq : a = b := by omega
            subst hEq
            simp only [Nat.lt_irrefl, ↓reduceIte] at hpq ⊢
            exact ih bs hpq
  · intro p
    induction p with
    | nil =>
      intro q
      cases q with
      | nil => right; right; rfl
      | cons _ _ => left; rfl
    | cons a as ih =>
      intro q
      cases q with
      | nil => right; left; rfl
      | cons b bs =>
        simp only [pathLexLt]
        by_cases hab : a < b
        · left; simp [hab]
        · by_cases hba : b < a
          · right; left; simp [hba]
          · have hEq : a = b := by omega
            subst hEq
            simp only [Nat.lt_irrefl, ↓reduceIte]
            rcases ih bs with h1 | h2 | h3
            · left; exact h1
            · right; left; exact h2
            · right; right; rw [h3]

/-- Proof of cumulative quantization/rounding error bound and certified margin exactness. -/
theorem approxScoreExactness : Prop_ApproxScoreExactness := by
  constructor
  · intro eps trueTerms approxTerms hErr
    induction trueTerms generalizing approxTerms with
    | nil =>
      cases approxTerms with
      | nil => simp
      | cons _ _ => simp [BoundedStepError] at hErr
    | cons t ts ih =>
      cases approxTerms with
      | nil => simp [BoundedStepError] at hErr
      | cons a as =>
        simp only [BoundedStepError] at hErr
        rcases hErr with ⟨hHead, hTail⟩
        have hRec := ih as hTail
        simp only [List.sum_cons, List.length_cons]
        have hMul : (ts.length + 1) * eps = ts.length * eps + eps := Nat.succ_mul ts.length eps
        rw [hMul]
        omega
  · intro trueOpt approxOpt trueAlt approxAlt delta hOpt hAlt hMargin
    omega

end FactorForgeFormal.Proofs
