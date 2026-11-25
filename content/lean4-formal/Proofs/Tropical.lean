import FactorForgeFormal.Spec.Tropical

/-!
Proofs: Tropical Max-Plus Semiring Laws (`FactorForgeFormal.Spec.Tropical`).
-/

namespace FactorForgeFormal.Proofs

open FactorForgeFormal.Spec
open FactorForgeFormal.Spec.Trop

private theorem int_max_eq (a b : Int) : max a b = if a ≤ b then b else a := rfl

private theorem int_add_max (a b c : Int) : a + max b c = max (a + b) (a + c) := by
  rw [int_max_eq b c, int_max_eq (a + b) (a + c)]
  split <;> split <;> omega

private theorem int_max_add (a b c : Int) : max a b + c = max (a + c) (b + c) := by
  rw [int_max_eq a b, int_max_eq (a + c) (b + c)]
  split <;> split <;> omega

private theorem trop_le_finite_iff (a b : Int) : (Trop.finite a ≤ Trop.finite b) ↔ a ≤ b :=
  Iff.rfl

/-- Proof of all 12 idempotent commutative semiring laws for `Trop Int`. -/
theorem tropIntSemiringLaws : Prop_TropIntSemiringLaws := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · intro a b c
    cases a <;> cases b <;> cases c <;> simp only [oplus, int_max_eq] <;>
      repeat (first | split | omega | rfl)
  · intro a b
    cases a <;> cases b <;> simp only [oplus, int_max_eq] <;>
      first | rfl | (apply congrArg Trop.finite; split <;> split <;> omega)
  · intro a
    cases a <;> simp only [oplus, int_max_eq] <;>
      first | rfl | (apply congrArg Trop.finite; split <;> omega)
  · intro a
    cases a <;> rfl
  · intro a
    cases a <;> rfl
  · intro a b c
    cases a <;> cases b <;> cases c <;> simp only [otimes] <;>
      first | rfl | exact congrArg Trop.finite (Int.add_assoc _ _ _)
  · intro a
    cases a <;> simp only [otimes, one] <;>
      first | rfl | exact congrArg Trop.finite (Int.zero_add _)
  · intro a
    cases a <;> simp only [otimes, one] <;>
      first | rfl | exact congrArg Trop.finite (Int.add_zero _)
  · intro a
    cases a <;> rfl
  · intro a
    cases a <;> rfl
  · intro a b c
    cases a <;> cases b <;> cases c <;> simp only [oplus, otimes] <;>
      first | rfl | exact congrArg Trop.finite (int_add_max _ _ _)
  · intro a b c
    cases a <;> cases b <;> cases c <;> simp only [oplus, otimes] <;>
      first | rfl | exact congrArg Trop.finite (int_max_add _ _ _)

/-- Proof of order laws and monotonicity for `Trop Int`. -/
theorem tropIntOrderLaws : Prop_TropIntOrderLaws := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · intro a
    cases a
    · trivial
    · exact Int.le_refl _
  · intro a b c hab hbc
    cases a <;> cases b <;> cases c
    all_goals first
      | trivial
      | exact False.elim hab
      | exact False.elim hbc
      | exact Int.le_trans hab hbc
  · intro a b hab hba
    cases a <;> cases b
    all_goals first
      | rfl
      | exact False.elim hab
      | exact False.elim hba
      | exact congrArg Trop.finite (Int.le_antisymm hab hba)
  · intro a b
    cases a <;> cases b
    · trivial
    · trivial
    · exact Int.le_refl _
    · simp only [oplus, int_max_eq, trop_le_finite_iff]; split <;> omega
  · intro a b
    cases a <;> cases b
    · trivial
    · exact Int.le_refl _
    · trivial
    · simp only [oplus, int_max_eq, trop_le_finite_iff]; split <;> omega
  · intro a b c hac hbc
    cases a <;> cases b <;> cases c
    all_goals first
      | trivial
      | exact hac
      | exact hbc
      | exact False.elim hac
      | exact False.elim hbc
      | (simp only [oplus, int_max_eq, trop_le_finite_iff] at hac hbc ⊢; split <;> omega)
  · intro a b c hab
    cases a <;> cases b <;> cases c
    all_goals first
      | trivial
      | exact False.elim hab
      | (simp only [otimes, trop_le_finite_iff] at hab ⊢; exact Int.add_le_add_right hab _)
  · intro a b c hab
    cases a <;> cases b <;> cases c
    all_goals first
      | trivial
      | exact False.elim hab
      | (simp only [otimes, trop_le_finite_iff] at hab ⊢; exact Int.add_le_add_left hab _)

end FactorForgeFormal.Proofs
