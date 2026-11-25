import FactorForgeFormal.Spec
import FactorForgeFormal.Proofs.Tropical
import FactorForgeFormal.Proofs.Automaton
import FactorForgeFormal.Proofs.GeneticCode
import FactorForgeFormal.Proofs.ExactDP
import FactorForgeFormal.Proofs.KineticAndParity
import FactorForgeFormal.Witnesses

/-!
Axiom Transparency Audit (`#print axioms`) across all proved theorems and witnesses.
Every theorem must depend solely on standard Lean axioms (`propext`, `Classical.choice`,
`Quot.sound`) or none at all — zero `sorryAx` and zero custom `axiom`s.
-/

#print axioms FactorForgeFormal.Proofs.tropIntSemiringLaws
#print axioms FactorForgeFormal.Proofs.tropIntOrderLaws
#print axioms FactorForgeFormal.Proofs.stepSeqAppend
#print axioms FactorForgeFormal.Proofs.safeSeqAppend
#print axioms FactorForgeFormal.Proofs.stepCodonSafeSound
#print axioms FactorForgeFormal.Proofs.stepCodonSafeComplete
#print axioms FactorForgeFormal.Proofs.fullConstructSafe
#print axioms FactorForgeFormal.Proofs.geneticCodePartition64
#print axioms FactorForgeFormal.Proofs.gcConservation
#print axioms FactorForgeFormal.Proofs.proteinPreservationAndGC
#print axioms FactorForgeFormal.Proofs.dpSoundness
#print axioms FactorForgeFormal.Proofs.dpCompleteness
#print axioms FactorForgeFormal.Proofs.exactGlobalOptimality
#print axioms FactorForgeFormal.Proofs.dpOptimizeEndToEnd
#print axioms FactorForgeFormal.Proofs.gcEnvelopeAndPruningAdmissible
#print axioms FactorForgeFormal.Proofs.synonymousEnvelopeUnsat
#print axioms FactorForgeFormal.Proofs.tasepRampBoundsAndMonotonicity
#print axioms FactorForgeFormal.Proofs.zeroWeightParity
#print axioms FactorForgeFormal.Proofs.pathLexTotalOrder
#print axioms FactorForgeFormal.Proofs.approxScoreExactness
#print axioms FactorForgeFormal.Witnesses.witness_malformed_codon_rejected
#print axioms FactorForgeFormal.Witnesses.witness_sl_wellFormedMenu
#print axioms FactorForgeFormal.Witnesses.witness_leftFlank_safe
#print axioms FactorForgeFormal.Witnesses.witness_sl_feasible
#print axioms FactorForgeFormal.Witnesses.witness_dpBest_sl_exact
#print axioms FactorForgeFormal.Witnesses.witness_dpOptimize_sl_end_to_end
#print axioms FactorForgeFormal.Witnesses.witness_tct_rejected
#print axioms FactorForgeFormal.Witnesses.witness_gc_and_protein_preservation
#print axioms FactorForgeFormal.Witnesses.witness_gc_pruning_admissible
#print axioms FactorForgeFormal.Witnesses.witness_tasep_ramp
#print axioms FactorForgeFormal.Witnesses.witness_zero_weight_parity
#print axioms FactorForgeFormal.Witnesses.witness_path_lex_order
#print axioms FactorForgeFormal.Witnesses.witness_approx_margin_exactness
#print axioms FactorForgeFormal.Witnesses.witness_unsat_gc
