---
lang: "fr"
langLabel: "Français"
title: "Vérification formelle en Lean 4 du modèle discret de programmation dynamique de FactorForge"
summary: "Plan directeur mathématique, spécifications Lean 4.36.0 verrouillées, esquisses de preuves inductives, trace constructive sur automate BsaI à 12 états et correspondance Python échantillonnée pour le noyau DP entier discret de FactorForge."
version: "Monographie technique v1.0.3 · Lean 4.36.0"
evidenceScope: "Preuves autonomes Lean 4.36.0 et tests finis de correspondance Python ; aucune preuve complète de raffinement Python ni validation biologique"
abstract: "L'optimisation de séquences codantes (CDS) sous contraintes sélectionne des codons synonymes préservant une protéine cible tout en évitant les motifs interdits à travers les séquences flanquantes et les jonctions inter-codons, en satisfaisant des bornes globales de GC nucléotidique et en maximisant un objectif additif d'adaptation codonique. Les suites de tests unitaires finies ne vérifient que des entrées échantillonnées, tandis que les raisonnements informels ou générés par IA sans contrainte risquent d'affaiblir silencieusement les spécifications s'ils ne sont pas contrôlés par un noyau de preuve indépendant. Nous présentons ici le plan directeur mathématique complet de FactorForgeFormal, une formalisation Lean 4.36.0 sans dépendance externe (14 modules, >2 500 lignes, 0 sorry, vérifiée transitivement par leanchecker) prouvant 20 théorèmes principaux, 3 lemmes auxiliaires et 14 témoins concrets couvrant l'algèbre tropicale max-plus, la sûreté par automate fini déterministe (DFA) à l'échelle du construit, le code génétique standard à 64 triplets (ValidCodonForAA), l'optimalité DP constructive par rétropropagation (dpOptimizeEndToEnd), l'interpolation rationnelle exacte de rampe cinétique (ExactRat) et les marges conditionnelles de perturbation entière, accompagnée d'une suite Python fail-closed et de 8/8 mutations sémantiques détectées."
pdfLabel: "Télécharger la monographie technique v1.0.3 (PDF, 14p)"
bundleLabel: "Télécharger l'archive reproductible Lean 4 + Oracle (.zip)"
toc:
  - id: "sec-1"
    number: "1"
    title: "Architecture de vérification et séparation des rôles"
  - id: "sec-2"
    number: "2"
    title: "Algèbre tropicale max-plus (Spec/Tropical.lean)"
  - id: "sec-3"
    number: "3"
    title: "Sûreté DFA à l'échelle du construit (Spec/Automaton.lean)"
  - id: "sec-4"
    number: "4"
    title: "Code génétique à 64 triplets et validité du menu"
  - id: "sec-5"
    number: "5"
    title: "Optimalité de Bellman et solveur constructif dpOptimize"
  - id: "sec-6"
    number: "6"
    title: "Cinétique rationnelle exacte, ordres de départage et marges"
  - id: "sec-7"
    number: "7"
    title: "Automate BsaI à 12 états et trace de réfutation"
  - id: "sec-8"
    number: "8"
    title: "Catalogues des théorèmes, témoins, mutants et F1-F28"
  - id: "sec-9"
    number: "9"
    title: "Frontières exactes de preuve et protocole de rejeu"
---

## 1. Architecture de vérification et séparation des rôles de confiance

La vérification d'un compilateur de séquences codantes par programmation dynamique (DP) à l'aide de tests unitaires finis confirme la concordance entrée-sortie sur des exemples choisis, mais ne peut garantir les invariants universels pour une longueur protéique arbitraire $L$, des fenêtres entières serrées de GC $[g_{\min}, g_{\max}]$ ou des ponts de motifs traversant les flancs $5'$, les triplets codants et les queues $3'$. À l'inverse, confier à un seul flux automatisé sans contrainte la rédaction des spécifications et celle des preuves expose à deux modes de défaillance classiques :

1. **Affaiblissement des spécifications et vacuité :** une formalisation peut omettre l'invariance de traduction synonyme ($\mathrm{Translate}(D) = P$), faire confiance à des métadonnées non vérifiées sur les candidats (par exemple un codon `AAA` déclarant `gc = 3`, ou un codon stop `TAA` dans un menu sens), ou prouver des implications universelles dont les prémisses sont insatisfiables.
2. **Confusion entre modèle et code :** prouver l'optimalité de Bellman pour un modèle entier discret sur $\mathbb{Z} \cup \{-\infty\}$ ne prouve pas le raffinement universel d'un solveur Python opérationnel qui accumule des flottants IEEE-754 binary64 via `math.log`, applique une tolérance d'égalité intra-état `1e-12` et reconstruit les chemins via des pointeurs arrière mutables.

Pour prévenir toute dérive silencieuse et mesurer explicitement les frontières d'exécution, `FactorForgeFormal` impose une séparation de confiance à quatre niveaux :

- **Spécifications Lean 4 verrouillées (`formal/FactorForgeFormal/Spec/`) :** six modules (`Tropical.lean`, `Automaton.lean`, `GeneticCode.lean`, `ExactDP.lean`, `KineticAndParity.lean` et `Spec.lean`) déclarent toutes les structures de données, fonctions et propositions cibles (`Prop_*`) avec zéro `sorry`, liés aux empreintes de `spec_lock_manifest.json`.
- **Preuves tactiques isolées (`formal/FactorForgeFormal/Proofs/`) :** cinq modules importent `Spec/` en lecture seule et établissent **20 théorèmes principaux** et **3 lemmes structurels** par induction structurelle, invariants de pliage (`foldl`), réduction noyau (`decide`) et arithmétique entière linéaire (`omega`), sans Mathlib ni `native_decide`.
- **Témoins concrets de non-vacuité et audit des axiomes (`Witnesses.lean`, `Audit.lean`) :** quatorze théorèmes vérifiés par le noyau instancient les spécifications sur un automate BsaI à 12 états (`GGTCTC` / `GAGACC`) pour le construit `"GGTC" + "SL" + "TAA"`, réfutant les codons malformés et prouvant la sélection constructive d'`AGCCTG` au score quantifié `-357`. `Audit.lean` exécute `#print axioms` sur les 34 déclarations, suivi d'un rejeu indépendant via `leanchecker`.
- **Correspondance Python échantillonnée et tests de mutation (`tests/`) :** recoupe `factorforge_snapshot/` avec un énumérateur indépendant d'Aho-Corasick (`BruteForceCDSOracle`), un miroir entier exact (`LeanExactMirrorDP`), un fuzzer réducteur sur 200 instances et quatre graines `PYTHONHASHSEED`, ainsi qu'une suite de 8 mutations sémantiques sur copie de référence. **Note importante : la revue adversariale multi-agents effectuée en interne est un contrôle d'ingénierie automatisé et ne remplace pas un audit indépendant par des mathématiciens humains ou des spécialistes de la vérification formelle.**

## 2. Algèbre tropicale max-plus (`Spec/Tropical.lean`)

La maximisation additive du log-CAI sur des états finis atteignables est formalisée sur le semi-anneau entier étendu $\mathrm{Trop}(\mathbb{Z}) = \mathbb{Z} \cup \{-\infty\}$, où les cellules `(gc, state)` inatteignables valent $-\infty$, l'extension de chemin additionne les scores entiers et la relaxation d'état prend le maximum point par point.

> **Définition 2.1 (Porteur tropical, opérations et ordre partiel).** Pour un type porteur $\alpha$, le type inductif `Trop α` possède les constructeurs `negInf` ($-\infty$, élément neutre additif $\mathbb{0}$) et `finite a` (élément neutre multiplicatif $\mathbb{1} = \mathrm{finite}(0)$). Sur $\alpha = \mathbb{Z}$, la relaxation $\oplus$, l'extension $\otimes$ et l'ordre partiel $\le$ sont définis par :

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

> **Théorème 2.1 (`tropIntSemiringLaws`) et Théorème 2.2 (`tropIntOrderLaws`).** $(\mathrm{Trop}(\mathbb{Z}), \oplus, \otimes, -\infty, 0)$ satisfait les 12 axiomes du semi-anneau max-plus idempotent (associativité, commutativité, idempotence $a \oplus a = a$, neutre $-\infty$ pour $\oplus$ ; associativité, unité $0$ et absorption par $-\infty$ pour $\otimes$ ; distributivité gauche et droite $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$) et $(\mathrm{Trop}(\mathbb{Z}), \le)$ est un ordre partiel dont $\oplus$ est la borne supérieure et $\otimes$ est monotone selon les deux arguments.

> **Esquisse de preuve (`Proofs/Tropical.lean`).** Analyse exhaustive des trois constructeurs (`cases a <;> cases b <;> cases c`), réduisant les branches finies à des buts linéaires entiers sur `max` et `+` résolus par `omega` (`#print axioms` : `[propext, Quot.sound]`).

## 3. Sûreté par automate fini à l'échelle du construit (`Spec/Automaton.lean`)

Les sites de restriction interdits (tels que BsaI `GGTCTC` et son complément inverse `GAGACC`) ainsi que les motifs délétères peuvent chevaucher les jonctions flanc $5'$-CDS, les frontières inter-codons et les jonctions CDS-terminateur $3'$. `Spec/Automaton.lean` modélise des automates finis déterministes (DFA) bornés sur $\Sigma = \{\mathrm{A}, \mathrm{C}, \mathrm{G}, \mathrm{T}\}$.

> **Définition 3.1 (DFA borné et transition sûre par préfixe).** Un `Automaton` $M = (N, q_0, \delta, T, h_0, h_\delta)$ comprend un nombre d'états $N = \text{numStates}$, un état initial $q_0 < N$, une transition fermée $\delta : \mathbb{N} \times \Sigma \to \mathbb{N}$ ($q < N \implies \delta(q,b) < N$) et un prédicat terminal interdit $T : \mathbb{N} \to \mathbb{B}$. La transition multi-bases $\delta^* = \text{stepSeq}$ et l'évitement par préfixe $\mathrm{safeSeq}$ opèrent récursivement, tandis que `stepCodonSafe` reflète `CompiledAutomaton.step_codon` en s'arrêtant immédiatement avec `(s', false)` dès qu'une base intermédiaire atteint un état terminal.

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

> **Théorèmes 3.1-3.5 (`stepSeqAppend`, `safeSeqAppend`, `stepCodonSafeSound`, `stepCodonSafeComplete`, `fullConstructSafe`).** Les transitions multi-bases se composent homomorphiquement ($\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q,u), v)$), la sûreté par préfixe se factorise exactement aux états intermédiaires ($\mathrm{safeSeq}(M, q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(M, q, u) \land \mathrm{safeSeq}(M, \delta^*(q, u), v)$) et `stepCodonSafe` est à la fois sain et complet vis-à-vis de `(stepSeq, safeSeq)`. Par conséquent, pour tout flanc $5'$ $F_L$, toute liste de codons $C$ et toute queue $3'$ $F_R$ avec $q_L = \delta^*(q_0, F_L)$ et $q_{\mathrm{end}} = \delta^*(q_L, \mathrm{flatten}(C))$ :

$$
\mathrm{safeSeq}(M, q_0, F_L) \;\land\; \mathrm{safeCodonList}(M, q_L, C) \;\land\; \mathrm{safeSeq}(M, q_{\mathrm{end}}, F_R)
\;\Longrightarrow\;
\mathrm{safeSeq}\bigl(M, q_0, F_L \mathbin{\Vert} \mathrm{flatten}(C) \mathbin{\Vert} F_R\bigr).
$$

> **Esquisse de preuve (`Proofs/Automaton.lean`).** Induction structurelle sur `xs` en généralisant `s`, avec disjonction sur `M.isTerminal (M.stepSym s b)`. Le lemme `safeCodonList_implies_safeSeq` étend `stepCodonSafeSound` à `cds : List (List Base)`, puis `fullConstructSafe` réécrit `List.append_assoc` et applique deux fois `safeSeqAppend` (`#print axioms` : `[propext]` uniquement).

## 4. Code génétique standard à 64 triplets et validité du menu (`Spec/GeneticCode.lean`)

Pour empêcher qu'un menu candidat malformé ne contourne la fidélité protéique ou ne falsifie le décompte GC stocké, `Spec/GeneticCode.lean` encode les $4^3 = 64$ triplets (`translateTriplet`) et le décodage récursif en phase exacte (`translateDNA`), vérifiés 64 pour 64 face à `STANDARD_GENETIC_CODE` en Python.

> **Définition 4.1 (`ValidCodonForAA` et `WellFormedMenu`).** Un candidat $c = (\mathrm{seq}, \mathrm{gc}, \mathrm{score})$ est valide pour le résidu cible $a \in \mathcal{A}$ si et seulement s'il a pour longueur exacte 3, si son compte GC nucléotidique égale son champ `gc` et si sa traduction sens vaut $a$ :

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

> **Théorème 4.1 (`geneticCodePartition64`, zéro axiome), Lemmes 4.2-4.3 (`validCodonForAA_destruct`, `translateDNA_cons3`) et Théorèmes 4.4-4.5 (`gcConservation`, `proteinPreservationAndGC`).** Dans le noyau Lean avec **zéro axiome**, les 64 triplets ADN se partitionnent en exactement `61` codons sens et `3` codons stop (`TAA`, `TAG`, `TGA`). Sous `WellFormedMenu P L`, tout chemin `ValidPath M s0 L C` s'aplatit en un ADN codant $D = \mathrm{flatMap}(\mathrm{seq}, C)$ vérifiant :

$$
|D| = 3|P|, \qquad
\mathrm{pathGC}(C) = \sum_{i=1}^{|P|} c_i.\mathrm{gc} = \mathrm{seqGC}(D), \qquad
\mathrm{translateDNA}(D) = \mathrm{some}(P),
$$

garantissant l'absence de décalage de cadre et l'absence de codons stop internes ou terminaux.

## 5. Optimalité de Bellman et extraction constructive de témoin (`Spec/ExactDP.lean`)

### 5.1 Table de Bellman tropicale vs solveur constructif avec suivi de candidats

Sur le treillis discret d'états $(g, s) \in \{0,\dots,G_{\max}\} \times \{0,\dots,N-1\}$, `Spec/ExactDP.lean` définit à la fois la récurrence de valeur tropicale `dpEval` / `dpBestScore` et le solveur constructif `dpTrackEval` / `dpOptimize`.

$$
V_i(g', s') := \bigoplus_{s = 0}^{N - 1} \;\bigoplus_{\substack{c \in O_i : \; c.\mathrm{gc} \le g' \\ \mathrm{stepCodonSafe}(M, s, c.\mathrm{seq}) = (s', \mathrm{true})}}
\Bigl(V_{i-1}(g' - c.\mathrm{gc}, s) \otimes \mathrm{finite}(c.\mathrm{score})\Bigr),
\qquad V_0(g, s) = \begin{cases} 0 & (g,s)=(0,s_0), \\ -\infty & \text{otherwise.} \end{cases}
$$

Pour renvoyer explicitement une liste optimale de codons `some (v, cs)` plutôt qu'une simple preuve existentielle de valeur, `DPCandidate := Option (Int × List CodonSpec)` associe score entier et préfixe de codons via la relaxation déterministe `relaxCand` (conservant le premier vu en cas d'égalité) et `extendCand`.

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

### 5.2 Sûreté, complétude, élagage et théorème central `dpOptimizeEndToEnd`

> **Théorèmes 5.1-5.3 (`dpSoundness`, `dpCompleteness`, `exactGlobalOptimality`) et Lemme (`exactOpt_witness_eq`).** Pour $s_0 < M.\mathrm{numStates}$, toute entrée finie $V_L(g, s) = \mathrm{finite}(v)$ atteste l'existence d'un `ValidPath` authentique correspondant à $(g, s, v)$, et tout `ValidPath` est majoré par $V_L(\mathrm{pathGC}(C), \delta^*(s_0, D))$. La projection terminale `dpBestScore` majore tous les chemins `FeasibleCDS` et atteint tout optimum global fini.

> **Théorème 5.4 (Théorème central : `dpOptimizeEndToEnd`).** Sous `WellFormedMenu P L` avec $s_0 = \delta^*(q_0, F_L)$ :
> 1. **Raffinement de valeur :** si $\mathrm{safeSeq}(M, q_0, F_L) = \mathrm{true}$, alors $\mathrm{candToTrop}(\mathrm{dpOptimize}(\dots)) = \mathrm{dpBestScore}(\dots)$.
> 2. **Certificat complet d'infaisabilité :** $\mathrm{dpOptimize}(\dots) = \mathrm{none}$ si et seulement si $F_L$ est dangereux ou aucun chemin `FeasibleCDS` n'existe.
> 3. **Optimalité constructive en 8 points :** lorsque $\mathrm{dpOptimize}(\dots) = \mathrm{some}(v, C)$ avec $D = \mathrm{flatMap}(\mathrm{seq}, C)$, $C$ est faisable, $\mathrm{pathScore}(C) = v$, $|D| = 3|P|$, $\mathrm{translateDNA}(D) = \mathrm{some}(P)$, $g_{\min} \le \mathrm{seqGC}(D) \le g_{\max}$, le construit complet $F_L \mathbin{\Vert} D \mathbin{\Vert} F_R$ évite tout état interdit depuis $q_0$, et $\mathrm{pathScore}(C') \le v$ pour tout concurrent faisable $C'$.

> **Théorèmes 5.5-5.6 (`gcEnvelopeAndPruningAdmissible`, `synonymousEnvelopeUnsat`).** Tout découpage faisable $C = C_{\mathrm{pre}} \mathbin{\Vert} C_{\mathrm{suf}}$ satisfait $g_{\min} \le \mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMaxGC}(\mathcal{L}_{\mathrm{suf}})$ et $\mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMinGC}(\mathcal{L}_{\mathrm{suf}}) \le g_{\max}$, prouvant que l'élagage par enveloppe GC suffixe ne supprime jamais une complétion optimale, et toute fenêtre GC disjointe de $[\mathrm{totalMinGC}(\mathcal{L}), \mathrm{totalMaxGC}(\mathcal{L})]$ n'admet aucune solution.

> **Esquisse de preuve (`Proofs/ExactDP.lean`, 1 225 lignes).** Utilise l'induction par ajout en fin de liste (`list_snoc_rec`) sur les couches DP et des lemmes d'invariants de pliage imbriqués sur `List.range M.numStates` et `opts`. Le lemme d'homomorphisme `candToTrop_dpTrackEval` relie `dpTrackEval` à `dpEval` via `candToTrop (relaxCand x y) = oplus (candToTrop x) (candToTrop y)`, tandis que `dpTrackSoundness` combine `proteinPreservationAndGC`, `fullConstructSafe` et `exactGlobalOptimality`.

## 6. Cinétique rationnelle exacte, ordres de départage et marges de perturbation (`Spec/KineticAndParity.lean`)

> **Définition 6.1 (`ExactRat` et `rampTau`).** Les rationnels exacts $\mathrm{ExactRat} = \{(p, q) \in \mathbb{Z}^2 : q > 0\}$ sont comparés par produit en croix ($a.p \cdot b.q < b.p \cdot a.q$) sans division ni arrondi flottant. L'interpolation linéaire de rampe de décélération en amont $\tau_{\mathrm{ramp}}(\tau_p, d, W) = \tau_p + \frac{d}{W}(1 - \tau_p)$ est représentée exactement par :

$$
\mathrm{rampTau}\bigl((p, q), d, W\bigr) := \frac{pW + d(q - p)}{qW}, \qquad (q > 0,\; W > 0).
$$

> **Théorèmes 6.1-6.4 (`tasepRampBoundsAndMonotonicity`, `zeroWeightParity`, `pathLexTotalOrder`, `approxScoreExactness`).**
> - **Intériorité stricte et monotonie de la rampe :** pour $0 < \tau_p < 1$ et $1 \le d < W$, $\tau_p <_{\mathbb{Q}} \mathrm{rampTau}(\tau_p, d, W) <_{\mathbb{Q}} 1$ ; $\mathrm{rampTau}$ est strictement croissante en $d$ et invariante en $\tau_p = 1$.
> - **Parité à poids nul :** lorsque tous les poids de pause actifs valent $0$, `structFitness` se réduit identiquement au score de base dans chaque cellule $(g, s)$ de `dpEval`.
> - **Ordre total strict lexicographique :** le comparateur de rangs préfixes `pathLexLt` est irréflexif, transitif, antisymétrique et trichotomique sur `List Nat`.
> - **Marge conditionnelle de perturbation entière (`List Int`) :** si l'erreur entière par étape vérifie $|a_i - t_i| \le \varepsilon$, alors $\bigl|\sum_{i=1}^L a_i - \sum_{i=1}^L t_i\bigr| \le L\varepsilon$, et $\tilde{S}_{\mathrm{alt}} + 2\Delta < \tilde{S}_{\mathrm{opt}}$ avec $|\tilde{S} - S| \le \Delta$ garantit $S_{\mathrm{alt}} < S_{\mathrm{opt}}$.

> **Limite d'exécution (`float` vs `List Int` / `ExactRat`).** `approxScoreExactness` est un théorème conditionnel sur `List Int` (quantification en virgule fixe), et non une borne d'erreur sur les flottants binary64 `math.log`. De même, `round(..., 3)` dans `TASEPKineticsEngine` en Python écrase l'intériorité stricte $< 1.0$ dès $\tau_p \ge 0.999$ (par exemple $\tau_p = 0.999, d = 2, W = 3 \mapsto 1.0$).

## 7. Automate BsaI à 12 états et trace constructive de réfutation (`Witnesses.lean`)

Pour prouver la non-vacuité dans le noyau Lean, `Witnesses.lean` encode l'automate déterministe Aho-Corasick à 12 états pour BsaI (`GGTCTC` $\to$ état terminal `6` ; complément inverse `GAGACC` $\to$ état terminal `11`) et optimise le dipeptide `"SL"` (`[.S, .L]`) sur le flanc $5'$ `"GGTC"`, la queue stop $3'$ `"TAA"` et la fenêtre GC `[2, 4]` :

1. **Passage du flanc (`witness_leftFlank_safe`) :** `"GGTC"` transite sûrement $0 \xrightarrow{\mathrm{G}} 1 \xrightarrow{\mathrm{G}} 2 \xrightarrow{\mathrm{T}} 3 \xrightarrow{\mathrm{C}} 4$ (`s0 = 4`).
2. **Réfutation d'une violation à la jonction (`witness_tct_rejected`) :** le meilleur codon Sérine `TCT` (score quantifié `-223`) transite $4 \xrightarrow{\mathrm{T}} 5 \xrightarrow{\mathrm{C}} \mathbf{6}$, complétant `"GGTCTC"` à travers la jonction $5'$ et étant rejeté avec `(6, false)`.
3. **Réfutation d'entrées malformées (`witness_malformed_codon_rejected`) :** `decide` rejette `AAA` déclarant `gc = 3`, `AAA` pour `.S` et le codon stop `TAA` pour `.Y`.
4. **Optimum global constructif (`witness_dpOptimize_sl_end_to_end`) :** `dpOptimize` sélectionne `AGC` ($4 \to 0 \to 1 \to 0$, score `-357`, `gc = 2`), suivi de `CTG` ($0 \to 0 \to 0 \to 1$, score `0`, `gc = 2`) et de la queue sûre `"TAA"` ($1 \to 0 \to 0 \to 0$), renvoyant `some (-357, [AGC, CTG])` (`"AGCCTG"`, `seqGC = 4`).

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

## 8. Catalogues complets des théorèmes, témoins, mutations et formulations

### 8.1 Les 20 théorèmes principaux audités + 3 lemmes structurels (`Audit.lean`)

Légende des axiomes (`lake env lean FactorForgeFormal/Audit.lean`) : **`none`** = zéro axiome ; **`P`** = `[propext]` ; **`P, Q`** = `[propext, Quot.sound]` ; **`P, C, Q`** = `[propext, Classical.choice, Quot.sound]` (zéro `sorryAx`, zéro axiome personnalisé).

| Module | Identifiant Lean | `#print axioms` | Énoncé mathématique vérifié |
| --- | --- | --- | --- |
| `Tropical` | `tropIntSemiringLaws` | `P, Q` | 12 lois du semi-anneau max-plus idempotent sur $\mathrm{Trop}(\mathbb{Z})$ |
| `Tropical` | `tropIntOrderLaws` | `P, Q` | Ordre partiel, borne supérieure et monotonie de $\oplus$/$\otimes$ |
| `Automaton` | `stepSeqAppend` | `P` | $\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q, u), v)$ pour toutes séquences $u, v$ |
| `Automaton` | `safeSeqAppend` | `P` | $\mathrm{safeSeq}(q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(q, u) \land \mathrm{safeSeq}(\delta^*(q, u), v)$ |
| `Automaton` | `stepCodonSafeSound` | `P` | `stepCodonSafe(q, c) = (q', true)` implique $\delta^*(q, c) = q'$ et `safeSeq(q, c)` |
| `Automaton` | `stepCodonSafeComplete` | `P` | `safeSeq(q, c) = true` implique `stepCodonSafe(q, c) = (stepSeq(q, c), true)` |
| `Automaton` | `fullConstructSafe` | `P` | Flanc $5'$, codons et queue $3'$ sûrs assurent un construit complet sûr |
| `GeneticCode` | `geneticCodePartition64` | `none` | Partition des 64 triplets ADN en 61 codons sens et 3 stops |
| `GeneticCode` | `validCodonForAA_destruct` *(lemme)* | `P, C, Q` | Décompose `ValidCodonForAA` en 3 bases, GC exact et AA sens |
| `GeneticCode` | `translateDNA_cons3` *(lemme)* | `P` | Un préfixe triplet sens valide préserve `translateDNA` récursif |
| `ExactDP` | `gcConservation` | `P, C, Q` | La somme des champs `gc` égale le `seqGC` nucléotidique aplati |
| `ExactDP` | `proteinPreservationAndGC` | `P, C, Q` | Tout `ValidPath` sur `WellFormedMenu` préserve $3\lvert P\rvert$, `seqGC` et `some P` |
| `ExactDP` | `dpSoundness` | `P, C, Q` | Toute entrée finie `dpEval` atteste un `ValidPath` réel en $(g, s, v)$ |
| `ExactDP` | `dpCompleteness` | `P, C, Q` | Tout `ValidPath` est majoré par `dpEval` en $(g, s)$ |
| `ExactDP` | `exactGlobalOptimality` | `P, C, Q` | `dpBestScore` majore tout `FeasibleCDS` et atteint tout optimum fini |
| `ExactDP` | `exactOpt_witness_eq` *(lemme)* | `P, C, Q` | Un témoin faisable majorant tous ses concurrents égale `dpBestScore` |
| `ExactDP` | `dpOptimizeEndToEnd` | `P, C, Q` | Équivalence constructive de `dpOptimize`, `none`-iff-unsat et optimalité en 8 points |
| `ExactDP` | `gcEnvelopeAndPruningAdmissible` | `P, C, Q` | Les bornes GC suffixes $[G_{\min}, G_{\max}]$ préservent toutes les complétions faisables |
| `ExactDP` | `synonymousEnvelopeUnsat` | `P, C, Q` | Zéro chemin faisable hors de l'enveloppe $[G_{\min}, G_{\max}]$ |
| `KineticAndParity` | `tasepRampBoundsAndMonotonicity` | `P, Q` | Intériorité rationnelle $(\tau_p, 1)$, monotonie stricte et invariance en $\tau_p = 1$ |
| `KineticAndParity` | `zeroWeightParity` | `P, Q` | Des poids de pause nuls réduisent fitness et table DP complète à la base |
| `KineticAndParity` | `pathLexTotalOrder` | `P, Q` | Irréflexivité, transitivité, asymétrie et trichotomie de `pathLexLt` |
| `KineticAndParity` | `approxScoreExactness` | `P, Q` | Borne d'erreur `List Int` $L\varepsilon$ et préservation d'argmax à $2\Delta$ |

### 8.2 Les 14 théorèmes témoins et réfutations concrètes (`Witnesses.lean`)

| Identifiant du témoin | `#print axioms` | Propriété concrète vérifiée par le noyau |
| --- | --- | --- |
| `witness_malformed_codon_rejected` | `P` | Rejette `AAA` avec `gc = 3`, `AAA` pour `.S` et `TAA` pour `.Y` |
| `witness_sl_wellFormedMenu` | `P` | Certifie que 6 options Sérine + 6 Leucine satisfont `WellFormedMenu [.S, .L]` |
| `witness_leftFlank_safe` | `P, Q` | Le flanc gauche `"GGTC"` est sûr sur le DFA BsaI et atteint l'état `4` |
| `witness_sl_feasible` | `P, Q` | Le chemin `AGCCTG` satisfait `FeasibleCDS` sur `"GGTC" + "SL" + "TAA"` |
| `witness_dpBest_sl_exact` | `P, C, Q` | Prouve `dpBestScore(...) = finite (-357)` via `exactOpt_witness_eq` |
| `witness_dpOptimize_sl_end_to_end` | `P, C, Q` | Extrait constructivement `some (-357, cs)` traduit en `[.S, .L]` |
| `witness_tct_rejected` | `P, Q` | Prouve que `TCT` depuis l'état `4` atteint l'état BsaI interdit `6` |
| `witness_gc_and_protein_preservation` | `P, C, Q` | Instancie `proteinPreservationAndGC` sur `optPathSL` (`AGCCTG`) |
| `witness_gc_pruning_admissible` | `P, C, Q` | Vérifie les bornes GC `[2, 4]` pour le préfixe `AGC` + suffixe Leucine |
| `witness_tasep_ramp` | `P, Q` | Certifie $\frac{7}{20} < \mathrm{rampTau}(\frac{7}{20}, 1, 3) < 1$ dans `ExactRat` |
| `witness_zero_weight_parity` | `P, Q` | Confirme que des poids nuls préservent le score `-357` à l'identique |
| `witness_path_lex_order` | `P, Q` | Certifie `[14, 19] < [15, 19] < [48, 19] => [14, 19] < [48, 19]` |
| `witness_approx_margin_exactness` | `P, Q` | Certifie la marge à 2 codons $-511 + 2(2) < -357 \implies -510 < -356$ |
| `witness_unsat_gc` | `P, C, Q` | Certifie zéro chemin faisable pour une bande GC cible `[5, 6] > 4` |

### 8.3 Audit de mutation sur copie de référence (`8/8` défauts sémantiques tués)

Sur 200 instances aléatoires répétées sous `PYTHONHASHSEED` $\in \{0, 1, 2, 3\}$, `DPV2Optimizer` concorde avec `BruteForceCDSOracle` en faisabilité, traduction, sûreté et score optimal, tout en mettant en évidence une différence de départage sur les homodipeptides (`FF`: `TTTTTC` vs `TTCTTT`, score identique en `(g = 1, s = 0)`). Dans `test_mutation_detection_audit.py`, 8 défauts sémantiques injectés ont tous été tués :

| ID du mutant | Résultat | Défaut injecté et assertion détectrice |
| --- | --- | --- |
| `M1_WRONG_SYNONYMOUS_CODON` | **Tué** | Injecte `AAA` (Lys, `gc = 0`) dans Sérine sur `"SL"` (`[0.30, 0.67]` GC) ; tué par `translate_dna(seq) != "SL"`. |
| `M2_GC_COUNT_DROP_C` | **Tué** | Compte uniquement `'G'` sur `"TT"` (`[0.66, 0.67]` GC) ; tué par la fenêtre GC et l'ensemble oracle. |
| `M3_DROP_REVERSE_COMPLEMENT` | **Tué** | Omet le complément inverse `GAGACC` sur `"GA" + "DL"` ; émet `GAGACC`, tué par recherche brute. |
| `M4_IGNORE_LEFT_FLANK` | **Tué** | Démarre à `s0 = 0` au lieu de `step("GGTC") = 4` sur `"GGTC" + "SL" + "TAA"` ; émet `TCT` (`GGTCTC`). |
| `M5_IGNORE_RIGHT_FLANK` | **Tué** | Ignore la vérification de queue droite sur `"" + "G" + "CTC"` ; émet `GGT` (`GGTCTC`). |
| `M6_OFF_BY_ONE_MAX_GC` | **Tué** | Remplace `g <= max_gc` par `g < max_gc` sur `"TT"` (`min_gc = max_gc = 4`) ; lève `No in-band candidate`. |
| `M7_MIN_INSTEAD_OF_MAX` | **Tué** | Minimise le log-CAI au lieu de le maximiser ; tué par comparaison au score optimal de l'oracle. |
| `M8_CORRUPT_BACKPOINTER` | **Tué** | Stocke `prev_g = g + 1` en passe avant ; échoue au rétro-parcours (`KeyError` ou séquence erronée). |

### 8.4 Matrice de couverture des formulations (`F1`-`F28`)

Niveaux : **L1** = preuve noyau Lean 4 ; **O1** = suite exhaustive/fuzzer/mutants de cette archive ; **C1** = tests unitaires déterministes du dépôt principal ; **(B)** = divergence d'exécution documentée.

| ID | Formulation | Ancrage Lean 4 / Python | Niveau | Note de portée |
| --- | --- | --- | --- | --- |
| `F1` | Fréquence codonique $f(c)$ | `load_codon_usage_table` | `C1` | Chargeur de tables |
| `F2` | Adaptativité relative $w(c)$ | `_build_codon_weights` | `C1 + O1` | Plancher $10^{-6}$ |
| `F3` | CAI géométrique et somme log | `pathScore`, `approxScoreExactness` | `L1 + O1 (B)` | `Int` vs `float` binary64 |
| `F4` | Compte et % GC nucléotidique | `seqGC`, `gcConservation` | `L1 + O1` | GC entier exact |
| `F5` | Code génétique à 64 triplets | `translateTriplet`, `geneticCodePartition64` | `L1 + O1` | Bijection 64/64 |
| `F6` | Traduction sens $\mathrm{Translate}(D)=P$ | `ValidCodonForAA`, `proteinPreservationAndGC` | `L1 + O1` | Sûreté du menu |
| `F7` | Motifs interdits + clôture RC | `Automaton`, `AutomatonCompiler` | `L1 + O1 (B)` | Table DFA fournie |
| `F8` | Sûreté de jonction du construit | `fullConstructSafe` | `L1 + O1` | Flancs arbitraires |
| `F9` | Ensemble CDS faisable $\mathcal{F}(P,\theta)$ | `FeasibleCDS`, `synonymousEnvelopeUnsat` | `L1 + O1` | Bande GC entière |
| `F10`-`F14` | Random, Greedy, Balanced, GC-target, SOP / réécriture locale | `reverse_translator.py`, `sop_balancer.py`, `local_rewriter.py` | `C1` | Heuristiques non-DP |
| `F15` | Semi-anneau tropical max-plus | `tropIntSemiringLaws`, `tropIntOrderLaws` | `L1 + O1` | Algèbre $\mathbb{Z}\cup\{-\infty\}$ |
| `F16` | Transition de Bellman avant | `dpStep`, `dpSoundness`, `dpCompleteness` | `L1 + O1 (B)` | Rampe $5'$ hors Lean |
| `F17` | Filtre terminal et optimum global | `dpBestScore`, `exactGlobalOptimality` | `L1 + O1 (B)` | Repli dans `O1` |
| `F18` | Rétropropagation et départage | `dpOptimizeEndToEnd`, `pathLexTotalOrder` | `L1 + O1 (B)` | 3 règles de départage |
| `F19` | Élagage GC suffixe et rampe TASEP | `gcEnvelopeAndPruningAdmissible`, `tasepRampBoundsAndMonotonicity` | `L1 + O1 (B)` | `round(..., 3)` près de $1.0$ |
| `F20`-`F26` | Portes de passage, GC fenêtré, homopolymères, dinucléotides | `SharedEvaluator`, `BenchmarkRunner` | `C1 (+ O1)` | Métriques descriptives |
| `F27` | Intégrité du manifeste | `verify_all.py`, `REPRODUCIBILITY_MANIFEST.json` | `O1` | Verrou sur 229 fichiers |
| `F28` | Porte épistémique | `UNVERIFIED_PUBLIC_CORPUS` | `Governance` | Zéro allégation in vivo |

## 9. Frontières exactes de preuve et protocole de rejeu fail-closed

Ce jalon prouve la correction mathématique du **modèle DP entier discret explicitement spécifié** de FactorForge, et non une vérification formelle universelle de toute la pile Python :

| Domaine | État actuel | Limite technique exacte |
| --- | --- | --- |
| **Noyau DP entier discret et traduction 64 codons (`FactorForgeFormal`)** | **Vérifié en Lean 4** | 20 théorèmes + 3 lemmes, 14 témoins, 34 contrôles `#print axioms` (`0 sorry`), vérifié par `leanchecker`. L'optimalité est relative aux `WellFormedMenu` fournis (validité des options fournies ; correspondance universelle avec les menus exécutés non démontrée). |
| **Correspondance Python échantillonnée et archive reproductible** | **Achevé (suite finie)** | 28 tests `pytest`, 4 exécutions `PYTHONHASHSEED`, `8/8` mutants tués et contrôle d'intégrité de 229 fichiers (`python verify_all.py`). |
| **Raffinement universel Python-vers-Lean et pointeurs arrière** | **Non prouvé (portée future)** | `dpOptimize` en Lean suit des listes préfixes ; le Python opérationnel reconstruit des pointeurs `(prev_g, prev_s)` mutables et n'est pas extrait de Lean. |
| **Bornes d'erreur `float` IEEE-754 et tolérance `1e-12`** | **Non prouvé (portée future)** | La DP opérationnelle somme des flottants binary64 `math.log` avec une tolérance non transitive `1e-12` (3 politiques distinctes de départage coexistent). `approxScoreExactness` est conditionnel sur `List Int`. |
| **Compilateur de motifs général et heuristiques hors DP** | **Non prouvé en Lean** | Lean suppose une table DFA fournie plutôt que la compilation Aho-Corasick générale ; `AutomatonCompiler` permute les IDs d'état selon `PYTHONHASHSEED` ; `round(..., 3)` casse l'intériorité stricte près de $1.0$ ; le clamping $5'$ et les heuristiques sont hors `ExactDP.lean`. |
| **Expression biologique et performance en laboratoire** | **Non disponible** | `UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE`. L'exactitude mathématique n'implique aucune garantie d'expression ou de rendement expérimental. |

Pour rejouer localement l'intégralité de l'archive depuis un état propre (avec Python 3.11+, `pytest`, `ruff` et `elan` `leanprover/lean4:v4.36.0`), décompressez `FactorForge_Lean4_Verification_Package.zip` dans un chemin court et exécutez :

```bash
python verify_all.py
```
