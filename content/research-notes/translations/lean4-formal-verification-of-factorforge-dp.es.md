---
lang: "es"
langLabel: "Español"
title: "Verificación formal en Lean 4 del modelo discreto de programación dinámica de FactorForge"
summary: "Plano matemático, especificaciones bloqueadas en Lean 4.36.0, bosquejos de pruebas inductivas, traza constructiva en autómata BsaI de 12 estados y correspondencia muestreada en Python para el núcleo DP entero discreto de FactorForge."
version: "Monografía técnica v1.0.3 · Lean 4.36.0"
evidenceScope: "Pruebas autónomas en Lean 4.36.0 y pruebas finitas de correspondencia en Python; sin prueba completa de refinamiento en Python ni validación biológica"
abstract: "El diseño de secuencias codificantes (CDS) bajo restricciones selecciona codones sinónimos que preservan una proteína objetivo evitando motivos prohibidos en flancos y uniones inter-codón, cumpliendo cotas globales de contenido GC nucleotídico y maximizando un objetivo aditivo de adaptación codónica. Las pruebas unitarias finitas solo verifican entradas muestreadas, mientras que los argumentos informales o generados por IA sin restricciones corren el riesgo de debilitar las especificaciones si no pasan por un núcleo formal independiente. Presentamos el plano matemático completo de FactorForgeFormal, una formalización en Lean 4.36.0 sin dependencias externas (14 módulos, >2.500 líneas, 0 sorry, verificada transitivamente con leanchecker) que demuestra 20 teoremas centrales, 3 lemas auxiliares y 14 testigos concretos sobre álgebra tropical max-plus, seguridad DFA a nivel de constructo, el código genético estándar de 64 tripletes (ValidCodonForAA), optimalidad DP constructiva con retroceso (dpOptimizeEndToEnd), interpolación racional exacta de rampa cinética (ExactRat) y márgenes condicionales de perturbación entera, junto con una batería Python fail-closed y 8/8 mutaciones semánticas detectadas."
pdfLabel: "Descargar monografía técnica completa v1.0.3 (PDF, 14p)"
bundleLabel: "Descargar archivo reproducible Lean 4 + Oráculo (.zip)"
toc:
  - id: "sec-1"
    number: "1"
    title: "Arquitectura de verificación y separación de confianza"
  - id: "sec-2"
    number: "2"
    title: "Álgebra tropical max-plus (Spec/Tropical.lean)"
  - id: "sec-3"
    number: "3"
    title: "Seguridad DFA del constructo completo (Spec/Automaton.lean)"
  - id: "sec-4"
    number: "4"
    title: "Código genético de 64 tripletes y validez del menú"
  - id: "sec-5"
    number: "5"
    title: "Optimalidad de Bellman y dpOptimize constructivo"
  - id: "sec-6"
    number: "6"
    title: "Cinética racional exacta, desempates y márgenes"
  - id: "sec-7"
    number: "7"
    title: "Autómata BsaI de 12 estados y traza de refutación"
  - id: "sec-8"
    number: "8"
    title: "Catálogos de teoremas, testigos, mutantes y F1-F28"
  - id: "sec-9"
    number: "9"
    title: "Límites exactos de prueba y protocolo de reproducción"
---

## 1. Arquitectura de verificación y separación de confianza por roles

Comprobar un compilador de secuencias codificantes basado en programación dinámica (DP) mediante pruebas unitarias finitas confirma la paridad entrada-salida en ejemplos elegidos, pero no puede certificar invariantes universales para longitudes proteicas arbitrarias $L$, ventanas enteras estrechas de GC $[g_{\min}, g_{\max}]$ ni puentes de motivos entre flancos $5'$, tripletes codificantes y colas $3'$. Por otro lado, delegar tanto el diseño de especificaciones como la redacción de pruebas a un único flujo automatizado sin restricciones introduce dos modos de fallo conocidos:

1. **Debilitamiento de especificaciones y vacuidad:** una formalización puede omitir la invariancia de traducción sinónima ($\mathrm{Translate}(D) = P$), confiar en metadatos no verificados de los candidatos (por ejemplo, un registro `AAA` que declara `gc = 3` o un codón de parada `TAA` dentro de un menú con sentido), o probar implicaciones universales cuyas hipótesis son insatisfacibles.
2. **Confusión entre modelo e implementación:** demostrar la optimalidad de Bellman para un modelo entero discreto sobre $\mathbb{Z} \cup \{-\infty\}$ no equivale a demostrar el refinamiento universal de un optimizador Python operacional que acumula flotantes IEEE-754 binary64 con `math.log`, aplica una tolerancia de empate intra-estado `1e-12` y reconstruye rutas mediante punteros hacia atrás mutables.

Para evitar derivas silenciosas y medir explícitamente las fronteras de ejecución, `FactorForgeFormal` impone una separación de confianza en cuatro capas:

- **Especificaciones Lean 4 bloqueadas (`formal/FactorForgeFormal/Spec/`):** seis módulos (`Tropical.lean`, `Automaton.lean`, `GeneticCode.lean`, `ExactDP.lean`, `KineticAndParity.lean` y `Spec.lean`) declaran todos los tipos de datos, algoritmos y proposiciones objetivo (`Prop_*`) con cero `sorry`, vinculados a resúmenes SHA-256 en `spec_lock_manifest.json`.
- **Pruebas tácticas aisladas (`formal/FactorForgeFormal/Proofs/`):** cinco módulos importan `Spec/` en solo lectura y demuestran **20 teoremas centrales** y **3 lemas estructurales** mediante inducción estructural, invariantes de plegado, reducción de núcleo (`decide`) y aritmética lineal entera (`omega`), sin Mathlib ni `native_decide`.
- **Testigos concretos y auditoría de axiomas (`Witnesses.lean`, `Audit.lean`):** catorce teoremas comprobados por el núcleo instancian las especificaciones en un autómata BsaI de 12 estados (`GGTCTC` / `GAGACC`) sobre `"GGTC" + "SL" + "TAA"`, refutando codones malformados y probando la selección constructiva de `AGCCTG` con puntuación cuantizada `-357`. `Audit.lean` ejecuta `#print axioms` en las 34 declaraciones, seguido de una verificación independiente con `leanchecker`.
- **Correspondencia Python muestreada y pruebas de mutación (`tests/`):** contrasta `factorforge_snapshot/` con un enumerador de subcadenas independiente de Aho-Corasick (`BruteForceCDSOracle`), un espejo entero exacto (`LeanExactMirrorDP`), un fuzzer reductor de 200 instancias bajo cuatro semillas `PYTHONHASHSEED` y 8 mutaciones semánticas sobre una copia de referencia. **Importante: la revisión adversarial multi-agente interna es un control automático de ingeniería y no sustituye a una auditoría independiente por matemáticos humanos ni especialistas en verificación formal.**

## 2. Álgebra tropical max-plus (`Spec/Tropical.lean`)

La maximización aditiva de log-CAI sobre estados finitos alcanzables se formaliza sobre el semianillo entero extendido $\mathrm{Trop}(\mathbb{Z}) = \mathbb{Z} \cup \{-\infty\}$, donde las celdas `(gc, state)` inalcanzables toman valor $-\infty$, la extensión de ruta suma puntuaciones enteras y la relajación toma el máximo.

> **Definición 2.1 (Portador tropical, operaciones y orden parcial).** Para un tipo portador $\alpha$, el tipo inductivo `Trop α` tiene constructores `negInf` ($-\infty$, neutro aditivo $\mathbb{0}$) y `finite a` (neutro multiplicativo $\mathbb{1} = \mathrm{finite}(0)$). Sobre $\alpha = \mathbb{Z}$, la relajación $\oplus$, la extensión $\otimes$ y el orden $\le$ se definen mediante:

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

> **Teorema 2.1 (`tropIntSemiringLaws`) y Teorema 2.2 (`tropIntOrderLaws`).** $(\mathrm{Trop}(\mathbb{Z}), \oplus, \otimes, -\infty, 0)$ cumple las 12 identidades de semianillo max-plus idempotente (asociatividad, conmutatividad, idempotencia $a \oplus a = a$, identidad $-\infty$ de $\oplus$; asociatividad, unidad $0$ y aniquilación por $-\infty$ de $\otimes$; distributividad izquierda y derecha $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$) y $(\mathrm{Trop}(\mathbb{Z}), \le)$ es un orden parcial donde $\oplus$ es el supremo y $\otimes$ es monótono en ambos argumentos.

> **Bosquejo de prueba (`Proofs/Tropical.lean`).** Análisis exhaustivo de tres constructores (`cases a <;> cases b <;> cases c`), reduciendo los casos finitos a metas enteras lineales sobre `max` y `+` cerradas por `omega` (`#print axioms`: `[propext, Quot.sound]`).

## 3. Seguridad por autómata finito a nivel de constructo (`Spec/Automaton.lean`)

Los sitios de restricción prohibidos (como BsaI `GGTCTC` y su complemento inverso `GAGACC`) y motivos no deseados pueden cruzar uniones entre flanco $5'$ y CDS, límites entre codones y uniones CDS-terminador $3'$. `Spec/Automaton.lean` modela autómatas finitos deterministas (DFA) acotados sobre $\Sigma = \{\mathrm{A}, \mathrm{C}, \mathrm{G}, \mathrm{T}\}$.

> **Definición 3.1 (DFA acotado y transición segura por prefijo).** Un `Automaton` $M = (N, q_0, \delta, T, h_0, h_\delta)$ consta de un número de estados $N = \text{numStates}$, estado inicial $q_0 < N$, función de transición cerrada $\delta : \mathbb{N} \times \Sigma \to \mathbb{N}$ ($q < N \implies \delta(q,b) < N$) e indicador terminal prohibido $T : \mathbb{N} \to \mathbb{B}$. La transición multi-base $\delta^* = \text{stepSeq}$ y la evitación por prefijos $\mathrm{safeSeq}$ operan recursivamente, mientras que `stepCodonSafe` refleja `CompiledAutomaton.step_codon` deteniéndose con `(s', false)` si cualquier base intermedia visita un estado terminal.

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

> **Teoremas 3.1-3.5 (`stepSeqAppend`, `safeSeqAppend`, `stepCodonSafeSound`, `stepCodonSafeComplete`, `fullConstructSafe`).** Las transiciones multi-base se componen homomórficamente ($\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q,u), v)$), la seguridad por prefijos factoriza sobre estados intermedios ($\mathrm{safeSeq}(M, q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(M, q, u) \land \mathrm{safeSeq}(M, \delta^*(q, u), v)$) y `stepCodonSafe` es sano y completo para `(stepSeq, safeSeq)`. En consecuencia, para todo flanco $5'$ $F_L$, lista de codones $C$ y cola $3'$ $F_R$ con $q_L = \delta^*(q_0, F_L)$ y $q_{\mathrm{end}} = \delta^*(q_L, \mathrm{flatten}(C))$:

$$
\mathrm{safeSeq}(M, q_0, F_L) \;\land\; \mathrm{safeCodonList}(M, q_L, C) \;\land\; \mathrm{safeSeq}(M, q_{\mathrm{end}}, F_R)
\;\Longrightarrow\;
\mathrm{safeSeq}\bigl(M, q_0, F_L \mathbin{\Vert} \mathrm{flatten}(C) \mathbin{\Vert} F_R\bigr).
$$

> **Bosquejo de prueba (`Proofs/Automaton.lean`).** Inducción estructural sobre `xs` generalizando `s`, dividiendo en `M.isTerminal (M.stepSym s b)`. El lema `safeCodonList_implies_safeSeq` eleva `stepCodonSafeSound` a `cds : List (List Base)` y `fullConstructSafe` reescribe `List.append_assoc` aplicando `safeSeqAppend` dos veces (`#print axioms`: solo `[propext]`).

## 4. Código genético estándar de 64 tripletes y validez del menú (`Spec/GeneticCode.lean`)

Para impedir que un menú candidato malformado eluda la fidelidad proteica o falsifique el conteo GC almacenado, `Spec/GeneticCode.lean` codifica los $4^3 = 64$ tripletes (`translateTriplet`) y el decodificador recursivo exacto (`translateDNA`), contrastados 64 a 64 contra `STANDARD_GENETIC_CODE` en Python.

> **Definición 4.1 (`ValidCodonForAA` y `WellFormedMenu`).** Un registro candidato $c = (\mathrm{seq}, \mathrm{gc}, \mathrm{score})$ es válido para el residuo objetivo $a \in \mathcal{A}$ si y solo si tiene longitud exacta 3, su cuenta nucleotídica GC coincide con `gc` y su traducción con sentido es $a$:

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

> **Teorema 4.1 (`geneticCodePartition64`, cero axiomas), Lemas 4.2-4.3 (`validCodonForAA_destruct`, `translateDNA_cons3`) y Teoremas 4.4-4.5 (`gcConservation`, `proteinPreservationAndGC`).** En el núcleo de Lean con **cero axiomas**, los 64 tripletes de ADN se particionan exactamente en `61` codones con sentido y `3` codones de parada (`TAA`, `TAG`, `TGA`). Bajo `WellFormedMenu P L`, todo `ValidPath M s0 L C` se aplana a un ADN codificante $D = \mathrm{flatMap}(\mathrm{seq}, C)$ que satisface:

$$
|D| = 3|P|, \qquad
\mathrm{pathGC}(C) = \sum_{i=1}^{|P|} c_i.\mathrm{gc} = \mathrm{seqGC}(D), \qquad
\mathrm{translateDNA}(D) = \mathrm{some}(P),
$$

garantizando cero desplazamientos de marco y cero codones de parada internos o terminales.

## 5. Optimalidad de Bellman y extracción constructiva de testigo (`Spec/ExactDP.lean`)

### 5.1 Tabla de Bellman tropical frente al solucionador constructivo

Sobre el retículo discreto de estados $(g, s) \in \{0,\dots,G_{\max}\} \times \{0,\dots,N-1\}$, `Spec/ExactDP.lean` define tanto la recurrencia tropical `dpEval` / `dpBestScore` como el solucionador constructivo `dpTrackEval` / `dpOptimize`.

$$
V_i(g', s') := \bigoplus_{s = 0}^{N - 1} \;\bigoplus_{\substack{c \in O_i : \; c.\mathrm{gc} \le g' \\ \mathrm{stepCodonSafe}(M, s, c.\mathrm{seq}) = (s', \mathrm{true})}}
\Bigl(V_{i-1}(g' - c.\mathrm{gc}, s) \otimes \mathrm{finite}(c.\mathrm{score})\Bigr),
\qquad V_0(g, s) = \begin{cases} 0 & (g,s)=(0,s_0), \\ -\infty & \text{otherwise.} \end{cases}
$$

Para devolver explícitamente una lista óptima de codones `some (v, cs)` en lugar de una prueba existencial, `DPCandidate := Option (Int × List CodonSpec)` empareja la puntuación entera con la lista prefijo mediante la relajación determinista `relaxCand` (conservando el primero en empates exactos) y `extendCand`.

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

### 5.2 Corrección, completitud, poda y teorema central `dpOptimizeEndToEnd`

> **Teoremas 5.1-5.3 (`dpSoundness`, `dpCompleteness`, `exactGlobalOptimality`) y Lema (`exactOpt_witness_eq`).** Para $s_0 < M.\mathrm{numStates}$, cada entrada finita $V_L(g, s) = \mathrm{finite}(v)$ atestigua un `ValidPath` auténtico con $(g, s, v)$ coincidentes, y todo `ValidPath` queda acotado superiormente por $V_L(\mathrm{pathGC}(C), \delta^*(s_0, D))$. La proyección terminal `dpBestScore` acota todos los caminos `FeasibleCDS` y alcanza cada óptimo global finito.

> **Teorema 5.4 (Teorema central: `dpOptimizeEndToEnd`).** Bajo `WellFormedMenu P L` con $s_0 = \delta^*(q_0, F_L)$:
> 1. **Refinamiento de valor:** si $\mathrm{safeSeq}(M, q_0, F_L) = \mathrm{true}$, $\mathrm{candToTrop}(\mathrm{dpOptimize}(\dots)) = \mathrm{dpBestScore}(\dots)$.
> 2. **Certificado completo de infactibilidad:** $\mathrm{dpOptimize}(\dots) = \mathrm{none}$ si y solo si $F_L$ es inseguro o no existe ningún camino `FeasibleCDS`.
> 3. **Optimalidad constructiva en 8 puntos:** cuando $\mathrm{dpOptimize}(\dots) = \mathrm{some}(v, C)$ con $D = \mathrm{flatMap}(\mathrm{seq}, C)$, $C$ es factible, $\mathrm{pathScore}(C) = v$, $|D| = 3|P|$, $\mathrm{translateDNA}(D) = \mathrm{some}(P)$, $g_{\min} \le \mathrm{seqGC}(D) \le g_{\max}$, el constructo completo $F_L \mathbin{\Vert} D \mathbin{\Vert} F_R$ evita todo estado prohibido desde $q_0$, y $\mathrm{pathScore}(C') \le v$ para todo competidor factible $C'$.

> **Teoremas 5.5-5.6 (`gcEnvelopeAndPruningAdmissible`, `synonymousEnvelopeUnsat`).** Toda partición factible $C = C_{\mathrm{pre}} \mathbin{\Vert} C_{\mathrm{suf}}$ satisface $g_{\min} \le \mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMaxGC}(\mathcal{L}_{\mathrm{suf}})$ y $\mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMinGC}(\mathcal{L}_{\mathrm{suf}}) \le g_{\max}$, demostrando que la poda GC sufija nunca descarta una compleción óptima, y toda ventana GC disjunta de $[\mathrm{totalMinGC}(\mathcal{L}), \mathrm{totalMaxGC}(\mathcal{L})]$ tiene cero soluciones.

> **Bosquejo de prueba (`Proofs/ExactDP.lean`, 1.225 líneas).** Usa inducción por concatenación final (`list_snoc_rec`) sobre las capas DP y lemas de invariantes de plegado anidados sobre `List.range M.numStates` y `opts`. El lema de homomorfismo `candToTrop_dpTrackEval` une `dpTrackEval` y `dpEval` mediante `candToTrop (relaxCand x y) = oplus (candToTrop x) (candToTrop y)`, mientras `dpTrackSoundness` integra `proteinPreservationAndGC`, `fullConstructSafe` y `exactGlobalOptimality`.

## 6. Cinética racional exacta, órdenes de desempate y márgenes (`Spec/KineticAndParity.lean`)

> **Definición 6.1 (`ExactRat` y `rampTau`).** Los racionales exactos $\mathrm{ExactRat} = \{(p, q) \in \mathbb{Z}^2 : q > 0\}$ se comparan por producto cruzado ($a.p \cdot b.q < b.p \cdot a.q$) sin división ni redondeo flotante. La interpolación lineal de rampa de desaceleración aguas arriba $\tau_{\mathrm{ramp}}(\tau_p, d, W) = \tau_p + \frac{d}{W}(1 - \tau_p)$ se representa exactamente como:

$$
\mathrm{rampTau}\bigl((p, q), d, W\bigr) := \frac{pW + d(q - p)}{qW}, \qquad (q > 0,\; W > 0).
$$

> **Teoremas 6.1-6.4 (`tasepRampBoundsAndMonotonicity`, `zeroWeightParity`, `pathLexTotalOrder`, `approxScoreExactness`).**
> - **Interioridad estricta y monotonía de rampa:** para $0 < \tau_p < 1$ y $1 \le d < W$, $\tau_p <_{\mathbb{Q}} \mathrm{rampTau}(\tau_p, d, W) <_{\mathbb{Q}} 1$; $\mathrm{rampTau}$ es estrictamente creciente en $d$ e invariante en $\tau_p = 1$.
> - **Paridad de peso nulo:** cuando todos los pesos de pausa activos valen $0$, `structFitness` colapsa idénticamente a la aptitud base en cada $(g, s)$ de `dpEval`.
> - **Orden total estricto lexicográfico:** el comparador de rangos `pathLexLt` es irreflexivo, transitivo, asimétrico y tricotómico sobre `List Nat`.
> - **Margen condicional de perturbación entera (`List Int`):** si el error entero por paso cumple $|a_i - t_i| \le \varepsilon$, entonces $\bigl|\sum_{i=1}^L a_i - \sum_{i=1}^L t_i\bigr| \le L\varepsilon$, y $\tilde{S}_{\mathrm{alt}} + 2\Delta < \tilde{S}_{\mathrm{opt}}$ con $|\tilde{S} - S| \le \Delta$ garantiza $S_{\mathrm{alt}} < S_{\mathrm{opt}}$.

> **Límite de ejecución (`float` vs `List Int` / `ExactRat`).** `approxScoreExactness` es un teorema condicional sobre `List Int` (cuantización en coma fija), no una cota de error de `math.log` en binary64. Igualmente, `round(..., 3)` en `TASEPKineticsEngine` de Python colapsa la interioridad estricta $< 1.0$ para $\tau_p \ge 0.999$ (por ejemplo $\tau_p = 0.999, d = 2, W = 3 \mapsto 1.0$).

## 7. Autómata BsaI de 12 estados y traza constructiva de refutación (`Witnesses.lean`)

Para probar no vacuidad en el núcleo Lean, `Witnesses.lean` codifica el autómata Aho-Corasick determinista de 12 estados para BsaI (`GGTCTC` $\to$ estado terminal `6`; complemento inverso `GAGACC` $\to$ estado terminal `11`) y optimiza el dipéptido `"SL"` (`[.S, .L]`) con flanco $5'$ `"GGTC"`, cola stop $3'$ `"TAA"` y ventana GC `[2, 4]`:

1. **Paso por el flanco (`witness_leftFlank_safe`):** `"GGTC"` transita de forma segura $0 \xrightarrow{\mathrm{G}} 1 \xrightarrow{\mathrm{G}} 2 \xrightarrow{\mathrm{T}} 3 \xrightarrow{\mathrm{C}} 4$ (`s0 = 4`).
2. **Refutación de violación en unión (`witness_tct_rejected`):** el mejor codón de Serina `TCT` (puntuación cuantizada `-223`) avanza $4 \xrightarrow{\mathrm{T}} 5 \xrightarrow{\mathrm{C}} \mathbf{6}$, formando `"GGTCTC"` en la unión $5'$ y siendo rechazado con `(6, false)`.
3. **Refutación de candidatos malformados (`witness_malformed_codon_rejected`):** `decide` rechaza `AAA` declarando `gc = 3`, `AAA` para `.S` y el codón de parada `TAA` para `.Y`.
4. **Óptimo global constructivo (`witness_dpOptimize_sl_end_to_end`):** `dpOptimize` selecciona `AGC` ($4 \to 0 \to 1 \to 0$, puntuación `-357`, `gc = 2`), seguido de `CTG` ($0 \to 0 \to 0 \to 1$, puntuación `0`, `gc = 2`) y la cola segura `"TAA"` ($1 \to 0 \to 0 \to 0$), devolviendo `some (-357, [AGC, CTG])` (`"AGCCTG"`, `seqGC = 4`).

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

## 8. Catálogos completos de teoremas, testigos, mutaciones y cobertura

### 8.1 Los 20 teoremas centrales auditados + 3 lemas estructurales (`Audit.lean`)

Leyenda de axiomas (`lake env lean FactorForgeFormal/Audit.lean`): **`none`** = cero axiomas; **`P`** = `[propext]`; **`P, Q`** = `[propext, Quot.sound]`; **`P, C, Q`** = `[propext, Classical.choice, Quot.sound]` (cero `sorryAx` y cero axiomas propios).

| Módulo | Identificador Lean | `#print axioms` | Enunciado matemático verificado |
| --- | --- | --- | --- |
| `Tropical` | `tropIntSemiringLaws` | `P, Q` | 12 leyes de semianillo max-plus idempotente sobre $\mathrm{Trop}(\mathbb{Z})$ |
| `Tropical` | `tropIntOrderLaws` | `P, Q` | Orden parcial, supremo y monotonía de $\oplus$/$\otimes$ |
| `Automaton` | `stepSeqAppend` | `P` | $\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q, u), v)$ para toda secuencia $u, v$ |
| `Automaton` | `safeSeqAppend` | `P` | $\mathrm{safeSeq}(q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(q, u) \land \mathrm{safeSeq}(\delta^*(q, u), v)$ |
| `Automaton` | `stepCodonSafeSound` | `P` | `stepCodonSafe(q, c) = (q', true)` implica $\delta^*(q, c) = q'$ y `safeSeq(q, c)` |
| `Automaton` | `stepCodonSafeComplete` | `P` | `safeSeq(q, c) = true` implica `stepCodonSafe(q, c) = (stepSeq(q, c), true)` |
| `Automaton` | `fullConstructSafe` | `P` | Flanco $5'$, codones y cola $3'$ seguros garantizan constructo completo seguro |
| `GeneticCode` | `geneticCodePartition64` | `none` | Partición de 64 tripletes de ADN en 61 con sentido y 3 de parada |
| `GeneticCode` | `validCodonForAA_destruct` *(lema)* | `P, C, Q` | Descompone `ValidCodonForAA` en 3 bases, GC exacto y AA con sentido |
| `GeneticCode` | `translateDNA_cons3` *(lema)* | `P` | Prefijo triplete válido preserva la decodificación recursiva `translateDNA` |
| `ExactDP` | `gcConservation` | `P, C, Q` | La suma de campos `gc` equivale al `seqGC` nucleotídico aplanado |
| `ExactDP` | `proteinPreservationAndGC` | `P, C, Q` | Todo `ValidPath` sobre `WellFormedMenu` preserva $3|P|$, `seqGC` y `some P` |
| `ExactDP` | `dpSoundness` | `P, C, Q` | Toda entrada finita `dpEval` atestigua un `ValidPath` real en $(g, s, v)$ |
| `ExactDP` | `dpCompleteness` | `P, C, Q` | Todo `ValidPath` está acotado por `dpEval` en $(g, s)$ |
| `ExactDP` | `exactGlobalOptimality` | `P, C, Q` | `dpBestScore` acota todo `FeasibleCDS` y alcanza todo óptimo finito |
| `ExactDP` | `exactOpt_witness_eq` *(lema)* | `P, C, Q` | Testigo factible que acota a todos sus competidores iguala `dpBestScore` |
| `ExactDP` | `dpOptimizeEndToEnd` | `P, C, Q` | Paridad de valor de `dpOptimize`, `none`-iff-unsat y optimalidad en 8 puntos |
| `ExactDP` | `gcEnvelopeAndPruningAdmissible` | `P, C, Q` | Cotas GC sufijas $[G_{\min}, G_{\max}]$ preservan todas las compleciones factibles |
| `ExactDP` | `synonymousEnvelopeUnsat` | `P, C, Q` | Cero caminos factibles fuera de $[G_{\min}, G_{\max}]$ |
| `KineticAndParity` | `tasepRampBoundsAndMonotonicity` | `P, Q` | Interioridad racional $(\tau_p, 1)$, monotonía estricta e invarianza en $\tau_p = 1$ |
| `KineticAndParity` | `zeroWeightParity` | `P, Q` | Pesos de pausa nulos reducen aptitud y tabla DP completa a la base |
| `KineticAndParity` | `pathLexTotalOrder` | `P, Q` | Irreflexividad, transitividad, asimetría y tricotomía de `pathLexLt` |
| `KineticAndParity` | `approxScoreExactness` | `P, Q` | Cota de error `List Int` $L\varepsilon$ y preservación de argmax a $2\Delta$ |

### 8.2 Los 14 teoremas testigo y refutaciones concretas (`Witnesses.lean`)

| Identificador del testigo | `#print axioms` | Propiedad concreta verificada por el núcleo |
| --- | --- | --- |
| `witness_malformed_codon_rejected` | `P` | Rechaza `AAA` con `gc = 3`, `AAA` para `.S` y `TAA` para `.Y` |
| `witness_sl_wellFormedMenu` | `P` | Certifica que 6 opciones de Serina + 6 de Leucina cumplen `WellFormedMenu [.S, .L]` |
| `witness_leftFlank_safe` | `P, Q` | Flanco izquierdo `"GGTC"` seguro en el DFA BsaI alcanzando estado `4` |
| `witness_sl_feasible` | `P, Q` | Camino `AGCCTG` cumple `FeasibleCDS` en `"GGTC" + "SL" + "TAA"` |
| `witness_dpBest_sl_exact` | `P, C, Q` | Prueba `dpBestScore(...) = finite (-357)` mediante `exactOpt_witness_eq` |
| `witness_dpOptimize_sl_end_to_end` | `P, C, Q` | Extrae constructivamente `some (-357, cs)` traducido a `[.S, .L]` |
| `witness_tct_rejected` | `P, Q` | Prueba que `TCT` desde el estado `4` alcanza el estado BsaI prohibido `6` |
| `witness_gc_and_protein_preservation` | `P, C, Q` | Instancia `proteinPreservationAndGC` en `optPathSL` (`AGCCTG`) |
| `witness_gc_pruning_admissible` | `P, C, Q` | Verifica cotas GC `[2, 4]` para prefijo `AGC` + sufijo Leucina |
| `witness_tasep_ramp` | `P, Q` | Certifica $\frac{7}{20} < \mathrm{rampTau}(\frac{7}{20}, 1, 3) < 1$ en `ExactRat` |
| `witness_zero_weight_parity` | `P, Q` | Confirma que pesos nulos preservan `-357` idénticamente |
| `witness_path_lex_order` | `P, Q` | Certifica `[14, 19] < [15, 19] < [48, 19] => [14, 19] < [48, 19]` |
| `witness_approx_margin_exactness` | `P, Q` | Certifica margen de 2 codones $-511 + 2(2) < -357 \implies -510 < -356$ |
| `witness_unsat_gc` | `P, C, Q` | Certifica cero caminos factibles cuando la banda GC objetivo es `[5, 6] > 4` |

### 8.3 Auditoría de mutación en copia de referencia (`8/8` defectos detectados)

En 200 instancias aleatorias repetidas con `PYTHONHASHSEED` $\in \{0, 1, 2, 3\}$, `DPV2Optimizer` coincidió con `BruteForceCDSOracle` en factibilidad, traducción, seguridad y puntuación óptima, revelando una diferencia concreta de desempate en homodipéptidos (`FF`: `TTTTTC` vs `TTCTTT`, idéntica puntuación en `(g = 1, s = 0)`). En `test_mutation_detection_audit.py`, los 8 defectos semánticos inyectados fueron eliminados (`8/8` killed):

| ID del mutante | Resultado | Defecto inyectado y aserción detectora |
| --- | --- | --- |
| `M1_WRONG_SYNONYMOUS_CODON` | **Detectado** | Inyecta `AAA` (Lisina, `gc = 0`) en Serina en `"SL"` (`[0.30, 0.67]` GC); detectado por `translate_dna(seq) != "SL"`. |
| `M2_GC_COUNT_DROP_C` | **Detectado** | Cuenta solo `'G'` en `"TT"` (`[0.66, 0.67]` GC); detectado por rango GC y conjunto oráculo. |
| `M3_DROP_REVERSE_COMPLEMENT` | **Detectado** | Omite complemento inverso `GAGACC` en `"GA" + "DL"`; genera `GAGACC`, detectado por subcadena directa. |
| `M4_IGNORE_LEFT_FLANK` | **Detectado** | Inicia en `s0 = 0` en lugar de `step("GGTC") = 4` en `"GGTC" + "SL" + "TAA"`; emite `TCT` (`GGTCTC`). |
| `M5_IGNORE_RIGHT_FLANK` | **Detectado** | Omite comprobación de cola derecha en `"" + "G" + "CTC"`; emite `GGT` (`GGTCTC`). |
| `M6_OFF_BY_ONE_MAX_GC` | **Detectado** | Cambia `g <= max_gc` por `g < max_gc` en `"TT"` (`min_gc = max_gc = 4`); lanza `No in-band candidate`. |
| `M7_MIN_INSTEAD_OF_MAX` | **Detectado** | Minimiza log-CAI en lugar de maximizar; detectado frente a la puntuación óptima del oráculo. |
| `M8_CORRUPT_BACKPOINTER` | **Detectado** | Almacena `prev_g = g + 1` en pasada directa; falla al retroceder con `KeyError` o secuencia errónea. |

### 8.4 Matriz de cobertura de formulaciones (`F1`-`F28`)

Niveles: **L1** = prueba en núcleo Lean 4; **O1** = batería exhaustiva/fuzzer/mutantes; **C1** = pruebas unitarias deterministas del repositorio principal; **(B)** = divergencia de ejecución documentada.

| ID | Formulación | Ancla Lean 4 / Python | Nivel | Nota de alcance |
| --- | --- | --- | --- | --- |
| `F1` | Frecuencia codónica $f(c)$ | `load_codon_usage_table` | `C1` | Cargador de tablas |
| `F2` | Adaptatividad relativa $w(c)$ | `_build_codon_weights` | `C1 + O1` | Mínimo $10^{-6}$ |
| `F3` | CAI geométrico y suma log | `pathScore`, `approxScoreExactness` | `L1 + O1 (B)` | `Int` vs `float` binary64 |
| `F4` | Conteo y % GC nucleotídico | `seqGC`, `gcConservation` | `L1 + O1` | GC entero exacto |
| `F5` | Código genético de 64 tripletes | `translateTriplet`, `geneticCodePartition64` | `L1 + O1` | Biyección 64/64 |
| `F6` | Traducción con sentido $\mathrm{Translate}(D)=P$ | `ValidCodonForAA`, `proteinPreservationAndGC` | `L1 + O1` | Corrección del menú |
| `F7` | Motivos prohibidos + cierre RC | `Automaton`, `AutomatonCompiler` | `L1 + O1 (B)` | Tabla DFA provista |
| `F8` | Seguridad de unión del constructo | `fullConstructSafe` | `L1 + O1` | Flancos arbitrarios |
| `F9` | Conjunto CDS factible $\mathcal{F}(P,\theta)$ | `FeasibleCDS`, `synonymousEnvelopeUnsat` | `L1 + O1` | Banda GC entera |
| `F10`-`F14` | Random, Greedy, Balanced, GC-target, SOP / reescritura local | `reverse_translator.py`, `sop_balancer.py`, `local_rewriter.py` | `C1` | Heurísticas no-DP |
| `F15` | Semianillo tropical max-plus | `tropIntSemiringLaws`, `tropIntOrderLaws` | `L1 + O1` | Álgebra $\mathbb{Z}\cup\{-\infty\}$ |
| `F16` | Transición de capa Bellman | `dpStep`, `dpSoundness`, `dpCompleteness` | `L1 + O1 (B)` | Rampa $5'$ fuera de Lean |
| `F17` | Filtro terminal y óptimo global | `dpBestScore`, `exactGlobalOptimality` | `L1 + O1 (B)` | Respaldo en `O1` |
| `F18` | Retroceso constructivo y desempates | `dpOptimizeEndToEnd`, `pathLexTotalOrder` | `L1 + O1 (B)` | 3 reglas de desempate |
| `F19` | Poda GC sufija y rampa TASEP | `gcEnvelopeAndPruningAdmissible`, `tasepRampBoundsAndMonotonicity` | `L1 + O1 (B)` | `round(..., 3)` cerca de $1.0$ |
| `F20`-`F26` | Puertas de paso, GC en ventana, homopolímeros, dinucleótidos | `SharedEvaluator`, `BenchmarkRunner` | `C1 (+ O1)` | Métricas descriptivas |
| `F27` | Integridad del manifiesto | `verify_all.py`, `REPRODUCIBILITY_MANIFEST.json` | `O1` | Bloqueo de 229 archivos |
| `F28` | Puerta epistémica | `UNVERIFIED_PUBLIC_CORPUS` | `Governance` | Cero afirmación in vivo |

## 9. Límites exactos de prueba y protocolo de reproducción

Este hito demuestra la solidez matemática del **modelo DP entero discreto explícitamente especificado** de FactorForge, no una verificación formal universal de toda la pila de software en Python:

| Área de alcance | Estado actual | Límite técnico exacto |
| --- | --- | --- |
| **Núcleo DP entero discreto y traducción de 64 codones (`FactorForgeFormal`)** | **Verificado en Lean 4** | 20 teoremas + 3 lemas, 14 testigos, 34 comprobaciones `#print axioms` (`0 sorry`), verificado con `leanchecker`. La optimalidad es relativa a los `WellFormedMenu` provistos (la completitud de 61 codones se verifica frente a `AA_TO_CODONS`). |
| **Correspondencia Python muestreada y archivo reproducible** | **Completado (suite finita)** | 28 pruebas `pytest`, 4 ejecuciones `PYTHONHASHSEED`, `8/8` mutantes eliminados y verificación de integridad de 229 archivos (`python verify_all.py`). |
| **Refinamiento universal Python-a-Lean y punteros atrás** | **No probado (alcance futuro)** | `dpOptimize` en Lean rastrea listas prefijo; el Python operacional reconstruye punteros `(prev_g, prev_s)` mutables y no es código extraído de Lean. |
| **Cotas de error `float` IEEE-754 y tolerancia `1e-12`** | **No probado (alcance futuro)** | La DP operacional suma flotantes binary64 `math.log` con una tolerancia no transitiva `1e-12` (coexisten 3 políticas de desempate). `approxScoreExactness` es condicional sobre `List Int`. |
| **Compilador general de motivos y heurísticas no-DP** | **No probado en Lean** | Lean asume una tabla DFA provista en lugar de formalizar la compilación general Aho-Corasick; `AutomatonCompiler` permuta IDs con `PYTHONHASHSEED`; `round(..., 3)` rompe la interioridad estricta cerca de $1.0$; el clamping $5'$ y heurísticas quedan fuera de `ExactDP.lean`. |
| **Expresión biológica y rendimiento experimental** | **No disponible** | `UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE`. La corrección matemática no garantiza expresión, plegamiento ni rendimiento en laboratorio húmedo. |

Para reproducir localmente todo el archivo de verificación desde un estado limpio (con Python 3.11+, `pytest`, `ruff` y `elan` `leanprover/lean4:v4.36.0`), descomprima `FactorForge_Lean4_Verification_Package.zip` en una ruta corta y ejecute:

```bash
python verify_all.py
```
