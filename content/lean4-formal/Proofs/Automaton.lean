import FactorForgeFormal.Spec.Automaton

/-!
Proofs: Construct-Level Finite-State Automaton Safety (`FactorForgeFormal.Spec.Automaton`).
-/

namespace FactorForgeFormal.Proofs

open FactorForgeFormal.Spec
open FactorForgeFormal.Spec.Automaton

/-- Proof that `stepSeq` splits over list concatenation. -/
theorem stepSeqAppend : Prop_StepSeqAppend := by
  intro M s xs ys
  induction xs generalizing s with
  | nil => rfl
  | cons b bs ih => simp [stepSeq, ih]

/-- Proof that `safeSeq` splits cleanly over list concatenation. -/
theorem safeSeqAppend : Prop_SafeSeqAppend := by
  intro M s xs ys
  induction xs generalizing s with
  | nil => simp [safeSeq, stepSeq]
  | cons b bs ih =>
    simp only [List.cons_append, safeSeq, stepSeq]
    by_cases ht : M.isTerminal (M.stepSym s b) = true
    · simp [ht]
    · simp [ht, ih]

/-- Proof that `stepCodonSafe` returning `(_, true)` matches `(stepSeq, safeSeq)`. -/
theorem stepCodonSafeSound : Prop_StepCodonSafeSound := by
  intro M s c s' h
  induction c generalizing s with
  | nil =>
    simp [stepCodonSafe] at h
    rcases h with ⟨rfl, _⟩
    simp [stepSeq, safeSeq]
  | cons b bs ih =>
    simp only [stepCodonSafe] at h
    by_cases ht : M.isTerminal (M.stepSym s b) = true
    · simp [ht] at h
    · simp [ht] at h
      have ⟨hseq, hsafe⟩ := ih (M.stepSym s b) h
      simp [stepSeq, safeSeq, ht, hseq, hsafe]

/-- Proof that `safeSeq = true` guarantees `stepCodonSafe = (stepSeq, true)`. -/
theorem stepCodonSafeComplete : Prop_StepCodonSafeComplete := by
  intro M s c h
  induction c generalizing s with
  | nil => simp [stepCodonSafe, stepSeq]
  | cons b bs ih =>
    simp only [safeSeq] at h
    by_cases ht : M.isTerminal (M.stepSym s b) = true
    · simp [ht] at h
    · simp [ht] at h
      simp [stepCodonSafe, stepSeq, ht, ih (M.stepSym s b) h]

private theorem safeCodonList_implies_safeSeq (M : Automaton) (s : Nat)
    (cds : List (List Base)) (h : M.safeCodonList s cds = true) :
    M.safeSeq s cds.flatten = true := by
  induction cds generalizing s with
  | nil => simp [safeSeq]
  | cons c cs ih =>
    simp only [safeCodonList] at h
    cases hc : M.stepCodonSafe s c with
    | mk s' ok =>
      rw [hc] at h
      cases ok
      · simp at h
      · simp at h
        have ⟨hseq, hsafe⟩ := stepCodonSafeSound M s c s' hc
        rw [List.flatten_cons, safeSeqAppend]
        simp [hsafe, hseq, ih s' h]

/-- Proof of full-construct safety across left flank, CDS, and stop/right flank. -/
theorem fullConstructSafe : Prop_FullConstructSafe := by
  intro M leftFlank tail cds s0 sEnd hLeft hCds hTail
  have hCdsFlat := safeCodonList_implies_safeSeq M s0 cds hCds
  dsimp only [s0, sEnd] at hCdsFlat hTail
  rw [List.append_assoc, safeSeqAppend, safeSeqAppend, hLeft, hCdsFlat, hTail]
  rfl

end FactorForgeFormal.Proofs
