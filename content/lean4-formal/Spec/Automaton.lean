/-!
Locked Specification: Construct-Level Finite-State Automaton Safety
(`sllm/automaton.py`: `CompiledAutomaton`, `dp_v2.py`, `dp_v2_4.py`).

Models nucleotide transitions `stepSym`, multi-symbol runs `stepSeq`,
forbidden-state avoidance `safeSeq` over all nonempty prefixes, and
codon-level `stepCodonSafe` matching `CompiledAutomaton.step_codon`.
-/

namespace FactorForgeFormal.Spec

/-- DNA nucleobase alphabet `{A, C, G, T}`. -/
inductive Base where
  | A | C | G | T
  deriving DecidableEq, Repr, Ord

namespace Base

/-- GC indicator (`1` for `G` or `C`, `0` for `A` or `T`). -/
def gcCount : Base -> Nat
  | G => 1
  | C => 1
  | A => 0
  | T => 0

end Base

/-- Deterministic finite-state automaton over `Nat` state IDs and `Base` symbols. -/
structure Automaton where
  numStates : Nat
  initState : Nat
  stepSym : Nat -> Base -> Nat
  isTerminal : Nat -> Bool
  init_lt : initState < numStates
  step_lt : ∀ s b, s < numStates -> stepSym s b < numStates

namespace Automaton

/-- Fold `stepSym` left over a nucleotide sequence. -/
def stepSeq (M : Automaton) (s : Nat) : List Base -> Nat
  | [] => s
  | b :: bs => stepSeq M (M.stepSym s b) bs

/-- True iff no transition along `xs` from `s` visits a terminal (forbidden) state. -/
def safeSeq (M : Automaton) (s : Nat) : List Base -> Bool
  | [] => true
  | b :: bs =>
    let s' := M.stepSym s b
    if M.isTerminal s' then false else safeSeq M s' bs

/-- Codon-level step matching `CompiledAutomaton.step_codon` (`sllm/automaton.py:30-40`). -/
def stepCodonSafe (M : Automaton) (s : Nat) (codon : List Base) : Nat × Bool :=
  match codon with
  | [] => (s, true)
  | b :: bs =>
    let s' := M.stepSym s b
    if M.isTerminal s' then (s', false) else stepCodonSafe M s' bs

/-- Check whether every codon in `codons` executes safely in sequence from `s`. -/
def safeCodonList (M : Automaton) (s : Nat) : List (List Base) -> Bool
  | [] => true
  | c :: cs =>
    let (s', ok) := stepCodonSafe M s c
    if ok then safeCodonList M s' cs else false

/-- `stepSeq` decomposes cleanly over list append (`++`). -/
def Prop_StepSeqAppend : Prop :=
  ∀ (M : Automaton) (s : Nat) (xs ys : List Base),
    M.stepSeq s (xs ++ ys) = M.stepSeq (M.stepSeq s xs) ys

/-- `safeSeq` over concatenated sequences splits across the intermediate state. -/
def Prop_SafeSeqAppend : Prop :=
  ∀ (M : Automaton) (s : Nat) (xs ys : List Base),
    M.safeSeq s (xs ++ ys) = (M.safeSeq s xs && M.safeSeq (M.stepSeq s xs) ys)

/-- `stepCodonSafe` agrees identically with `(stepSeq, safeSeq)` whenever safe. -/
def Prop_StepCodonSafeSound : Prop :=
  ∀ (M : Automaton) (s : Nat) (c : List Base) (s' : Nat),
    M.stepCodonSafe s c = (s', true) ->
    M.stepSeq s c = s' ∧ M.safeSeq s c = true

/-- `safeSeq` implies `stepCodonSafe` succeeds with `(stepSeq, true)`. -/
def Prop_StepCodonSafeComplete : Prop :=
  ∀ (M : Automaton) (s : Nat) (c : List Base),
    M.safeSeq s c = true ->
    M.stepCodonSafe s c = (M.stepSeq s c, true)

/-- Construct-level invariant: safe left flank + safe codons + safe tail yields safe full DNA. -/
def Prop_FullConstructSafe : Prop :=
  ∀ (M : Automaton) (leftFlank tail : List Base) (cds : List (List Base)),
    let s0 := M.stepSeq M.initState leftFlank
    let sEnd := M.stepSeq s0 cds.flatten
    M.safeSeq M.initState leftFlank = true ->
    M.safeCodonList s0 cds = true ->
    M.safeSeq sEnd tail = true ->
    M.safeSeq M.initState (leftFlank ++ cds.flatten ++ tail) = true

end Automaton

end FactorForgeFormal.Spec
