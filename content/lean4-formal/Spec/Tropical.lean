/-!
Locked Specification: Tropical Max-Plus Semiring (`dp_v2_4.py`: `TropicalSemiring`).

Models `(alpha union {-inf}, oplus = max, otimes = +)` over any linearly ordered
additive group/monoid, with zero element `negInf` and multiplicative identity `0`.
-/

namespace FactorForgeFormal.Spec

/-- Tropical max-plus carrier `alpha union {-infinity}`. -/
inductive Trop (alpha : Type u) where
  | negInf : Trop alpha
  | finite : alpha -> Trop alpha
  deriving DecidableEq, Repr

namespace Trop

/-- Tropical additive zero (`-infinity`). -/
def zero {alpha : Type u} : Trop alpha :=
  Trop.negInf

/-- Tropical multiplicative identity (`0`). -/
def one {alpha : Type u} [Zero alpha] : Trop alpha :=
  Trop.finite 0

/-- Tropical addition: `a oplus b = max a b` (with `negInf` bottom). -/
def oplus {alpha : Type u} [Max alpha] : Trop alpha -> Trop alpha -> Trop alpha
  | Trop.negInf, b => b
  | a, Trop.negInf => a
  | Trop.finite a, Trop.finite b => Trop.finite (max a b)

/-- Tropical multiplication: `a otimes b = a + b` (with `negInf` absorbing). -/
def otimes {alpha : Type u} [Add alpha] : Trop alpha -> Trop alpha -> Trop alpha
  | Trop.negInf, _ => Trop.negInf
  | _, Trop.negInf => Trop.negInf
  | Trop.finite a, Trop.finite b => Trop.finite (a + b)

/-- Tropical order relation (`negInf <= everything`, `finite a <= finite b <-> a <= b`). -/
def le {alpha : Type u} [LE alpha] : Trop alpha -> Trop alpha -> Prop
  | Trop.negInf, _ => True
  | Trop.finite _, Trop.negInf => False
  | Trop.finite a, Trop.finite b => a <= b

instance {alpha : Type u} [LE alpha] : LE (Trop alpha) := ⟨Trop.le⟩

/-- Computable decision procedure for `Trop.le` when base order is decidable. -/
def ble {alpha : Type u} [LE alpha] [DecidableRel (α := alpha) (· ≤ ·)] :
    Trop alpha -> Trop alpha -> Bool
  | Trop.negInf, _ => true
  | Trop.finite _, Trop.negInf => false
  | Trop.finite a, Trop.finite b => decide (a <= b)

/-- Algebraic semiring laws required of `Trop Int`. -/
def Prop_TropIntSemiringLaws : Prop :=
  (∀ a b c : Trop Int, oplus (oplus a b) c = oplus a (oplus b c)) ∧
  (∀ a b : Trop Int, oplus a b = oplus b a) ∧
  (∀ a : Trop Int, oplus a a = a) ∧
  (∀ a : Trop Int, oplus zero a = a) ∧
  (∀ a : Trop Int, oplus a zero = a) ∧
  (∀ a b c : Trop Int, otimes (otimes a b) c = otimes a (otimes b c)) ∧
  (∀ a : Trop Int, otimes one a = a) ∧
  (∀ a : Trop Int, otimes a one = a) ∧
  (∀ a : Trop Int, otimes zero a = zero) ∧
  (∀ a : Trop Int, otimes a zero = zero) ∧
  (∀ a b c : Trop Int, otimes a (oplus b c) = oplus (otimes a b) (otimes a c)) ∧
  (∀ a b c : Trop Int, otimes (oplus a b) c = oplus (otimes a c) (otimes b c))

/-- Order-preservation & max-upper-bound laws required of `Trop Int`. -/
def Prop_TropIntOrderLaws : Prop :=
  (∀ a : Trop Int, a ≤ a) ∧
  (∀ a b c : Trop Int, a ≤ b -> b ≤ c -> a ≤ c) ∧
  (∀ a b : Trop Int, a ≤ b -> b ≤ a -> a = b) ∧
  (∀ a b : Trop Int, a ≤ oplus a b) ∧
  (∀ a b : Trop Int, b ≤ oplus a b) ∧
  (∀ a b c : Trop Int, a ≤ c -> b ≤ c -> oplus a b ≤ c) ∧
  (∀ a b c : Trop Int, a ≤ b -> otimes a c ≤ otimes b c) ∧
  (∀ a b c : Trop Int, a ≤ b -> otimes c a ≤ otimes c b)

end Trop

end FactorForgeFormal.Spec
