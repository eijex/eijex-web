import FactorForgeFormal.Spec.GeneticCode
import FactorForgeFormal.Spec.ExactDP

/-!
Proofs: Standard Genetic Code Partition (61 Sense + 3 Stop = 64 Triplets) and
Codon-to-Amino-Acid Validity Decomposition (`FactorForgeFormal.Spec.GeneticCode`).
-/

namespace FactorForgeFormal.Proofs

open FactorForgeFormal.Spec

/-- Proof that the 64 DNA triplets partition into 61 sense codons and 3 stop codons. -/
theorem geneticCodePartition64 : Prop_GeneticCodePartition64 := by
  unfold Prop_GeneticCodePartition64
  exact ⟨by decide, by decide, by decide⟩

/-- Decompose `ValidCodonForAA c a = true` into `wellFormed`, 3-base structure,
    exact nucleotide GC count, and sense translation `translateTriplet b1 b2 b3 = .aa a`. -/
theorem validCodonForAA_destruct (c : CodonSpec) (a : AminoAcid)
    (h : ValidCodonForAA c a = true) :
    c.wellFormed = true ∧
    c.seq.length = 3 ∧
    c.gc = seqGC c.seq ∧
    ∃ b1 b2 b3 : Base, c.seq = [b1, b2, b3] ∧ translateTriplet b1 b2 b3 = .aa a := by
  simp only [ValidCodonForAA, Bool.and_eq_true, beq_iff_eq] at h
  rcases h with ⟨⟨hLen, hGC⟩, hTrans⟩
  have hWF : c.wellFormed = true := by
    simp [CodonSpec.wellFormed, hLen, hGC]
  refine ⟨hWF, hLen, hGC, ?_⟩
  cases hSeq : c.seq with
  | nil => rw [hSeq] at hLen; cases hLen
  | cons b1 r1 =>
    cases r1 with
    | nil => rw [hSeq] at hLen; cases hLen
    | cons b2 r2 =>
      cases r2 with
      | nil => rw [hSeq] at hLen; cases hLen
      | cons b3 r3 =>
        cases r3 with
        | nil =>
          rw [hSeq] at hTrans
          simp only [translateCodonSeq, Option.some.injEq] at hTrans
          exact ⟨b1, b2, b3, rfl, hTrans⟩
        | cons b4 _ =>
          rw [hSeq] at hLen
          simp at hLen

/-- Helper: prepending a valid sense triplet `[b1, b2, b3]` prepends `a` under `translateDNA`. -/
theorem translateDNA_cons3 (b1 b2 b3 : Base) (rest : List Base)
    (a : AminoAcid) (aas : List AminoAcid)
    (h1 : translateTriplet b1 b2 b3 = .aa a)
    (h2 : translateDNA rest = some aas) :
    translateDNA ([b1, b2, b3] ++ rest) = some (a :: aas) := by
  simp [translateDNA, h1, h2]

end FactorForgeFormal.Proofs
