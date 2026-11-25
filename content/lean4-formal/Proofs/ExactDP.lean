import FactorForgeFormal.Spec.ExactDP
import FactorForgeFormal.Proofs.Tropical
import FactorForgeFormal.Proofs.Automaton
import FactorForgeFormal.Proofs.GeneticCode

/-!
Proofs: Exact Finite-State Dynamic Programming Optimality, GC Conservation,
Protein Translation Preservation, Constructive Backtracking (`dpOptimize`),
Suffix Pruning Admissibility, and Synonymous GC Envelope Unsatisfiability
(`FactorForgeFormal.Spec.ExactDP`).
-/

namespace FactorForgeFormal.Proofs

open FactorForgeFormal.Spec
open FactorForgeFormal.Spec.Trop
open FactorForgeFormal.Spec.Automaton

private theorem list_snoc_rec {α : Type} {P : List α -> Prop}
    (nil : P []) (snoc : ∀ xs x, P xs -> P (xs ++ [x])) (xs : List α) : P xs := by
  have hRev : xs = xs.reverse.reverse := (List.reverse_reverse xs).symm
  rw [hRev]
  induction xs.reverse with
  | nil => exact nil
  | cons x rx ih =>
    rw [List.reverse_cons]
    exact snoc rx.reverse x ih

private theorem stepSeq_lt (M : Automaton) (s : Nat) (hs : s < M.numStates)
    (xs : List Base) : M.stepSeq s xs < M.numStates := by
  induction xs generalizing s with
  | nil => exact hs
  | cons b bs ih => exact ih (M.stepSym s b) (M.step_lt s b hs)

private theorem stepCodonSafe_fst_eq (M : Automaton) (s : Nat) (c : List Base)
    (h : (M.stepCodonSafe s c).2 = true) :
    (M.stepCodonSafe s c).1 = M.stepSeq s c := by
  cases hp : M.stepCodonSafe s c with
  | mk sn ok =>
    rw [hp] at h
    dsimp only at h
    subst h
    exact (stepCodonSafeSound M s c sn hp).1.symm

private theorem pathGC_append (xs ys : List CodonSpec) :
    pathGC (xs ++ ys) = pathGC xs + pathGC ys := by
  simp [pathGC, List.map_append, List.sum_append]

private theorem pathScore_append (xs ys : List CodonSpec) :
    pathScore (xs ++ ys) = pathScore xs + pathScore ys := by
  simp [pathScore, List.map_append, List.sum_append]

private theorem seqGC_append (xs ys : List Base) :
    seqGC (xs ++ ys) = seqGC xs + seqGC ys := by
  simp [seqGC, List.map_append, List.sum_append]

private theorem totalMaxGC_append (a b : List (List CodonSpec)) :
    totalMaxGC (a ++ b) = totalMaxGC a + totalMaxGC b := by
  simp [totalMaxGC, List.map_append, List.sum_append]

private theorem foldl_max_ge_init (opts : List CodonSpec) (init : Nat) :
    init ≤ opts.foldl (fun acc c => max acc c.gc) init := by
  induction opts generalizing init with
  | nil => exact Nat.le_refl _
  | cons x xs ih =>
    simp only [List.foldl_cons]
    exact Nat.le_trans (Nat.le_max_left _ _) (ih _)

private theorem foldl_max_mem_le (opts : List CodonSpec) (init : Nat)
    (c : CodonSpec) (hc : c ∈ opts) :
    c.gc ≤ opts.foldl (fun acc x => max acc x.gc) init := by
  induction opts generalizing init with
  | nil => cases hc
  | cons x xs ih =>
    simp only [List.foldl_cons]
    cases hc with
    | head => exact Nat.le_trans (Nat.le_max_right _ _) (foldl_max_ge_init xs _)
    | tail _ hMem => exact ih _ hMem

private theorem foldl_min_le_init (opts : List CodonSpec) (init : Nat) :
    opts.foldl (fun acc x => min acc x.gc) init ≤ init := by
  induction opts generalizing init with
  | nil => exact Nat.le_refl _
  | cons x xs ih =>
    simp only [List.foldl_cons]
    exact Nat.le_trans (ih _) (Nat.min_le_left _ _)

private theorem foldl_min_mem_ge (opts : List CodonSpec) (init : Nat)
    (c : CodonSpec) (hc : c ∈ opts) :
    opts.foldl (fun acc x => min acc x.gc) init ≤ c.gc := by
  induction opts generalizing init with
  | nil => cases hc
  | cons x xs ih =>
    simp only [List.foldl_cons]
    cases hc with
    | head => exact Nat.le_trans (foldl_min_le_init xs _) (Nat.min_le_right _ _)
    | tail _ hMem => exact ih _ hMem

private theorem mem_layer_gc_bounds (opts : List CodonSpec) (c : CodonSpec)
    (hc : c ∈ opts) : layerMinGC opts ≤ c.gc ∧ c.gc ≤ layerMaxGC opts := by
  constructor
  · cases opts with
    | nil => cases hc
    | cons x xs =>
      simp only [layerMinGC]
      cases hc with
      | head => exact foldl_min_le_init xs c.gc
      | tail _ hMem => exact foldl_min_mem_ge xs x.gc c hMem
  · exact foldl_max_mem_le opts 0 c hc

private theorem validPath_gc_bounds (M : Automaton) (s0 : Nat)
    (layers : List (List CodonSpec)) (cs : List CodonSpec)
    (h : ValidPath M s0 layers cs) :
    totalMinGC layers ≤ pathGC cs ∧ pathGC cs ≤ totalMaxGC layers := by
  induction layers generalizing s0 cs with
  | nil =>
    cases cs with
    | nil => simp [totalMinGC, totalMaxGC, pathGC]
    | cons _ _ => simp [ValidPath] at h
  | cons opts rest ih =>
    cases cs with
    | nil => simp [ValidPath] at h
    | cons c tailCs =>
      simp only [ValidPath] at h
      rcases h with ⟨hc, _, hRest⟩
      have hB := mem_layer_gc_bounds opts c hc
      have hRec := ih (M.stepCodonSafe s0 c.seq).1 tailCs hRest
      simp only [totalMinGC, totalMaxGC, pathGC, List.map_cons, List.sum_cons] at hRec ⊢
      omega

private theorem validPath_snoc (M : Automaton) (s0 : Nat)
    (init : List (List CodonSpec)) (opts : List CodonSpec) (cs : List CodonSpec) :
    ValidPath M s0 (init ++ [opts]) cs ↔
      ∃ pre c, cs = pre ++ [c] ∧
        ValidPath M s0 init pre ∧
        c ∈ opts ∧
        (M.stepCodonSafe (M.stepSeq s0 (pre.flatMap (·.seq))) c.seq).2 = true := by
  induction init generalizing s0 cs with
  | nil =>
    constructor
    · intro h
      cases cs with
      | nil => simp [ValidPath] at h
      | cons c tail =>
        cases tail with
        | nil =>
          simp only [List.nil_append, ValidPath] at h
          rcases h with ⟨hc, hSafe, _⟩
          exact ⟨[], c, rfl, trivial, hc, hSafe⟩
        | cons _ _ => simp [ValidPath] at h
    · rintro ⟨pre, c, rfl, hPre, hc, hSafe⟩
      cases pre with
      | nil =>
        simp only [List.nil_append, ValidPath]
        exact ⟨hc, hSafe, trivial⟩
      | cons _ _ => simp [ValidPath] at hPre
  | cons opt0 rest ih =>
    constructor
    · intro h
      cases cs with
      | nil => simp [ValidPath] at h
      | cons c0 tailCs =>
        simp only [List.cons_append, ValidPath] at h
        rcases h with ⟨hc0, hSafe0, hRest⟩
        obtain ⟨preTail, c, hEq, hPreTail, hc, hSafeLast⟩ :=
          (ih (M.stepCodonSafe s0 c0.seq).1 tailCs).mp hRest
        have hSeq0 : (M.stepCodonSafe s0 c0.seq).1 = M.stepSeq s0 c0.seq :=
          stepCodonSafe_fst_eq M s0 c0.seq hSafe0
        refine ⟨c0 :: preTail, c, by simp [hEq], ⟨hc0, hSafe0, hPreTail⟩, hc, ?_⟩
        rw [List.flatMap_cons, stepSeqAppend, ← hSeq0]
        exact hSafeLast
    · rintro ⟨pre, c, hEq, hPre, hc, hSafeLast⟩
      cases pre with
      | nil => simp [ValidPath] at hPre
      | cons c0 preTail =>
        simp only [ValidPath] at hPre
        rcases hPre with ⟨hc0, hSafe0, hRest⟩
        have hSeq0 : (M.stepCodonSafe s0 c0.seq).1 = M.stepSeq s0 c0.seq :=
          stepCodonSafe_fst_eq M s0 c0.seq hSafe0
        have hSafeLast' :
            (M.stepCodonSafe (M.stepSeq (M.stepCodonSafe s0 c0.seq).1
              (preTail.flatMap (·.seq))) c.seq).2 = true := by
          rw [hSeq0, ← stepSeqAppend, ← List.flatMap_cons]
          exact hSafeLast
        have hTail :
            ValidPath M (M.stepCodonSafe s0 c0.seq).1 (rest ++ [opts]) (preTail ++ [c]) :=
          (ih (M.stepCodonSafe s0 c0.seq).1 (preTail ++ [c])).mpr
            ⟨preTail, c, rfl, hRest, hc, hSafeLast'⟩
        rw [hEq]
        simp only [List.cons_append, ValidPath]
        exact ⟨hc0, hSafe0, hTail⟩

private theorem trop_le_refl (a : Trop Int) : a ≤ a :=
  tropIntOrderLaws.1 a

private theorem trop_le_trans {a b c : Trop Int} (h1 : a ≤ b) (h2 : b ≤ c) : a ≤ c :=
  tropIntOrderLaws.2.1 a b c h1 h2

private theorem trop_le_oplus_left (a b : Trop Int) : a ≤ Trop.oplus a b :=
  tropIntOrderLaws.2.2.2.1 a b

private theorem trop_le_oplus_right (a b : Trop Int) : b ≤ Trop.oplus a b :=
  tropIntOrderLaws.2.2.2.2.1 a b

private theorem trop_oplus_assoc (a b c : Trop Int) :
    Trop.oplus (Trop.oplus a b) c = Trop.oplus a (Trop.oplus b c) :=
  tropIntSemiringLaws.1 a b c

private theorem trop_zero_oplus (a : Trop Int) : Trop.oplus Trop.zero a = a :=
  tropIntSemiringLaws.2.2.2.1 a

private theorem trop_oplus_zero (a : Trop Int) : Trop.oplus a Trop.zero = a :=
  tropIntSemiringLaws.2.2.2.2.1 a

private theorem trop_otimes_mono_left {a b : Trop Int} (c : Trop Int) (h : a ≤ b) :
    Trop.otimes a c ≤ Trop.otimes b c :=
  tropIntOrderLaws.2.2.2.2.2.2.1 a b c h

private theorem trop_oplus_finite_cases (a b : Trop Int) (v : Int)
    (h : Trop.oplus a b = Trop.finite v) : a = Trop.finite v ∨ b = Trop.finite v := by
  cases a with
  | negInf => right; simpa [Trop.oplus] using h
  | finite x =>
    cases b with
    | negInf => left; simpa [Trop.oplus] using h
    | finite y =>
      simp only [Trop.oplus] at h
      have hMax : max x y = v := Trop.finite.inj h
      change (if x ≤ y then y else x) = v at hMax
      split at hMax
      · right; exact congrArg Trop.finite hMax
      · left; exact congrArg Trop.finite hMax

private theorem oplus_foldl_ge_init {α : Type} (xs : List α) (f : α -> Trop Int)
    (init : Trop Int) :
    init ≤ xs.foldl (fun acc x => Trop.oplus acc (f x)) init := by
  induction xs generalizing init with
  | nil => exact trop_le_refl _
  | cons x xs ih =>
    simp only [List.foldl_cons]
    exact trop_le_trans (trop_le_oplus_left _ _) (ih _)

private theorem oplus_foldl_mem_ge {α : Type} (xs : List α) (f : α -> Trop Int)
    (init : Trop Int) (x : α) (hx : x ∈ xs) :
    f x ≤ xs.foldl (fun acc y => Trop.oplus acc (f y)) init := by
  induction xs generalizing init with
  | nil => cases hx
  | cons y ys ih =>
    simp only [List.foldl_cons]
    cases hx with
    | head => exact trop_le_trans (trop_le_oplus_right _ _) (oplus_foldl_ge_init ys f _)
    | tail _ hMem => exact ih _ hMem

private theorem oplus_foldl_finite_witness {α : Type} (xs : List α) (f : α -> Trop Int)
    (init : Trop Int) (v : Int)
    (h : xs.foldl (fun acc x => Trop.oplus acc (f x)) init = Trop.finite v) :
    init = Trop.finite v ∨ ∃ x ∈ xs, f x = Trop.finite v := by
  induction xs generalizing init with
  | nil => left; exact h
  | cons y ys ih =>
    simp only [List.foldl_cons] at h
    rcases ih (Trop.oplus init (f y)) h with hHead | ⟨x, hx, hfx⟩
    · rcases trop_oplus_finite_cases init (f y) v hHead with hInit | hFy
      · left; exact hInit
      · right; exact ⟨y, by simp, hFy⟩
    · right; exact ⟨x, by simp [hx], hfx⟩

private theorem oplus_foldl_shift {α : Type} (xs : List α) (f : α -> Trop Int)
    (init : Trop Int) :
    xs.foldl (fun acc x => Trop.oplus acc (f x)) init =
    Trop.oplus init (xs.foldl (fun acc x => Trop.oplus acc (f x)) Trop.zero) := by
  induction xs generalizing init with
  | nil => simp [trop_oplus_zero]
  | cons y ys ih =>
    simp only [List.foldl_cons]
    rw [ih (Trop.oplus init (f y)), ih (Trop.oplus Trop.zero (f y)), trop_zero_oplus, trop_oplus_assoc]

private theorem oplus_ite_foldl {α : Type} (xs : List α) (p : α -> Bool)
    (f : α -> Trop Int) (init : Trop Int) :
    xs.foldl (fun acc x => if p x then Trop.oplus acc (f x) else acc) init =
    xs.foldl (fun acc x => Trop.oplus acc (if p x then f x else Trop.zero)) init := by
  induction xs generalizing init with
  | nil => rfl
  | cons x xs ih =>
    simp only [List.foldl_cons]
    cases hpx : p x
    · simp [trop_oplus_zero, ih]
    · simp [ih]

private theorem foldl_oplus_zero_const {α : Type} (xs : List α) :
    xs.foldl (fun acc _ => Trop.oplus acc (Trop.zero : Trop Int)) (Trop.zero : Trop Int) =
      (Trop.zero : Trop Int) := by
  induction xs with
  | nil => rfl
  | cons _ ys ih =>
    simp only [List.foldl_cons, trop_zero_oplus]
    exact ih

private def dpFold (M : Automaton) (s0 : Nat) (layers : List (List CodonSpec)) :
    Nat × (Nat -> Nat -> Trop Int) :=
  layers.foldl
    (fun (acc : Nat × (Nat -> Nat -> Trop Int)) opts =>
      let newMax := acc.1 + layerMaxGC opts
      (newMax, dpStep M newMax opts acc.2))
    (0, dpBase s0)

private theorem dpFold_fst (M : Automaton) (s0 : Nat) (layers : List (List CodonSpec)) :
    (dpFold M s0 layers).1 = totalMaxGC layers := by
  induction layers using list_snoc_rec with
  | nil => simp [dpFold, totalMaxGC]
  | snoc init opts ih =>
    simp only [dpFold, List.foldl_append, List.foldl_cons, List.foldl_nil] at ih ⊢
    rw [ih, totalMaxGC_append]
    simp [totalMaxGC]

private theorem dpEval_nil (M : Automaton) (s0 : Nat) :
    dpEval M s0 [] = dpBase s0 := rfl

private theorem dpEval_snoc (M : Automaton) (s0 : Nat) (init : List (List CodonSpec))
    (opts : List CodonSpec) :
    dpEval M s0 (init ++ [opts]) =
      dpStep M (totalMaxGC (init ++ [opts])) opts (dpEval M s0 init) := by
  have hFst := dpFold_fst M s0 init
  simp only [dpEval, dpFold] at hFst ⊢
  rw [List.foldl_append, List.foldl_cons, List.foldl_nil]
  dsimp only
  rw [hFst, totalMaxGC_append]
  simp [totalMaxGC]

private def stepCell (M : Automaton) (prev : Nat -> Nat -> Trop Int)
    (g' s' s : Nat) (c : CodonSpec) : Trop Int :=
  if decide (c.gc ≤ g') && (M.stepCodonSafe s c.seq).2 && ((M.stepCodonSafe s c.seq).1 == s') then
    Trop.otimes (prev (g' - c.gc) s) (Trop.finite c.score)
  else
    Trop.zero

private theorem dpStep_one_step (M : Automaton) (prev : Nat -> Nat -> Trop Int)
    (g' s' s : Nat) (c : CodonSpec) (acc : Trop Int) :
    (if c.gc ≤ g' then
      let res := M.stepCodonSafe s c.seq
      if res.2 && res.1 == s' then
        Trop.oplus acc (Trop.otimes (prev (g' - c.gc) s) (Trop.finite c.score))
      else acc
    else acc) =
    Trop.oplus acc (stepCell M prev g' s' s c) := by
  simp only [stepCell]
  by_cases hgc : c.gc ≤ g'
  · by_cases hok : (M.stepCodonSafe s c.seq).2 = true
    · by_cases hst : ((M.stepCodonSafe s c.seq).1 == s') = true
      · simp [hgc, hok, hst]
      · simp [hgc, hok, hst, trop_oplus_zero]
    · simp [hgc, hok, trop_oplus_zero]
  · simp [hgc, trop_oplus_zero]

private theorem dpStep_inner_eq (M : Automaton) (opts : List CodonSpec)
    (prev : Nat -> Nat -> Trop Int) (g' s' s : Nat) (acc : Trop Int) :
    opts.foldl
      (fun acc2 c =>
        if c.gc ≤ g' then
          let res := M.stepCodonSafe s c.seq
          if res.2 && res.1 == s' then
            Trop.oplus acc2 (Trop.otimes (prev (g' - c.gc) s) (Trop.finite c.score))
          else acc2
        else acc2)
      acc =
    Trop.oplus acc
      (opts.foldl (fun acc2 c => Trop.oplus acc2 (stepCell M prev g' s' s c)) Trop.zero) := by
  rw [← oplus_foldl_shift]
  induction opts generalizing acc with
  | nil => rfl
  | cons c cs ih =>
    simp only [List.foldl_cons]
    rw [dpStep_one_step]
    exact ih (Trop.oplus acc (stepCell M prev g' s' s c))

private theorem dpStep_eq_nested_oplus (M : Automaton) (maxGC : Nat)
    (opts : List CodonSpec) (prev : Nat -> Nat -> Trop Int) (g' s' : Nat)
    (hBound : g' ≤ maxGC ∧ s' < M.numStates) :
    dpStep M maxGC opts prev g' s' =
    (List.range M.numStates).foldl
      (fun acc s =>
        Trop.oplus acc
          (opts.foldl (fun acc2 c => Trop.oplus acc2 (stepCell M prev g' s' s c)) Trop.zero))
      Trop.zero := by
  simp only [dpStep, hBound, and_self, ↓reduceIte]
  congr 1
  funext acc s
  exact dpStep_inner_eq M opts prev g' s' s acc

private theorem dpBestScore_eq_nested_oplus (M : Automaton) (s0 minGC maxGC : Nat)
    (tail : List Base) (layers : List (List CodonSpec)) :
    dpBestScore M s0 minGC maxGC tail layers =
    (List.range (totalMaxGC layers + 1)).foldl
      (fun acc g =>
        Trop.oplus acc
          ((List.range M.numStates).foldl
            (fun acc2 s =>
              Trop.oplus acc2
                (if decide (minGC ≤ g) && decide (g ≤ maxGC) && M.safeSeq s tail then
                  dpEval M s0 layers g s
                else Trop.zero))
            Trop.zero))
      Trop.zero := by
  simp only [dpBestScore]
  congr 1
  funext acc g
  by_cases hBand : (decide (minGC ≤ g) && decide (g ≤ maxGC)) = true
  · simp only [hBand, ↓reduceIte, Bool.true_and]
    rw [oplus_ite_foldl, ← oplus_foldl_shift]
  · simp only [hBand, Bool.false_and, Bool.false_eq_true, ↓reduceIte]
    rw [foldl_oplus_zero_const, trop_oplus_zero]

/-- Proof of GC conservation across well-formed codon options. -/
theorem gcConservation : Prop_GCConservation := by
  intro cs hwf
  induction cs with
  | nil => rfl
  | cons c rest ih =>
    have hc : c.wellFormed = true := hwf c (by simp)
    have hRest : ∀ x ∈ rest, x.wellFormed = true := fun x hx => hwf x (by simp [hx])
    simp only [CodonSpec.wellFormed, Bool.and_eq_true, beq_iff_eq] at hc
    simp only [pathGC, List.map_cons, List.sum_cons, List.flatMap_cons, seqGC_append]
    rw [hc.2]
    change seqGC c.seq + pathGC rest = seqGC c.seq + seqGC (rest.flatMap (·.seq))
    rw [ih hRest]

/-- Proof of Protein Preservation & True Nucleotide GC Exactness under `WellFormedMenu`. -/
theorem proteinPreservationAndGC : Prop_ProteinPreservationAndGC := by
  intro M s0 protein layers cs hMenu hValid
  induction protein generalizing s0 layers cs with
  | nil =>
    cases layers with
    | nil =>
      cases cs with
      | nil => simp [pathGC, seqGC, translateDNA]
      | cons _ _ => simp [ValidPath] at hValid
    | cons _ _ => simp [WellFormedMenu] at hMenu
  | cons a as ih =>
    cases layers with
    | nil => simp [WellFormedMenu] at hMenu
    | cons opts rest =>
      cases cs with
      | nil => simp [ValidPath] at hValid
      | cons c tailCs =>
        simp only [WellFormedMenu] at hMenu
        simp only [ValidPath] at hValid
        rcases hMenu with ⟨hOptsValid, hMenuRest⟩
        rcases hValid with ⟨hcMem, _, hValidRest⟩
        obtain ⟨_, _, hcGC, b1, b2, b3, hcSeq, hcTrans⟩ :=
          validCodonForAA_destruct c a (hOptsValid c hcMem)
        obtain ⟨hLenRest, hGCRest, hTransRest⟩ :=
          ih (M.stepCodonSafe s0 c.seq).1 rest tailCs hMenuRest hValidRest
        dsimp only
        refine ⟨?_, ?_, ?_⟩
        · simp only [List.flatMap_cons, List.length_append, hcSeq, List.length_cons,
            List.length_nil]
          omega
        · simp only [pathGC, List.map_cons, List.sum_cons, List.flatMap_cons, seqGC_append]
          rw [hcGC]
          change seqGC c.seq + pathGC tailCs = seqGC c.seq + seqGC (tailCs.flatMap (·.seq))
          rw [hGCRest]
        · simp only [List.flatMap_cons, hcSeq]
          exact translateDNA_cons3 b1 b2 b3 (tailCs.flatMap (·.seq)) a as hcTrans hTransRest

/-- Proof of DP soundness: every finite DP table entry witnesses a valid path. -/
theorem dpSoundness : Prop_DPSoundness := by
  intro M s0 _hs0 layers
  induction layers using list_snoc_rec with
  | nil =>
    intro g s v h
    rw [dpEval_nil] at h
    simp only [dpBase] at h
    by_cases hEq : (g == 0 && s == s0) = true
    · simp only [hEq, ↓reduceIte, Trop.one] at h
      have hv : 0 = v := Trop.finite.inj h
      simp only [Bool.and_eq_true, beq_iff_eq] at hEq
      refine ⟨[], trivial, ?_, ?_, ?_⟩
      · simpa [pathGC] using hEq.1.symm
      · simpa [stepSeq] using hEq.2.symm
      · simpa [pathScore] using hv
    · simp [hEq, Trop.zero] at h
  | snoc init opts ih =>
    intro g' s' v h
    rw [dpEval_snoc] at h
    by_cases hBound : g' ≤ totalMaxGC (init ++ [opts]) ∧ s' < M.numStates
    · rw [dpStep_eq_nested_oplus M _ opts _ g' s' hBound] at h
      rcases oplus_foldl_finite_witness _ _ Trop.zero v h with hZ | ⟨s, _, hs⟩
      · cases hZ
      · rcases oplus_foldl_finite_witness _ _ Trop.zero v hs with hZ2 | ⟨c, hcOpts, hcVal⟩
        · cases hZ2
        · simp only [stepCell] at hcVal
          by_cases hCond :
              (decide (c.gc ≤ g') && (M.stepCodonSafe s c.seq).2 &&
                ((M.stepCodonSafe s c.seq).1 == s')) = true
          · simp only [hCond, ↓reduceIte] at hcVal
            simp only [Bool.and_eq_true, decide_eq_true_eq, beq_iff_eq] at hCond
            rcases hCond with ⟨⟨hgc, hSafe⟩, hNext⟩
            cases hPrev : dpEval M s0 init (g' - c.gc) s with
            | negInf =>
              rw [hPrev] at hcVal
              cases hcVal
            | finite vPrev =>
              rw [hPrev] at hcVal
              have hvEq : vPrev + c.score = v := Trop.finite.inj hcVal
              obtain ⟨pre, hPreVal, hPreGC, hPreSeq, hPreScore⟩ :=
                ih (g' - c.gc) s vPrev hPrev
              have hSafeAt :
                  (M.stepCodonSafe (M.stepSeq s0 (pre.flatMap (·.seq))) c.seq).2 = true := by
                rw [hPreSeq]; exact hSafe
              have hSeqSound : M.stepSeq s c.seq = s' := by
                have hPair : M.stepCodonSafe s c.seq = (s', true) := by
                  cases hp : M.stepCodonSafe s c.seq with
                  | mk sn ok =>
                    rw [hp] at hSafe hNext
                    simp only at hSafe hNext
                    subst hSafe; subst hNext; rfl
                exact (stepCodonSafeSound M s c.seq s' hPair).1
              refine ⟨pre ++ [c], ?_, ?_, ?_, ?_⟩
              · exact (validPath_snoc M s0 init opts (pre ++ [c])).mpr
                  ⟨pre, c, rfl, hPreVal, hcOpts, hSafeAt⟩
              · rw [pathGC_append, hPreGC]
                simp [pathGC]
                omega
              · rw [List.flatMap_append, stepSeqAppend, hPreSeq]
                simpa [List.flatMap_cons, List.flatMap_nil] using hSeqSound
              · rw [pathScore_append, hPreScore, ← hvEq]
                simp [pathScore]
          · simp [hCond, Trop.zero] at hcVal
    · simp [dpStep, hBound, Trop.zero] at h

/-- Proof of DP completeness: every valid path is upper-bounded by the DP table. -/
theorem dpCompleteness : Prop_DPCompleteness := by
  intro M s0 hs0 layers
  induction layers using list_snoc_rec with
  | nil =>
    intro cs h
    cases cs with
    | nil =>
      rw [dpEval_nil]
      simp only [dpBase, pathGC, stepSeq, pathScore, Trop.one, beq_self_eq_true, Bool.and_self,
        ↓reduceIte, List.flatMap_nil, List.map_nil, List.sum_nil]
      exact Int.le_refl 0
    | cons _ _ => simp [ValidPath] at h
  | snoc init opts ih =>
    intro cs h
    obtain ⟨pre, c, rfl, hPreVal, hcOpts, hSafeAt⟩ :=
      (validPath_snoc M s0 init opts cs).mp h
    rw [dpEval_snoc]
    let s := M.stepSeq s0 (pre.flatMap (·.seq))
    have hsLt : s < M.numStates := stepSeq_lt M s0 hs0 _
    have hFstEq : (M.stepCodonSafe s c.seq).1 = M.stepSeq s c.seq :=
      stepCodonSafe_fst_eq M s c.seq hSafeAt
    have hs'Lt : M.stepSeq s c.seq < M.numStates := stepSeq_lt M s hsLt c.seq
    have hEndSeq :
        M.stepSeq s0 ((pre ++ [c]).flatMap (·.seq)) = M.stepSeq s c.seq := by
      rw [List.flatMap_append, stepSeqAppend]
      simp [s]
    have hGCBound : pathGC (pre ++ [c]) ≤ totalMaxGC (init ++ [opts]) :=
      (validPath_gc_bounds M s0 (init ++ [opts]) (pre ++ [c]) h).2
    have hBound :
        pathGC (pre ++ [c]) ≤ totalMaxGC (init ++ [opts]) ∧
        M.stepSeq s0 ((pre ++ [c]).flatMap (·.seq)) < M.numStates := by
      rw [hEndSeq]
      exact ⟨hGCBound, hs'Lt⟩
    rw [dpStep_eq_nested_oplus M _ opts _ _ _ hBound, hEndSeq]
    have hIH := ih pre hPreVal
    have hScoreEq :
        Trop.finite (pathScore (pre ++ [c])) =
        Trop.otimes (Trop.finite (pathScore pre)) (Trop.finite c.score) := by
      rw [pathScore_append]
      simp [pathScore, Trop.otimes]
    have hMono :
        Trop.otimes (Trop.finite (pathScore pre)) (Trop.finite c.score) ≤
        Trop.otimes (dpEval M s0 init (pathGC pre) s) (Trop.finite c.score) :=
      trop_otimes_mono_left (Trop.finite c.score) hIH
    have hGCEq : pathGC (pre ++ [c]) = pathGC pre + c.gc := by
      rw [pathGC_append]; simp [pathGC]
    have hCell :
        stepCell M (dpEval M s0 init) (pathGC (pre ++ [c])) (M.stepSeq s c.seq) s c =
        Trop.otimes (dpEval M s0 init (pathGC pre) s) (Trop.finite c.score) := by
      simp only [stepCell]
      have h1 : c.gc ≤ pathGC (pre ++ [c]) := by omega
      have h2 : (M.stepCodonSafe s c.seq).2 = true := hSafeAt
      have hSub : pathGC (pre ++ [c]) - c.gc = pathGC pre := by omega
      simp [h1, h2, hFstEq, hSub]
    have hMemOuter :=
      oplus_foldl_mem_ge (List.range M.numStates)
        (fun st => opts.foldl (fun acc2 cd =>
          Trop.oplus acc2 (stepCell M (dpEval M s0 init) (pathGC (pre ++ [c]))
            (M.stepSeq s c.seq) st cd)) Trop.zero)
        Trop.zero s (List.mem_range.mpr hsLt)
    have hMemInner :=
      oplus_foldl_mem_ge opts
        (fun cd => stepCell M (dpEval M s0 init) (pathGC (pre ++ [c]))
          (M.stepSeq s c.seq) s cd)
        Trop.zero c hcOpts
    rw [hScoreEq]
    exact trop_le_trans hMono (trop_le_trans (by rw [← hCell]; exact hMemInner) hMemOuter)

/-- Proof of exact global optimality from DP soundness and completeness. -/
theorem exactGlobalOptimality : Prop_ExactGlobalOptimality := by
  intro M s0 hs0 minGC maxGC tail layers
  constructor
  · intro cs hFeas
    rcases hFeas with ⟨hVal, hTail, hMin, hMax⟩
    rw [dpBestScore_eq_nested_oplus]
    have hGCBound := (validPath_gc_bounds M s0 layers cs hVal).2
    have hsLt : M.stepSeq s0 (cs.flatMap (·.seq)) < M.numStates := stepSeq_lt M s0 hs0 _
    have hComp := dpCompleteness M s0 hs0 layers cs hVal
    have hOuter :=
      oplus_foldl_mem_ge (List.range (totalMaxGC layers + 1))
        (fun g => (List.range M.numStates).foldl
          (fun acc2 s => Trop.oplus acc2
            (if decide (minGC ≤ g) && decide (g ≤ maxGC) && M.safeSeq s tail then
              dpEval M s0 layers g s
            else Trop.zero))
          Trop.zero)
        Trop.zero (pathGC cs) (List.mem_range.mpr (by omega))
    have hInner :=
      oplus_foldl_mem_ge (List.range M.numStates)
        (fun s =>
          if decide (minGC ≤ pathGC cs) && decide (pathGC cs ≤ maxGC) && M.safeSeq s tail then
            dpEval M s0 layers (pathGC cs) s
          else Trop.zero)
        Trop.zero (M.stepSeq s0 (cs.flatMap (·.seq))) (List.mem_range.mpr hsLt)
    have hIf :
        (if decide (minGC ≤ pathGC cs) && decide (pathGC cs ≤ maxGC) &&
            M.safeSeq (M.stepSeq s0 (cs.flatMap (·.seq))) tail then
          dpEval M s0 layers (pathGC cs) (M.stepSeq s0 (cs.flatMap (·.seq)))
        else Trop.zero) =
        dpEval M s0 layers (pathGC cs) (M.stepSeq s0 (cs.flatMap (·.seq))) := by
      simp [hMin, hMax, hTail]
    rw [hIf] at hInner
    exact trop_le_trans hComp (trop_le_trans hInner hOuter)
  · intro v hBest
    rw [dpBestScore_eq_nested_oplus] at hBest
    rcases oplus_foldl_finite_witness _ _ Trop.zero v hBest with hZ | ⟨g, _, hg⟩
    · cases hZ
    · rcases oplus_foldl_finite_witness _ _ Trop.zero v hg with hZ2 | ⟨s, _, hs⟩
      · cases hZ2
      · by_cases hCond : (decide (minGC ≤ g) && decide (g ≤ maxGC) && M.safeSeq s tail) = true
        · simp only [hCond, ↓reduceIte] at hs
          simp only [Bool.and_eq_true, decide_eq_true_eq] at hCond
          rcases hCond with ⟨⟨hMin, hMax⟩, hTail⟩
          obtain ⟨cs, hVal, hGC, hSeq, hScore⟩ := dpSoundness M s0 hs0 layers g s v hs
          refine ⟨cs, ⟨hVal, ?_, ?_, ?_⟩, hScore⟩
          · rw [hSeq]; exact hTail
          · rw [hGC]; exact hMin
          · rw [hGC]; exact hMax
        · simp [hCond, Trop.zero] at hs

-- ============================================================================
-- Constructive Backtracking (`dpTrackEval` / `dpOptimize`) Lemmas & Proof
-- ============================================================================

private theorem candToTrop_relax (a b : DPCandidate) :
    candToTrop (relaxCand a b) = Trop.oplus (candToTrop a) (candToTrop b) := by
  cases a with
  | none => rfl
  | some p1 =>
    cases b with
    | none => rfl
    | some p2 =>
      rcases p1 with ⟨v1, cs1⟩
      rcases p2 with ⟨v2, cs2⟩
      simp only [relaxCand, candToTrop, Trop.oplus]
      change candToTrop (if v1 < v2 then some (v2, cs2) else some (v1, cs1)) =
        Trop.finite (if v1 ≤ v2 then v2 else v1)
      by_cases hLt : v1 < v2
      · have hLe : v1 ≤ v2 := by omega
        simp [hLt, hLe, candToTrop]
      · by_cases hLe : v1 ≤ v2
        · have hEq : v1 = v2 := by omega
          subst hEq
          simp [hLt, candToTrop]
        · simp [hLt, hLe, candToTrop]

private theorem candToTrop_extend (prev : DPCandidate) (c : CodonSpec) :
    candToTrop (extendCand prev c) = Trop.otimes (candToTrop prev) (Trop.finite c.score) := by
  cases prev <;> rfl

private theorem relaxCand_eq_some_cases (a b : DPCandidate) (v : Int) (cs : List CodonSpec)
    (h : relaxCand a b = some (v, cs)) :
    a = some (v, cs) ∨ b = some (v, cs) := by
  cases a with
  | none => right; exact h
  | some p1 =>
    cases b with
    | none => left; exact h
    | some p2 =>
      rcases p1 with ⟨v1, cs1⟩
      rcases p2 with ⟨v2, cs2⟩
      simp only [relaxCand] at h
      split at h
      · right; exact h
      · left; exact h

private theorem foldl_relax_ite_some_witness {α : Type} (xs : List α) (p : α -> Bool)
    (f : α -> DPCandidate) (init : DPCandidate) (v : Int) (cs : List CodonSpec)
    (h : xs.foldl (fun acc x => if p x then relaxCand acc (f x) else acc) init = some (v, cs)) :
    init = some (v, cs) ∨ ∃ x ∈ xs, p x = true ∧ f x = some (v, cs) := by
  induction xs generalizing init with
  | nil => left; exact h
  | cons y ys ih =>
    simp only [List.foldl_cons] at h
    by_cases hpy : p y = true
    · simp only [hpy, ↓reduceIte] at h
      rcases ih (relaxCand init (f y)) h with hRel | ⟨x, hx, hpx, hfx⟩
      · rcases relaxCand_eq_some_cases init (f y) v cs hRel with hInit | hFy
        · left; exact hInit
        · right; exact ⟨y, by simp, hpy, hFy⟩
      · right; exact ⟨x, by simp [hx], hpx, hfx⟩
    · simp only [hpy, Bool.false_eq_true, ↓reduceIte] at h
      rcases ih init h with hInit | ⟨x, hx, hpx, hfx⟩
      · left; exact hInit
      · right; exact ⟨x, by simp [hx], hpx, hfx⟩

private theorem candToTrop_foldl_ite {α : Type} (xs : List α) (p : α -> Bool)
    (f : α -> DPCandidate) (fT : α -> Trop Int)
    (hf : ∀ x, candToTrop (f x) = fT x) (init : DPCandidate) :
    candToTrop (xs.foldl (fun acc x => if p x then relaxCand acc (f x) else acc) init) =
    xs.foldl (fun acc x => if p x then Trop.oplus acc (fT x) else acc) (candToTrop init) := by
  induction xs generalizing init with
  | nil => rfl
  | cons y ys ih =>
    simp only [List.foldl_cons]
    by_cases hpy : p y = true
    · simp only [hpy, ↓reduceIte]
      rw [ih (relaxCand init (f y)), candToTrop_relax, hf y]
    · simp only [hpy, Bool.false_eq_true, ↓reduceIte]
      exact ih init

private def dpTrackFold (M : Automaton) (s0 : Nat) (layers : List (List CodonSpec)) :
    Nat × (Nat -> Nat -> DPCandidate) :=
  layers.foldl
    (fun (acc : Nat × (Nat -> Nat -> DPCandidate)) opts =>
      let newMax := acc.1 + layerMaxGC opts
      (newMax, dpTrackStep M newMax opts acc.2))
    (0, dpTrackBase s0)

private theorem dpTrackFold_fst (M : Automaton) (s0 : Nat) (layers : List (List CodonSpec)) :
    (dpTrackFold M s0 layers).1 = totalMaxGC layers := by
  induction layers using list_snoc_rec with
  | nil => simp [dpTrackFold, totalMaxGC]
  | snoc init opts ih =>
    simp only [dpTrackFold, List.foldl_append, List.foldl_cons, List.foldl_nil] at ih ⊢
    rw [ih, totalMaxGC_append]
    simp [totalMaxGC]

private theorem dpTrackEval_nil (M : Automaton) (s0 : Nat) :
    dpTrackEval M s0 [] = dpTrackBase s0 := rfl

private theorem dpTrackEval_snoc (M : Automaton) (s0 : Nat) (init : List (List CodonSpec))
    (opts : List CodonSpec) :
    dpTrackEval M s0 (init ++ [opts]) =
      dpTrackStep M (totalMaxGC (init ++ [opts])) opts (dpTrackEval M s0 init) := by
  have hFst := dpTrackFold_fst M s0 init
  simp only [dpTrackEval, dpTrackFold] at hFst ⊢
  rw [List.foldl_append, List.foldl_cons, List.foldl_nil]
  dsimp only
  rw [hFst, totalMaxGC_append]
  simp [totalMaxGC]

private theorem dpTrackStep_inner_rewrite (M : Automaton) (opts : List CodonSpec)
    (prev : Nat -> Nat -> DPCandidate) (g' s' s : Nat) (acc : DPCandidate) :
    opts.foldl
      (fun acc2 c =>
        if c.gc ≤ g' then
          let res := M.stepCodonSafe s c.seq
          if res.2 && res.1 == s' then
            relaxCand acc2 (extendCand (prev (g' - c.gc) s) c)
          else acc2
        else acc2)
      acc =
    opts.foldl
      (fun acc2 c =>
        if decide (c.gc ≤ g') && (M.stepCodonSafe s c.seq).2 &&
            ((M.stepCodonSafe s c.seq).1 == s') then
          relaxCand acc2 (extendCand (prev (g' - c.gc) s) c)
        else acc2)
      acc := by
  congr 1
  funext acc2 c
  by_cases hgc : c.gc ≤ g'
  · simp [hgc]
  · simp [hgc]

private theorem dpStep_inner_rewrite (M : Automaton) (opts : List CodonSpec)
    (prev : Nat -> Nat -> Trop Int) (g' s' s : Nat) (acc : Trop Int) :
    opts.foldl
      (fun acc2 c =>
        if c.gc ≤ g' then
          let res := M.stepCodonSafe s c.seq
          if res.2 && res.1 == s' then
            Trop.oplus acc2 (Trop.otimes (prev (g' - c.gc) s) (Trop.finite c.score))
          else acc2
        else acc2)
      acc =
    opts.foldl
      (fun acc2 c =>
        if decide (c.gc ≤ g') && (M.stepCodonSafe s c.seq).2 &&
            ((M.stepCodonSafe s c.seq).1 == s') then
          Trop.oplus acc2 (Trop.otimes (prev (g' - c.gc) s) (Trop.finite c.score))
        else acc2)
      acc := by
  congr 1
  funext acc2 c
  by_cases hgc : c.gc ≤ g'
  · simp [hgc]
  · simp [hgc]

private theorem candToTrop_dpTrackEval (M : Automaton) (s0 : Nat)
    (layers : List (List CodonSpec)) (g s : Nat) :
    candToTrop (dpTrackEval M s0 layers g s) = dpEval M s0 layers g s := by
  induction layers using list_snoc_rec generalizing g s with
  | nil =>
    rw [dpTrackEval_nil, dpEval_nil]
    simp only [dpTrackBase, dpBase]
    by_cases hEq : (g == 0 && s == s0) = true <;> simp [hEq, candToTrop, Trop.one, Trop.zero]
  | snoc init opts ih =>
    rw [dpTrackEval_snoc, dpEval_snoc]
    simp only [dpTrackStep, dpStep]
    by_cases hBound : g ≤ totalMaxGC (init ++ [opts]) ∧ s < M.numStates
    · simp only [hBound, and_self, ↓reduceIte]
      have hOuter :
          ∀ st acc,
            candToTrop
              (opts.foldl
                (fun acc2 c =>
                  if c.gc ≤ g then
                    let res := M.stepCodonSafe st c.seq
                    if res.2 && res.1 == s then
                      relaxCand acc2 (extendCand (dpTrackEval M s0 init (g - c.gc) st) c)
                    else acc2
                  else acc2)
                acc) =
            opts.foldl
              (fun acc2 c =>
                if c.gc ≤ g then
                  let res := M.stepCodonSafe st c.seq
                  if res.2 && res.1 == s then
                    Trop.oplus acc2
                      (Trop.otimes (dpEval M s0 init (g - c.gc) st) (Trop.finite c.score))
                  else acc2
                else acc2)
              (candToTrop acc) := by
        intro st acc
        rw [dpTrackStep_inner_rewrite, dpStep_inner_rewrite]
        exact candToTrop_foldl_ite opts
          (fun c => decide (c.gc ≤ g) && (M.stepCodonSafe st c.seq).2 &&
            ((M.stepCodonSafe st c.seq).1 == s))
          (fun c => extendCand (dpTrackEval M s0 init (g - c.gc) st) c)
          (fun c => Trop.otimes (dpEval M s0 init (g - c.gc) st) (Trop.finite c.score))
          (fun c => by rw [candToTrop_extend, ih (g - c.gc) st])
          acc
      have hFold :
          ∀ (xs : List Nat) (acc : DPCandidate),
            candToTrop
              (xs.foldl
                (fun acc1 st =>
                  opts.foldl
                    (fun acc2 c =>
                      if c.gc ≤ g then
                        let res := M.stepCodonSafe st c.seq
                        if res.2 && res.1 == s then
                          relaxCand acc2 (extendCand (dpTrackEval M s0 init (g - c.gc) st) c)
                        else acc2
                      else acc2)
                    acc1)
                acc) =
            xs.foldl
              (fun acc1 st =>
                opts.foldl
                  (fun acc2 c =>
                    if c.gc ≤ g then
                      let res := M.stepCodonSafe st c.seq
                      if res.2 && res.1 == s then
                        Trop.oplus acc2
                          (Trop.otimes (dpEval M s0 init (g - c.gc) st) (Trop.finite c.score))
                      else acc2
                    else acc2)
                  acc1)
              (candToTrop acc) := by
        intro xs acc
        induction xs generalizing acc with
        | nil => rfl
        | cons st sts ihSt =>
          simp only [List.foldl_cons]
          rw [ihSt, hOuter st acc]
      exact hFold (List.range M.numStates) none
    · simp [hBound, candToTrop, Trop.zero]

private theorem dpTrackSoundness (M : Automaton) (s0 : Nat)
    (layers : List (List CodonSpec)) (g s : Nat) (v : Int) (cs : List CodonSpec)
    (h : dpTrackEval M s0 layers g s = some (v, cs)) :
    ValidPath M s0 layers cs ∧
    pathGC cs = g ∧
    M.stepSeq s0 (cs.flatMap (·.seq)) = s ∧
    pathScore cs = v := by
  induction layers using list_snoc_rec generalizing g s v cs with
  | nil =>
    rw [dpTrackEval_nil] at h
    simp only [dpTrackBase] at h
    by_cases hEq : (g == 0 && s == s0) = true
    · simp only [hEq, ↓reduceIte, Option.some.injEq, Prod.mk.injEq] at h
      rcases h with ⟨hv, hcs⟩
      subst hv; subst hcs
      simp only [Bool.and_eq_true, beq_iff_eq] at hEq
      refine ⟨trivial, ?_, ?_, rfl⟩
      · simpa [pathGC] using hEq.1.symm
      · simpa [stepSeq] using hEq.2.symm
    · simp [hEq] at h
  | snoc init opts ih =>
    rw [dpTrackEval_snoc] at h
    simp only [dpTrackStep] at h
    by_cases hBound : g ≤ totalMaxGC (init ++ [opts]) ∧ s < M.numStates
    · simp only [hBound, and_self, ↓reduceIte] at h
      have hStepWitness :
          ∀ (xs : List Nat) (acc : DPCandidate),
            xs.foldl
              (fun acc1 st =>
                opts.foldl
                  (fun acc2 c =>
                    if c.gc ≤ g then
                      let res := M.stepCodonSafe st c.seq
                      if res.2 && res.1 == s then
                        relaxCand acc2 (extendCand (dpTrackEval M s0 init (g - c.gc) st) c)
                      else acc2
                    else acc2)
                  acc1)
              acc = some (v, cs) ->
            acc = some (v, cs) ∨
            ∃ st ∈ xs, ∃ c ∈ opts,
              (decide (c.gc ≤ g) && (M.stepCodonSafe st c.seq).2 &&
                ((M.stepCodonSafe st c.seq).1 == s)) = true ∧
              extendCand (dpTrackEval M s0 init (g - c.gc) st) c = some (v, cs) := by
        intro xs acc hFold
        induction xs generalizing acc with
        | nil => left; exact hFold
        | cons st sts ihSt =>
          simp only [List.foldl_cons] at hFold
          rcases ihSt _ hFold with hInner | ⟨st', hst', c, hc, hCond, hExt⟩
          · rw [dpTrackStep_inner_rewrite] at hInner
            rcases foldl_relax_ite_some_witness opts
              (fun c => decide (c.gc ≤ g) && (M.stepCodonSafe st c.seq).2 &&
                ((M.stepCodonSafe st c.seq).1 == s))
              (fun c => extendCand (dpTrackEval M s0 init (g - c.gc) st) c)
              acc v cs hInner with hAcc | ⟨c, hc, hCond, hExt⟩
            · left; exact hAcc
            · right; exact ⟨st, by simp, c, hc, hCond, hExt⟩
          · right; exact ⟨st', by simp [hst'], c, hc, hCond, hExt⟩
      rcases hStepWitness (List.range M.numStates) none h with hNone | ⟨st, _, c, hcOpts, hCond, hExt⟩
      · cases hNone
      · simp only [Bool.and_eq_true, decide_eq_true_eq, beq_iff_eq] at hCond
        rcases hCond with ⟨⟨hgc, hSafe⟩, hNext⟩
        cases hPrev : dpTrackEval M s0 init (g - c.gc) st with
        | none =>
          rw [hPrev] at hExt
          cases hExt
        | some pPrev =>
          rcases pPrev with ⟨vPrev, pre⟩
          rw [hPrev] at hExt
          simp only [extendCand, Option.some.injEq, Prod.mk.injEq] at hExt
          rcases hExt with ⟨hvEq, hcsEq⟩
          subst hcsEq
          obtain ⟨hPreVal, hPreGC, hPreSeq, hPreScore⟩ := ih (g - c.gc) st vPrev pre hPrev
          have hSafeAt :
              (M.stepCodonSafe (M.stepSeq s0 (pre.flatMap (·.seq))) c.seq).2 = true := by
            rw [hPreSeq]; exact hSafe
          have hSeqSound : M.stepSeq st c.seq = s := by
            have hPair : M.stepCodonSafe st c.seq = (s, true) := by
              cases hp : M.stepCodonSafe st c.seq with
              | mk sn ok =>
                rw [hp] at hSafe hNext
                simp only at hSafe hNext
                subst hSafe; subst hNext; rfl
            exact (stepCodonSafeSound M st c.seq s hPair).1
          refine ⟨?_, ?_, ?_, ?_⟩
          · exact (validPath_snoc M s0 init opts (pre ++ [c])).mpr
              ⟨pre, c, rfl, hPreVal, hcOpts, hSafeAt⟩
          · rw [pathGC_append, hPreGC]
            simp [pathGC]
            omega
          · rw [List.flatMap_append, stepSeqAppend, hPreSeq]
            simpa [List.flatMap_cons, List.flatMap_nil] using hSeqSound
          · rw [pathScore_append, hPreScore, ← hvEq]
            simp [pathScore]
    · simp [hBound] at h

private theorem validPath_safeCodonList (M : Automaton) (s0 : Nat)
    (layers : List (List CodonSpec)) (cs : List CodonSpec)
    (h : ValidPath M s0 layers cs) :
    M.safeCodonList s0 (cs.map (·.seq)) = true := by
  induction layers generalizing s0 cs with
  | nil =>
    cases cs with
    | nil => rfl
    | cons _ _ => simp [ValidPath] at h
  | cons opts rest ih =>
    cases cs with
    | nil => simp [ValidPath] at h
    | cons c tailCs =>
      simp only [ValidPath] at h
      rcases h with ⟨_, hSafe, hRest⟩
      simp only [List.map_cons, safeCodonList]
      cases hp : M.stepCodonSafe s0 c.seq with
      | mk sn ok =>
        rw [hp] at hSafe hRest
        dsimp only at hSafe
        subst hSafe
        simp only [↓reduceIte]
        exact ih sn tailCs hRest

private theorem map_seq_flatten_eq_flatMap (cs : List CodonSpec) :
    (cs.map (·.seq)).flatten = cs.flatMap (·.seq) := by
  induction cs with
  | nil => rfl
  | cons c rest ih =>
    simp [List.map_cons, List.flatten_cons, List.flatMap_cons, ih]

/-- Proof of Constructive End-to-End DP Optimality, Protein Preservation & Full-Construct Safety. -/
theorem dpOptimizeEndToEnd : Prop_DPOptimizeEndToEnd := by
  intro M leftFlank minGC maxGC tail protein layers hMenu
  dsimp only
  let s0 := M.stepSeq M.initState leftFlank
  have hs0 : s0 < M.numStates := stepSeq_lt M M.initState M.init_lt leftFlank
  have hTropAgree :
      M.safeSeq M.initState leftFlank = true ->
      candToTrop (dpOptimize M leftFlank minGC maxGC tail layers) =
        dpBestScore M s0 minGC maxGC tail layers := by
    intro hLeft
    simp only [dpOptimize, hLeft, ↓reduceIte, dpBestScore]
    have hInner :
        ∀ g acc,
          candToTrop
            (if minGC ≤ g && g ≤ maxGC then
              (List.range M.numStates).foldl
                (fun acc2 s =>
                  if M.safeSeq s tail then relaxCand acc2 (dpTrackEval M s0 layers g s) else acc2)
                acc
            else acc) =
          (if minGC ≤ g && g ≤ maxGC then
            (List.range M.numStates).foldl
              (fun acc2 s =>
                if M.safeSeq s tail then Trop.oplus acc2 (dpEval M s0 layers g s) else acc2)
              (candToTrop acc)
          else candToTrop acc) := by
      intro g acc
      by_cases hBand : (decide (minGC ≤ g) && decide (g ≤ maxGC)) = true
      · simp only [hBand, ↓reduceIte]
        exact candToTrop_foldl_ite (List.range M.numStates)
          (fun s => M.safeSeq s tail)
          (fun s => dpTrackEval M s0 layers g s)
          (fun s => dpEval M s0 layers g s)
          (fun s => candToTrop_dpTrackEval M s0 layers g s)
          acc
      · simp [hBand]
    have hOuter :
        ∀ (gs : List Nat) (acc : DPCandidate),
          candToTrop
            (gs.foldl
              (fun acc1 g =>
                if minGC ≤ g && g ≤ maxGC then
                  (List.range M.numStates).foldl
                    (fun acc2 s =>
                      if M.safeSeq s tail then relaxCand acc2 (dpTrackEval M s0 layers g s) else acc2)
                    acc1
                else acc1)
              acc) =
          gs.foldl
            (fun acc1 g =>
              if minGC ≤ g && g ≤ maxGC then
                (List.range M.numStates).foldl
                  (fun acc2 s =>
                    if M.safeSeq s tail then Trop.oplus acc2 (dpEval M s0 layers g s) else acc2)
                  acc1
              else acc1)
            (candToTrop acc) := by
      intro gs acc
      induction gs generalizing acc with
      | nil => rfl
      | cons g gsTail ihG =>
        simp only [List.foldl_cons]
        rw [ihG, hInner g acc]
    exact hOuter (List.range (totalMaxGC layers + 1)) none
  refine ⟨hTropAgree, ?_, ?_⟩
  · constructor
    · intro hNone
      by_cases hLeft : M.safeSeq M.initState leftFlank = true
      · right
        intro cs hFeas
        have hEq := hTropAgree hLeft
        rw [hNone] at hEq
        simp only [candToTrop] at hEq
        have hUpper := (exactGlobalOptimality M s0 hs0 minGC maxGC tail layers).1 cs hFeas
        rw [← hEq] at hUpper
        cases hUpper
      · left
        cases hB : M.safeSeq M.initState leftFlank
        · rfl
        · exact False.elim (hLeft hB)
    · intro hDisj
      rcases hDisj with hLeftFalse | hNoFeas
      · simp [dpOptimize, hLeftFalse]
      · by_cases hLeft : M.safeSeq M.initState leftFlank = true
        · cases hOpt : dpOptimize M leftFlank minGC maxGC tail layers with
          | none => rfl
          | some p =>
            rcases p with ⟨v, cs⟩
            have hEq := hTropAgree hLeft
            rw [hOpt] at hEq
            simp only [candToTrop] at hEq
            obtain ⟨csW, hFeasW, _⟩ :=
              (exactGlobalOptimality M s0 hs0 minGC maxGC tail layers).2 v hEq.symm
            exact False.elim (hNoFeas csW hFeasW)
        · simp [dpOptimize, hLeft]
  · intro v cs hSome
    by_cases hLeft : M.safeSeq M.initState leftFlank = true
    · have hBestEq : dpBestScore M s0 minGC maxGC tail layers = Trop.finite v := by
        have hEq := hTropAgree hLeft
        rw [hSome] at hEq
        exact hEq.symm
      simp only [dpOptimize, hLeft, ↓reduceIte] at hSome
      have hFinalWitness :
          ∀ (gs : List Nat) (acc : DPCandidate),
            gs.foldl
              (fun acc1 g =>
                if minGC ≤ g && g ≤ maxGC then
                  (List.range M.numStates).foldl
                    (fun acc2 s =>
                      if M.safeSeq s tail then relaxCand acc2 (dpTrackEval M s0 layers g s) else acc2)
                    acc1
                else acc1)
              acc = some (v, cs) ->
            acc = some (v, cs) ∨
            ∃ g ∈ gs, (decide (minGC ≤ g) && decide (g ≤ maxGC)) = true ∧
              ∃ s ∈ List.range M.numStates, M.safeSeq s tail = true ∧
                dpTrackEval M s0 layers g s = some (v, cs) := by
        intro gs acc hFold
        induction gs generalizing acc with
        | nil => left; exact hFold
        | cons g gsTail ihG =>
          simp only [List.foldl_cons] at hFold
          by_cases hBand : (decide (minGC ≤ g) && decide (g ≤ maxGC)) = true
          · simp only [hBand, ↓reduceIte] at hFold
            rcases ihG _ hFold with hIn | ⟨g', hg', hB', s, hs, hT, hEval⟩
            · rcases foldl_relax_ite_some_witness (List.range M.numStates)
                (fun s => M.safeSeq s tail)
                (fun s => dpTrackEval M s0 layers g s)
                acc v cs hIn with hAcc | ⟨s, hs, hT, hEval⟩
              · left; exact hAcc
              · right; exact ⟨g, by simp, hBand, s, hs, hT, hEval⟩
            · right; exact ⟨g', by simp [hg'], hB', s, hs, hT, hEval⟩
          · simp only [hBand, Bool.false_eq_true, ↓reduceIte] at hFold
            rcases ihG acc hFold with hAcc | ⟨g', hg', hB', s, hs, hT, hEval⟩
            · left; exact hAcc
            · right; exact ⟨g', by simp [hg'], hB', s, hs, hT, hEval⟩
      rcases hFinalWitness (List.range (totalMaxGC layers + 1)) none hSome with
        hNone | ⟨g, _, hBand, s, _, hTailSafe, hEval⟩
      · cases hNone
      · simp only [Bool.and_eq_true, decide_eq_true_eq] at hBand
        rcases hBand with ⟨hMinG, hMaxG⟩
        obtain ⟨hVal, hGCEq, hSeqEq, hScoreEq⟩ := dpTrackSoundness M s0 layers g s v cs hEval
        have hFeas : FeasibleCDS M s0 minGC maxGC tail layers cs := by
          refine ⟨hVal, ?_, ?_, ?_⟩
          · rw [hSeqEq]; exact hTailSafe
          · rw [hGCEq]; exact hMinG
          · rw [hGCEq]; exact hMaxG
        obtain ⟨hLen, hNucGC, hTrans⟩ := proteinPreservationAndGC M s0 protein layers cs hMenu hVal
        have hFullSafe :
            M.safeSeq M.initState (leftFlank ++ cs.flatMap (·.seq) ++ tail) = true := by
          have hCodonsSafe := validPath_safeCodonList M s0 layers cs hVal
          have hTailAtEnd :
              M.safeSeq (M.stepSeq s0 ((cs.map (·.seq)).flatten)) tail = true := by
            rw [map_seq_flatten_eq_flatMap, hSeqEq]
            exact hTailSafe
          have hFull := fullConstructSafe M leftFlank tail (cs.map (·.seq))
            hLeft hCodonsSafe hTailAtEnd
          rwa [map_seq_flatten_eq_flatMap] at hFull
        refine ⟨hFeas, hScoreEq, hLen, hTrans, ?_, ?_, hFullSafe, ?_⟩
        · rw [← hNucGC, hGCEq]; exact hMinG
        · rw [← hNucGC, hGCEq]; exact hMaxG
        · intro cs' hFeas'
          have hLe := (exactGlobalOptimality M s0 hs0 minGC maxGC tail layers).1 cs' hFeas'
          rw [hBestEq] at hLe
          exact hLe
    · simp [dpOptimize, hLeft] at hSome

/-- Proof of synonymous GC envelope bounds and suffix pruning admissibility. -/
theorem gcEnvelopeAndPruningAdmissible : Prop_GCEnvelopeAndPruningAdmissible := by
  intro M s0 prefixLayers suffixLayers pre suf _hPre hSuf
  have hB := validPath_gc_bounds M (M.stepSeq s0 (pre.flatMap (·.seq))) suffixLayers suf hSuf
  refine ⟨hB.1, hB.2, ?_⟩
  intro minGC maxGC hMin hMax
  rw [pathGC_append] at hMin hMax
  omega

/-- Proof of unsatisfiability certificate outside the synonymous GC envelope. -/
theorem synonymousEnvelopeUnsat : Prop_SynonymousEnvelopeUnsat := by
  intro M s0 minGC maxGC tail layers hOut cs hFeas
  rcases hFeas with ⟨hVal, _, hMin, hMax⟩
  have hB := validPath_gc_bounds M s0 layers cs hVal
  omega

/-- Corollary: any feasible path whose score upper-bounds all feasible paths equals `dpBestScore`. -/
theorem exactOpt_witness_eq (M : Automaton) (s0 : Nat) (hs0 : s0 < M.numStates)
    (minGC maxGC : Nat) (tail : List Base) (layers : List (List CodonSpec))
    (cs : List CodonSpec) (hFeas : FeasibleCDS M s0 minGC maxGC tail layers cs)
    (hMax : ∀ xs, FeasibleCDS M s0 minGC maxGC tail layers xs -> pathScore xs ≤ pathScore cs) :
    dpBestScore M s0 minGC maxGC tail layers = Trop.finite (pathScore cs) := by
  obtain ⟨hLowerAll, hAch⟩ := exactGlobalOptimality M s0 hs0 minGC maxGC tail layers
  have hLower := hLowerAll cs hFeas
  cases hBest : dpBestScore M s0 minGC maxGC tail layers with
  | negInf =>
    rw [hBest] at hLower
    cases hLower
  | finite v =>
    rw [hBest] at hLower
    obtain ⟨csBest, hFeasBest, hScoreBest⟩ := hAch v hBest
    have hUp := hMax csBest hFeasBest
    have hvLo : pathScore cs ≤ v := hLower
    have hvEq : v = pathScore cs := by omega
    rw [hvEq]

end FactorForgeFormal.Proofs
