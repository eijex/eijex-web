---
lang: "de"
langLabel: "Deutsch"
title: "Formale Verifikation des diskreten dynamischen Programmierungsmodells von FactorForge in Lean 4"
summary: "Mathematischer Blueprint, gesperrte Lean-4.36.0-Spezifikationen, induktive Beweisskizzen, konstruktiver 12-Zustands-BsaI-Trace und stichprobenartige Python-Korrespondenz für den diskreten ganzzahligen DP-Kern von FactorForge."
version: "Technische Monographie v1.0.3 · Lean 4.36.0"
evidenceScope: "Eigenständige Lean-4.36.0-Beweise und endliche Python-Korrespondenztests; kein vollständiger Python-Verfeinerungsbeweis und keine biologische Validierung"
abstract: "Constraint-bewusstes Codon-Sequenzdesign (CDS) wählt synonyme Codons, die eine Zielproteinsequenz bewahren, verbotene Motive über Flanken und Codon-Übergänge hinweg vermeiden, globale Nukleotid-GC-Schranken einhalten und ein additives Codon-Anpassungsziel maximieren. Endliche Unit-Tests prüfen nur Stichproben, während informelle oder unbeschränkte KI-generierte Beweise ohne unabhängigen Beweiskern zu stiller Spezifikationsabschwächung neigen. Wir präsentieren den vollständigen mathematischen Blueprint von FactorForgeFormal, einer abhängigkeitsfreien Lean-4.36.0-Formalisierung (14 Module, >2.500 Zeilen, 0 sorry, transitiv durch leanchecker geprüft), die 20 Kerntheoreme, 3 Hilfslemmata und 14 konkrete Zeugen- und Widerlegungstheoreme beweist: tropische Max-Plus-Algebra, konstruktweite DFA-Sicherheit, den 64-Triplett-Standard-Gencode (ValidCodonForAA), konstruktive Backtracking-DP-Optimalität (dpOptimizeEndToEnd), exakte rationale Pausenrampen-Interpolation (ExactRat) sowie bedingte ganzzahlige Störungsschranken - begleitet von einer fail-closed Python-Korrespondenz- und 8/8-Mutations-Testsuite."
pdfLabel: "Vollständige Technische Monographie v1.0.3 herunterladen (PDF, 14 S.)"
bundleLabel: "Reproduzierbares Lean-4- + Orakel-Archiv herunterladen (.zip)"
toc:
  - id: "sec-1"
    number: "1"
    title: "Verifikationsarchitektur & rollengetrenntes Vertrauen"
  - id: "sec-2"
    number: "2"
    title: "Tropische Max-Plus-Algebra (Spec/Tropical.lean)"
  - id: "sec-3"
    number: "3"
    title: "Konstruktweite DFA-Sicherheit (Spec/Automaton.lean)"
  - id: "sec-4"
    number: "4"
    title: "64-Triplett-Gencode & Menü-Wohlgeformtheit"
  - id: "sec-5"
    number: "5"
    title: "Bellman-Optimalität & konstruktives dpOptimize"
  - id: "sec-6"
    number: "6"
    title: "Exakte rationale Kinetik, Tie-Orders & Schranken"
  - id: "sec-7"
    number: "7"
    title: "12-Zustands-BsaI-Automat & Widerlegungs-Trace"
  - id: "sec-8"
    number: "8"
    title: "Theorem-, Zeugen-, Mutanten- & F1-F28-Kataloge"
  - id: "sec-9"
    number: "9"
    title: "Exakte Beweisgrenzen & Reproduktionsprotokoll"
---

## 1. Verifikationsarchitektur und rollengetrenntes Vertrauen

Die Prüfung eines auf dynamischer Programmierung (DP) basierenden CDS-Compilers allein durch endliche Unit-Tests bestätigt Ein-Ausgabe-Parität auf gewählten Beispielen, zertifiziert jedoch keine universellen Invarianten für beliebige Proteinlängen $L$, enge ganzzahlige GC-Intervalle $[g_{\min}, g_{\max}]$ oder Motivbrücken über $5'$-Flanken, codierende Tripletts und $3'$-Terminatoren hinweg. Umgekehrt birgt das Delegieren von Spezifikation und Beweisführung an einen einzigen unbeschränkten Workflow zwei bekannte Fehlermodi:

1. **Spezifikationsabschwächung und Leerheit (Vacuity):** Eine Formalisierung kann die synonyme Translationsinvarianz ($\mathrm{Translate}(D) = P$) auslassen, ungeprüften Metadaten vertrauen (etwa einem Eintrag `AAA` mit `gc = 3` oder einem Stoppcodon `TAA` im Sense-Menü) oder All-Implikationen mit unerfüllbaren Prämissen beweisen.
2. **Modell-zu-Code-Verwechslung:** Der Beweis der Bellman-Optimalität für ein diskretes Ganzzahlmodell über $\mathbb{Z} \cup \{-\infty\}$ beweist noch keine universelle Code-Verfeinerung für einen produktiven Python-Optimierer, der IEEE-754-binary64-Gleitkommazahlen (`math.log`) mit `1e-12`-Tie-Toleranz akkumuliert und Pfade über veränderliche Rückzeiger rekonstruiert.

Zur Verhinderung stiller Spezifikationsdrift erzwingt `FactorForgeFormal` eine vierstufige Vertrauenstrennung:

- **Kryptographisch gesperrte Lean-4-Spezifikationen (`formal/FactorForgeFormal/Spec/`):** Sechs Module (`Tropical.lean`, `Automaton.lean`, `GeneticCode.lean`, `ExactDP.lean`, `KineticAndParity.lean` und `Spec.lean`) deklarieren alle Datentypen, Algorithmen und Zielaussagen (`Prop_*`) ohne `sorry`, gebunden an SHA-256-Digests in `spec_lock_manifest.json`.
- **Isolierte Taktik-Beweise (`formal/FactorForgeFormal/Proofs/`):** Fünf Beweismodule importieren `Spec/` schreibgeschützt und beweisen **20 Kerntheoreme** sowie **3 strukturelle Hilfslemmata** mittels struktureller Induktion, Fold-Invarianten, Kernel-Reduktion (`decide`) und linearer Ganzzahlarithmetik (`omega`) ohne Mathlib und ohne `native_decide`.
- **Konkrete Nicht-Leerheitszeugen & Axiom-Audit (`Witnesses.lean`, `Audit.lean`):** Vierzehn kernelgeprüfte Theoreme instanziieren die Spezifikationen auf einem 12-Zustands-BsaI-Automaten (`GGTCTC` / `GAGACC`) für `"GGTC" + "SL" + "TAA"`, widerlegen fehlerhafte Codons und beweisen die konstruktive Auswahl von `AGCCTG` zum quantisierten Score `-357`. `Audit.lean` prüft alle 34 Deklarationen mittels `#print axioms`, gefolgt von `leanchecker`.
- **Stichprobenartige Python-Korrespondenz & Mutationssuite (`tests/`):** Vergleicht `factorforge_snapshot/` mit einem Aho-Corasick-unabhängigen Substring-Enumerator (`BruteForceCDSOracle`), einem exakten Ganzzahl-Spiegel (`LeanExactMirrorDP`), einem schrumpfenden 200-Instanzen-Fuzzer über vier `PYTHONHASHSEED`-Werte sowie 8 semantischen Mutationen auf einer Referenzkopie. **Wichtig: Die interne Multi-Agenten-Prüfung ist ein automatisierter Engineering-Check und ersetzt kein unabhängiges Gutachten externer Mathematiker oder Verifikationsspezialisten.**

## 2. Tropische Max-Plus-Algebra (`Spec/Tropical.lean`)

Die additive Maximierung von log-CAI über erreichbare endliche Zustände wird über dem erweiterten Ganzzahl-Halbring $\mathrm{Trop}(\mathbb{Z}) = \mathbb{Z} \cup \{-\infty\}$ formalisiert: Unerreichbare `(gc, state)`-Zellen tragen $-\infty$, Pfaderweiterung addiert Ganzzahl-Scores und Zustandsrelaxation bildet das punktweise Maximum.

> **Definition 2.1 (Tropischer Träger, Operationen und Halbordnung).** Für einen Trägertyp $\alpha$ besitzt der induktive Typ `Trop α` die Konstruktoren `negInf` ($-\infty$, additives Nullelement $\mathbb{0}$) und `finite a` (multiplikatives Einselement $\mathbb{1} = \mathrm{finite}(0)$). Über $\alpha = \mathbb{Z}$ sind Relaxation $\oplus$, Erweiterung $\otimes$ und Ordnung $\le$ definiert durch:

$$
x \oplus y := \begin{cases} y & \text{if } x = -\infty, \\ x & \text{if } y = -\infty, \\ \mathrm{finite}(\max(a,b)) & \text{if } x = \mathrm{finite}(a),\; y = \mathrm{finite}(b), \end{cases}
\qquad
x \otimes y := \begin{cases} -\infty & \text{if } x = -\infty \text{ or } y = -\infty, \\ \mathrm{finite}(a + b) & \text{if } x = \mathrm{finite}(a),\; y = \mathrm{finite}(b). \end{cases}
$$

```lean
inductive Trop (alpha : Type u) where
  | negInf : Trop alpha
  | finite : alpha -> Trop alpha
  deriving DecidableEq, Repr

def oplus {alpha : Type u} [Max alpha] : Trop alpha -> Trop alpha -> Trop alpha
  | Trop.negInf, b => b
  | a, Trop.negInf => a
  | Trop.finite a, Trop.finite b => Trop.finite (max a b)

def otimes {alpha : Type u} [Add alpha] : Trop alpha -> Trop alpha -> Trop alpha
  | Trop.negInf, _ => Trop.negInf
  | _, Trop.negInf => Trop.negInf
  | Trop.finite a, Trop.finite b => Trop.finite (a + b)
```

> **Satz 2.1 (`tropIntSemiringLaws`) & Satz 2.2 (`tropIntOrderLaws`).** $(\mathrm{Trop}(\mathbb{Z}), \oplus, \otimes, -\infty, 0)$ erfüllt alle 12 Gesetze eines idempotenten Max-Plus-Halbrings (Assoziativität, Kommutativität, Idempotenz $a \oplus a = a$, Neutralität von $-\infty$ bzgl. $\oplus$; Assoziativität, Eins $0$ und $-\infty$-Annihilation bzgl. $\otimes$; Links- und Rechtsdistributivität $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$) und $(\mathrm{Trop}(\mathbb{Z}), \le)$ ist eine Halbordnung mit Supremum $\oplus$ und in beiden Argumenten monotonem $\otimes$.

> **Beweisskizze (`Proofs/Tropical.lean`).** Erschöpfende dreifache Konstruktor-Fallunterscheidung (`cases a <;> cases b <;> cases c`), welche die endlichen Zweige auf lineare Ganzzahlziele über `max` und `+` reduziert und mit `omega` schließt (`#print axioms`: `[propext, Quot.sound]`).

## 3. Konstruktweite Automaten-Sicherheit (`Spec/Automaton.lean`)

Verbotene Restriktionsschnittstellen (wie BsaI `GGTCTC` samt Reverskomplement `GAGACC`) und unerwünschte Motive können über $5'$-Flanke-zu-CDS-Grenzen, Codon-Grenzen und CDS-zu-Terminator-Grenzen hinweg entstehen. `Spec/Automaton.lean` modelliert beschränkte deterministische endliche Automaten (DFA) über $\Sigma = \{\mathrm{A}, \mathrm{C}, \mathrm{G}, \mathrm{T}\}$.

> **Definition 3.1 (Beschränkter DFA und präfixsichere Transition).** Ein `Automaton` $M = (N, q_0, \delta, T, h_0, h_\delta)$ umfasst Zustandsanzahl $N = \text{numStates}$, Startzustand $q_0 < N$, zustandsabgeschlossene Übergangsfunktion $\delta : \mathbb{N} \times \Sigma \to \mathbb{N}$ ($q < N \implies \delta(q,b) < N$) sowie Endzustandsprädikat $T : \mathbb{N} \to \mathbb{B}$. Mehrfach-Übergang $\delta^* = \text{stepSeq}$ und Präfix-Vermeidung $\mathrm{safeSeq}$ rekursieren über Basenlisten, während `stepCodonSafe` exakt `CompiledAutomaton.step_codon` abbildet, indem bei Erreichen eines verbotenen Zustands sofort `(s', false)` zurückgegeben wird.

```lean
structure Automaton where
  numStates : Nat
  initState : Nat
  stepSym : Nat -> Base -> Nat
  isTerminal : Nat -> Bool
  init_lt : initState < numStates
  step_lt : ∀ s b, s < numStates -> stepSym s b < numStates

def safeSeq (M : Automaton) (s : Nat) : List Base -> Bool
  | [] => true
  | b :: bs =>
    let s' := M.stepSym s b
    if M.isTerminal s' then false else safeSeq M s' bs

def stepCodonSafe (M : Automaton) (s : Nat) (codon : List Base) : Nat × Bool :=
  match codon with
  | [] => (s, true)
  | b :: bs =>
    let s' := M.stepSym s b
    if M.isTerminal s' then (s', false) else stepCodonSafe M s' bs
```

> **Sätze 3.1-3.5 (`stepSeqAppend`, `safeSeqAppend`, `stepCodonSafeSound`, `stepCodonSafeComplete`, `fullConstructSafe`).** Sequenzübergänge komponieren homomorph ($\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q,u), v)$), Präfixsicherheit faktorisiert sauber ($\mathrm{safeSeq}(M, q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(M, q, u) \land \mathrm{safeSeq}(M, \delta^*(q, u), v)$) und `stepCodonSafe` ist korrekt und vollständig bzgl. `(stepSeq, safeSeq)`. Für jede $5'$-Flanke $F_L$, Codon-Liste $C$ und $3'$-Endsequenz $F_R$ mit $q_L = \delta^*(q_0, F_L)$ und $q_{\mathrm{end}} = \delta^*(q_L, \mathrm{flatten}(C))$ gilt daher:

$$
\mathrm{safeSeq}(M, q_0, F_L) \;\land\; \mathrm{safeCodonList}(M, q_L, C) \;\land\; \mathrm{safeSeq}(M, q_{\mathrm{end}}, F_R)
\;\Longrightarrow\;
\mathrm{safeSeq}\bigl(M, q_0, F_L \mathbin{\Vert} \mathrm{flatten}(C) \mathbin{\Vert} F_R\bigr).
$$

> **Beweisskizze (`Proofs/Automaton.lean`).** Strukturelle Listeninduktion über `xs` unter Generalisierung von `s` mit Fallunterscheidung auf `M.isTerminal (M.stepSym s b)`. Das Lemma `safeCodonList_implies_safeSeq` hebt `stepCodonSafeSound` auf `cds : List (List Base)`, worauf `fullConstructSafe` `List.append_assoc` umschreibt und `safeSeqAppend` zweimal anwendet (`#print axioms`: nur `[propext]`).

## 4. 64-Triplett-Standard-Gencode und Menü-Wohlgeformtheit (`Spec/GeneticCode.lean`)

Um zu verhindern, dass fehlerhafte Kandidatenmenüs die Aminosäuretreue umgehen oder gespeicherte GC-Zahlen fälschen, kodiert `Spec/GeneticCode.lean` alle $4^3 = 64$ Tripletts (`translateTriplet`) sowie die leserahmenexakte Übersetzung (`translateDNA`), 64-gegen-64 abgeglichen mit `STANDARD_GENETIC_CODE` in Python.

> **Definition 4.1 (`ValidCodonForAA` & `WellFormedMenu`).** Ein Codon-Kandidat $c = (\mathrm{seq}, \mathrm{gc}, \mathrm{score})$ ist für die Zielaminosäure $a \in \mathcal{A}$ gültig genau dann, wenn er exakt Länge 3 hat, seine Nukleotid-GC-Zahl mit `gc` übereinstimmt und er zu $a$ translatiert:

$$
\mathrm{ValidCodonForAA}(c, a) \;\Longleftrightarrow\;
|c.\mathrm{seq}| = 3 \;\land\;
c.\mathrm{gc} = \mathrm{seqGC}(c.\mathrm{seq}) \;\land\;
\mathrm{translateCodonSeq}(c.\mathrm{seq}) = \mathrm{some}(\mathrm{aa}\;a).
$$

```lean
def ValidCodonForAA (c : CodonSpec) (a : AminoAcid) : Bool :=
  c.seq.length == 3 && c.gc == seqGC c.seq && translateCodonSeq c.seq == some (.aa a)

def WellFormedMenu : List AminoAcid -> List (List CodonSpec) -> Prop
  | [], [] => True
  | a :: as, opts :: rest =>
    (∀ c ∈ opts, ValidCodonForAA c a = true) ∧ WellFormedMenu as rest
  | _, _ => False
```

> **Satz 4.1 (`geneticCodePartition64`, null Axiome), Lemmata 4.2-4.3 (`validCodonForAA_destruct`, `translateDNA_cons3`) & Sätze 4.4-4.5 (`gcConservation`, `proteinPreservationAndGC`).** Im Lean-Kernel **ohne jegliche Axiome** bewiesen: Die 64 DNA-Tripletts partitionieren exakt in `61` Sense-Codons und `3` Stoppcodons (`TAA`, `TAG`, `TGA`). Unter `WellFormedMenu P L` erfüllt jede ausgeflachte DNA $D = \mathrm{flatMap}(\mathrm{seq}, C)$ eines `ValidPath M s0 L C`:

$$
|D| = 3|P|, \qquad
\mathrm{pathGC}(C) = \sum_{i=1}^{|P|} c_i.\mathrm{gc} = \mathrm{seqGC}(D), \qquad
\mathrm{translateDNA}(D) = \mathrm{some}(P),
$$

was null Leserasterverschiebungen und null interne oder terminale Stoppcodons garantiert.

## 5. Bellman-Optimalität und konstruktive Zeugenextraktion (`Spec/ExactDP.lean`)

### 5.1 Tropische Bellman-Tabelle vs. konstruktiver Kandidaten-Solver

Auf dem diskreten Zustandsgitter $(g, s) \in \{0,\dots,G_{\max}\} \times \{0,\dots,N-1\}$ definiert `Spec/ExactDP.lean` sowohl die tropische Wertrekursion `dpEval` / `dpBestScore` als auch den konstruktiven Pfad-Solver `dpTrackEval` / `dpOptimize`.

$$
V_i(g', s') := \bigoplus_{s = 0}^{N - 1} \;\bigoplus_{\substack{c \in O_i : \; c.\mathrm{gc} \le g' \\ \mathrm{stepCodonSafe}(M, s, c.\mathrm{seq}) = (s', \mathrm{true})}}
\Bigl(V_{i-1}(g' - c.\mathrm{gc}, s) \otimes \mathrm{finite}(c.\mathrm{score})\Bigr),
\qquad V_0(g, s) = \begin{cases} 0 & (g,s)=(0,s_0), \\ -\infty & \text{otherwise.} \end{cases}
$$

Um direkt eine konkrete optimale Codonliste `some (v, cs)` zurückzugeben, paart `DPCandidate := Option (Int × List CodonSpec)` Ganzzahl-Scores mit Präfix-Listen über die deterministische Relaxation `relaxCand` (behält bei Gleichstand den zuerst gesehenen) und `extendCand`.

```lean
def Prop_DPOptimizeEndToEnd : Prop :=
  ∀ (M : Automaton) (leftFlank : List Base) (minGC maxGC : Nat) (tail : List Base)
    (protein : List AminoAcid) (layers : List (List CodonSpec)),
    WellFormedMenu protein layers ->
    let s0 := M.stepSeq M.initState leftFlank
    (M.safeSeq M.initState leftFlank = true ->
      candToTrop (dpOptimize M leftFlank minGC maxGC tail layers) =
        dpBestScore M s0 minGC maxGC tail layers) ∧
    (dpOptimize M leftFlank minGC maxGC tail layers = none ↔
      M.safeSeq M.initState leftFlank = false ∨
      ∀ cs, ¬ FeasibleCDS M s0 minGC maxGC tail layers cs) ∧
    (∀ (v : Int) (cs : List CodonSpec),
      dpOptimize M leftFlank minGC maxGC tail layers = some (v, cs) ->
      let dna := cs.flatMap (·.seq)
      FeasibleCDS M s0 minGC maxGC tail layers cs ∧
      pathScore cs = v ∧
      dna.length = 3 * protein.length ∧
      translateDNA dna = some protein ∧
      minGC ≤ seqGC dna ∧
      seqGC dna ≤ maxGC ∧
      M.safeSeq M.initState (leftFlank ++ dna ++ tail) = true ∧
      ∀ cs', FeasibleCDS M s0 minGC maxGC tail layers cs' -> pathScore cs' ≤ v)
```

### 5.2 Korrektheit, Vollständigkeit, Pruning und Hauptsatz `dpOptimizeEndToEnd`

> **Sätze 5.1-5.3 (`dpSoundness`, `dpCompleteness`, `exactGlobalOptimality`) & Lemma (`exactOpt_witness_eq`).** Für $s_0 < M.\mathrm{numStates}$ bezeugt jeder endliche Eintrag $V_L(g, s) = \mathrm{finite}(v)$ einen echten `ValidPath` mit passendem $(g, s, v)$, und jeder `ValidPath` wird durch $V_L(\mathrm{pathGC}(C), \delta^*(s_0, D))$ nach oben beschränkt. Die terminale Projektion `dpBestScore` beschränkt alle `FeasibleCDS`-Pfade und erreicht jedes endliche globale Optimum.

> **Satz 5.4 (Hauptsatz: `dpOptimizeEndToEnd`).** Unter `WellFormedMenu P L` mit $s_0 = \delta^*(q_0, F_L)$ erfüllt `dpOptimize`:
> 1. **Wertäquivalenz:** Wenn $\mathrm{safeSeq}(M, q_0, F_L) = \mathrm{true}$, gilt $\mathrm{candToTrop}(\mathrm{dpOptimize}(\dots)) = \mathrm{dpBestScore}(\dots)$.
> 2. **Vollständiges Unerfüllbarkeitszertifikat:** $\mathrm{dpOptimize}(\dots) = \mathrm{none}$ genau dann, wenn $F_L$ unsicher ist oder kein `FeasibleCDS`-Pfad existiert.
> 3. **8-fache konstruktive Optimalität:** Immer wenn $\mathrm{dpOptimize}(\dots) = \mathrm{some}(v, C)$ mit $D = \mathrm{flatMap}(\mathrm{seq}, C)$, ist $C$ zulässig, $\mathrm{pathScore}(C) = v$, $|D| = 3|P|$, $\mathrm{translateDNA}(D) = \mathrm{some}(P)$, $g_{\min} \le \mathrm{seqGC}(D) \le g_{\max}$, das Gesamtkonstrukt $F_L \mathbin{\Vert} D \mathbin{\Vert} F_R$ frei von verbotenen Zuständen ab $q_0$ und $\mathrm{pathScore}(C') \le v$ für jeden zulässigen Konkurrenten $C'$.

> **Sätze 5.5-5.6 (`gcEnvelopeAndPruningAdmissible`, `synonymousEnvelopeUnsat`).** Jede zulässige Zerlegung $C = C_{\mathrm{pre}} \mathbin{\Vert} C_{\mathrm{suf}}$ erfüllt $g_{\min} \le \mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMaxGC}(\mathcal{L}_{\mathrm{suf}})$ sowie $\mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMinGC}(\mathcal{L}_{\mathrm{suf}}) \le g_{\max}$; Suffix-GC-Pruning verwirft daher nie eine optimale Vervollständigung, und disjunkte GC-Fenster besitzen null Lösungen.

> **Beweisskizze (`Proofs/ExactDP.lean`, 1.225 Zeilen).** Verwendet Snoc-Listeninduktion (`list_snoc_rec`) über DP-Schichten sowie geschachtelte Fold-Invarianten über `List.range M.numStates` und `opts`. Das Homomorphie-Lemma `candToTrop_dpTrackEval` beweist `candToTrop (dpTrackEval ...) = dpEval ...` mittels `candToTrop (relaxCand x y) = oplus (candToTrop x) (candToTrop y)`, während `dpTrackSoundness` mit `proteinPreservationAndGC`, `fullConstructSafe` und `exactGlobalOptimality` kombiniert wird.

## 6. Exakte rationale Kinetik, Tie-Ordnung und Störungsschranken (`Spec/KineticAndParity.lean`)

> **Definition 6.1 (`ExactRat` & `rampTau`).** Exakte rationale Zahlen $\mathrm{ExactRat} = \{(p, q) \in \mathbb{Z}^2 : q > 0\}$ werden per Kreuzmultiplikation ($a.p \cdot b.q < b.p \cdot a.q$) ohne Division oder Rundung verglichen. Die lineare Verzögerungsrampe $\tau_{\mathrm{ramp}}(\tau_p, d, W) = \tau_p + \frac{d}{W}(1 - \tau_p)$ lautet exakt:

$$
\mathrm{rampTau}\bigl((p, q), d, W\bigr) := \frac{pW + d(q - p)}{qW}, \qquad (q > 0,\; W > 0).
$$

> **Sätze 6.1-6.4 (`tasepRampBoundsAndMonotonicity`, `zeroWeightParity`, `pathLexTotalOrder`, `approxScoreExactness`).**
> - **Strikte Rampen-Interiorität & Monotonie:** Für $0 < \tau_p < 1$ und $1 \le d < W$ gilt $\tau_p <_{\mathbb{Q}} \mathrm{rampTau}(\tau_p, d, W) <_{\mathbb{Q}} 1$; $\mathrm{rampTau}$ ist streng steigend in $d$ und invariant bei $\tau_p = 1$.
> - **Nullgewicht-Parität:** Sind alle aktiven Pausengewichte $0$, fällt `structFitness` in jeder Zelle $(g, s)$ von `dpEval` mit der Basisfitness zusammen.
> - **Lexikographische strenge Totalordnung:** Der Präfix-Vergleicher `pathLexLt` ist irreflexiv, transitiv, asymmetrisch und trichotom auf `List Nat`.
> - **Bedingte Ganzzahl-Störungsschranke (`List Int`):** Gilt $|a_i - t_i| \le \varepsilon$ je Schritt, folgt $\bigl|\sum_{i=1}^L a_i - \sum_{i=1}^L t_i\bigr| \le L\varepsilon$, und $\tilde{S}_{\mathrm{alt}} + 2\Delta < \tilde{S}_{\mathrm{opt}}$ mit $|\tilde{S} - S| \le \Delta$ impliziert $S_{\mathrm{alt}} < S_{\mathrm{opt}}$.

> **Laufzeitgrenze (`float` vs. `List Int` / `ExactRat`).** `approxScoreExactness` ist ein bedingter Satz über `List Int` (Festkomma-Quantisierung), kein IEEE-754-binary64-Fehlerzertifikat für `math.log`. Ebenso kollabiert Pythons `round(..., 3)` in `TASEPKineticsEngine` die strenge $< 1.0$-Interiorität für $\tau_p \ge 0.999$ (z. B. $\tau_p = 0.999, d = 2, W = 3 \mapsto 1.0$).

## 7. Konkreter 12-Zustands-BsaI-Automat & Widerlegungs-Trace (`Witnesses.lean`)

Zum Nachweis der Nicht-Leerheit im Lean-Kernel kodiert `Witnesses.lean` den deterministischen 12-Zustands-Aho-Corasick-Automaten für BsaI (`GGTCTC` $\to$ Endzustand `6`; Reverskomplement `GAGACC` $\to$ `11`) und optimiert das Dipeptid `"SL"` (`[.S, .L]`) über $5'$-Flanke `"GGTC"`, $3'$-Stoppende `"TAA"` und GC-Fenster `[2, 4]`:

1. **Flankenübergang (`witness_leftFlank_safe`):** `"GGTC"` wechselt sicher $0 \xrightarrow{\mathrm{G}} 1 \xrightarrow{\mathrm{G}} 2 \xrightarrow{\mathrm{T}} 3 \xrightarrow{\mathrm{C}} 4$ (`s0 = 4`).
2. **Widerlegung einer Übergangsverletzung (`witness_tct_rejected`):** Das punktbeste Serin-Codon `TCT` (Score `-223`) durchläuft $4 \xrightarrow{\mathrm{T}} 5 \xrightarrow{\mathrm{C}} \mathbf{6}$, bildet `"GGTCTC"` über die $5'$-Grenze und wird mit `(6, false)` verworfen.
3. **Widerlegung fehlerhafter Eingaben (`witness_malformed_codon_rejected`):** `decide` verwirft `AAA` mit `gc = 3`, `AAA` für `.S` und das Stoppcodon `TAA` für `.Y`.
4. **Konstruktives globales Optimum (`witness_dpOptimize_sl_end_to_end`):** `dpOptimize` wählt `AGC` ($4 \to 0 \to 1 \to 0$, Score `-357`, `gc = 2`), gefolgt von `CTG` ($0 \to 0 \to 0 \to 1$, Score `0`, `gc = 2`) und `"TAA"` ($1 \to 0 \to 0 \to 0$), und liefert `some (-357, [AGC, CTG])` (`"AGCCTG"`, `seqGC = 4`).

```lean
theorem witness_malformed_codon_rejected :
    ValidCodonForAA ⟨[.A, .A, .A], 3, 100⟩ .K = false ∧
    ValidCodonForAA ⟨[.A, .A, .A], 0, 100⟩ .S = false ∧
    ValidCodonForAA ⟨[.T, .A, .A], 0, 0⟩ .Y = false := by
  decide

theorem witness_dpOptimize_sl_end_to_end :
    ∃ cs : List CodonSpec,
      dpOptimize bsaiAutomaton leftFlankGGTC 2 4 tailStopTAA slLayers = some (-357, cs) ∧
      translateDNA (cs.flatMap (·.seq)) = some [.S, .L] ∧
      2 ≤ seqGC (cs.flatMap (·.seq)) ∧
      seqGC (cs.flatMap (·.seq)) ≤ 4 ∧
      bsaiAutomaton.safeSeq bsaiAutomaton.initState
        (leftFlankGGTC ++ cs.flatMap (·.seq) ++ tailStopTAA) = true
```

## 8. Vollständige Theorem-, Zeugen-, Mutations- & F1-F28-Kataloge

### 8.1 Alle 20 geprüften Kerntheoreme + 3 strukturelle Lemmata (`Audit.lean`)

Axiom-Legende (`lake env lean FactorForgeFormal/Audit.lean`): **`none`** = null Axiome; **`P`** = `[propext]`; **`P, Q`** = `[propext, Quot.sound]`; **`P, C, Q`** = `[propext, Classical.choice, Quot.sound]` (null `sorryAx`, null eigene Axiome).

| Modul | Lean-Bezeichner | `#print axioms` | Verifizierte mathematische Aussage |
| --- | --- | --- | --- |
| `Tropical` | `tropIntSemiringLaws` | `P, Q` | 12 idempotente Max-Plus-Halbringgesetze über $\mathrm{Trop}(\mathbb{Z})$ |
| `Tropical` | `tropIntOrderLaws` | `P, Q` | Halbordnung, Supremum und $\oplus$/$\otimes$-Monotonie |
| `Automaton` | `stepSeqAppend` | `P` | $\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q, u), v)$ für alle Basenlisten $u, v$ |
| `Automaton` | `safeSeqAppend` | `P` | $\mathrm{safeSeq}(q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(q, u) \land \mathrm{safeSeq}(\delta^*(q, u), v)$ |
| `Automaton` | `stepCodonSafeSound` | `P` | `stepCodonSafe(q, c) = (q', true)` impliziert $\delta^*(q, c) = q'$ und `safeSeq(q, c)` |
| `Automaton` | `stepCodonSafeComplete` | `P` | `safeSeq(q, c) = true` impliziert `stepCodonSafe(q, c) = (stepSeq(q, c), true)` |
| `Automaton` | `fullConstructSafe` | `P` | Sichere $5'$-Flanke, Codons und $3'$-Schwanz ergeben sicheres Gesamtkonstrukt |
| `GeneticCode` | `geneticCodePartition64` | `none` | Partition der 64 DNA-Tripletts in 61 Sense- und 3 Stoppcodons |
| `GeneticCode` | `validCodonForAA_destruct` *(Lemma)* | `P, C, Q` | Zerlegt `ValidCodonForAA` in 3 Basen, exaktes GC und Sense-Aminosäure |
| `GeneticCode` | `translateDNA_cons3` *(Lemma)* | `P` | Gültiges Sense-Triplett-Präfix erhält rekursives `translateDNA` |
| `ExactDP` | `gcConservation` | `P, C, Q` | Summe wohlgeformter `gc`-Felder gleicht ausgeflachtem Nukleotid-`seqGC` |
| `ExactDP` | `proteinPreservationAndGC` | `P, C, Q` | `ValidPath` über `WellFormedMenu` erhält $3\lvert P\rvert$, `seqGC` und `some P` |
| `ExactDP` | `dpSoundness` | `P, C, Q` | Jeder endliche `dpEval`-Eintrag bezeugt einen echten `ValidPath` |
| `ExactDP` | `dpCompleteness` | `P, C, Q` | Jeder `ValidPath` wird durch `dpEval` bei $(g, s)$ nach oben beschränkt |
| `ExactDP` | `exactGlobalOptimality` | `P, C, Q` | `dpBestScore` beschränkt alle `FeasibleCDS` und erreicht jedes endliche Optimum |
| `ExactDP` | `exactOpt_witness_eq` *(Lemma)* | `P, C, Q` | Zulässiger Zeuge oberhalb aller Konkurrenten gleicht `dpBestScore` |
| `ExactDP` | `dpOptimizeEndToEnd` | `P, C, Q` | Wertparität von `dpOptimize`, `none`-iff-unsat und 8-teilige Optimalität |
| `ExactDP` | `gcEnvelopeAndPruningAdmissible` | `P, C, Q` | Suffix-GC-Schranken $[G_{\min}, G_{\max}]$ erhalten alle zulässigen Vervollständigungen |
| `ExactDP` | `synonymousEnvelopeUnsat` | `P, C, Q` | Null zulässige Pfade außerhalb $[G_{\min}, G_{\max}]$ |
| `KineticAndParity` | `tasepRampBoundsAndMonotonicity` | `P, Q` | Exakte rationale Rampen-Interiorität $(\tau_p, 1)$, Monotonie und $\tau_p = 1$ |
| `KineticAndParity` | `zeroWeightParity` | `P, Q` | Nullgewichtige Pausen-Maps reduzieren Fitness und DP-Tabelle auf Basislinie |
| `KineticAndParity` | `pathLexTotalOrder` | `P, Q` | Irreflexivität, Transitivität, Asymmetrie und Trichotomie von `pathLexLt` |
| `KineticAndParity` | `approxScoreExactness` | `P, Q` | Bedingte `List Int`-Schranke $L\varepsilon$ und $2\Delta$-Argmax-Erhalt |

### 8.2 Alle 14 konkreten Zeugen- & Widerlegungstheoreme (`Witnesses.lean`)

| Zeugen-Bezeichner | `#print axioms` | Kernelgeprüfte konkrete Eigenschaft |
| --- | --- | --- |
| `witness_malformed_codon_rejected` | `P` | Verwirft `AAA` mit `gc = 3`, `AAA` für `.S` und Stoppcodon `TAA` für `.Y` |
| `witness_sl_wellFormedMenu` | `P` | Zertifiziert `WellFormedMenu [.S, .L]` für 6 Serin- + 6 Leucin-Optionen |
| `witness_leftFlank_safe` | `P, Q` | Linke Flanke `"GGTC"` sicher auf 12-Zustands-BsaI-DFA, erreicht Zustand `4` |
| `witness_sl_feasible` | `P, Q` | Pfad `AGCCTG` erfüllt `FeasibleCDS` über `"GGTC" + "SL" + "TAA"` |
| `witness_dpBest_sl_exact` | `P, C, Q` | Beweist `dpBestScore(...) = finite (-357)` mittels `exactOpt_witness_eq` |
| `witness_dpOptimize_sl_end_to_end` | `P, C, Q` | Extrahiert konstruktiv `some (-357, cs)` übersetzt zu `[.S, .L]` |
| `witness_tct_rejected` | `P, Q` | Beweist, dass `TCT` ab Zustand `4` in den verbotenen Zustand `6` läuft |
| `witness_gc_and_protein_preservation` | `P, C, Q` | Instanziiert `proteinPreservationAndGC` auf `optPathSL` (`AGCCTG`) |
| `witness_gc_pruning_admissible` | `P, C, Q` | Prüft GC-Hüllkurven `[2, 4]` für Präfix `AGC` + Suffix Leucin |
| `witness_tasep_ramp` | `P, Q` | Zertifiziert $\frac{7}{20} < \mathrm{rampTau}(\frac{7}{20}, 1, 3) < 1$ in `ExactRat` |
| `witness_zero_weight_parity` | `P, Q` | Bestätigt identische Score-Erhaltung `-357` bei Nullgewichten |
| `witness_path_lex_order` | `P, Q` | Zertifiziert `[14, 19] < [15, 19] < [48, 19] => [14, 19] < [48, 19]` |
| `witness_approx_margin_exactness` | `P, Q` | Zertifiziert 2-Codon-Marge $-511 + 2(2) < -357 \implies -510 < -356$ |
| `witness_unsat_gc` | `P, C, Q` | Zertifiziert null zulässige Pfade für Zielband `[5, 6] > 4` |

### 8.3 Referenzkopie-Mutationsaudit (`8/8` injizierte Defekte erkannt)

Über 200 Zufallsinstanzen mit `PYTHONHASHSEED` $\in \{0, 1, 2, 3\}$ stimmte `DPV2Optimizer` mit `BruteForceCDSOracle` bei Zulässigkeit, Translation, Motivsicherheit und Optimalscore überein, deckte jedoch auf Homodipeptiden (`FF`: `TTTTTC` vs. `TTCTTT`, gleicher Score bei `(g = 1, s = 0)`) eine konkrete Tie-Breaking-Differenz auf. Alle 8 semantischen Mutanten in `test_mutation_detection_audit.py` wurden erkannt:

| Mutanten-ID | Ergebnis | Injizierter Defekt & erkennende Zusicherung |
| --- | --- | --- |
| `M1_WRONG_SYNONYMOUS_CODON` | **Erkannt** | Injiziert `AAA` (Lys, `gc = 0`) in Serin auf `"SL"` (`[0.30, 0.67]` GC); gefangen durch `translate_dna(seq) != "SL"`. |
| `M2_GC_COUNT_DROP_C` | **Erkannt** | Zählt nur `'G'` auf `"TT"` (`[0.66, 0.67]` GC); gefangen durch GC-Fenster und Orakelmenge. |
| `M3_DROP_REVERSE_COMPLEMENT` | **Erkannt** | Lässt Reverskomplement `GAGACC` bei `"GA" + "DL"` weg; erzeugt `GAGACC`, gefangen per Substring-Suche. |
| `M4_IGNORE_LEFT_FLANK` | **Erkannt** | Startet bei `s0 = 0` statt `step("GGTC") = 4` auf `"GGTC" + "SL" + "TAA"`; emittiert `TCT` (`GGTCTC`). |
| `M5_IGNORE_RIGHT_FLANK` | **Erkannt** | Überspringt rechte Flankenprüfung auf `"" + "G" + "CTC"`; emittiert `GGT` (`GGTCTC`). |
| `M6_OFF_BY_ONE_MAX_GC` | **Erkannt** | Ersetzt `g <= max_gc` durch `g < max_gc` auf `"TT"` (`min_gc = max_gc = 4`); wirft fälschlich `No in-band candidate`. |
| `M7_MIN_INSTEAD_OF_MAX` | **Erkannt** | Minimiert log-CAI statt zu maximieren; gefangen gegen den Optimalscore des Orakels. |
| `M8_CORRUPT_BACKPOINTER` | **Erkannt** | Speichert `prev_g = g + 1` im Vorwärtsdurchlauf; schlägt beim Backtracking mit `KeyError` fehl. |

### 8.4 Formulierungs-Abdeckungsmatrix (`F1`-`F28`)

Stufen: **L1** = Lean-4-Kernelbeweis; **O1** = Exhaustive/Fuzzer/Mutanten-Suite; **C1** = deterministische Unit-Tests im Hauptrepository; **(B)** = dokumentierte Laufzeitdivergenz.

| ID | Formulierung | Lean-4- / Python-Anker | Stufe | Bereichshinweis |
| --- | --- | --- | --- | --- |
| `F1` | Codonhäufigkeit $f(c)$ | `load_codon_usage_table` | `C1` | Tabellenlader |
| `F2` | Relative Adaptivität $w(c)$ | `_build_codon_weights` | `C1 + O1` | Untergrenze $10^{-6}$ |
| `F3` | Geometrischer CAI & Log-Summe | `pathScore`, `approxScoreExactness` | `L1 + O1 (B)` | `Int` vs. `float` binary64 |
| `F4` | Nukleotid-GC-Zahl & -Anteil | `seqGC`, `gcConservation` | `L1 + O1` | Exaktes Ganzzahl-GC |
| `F5` | 64-Triplett-Gencode | `translateTriplet`, `geneticCodePartition64` | `L1 + O1` | 64/64-Bijektion |
| `F6` | Sense-Translation $\mathrm{Translate}(D)=P$ | `ValidCodonForAA`, `proteinPreservationAndGC` | `L1 + O1` | Menü-Korrektheit |
| `F7` | Verbotene Motive + RC-Abschluss | `Automaton`, `AutomatonCompiler` | `L1 + O1 (B)` | Gegebene DFA-Tabelle |
| `F8` | Konstruktweite Übergangssicherheit | `fullConstructSafe` | `L1 + O1` | Beliebige Flanken |
| `F9` | Zulässige CDS-Menge $\mathcal{F}(P,\theta)$ | `FeasibleCDS`, `synonymousEnvelopeUnsat` | `L1 + O1` | Ganzzahliges GC-Band |
| `F10`-`F14` | Random, Greedy, Balanced, GC-target, SOP / lokaler Rewriter | `reverse_translator.py`, `sop_balancer.py`, `local_rewriter.py` | `C1` | Nicht-DP-Heuristiken |
| `F15` | Tropischer Max-Plus-Halbring | `tropIntSemiringLaws`, `tropIntOrderLaws` | `L1 + O1` | $\mathbb{Z}\cup\{-\infty\}$-Algebra |
| `F16` | Vorwärts-Bellman-Schicht | `dpStep`, `dpSoundness`, `dpCompleteness` | `L1 + O1 (B)` | $5'$-Rampe außerhalb Lean |
| `F17` | Terminalfilter & globales Optimum | `dpBestScore`, `exactGlobalOptimality` | `L1 + O1 (B)` | Fallback in `O1` |
| `F18` | Konstruktives Backtracking & Ties | `dpOptimizeEndToEnd`, `pathLexTotalOrder` | `L1 + O1 (B)` | 3 Tie-Strategien |
| `F19` | Suffix-GC-Pruning & TASEP-Rampe | `gcEnvelopeAndPruningAdmissible`, `tasepRampBoundsAndMonotonicity` | `L1 + O1 (B)` | `round(..., 3)` nahe $1.0$ |
| `F20`-`F26` | Pass-Gate, Fenster-GC, Homopolymere, Dinukleotide | `SharedEvaluator`, `BenchmarkRunner` | `C1 (+ O1)` | Deskriptive Metriken |
| `F27` | Manifest-Integritätsbindung | `verify_all.py`, `REPRODUCIBILITY_MANIFEST.json` | `O1` | 229-Dateien-Sperre |
| `F28` | Epistemisches Gate | `UNVERIFIED_PUBLIC_CORPUS` | `Governance` | Keine Nasslabor-Aussage |

## 9. Exakte Beweisgrenzen und Fail-Closed-Reproduktionsprotokoll

Dieser Meilenstein beweist die mathematische Korrektheit des **explizit spezifizierten diskreten Ganzzahl-DP-Modells** von FactorForge, nicht eine universelle formale Verifikation des gesamten Python-Software-Stacks:

| Bereich | Aktueller Status | Exakte technische Grenze |
| --- | --- | --- |
| **Diskreter Ganzzahl-DP-Kern & 64-Codon-Translation (`FactorForgeFormal`)** | **In Lean 4 verifiziert** | 20 Kerntheoreme + 3 Lemmata, 14 Zeugen, 34 `#print axioms`-Prüfungen (`0 sorry`), geprüft durch `leanchecker`. Optimalität gilt relativ zu übergebenen `WellFormedMenu`-Menüs (Gültigkeit der übergebenen Optionen; universelle Entsprechung zu Laufzeitmenüs nicht bewiesen). |
| **Stichproben-Python-Korrespondenz & Archiv** | **Abgeschlossen (endliche Suite)** | 28 `pytest`-Prüfungen, 4 `PYTHONHASHSEED`-Läufe, `8/8` Mutanten erkannt und Integritätsprüfung aller 229 Dateien (`python verify_all.py`). |
| **Universelle Python-zu-Lean-Verfeinerung & Rückzeiger** | **Nicht bewiesen (Zukunft)** | Lean `dpOptimize` speichert Präfixlisten; produktives Python rekonstruiert veränderliche `(prev_g, prev_s)`-Zeiger und wird nicht aus Lean extrahiert. |
| **IEEE-754-`float`- & `1e-12`-Epsilon-Schranken** | **Nicht bewiesen (Zukunft)** | Produktives DP summiert binary64-`math.log`-Floats mit nicht-transitiver `1e-12`-Toleranz (3 Tie-Strategien koexistieren). `approxScoreExactness` gilt bedingt über `List Int`. |
| **Allgemeiner Motiv-Compiler & Nicht-DP-Heuristiken** | **Nicht in Lean bewiesen** | Lean setzt eine gegebene DFA-Übergangstabelle voraus statt allgemeiner Aho-Corasick-Kompilierung; `AutomatonCompiler` permutiert IDs mit `PYTHONHASHSEED`; `round(..., 3)` bricht strikte Interiorität nahe $1.0$; $5'$-Clamping und Heuristiken liegen außerhalb von `ExactDP.lean`. |
| **Biologische Expression & Nasslabor-Leistung** | **Nicht verfügbar** | `UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE`. Mathematische Optimalität impliziert keinerlei Expressions-, Faltungs- oder Ausbeutegarantie. |

Zur lokalen Reproduktion des gesamten Verifikationsarchivs (Python 3.11+, `pytest`, `ruff` und `elan` `leanprover/lean4:v4.36.0` erforderlich) entpacken Sie `FactorForge_Lean4_Verification_Package.zip` in einen kurzen Pfad und führen aus:

```bash
python verify_all.py
```
