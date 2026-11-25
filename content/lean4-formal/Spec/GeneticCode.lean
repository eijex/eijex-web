import FactorForgeFormal.Spec.Automaton

/-!
Locked Specification: Standard Genetic Code (64 Triplets) and Protein Translation
(`factorforge/analysis/metrics.py`: `STANDARD_GENETIC_CODE`, `STOP_CODONS`, `translate_dna`).

Encodes all 20 canonical amino acids, stop-codon classification, exact 3-base codon
translation `translateCodonSeq`, and sense-CDS translation `translateDNA`.
-/

namespace FactorForgeFormal.Spec

/-- The 20 canonical proteinogenic amino acids (`STANDARD_GENETIC_CODE`). -/
inductive AminoAcid where
  | A | C | D | E | F | G | H | I | K | L
  | M | N | P | Q | R | S | T | V | W | Y
  deriving DecidableEq, Repr, Ord

/-- Translation outcome of a 3-nucleotide codon: either a sense amino acid or a stop signal. -/
inductive TranslationResult where
  | aa (res : AminoAcid)
  | stop
  deriving DecidableEq, Repr

/-- Exact 64-triplet Standard Genetic Code matching `metrics.py:STANDARD_GENETIC_CODE`. -/
def translateTriplet (b1 b2 b3 : Base) : TranslationResult :=
  match b1, b2, b3 with
  -- T-row
  | .T, .T, .T => .aa .F | .T, .T, .C => .aa .F | .T, .T, .A => .aa .L | .T, .T, .G => .aa .L
  | .T, .C, .T => .aa .S | .T, .C, .C => .aa .S | .T, .C, .A => .aa .S | .T, .C, .G => .aa .S
  | .T, .A, .T => .aa .Y | .T, .A, .C => .aa .Y | .T, .A, .A => .stop  | .T, .A, .G => .stop
  | .T, .G, .T => .aa .C | .T, .G, .C => .aa .C | .T, .G, .A => .stop  | .T, .G, .G => .aa .W
  -- C-row
  | .C, .T, .T => .aa .L | .C, .T, .C => .aa .L | .C, .T, .A => .aa .L | .C, .T, .G => .aa .L
  | .C, .C, .T => .aa .P | .C, .C, .C => .aa .P | .C, .C, .A => .aa .P | .C, .C, .G => .aa .P
  | .C, .A, .T => .aa .H | .C, .A, .C => .aa .H | .C, .A, .A => .aa .Q | .C, .A, .G => .aa .Q
  | .C, .G, .T => .aa .R | .C, .G, .C => .aa .R | .C, .G, .A => .aa .R | .C, .G, .G => .aa .R
  -- A-row
  | .A, .T, .T => .aa .I | .A, .T, .C => .aa .I | .A, .T, .A => .aa .I | .A, .T, .G => .aa .M
  | .A, .C, .T => .aa .T | .A, .C, .C => .aa .T | .A, .C, .A => .aa .T | .A, .C, .G => .aa .T
  | .A, .A, .T => .aa .N | .A, .A, .C => .aa .N | .A, .A, .A => .aa .K | .A, .A, .G => .aa .K
  | .A, .G, .T => .aa .S | .A, .G, .C => .aa .S | .A, .G, .A => .aa .R | .A, .G, .G => .aa .R
  -- G-row
  | .G, .T, .T => .aa .V | .G, .T, .C => .aa .V | .G, .T, .A => .aa .V | .G, .T, .G => .aa .V
  | .G, .C, .T => .aa .A | .G, .C, .C => .aa .A | .G, .C, .A => .aa .A | .G, .C, .G => .aa .A
  | .G, .A, .T => .aa .D | .G, .A, .C => .aa .D | .G, .A, .A => .aa .E | .G, .A, .G => .aa .E
  | .G, .G, .T => .aa .G | .G, .G, .C => .aa .G | .G, .G, .A => .aa .G | .G, .G, .G => .aa .G

/-- Translate a nucleotide list iff it has exact length 3. -/
def translateCodonSeq : List Base -> Option TranslationResult
  | [b1, b2, b3] => some (translateTriplet b1 b2 b3)
  | _ => none

/-- Translate a coding DNA sequence into sense amino acids; rejects frame errors and stop codons. -/
def translateDNA : List Base -> Option (List AminoAcid)
  | [] => some []
  | b1 :: b2 :: b3 :: rest =>
    match translateTriplet b1 b2 b3, translateDNA rest with
    | .aa a, some aas => some (a :: aas)
    | _, _ => none
  | _ => none

/-- Enumeration of the 4 DNA nucleobases. -/
def allBases : List Base := [.A, .C, .G, .T]

/-- Enumeration of all 64 DNA triplets in `Base × Base × Base`. -/
def allTriplets : List (Base × Base × Base) :=
  allBases.flatMap (fun b1 =>
    allBases.flatMap (fun b2 =>
      allBases.map (fun b3 => (b1, b2, b3))))

/-- True iff `translateTriplet b1 b2 b3` is a sense amino acid (not `.stop`). -/
def isSenseTriplet (t : Base × Base × Base) : Bool :=
  match translateTriplet t.1 t.2.1 t.2.2 with
  | .aa _ => true
  | .stop => false

/-- Partition law of the Standard Genetic Code: 64 triplets = 61 sense codons + 3 stop codons. -/
def Prop_GeneticCodePartition64 : Prop :=
  allTriplets.length = 64 ∧
  (allTriplets.filter isSenseTriplet).length = 61 ∧
  (allTriplets.filter (fun t => !isSenseTriplet t)).length = 3

end FactorForgeFormal.Spec
