---
lang: "ru"
langLabel: "Русский"
title: "Формальная верификация дискретной модели динамического программирования FactorForge в Lean 4"
summary: "Математический план (blueprint), зафиксированные спецификации Lean 4.36.0, схемы индуктивных доказательств, конструктивная трасса на 12-состоянийном автомате BsaI и выборочное сопоставление с Python для дискретного целочисленного ядра DP FactorForge."
version: "Техническая монография v1.0.3 · Lean 4.36.0"
evidenceScope: "Автономные доказательства в Lean 4.36.0 и конечные тесты соответствия на Python; полное доказательство уточнения кода Python и биологическая валидация не выполнялись"
abstract: "Оптимизация кодирующих последовательностей (CDS) с ограничениями подбирает синонимичные кодоны, сохраняющие целевой белок, избегая запрещённых мотивов на стыках флангов и между кодонами, соблюдая глобальные границы содержания GC и максимизируя аддитивную целевую функцию кодонной адаптации. Конечные модульные тесты проверяют лишь выборочные входы, тогда как неформальные или неконтролируемые ИИ-доказательства рискуют незаметно ослабить спецификацию без независимой проверки ядром доказательства. В этой работе представлен полный математический план FactorForgeFormal - формализации на Lean 4.36.0 без внешних зависимостей (14 модулей, >2 500 строк, 0 sorry, перепроверено через leanchecker), доказывающей 20 основных теорем, 3 вспомогательные леммы и 14 конкретных свидетельств и опровержений: тропическую алгебру max-plus, безопасность конечного детерминированного автомата (DFA) на уровне всего конструкта, стандартный генетический код из 64 триплетов (ValidCodonForAA), конструктивную оптимальность ДП с восстановлением пути (dpOptimizeEndToEnd), точную рациональную интерполяцию рампы пауз (ExactRat) и условные целочисленные границы возмущений, в сочетании с fail-closed проверкой на Python и тестом 8/8 семантических мутаций."
pdfLabel: "Скачать полную техническую монографию v1.0.3 (PDF, 14 с.)"
bundleLabel: "Скачать воспроизводимый архив Lean 4 + оракул (.zip)"
toc:
  - id: "sec-1"
    number: "1"
    title: "Архитектура верификации и разделение доверия"
  - id: "sec-2"
    number: "2"
    title: "Тропическая max-plus алгебра (Spec/Tropical.lean)"
  - id: "sec-3"
    number: "3"
    title: "Безопасность DFA всего конструкта (Spec/Automaton.lean)"
  - id: "sec-4"
    number: "4"
    title: "Генетический код из 64 триплетов и корректность меню"
  - id: "sec-5"
    number: "5"
    title: "Оптимальность Беллмана и конструктивный dpOptimize"
  - id: "sec-6"
    number: "6"
    title: "Точная рациональная кинетика, порядок и допуски"
  - id: "sec-7"
    number: "7"
    title: "12-состоянийный автомат BsaI и трасса опровержения"
  - id: "sec-8"
    number: "8"
    title: "Каталоги теорем, свидетельств, мутаций и F1-F28"
  - id: "sec-9"
    number: "9"
    title: "Точные границы доказательства и протокол запуска"
---

## 1. Архитектура верификации и ролевое разделение доверия

Проверка компилятора кодирующих последовательностей на основе динамического программирования (DP) только конечными модульными тестами подтверждает совпадение на выбранных примерах, но не может доказать универсальные инварианты для произвольной длины белка $L$, узких целочисленных окон GC $[g_{\min}, g_{\max}]$ и мотивов на границах $5'$-фланга, кодирующих триплетов и $3'$-хвоста. С другой стороны, передача и проектирования спецификаций, и написания доказательств единому неконтролируемому автоматическому конвейеру порождает две типичные проблемы:

1. **Ослабление спецификации и вырожденность (vacuity):** формализация может опустить сохранение синонимичной трансляции ($\mathrm{Translate}(D) = P$), доверять непроверенным метаданным кандидатов (например, кодону `AAA`, заявляющему `gc = 3`, или стоп-кодону `TAA` в смысловом меню), либо доказывать импликации с невыполнимыми посылками.
2. **Смешение модели и кода:** доказательство оптимальности Беллмана для дискретной целочисленной модели над $\mathbb{Z} \cup \{-\infty\}$ не равносильно доказательству уточнения для рабочего Python-оптимизатора, суммирующего числа с плавающей точкой IEEE-754 binary64 `math.log` с допуском равенства `1e-12` и восстанавливающего путь по изменяемым обратным указателям.

Для предотвращения скрытого дрейфа спецификаций и явного измерения границ выполнения `FactorForgeFormal` разделяет систему на четыре изолированных уровня:

- **Криптографически зафиксированные спецификации Lean 4 (`formal/FactorForgeFormal/Spec/`):** шесть модулей (`Tropical.lean`, `Automaton.lean`, `GeneticCode.lean`, `ExactDP.lean`, `KineticAndParity.lean` и `Spec.lean`) объявляют все структуры данных, функции и целевые утверждения (`Prop_*`) без единого `sorry`, с фиксацией SHA-256 хешей в `spec_lock_manifest.json`.
- **Изолированные тактические доказательства (`formal/FactorForgeFormal/Proofs/`):** пять модулей импортируют `Spec/` только для чтения и доказывают **20 основных теорем** и **3 структурные леммы** методом структурной индукции, поднятия инвариантов свёртки (`foldl`), ядерной редукции (`decide`) и линейной целочисленной арифметики (`omega`), без Mathlib и `native_decide`.
- **Конкретные свидетельства невырожденности и аудит аксиом (`Witnesses.lean`, `Audit.lean`):** четырнадцать проверенных ядром теорем инстанцируют спецификации на 12-состоянийном автомате BsaI (`GGTCTC` / `GAGACC`) для конструкта `"GGTC" + "SL" + "TAA"`, опровергая некорректные кодоны и конструктивно выбирая оптимальную последовательность `AGCCTG` с квантованным баллом `-357`. `Audit.lean` запускает `#print axioms` для всех 34 деклараций с последующей независимой перепроверкой через `leanchecker`.
- **Выборочное сопоставление с Python и мутационное тестирование (`tests/`):** сверяет автономный `factorforge_snapshot/` с независимым от Aho-Corasick переборным оракулом подстрок (`BruteForceCDSOracle`), точным целочисленным зеркалом (`LeanExactMirrorDP`), 200-экземплярным фаззером на 4 значениях `PYTHONHASHSEED` и набором из 8 семантических мутаций эталонной копии. **Важно: внутренняя мультиагентная состязательная проверка является автоматической инженерной проверкой и не заменяет независимого аудита со стороны математиков или специалистов по формальной верификации.**

## 2. Тропическая max-plus алгебра (`Spec/Tropical.lean`)

Аддитивная максимизация log-CAI по достижимым конечным состояниям формализована над расширенным целочисленным полукольцом $\mathrm{Trop}(\mathbb{Z}) = \mathbb{Z} \cup \{-\infty\}$, где недостижимые ячейки `(gc, state)` равны $-\infty$, расширение пути складывает целые баллы, а релаксация выбирает максимум.

> **Определение 2.1 (Тропический носитель, операции и частичный порядок).** Для базового типа $\alpha$ индуктивный тип `Trop α` имеет конструкторы `negInf` ($-\infty$, нейтральный элемент $\mathbb{0}$) и `finite a` (единица $\mathbb{1} = \mathrm{finite}(0)$). Над $\alpha = \mathbb{Z}$ релаксация $\oplus$, расширение $\otimes$ и порядок $\le$ задаются так:

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

> **Теорема 2.1 (`tropIntSemiringLaws`) и Теорема 2.2 (`tropIntOrderLaws`).** $(\mathrm{Trop}(\mathbb{Z}), \oplus, \otimes, -\infty, 0)$ удовлетворяет всем 12 законам идемпотентного max-plus полукольца (ассоциативность, коммутативность, идемпотентность $a \oplus a = a$, нейтраль $-\infty$ для $\oplus$; ассоциативность, единица $0$ и поглощение $-\infty$ для $\otimes$; левая и правая дистрибутивность $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$), а $(\mathrm{Trop}(\mathbb{Z}), \le)$ образует частичный порядок, где $\oplus$ есть точная верхняя грань и $\otimes$ монотонно по обоим аргументам.

> **Схема доказательства (`Proofs/Tropical.lean`).** Полный разбор случаев по трём конструкторам (`cases a <;> cases b <;> cases c`), сводящий конечные ветви к линейным целочисленным целям над `max` и `+`, закрываемым тактикой `omega` (`#print axioms`: `[propext, Quot.sound]`).

## 3. Безопасность конечного автомата на уровне всего конструкта (`Spec/Automaton.lean`)

Запрещённые сайты рестрикции (такие как BsaI `GGTCTC` и обратный комплемент `GAGACC`) и нежелательные мотивы могут возникать на стыках $5'$-фланга и CDS, между соседними кодонами и на стыке CDS с $3'$-терминатором. `Spec/Automaton.lean` моделирует ограниченные детерминированные конечные автоматы (DFA) над алфавитом $\Sigma = \{\mathrm{A}, \mathrm{C}, \mathrm{G}, \mathrm{T}\}$.

> **Определение 3.1 (Ограниченный DFA и префиксная безопасность).** `Automaton` $M = (N, q_0, \delta, T, h_0, h_\delta)$ содержит число состояний $N = \text{numStates}$, начальное состояние $q_0 < N$, замкнутую функцию переходов $\delta : \mathbb{N} \times \Sigma \to \mathbb{N}$ ($q < N \implies \delta(q,b) < N$) и предикат запрещённого состояния $T : \mathbb{N} \to \mathbb{B}$. Многосимвольный переход $\delta^* = \text{stepSeq}$ и префиксное избегание $\mathrm{safeSeq}$ определяются рекурсивно, а `stepCodonSafe` точно моделирует `CompiledAutomaton.step_codon`, немедленно возвращая `(s', false)` при попадании промежуточного основания в запрещённое состояние.

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

> **Теоремы 3.1-3.5 (`stepSeqAppend`, `safeSeqAppend`, `stepCodonSafeSound`, `stepCodonSafeComplete`, `fullConstructSafe`).** Переходы гомоморфны относительно конкатенации ($\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q,u), v)$), префиксная безопасность раскладывается по промежуточному состоянию ($\mathrm{safeSeq}(M, q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(M, q, u) \land \mathrm{safeSeq}(M, \delta^*(q, u), v)$), а `stepCodonSafe` корректен и полон относительно `(stepSeq, safeSeq)`. Следовательно, для любых флангов $F_L, F_R$ и списка кодонов $C$ при $q_L = \delta^*(q_0, F_L)$ и $q_{\mathrm{end}} = \delta^*(q_L, \mathrm{flatten}(C))$:

$$
\mathrm{safeSeq}(M, q_0, F_L) \;\land\; \mathrm{safeCodonList}(M, q_L, C) \;\land\; \mathrm{safeSeq}(M, q_{\mathrm{end}}, F_R)
\;\Longrightarrow\;
\mathrm{safeSeq}\bigl(M, q_0, F_L \mathbin{\Vert} \mathrm{flatten}(C) \mathbin{\Vert} F_R\bigr).
$$

> **Схема доказательства (`Proofs/Automaton.lean`).** Структурная индукция по `xs` с обобщением `s` и разбором `M.isTerminal (M.stepSym s b)`. Лемма `safeCodonList_implies_safeSeq` поднимает `stepCodonSafeSound` на `cds : List (List Base)`, после чего `fullConstructSafe` дважды применяет `safeSeqAppend` (`#print axioms`: только `[propext]`).

## 4. Стандартный генетический код из 64 триплетов и корректность меню (`Spec/GeneticCode.lean`)

Чтобы некорректное меню кандидатов не нарушало аминокислотную идентичность и не искажало подсчёт GC, `Spec/GeneticCode.lean` кодирует все $4^3 = 64$ триплета (`translateTriplet`) и строгий порамковый декодер (`translateDNA`), сверенные 64 к 64 с `STANDARD_GENETIC_CODE` в Python.

> **Определение 4.1 (`ValidCodonForAA` и `WellFormedMenu`).** Запись кодона $c = (\mathrm{seq}, \mathrm{gc}, \mathrm{score})$ корректна для целевого остатка $a \in \mathcal{A}$ тогда и только тогда, когда её длина равна 3, нуклеотидный счёт GC совпадает с полем `gc`, а смысловая трансляция равна $a$:

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

> **Теорема 4.1 (`geneticCodePartition64`, без аксиом), Леммы 4.2-4.3 (`validCodonForAA_destruct`, `translateDNA_cons3`) и Теоремы 4.4-4.5 (`gcConservation`, `proteinPreservationAndGC`).** Внутри ядра Lean **без единой аксиомы** доказано разбиение 64 триплетов ДНК ровно на `61` смысловой кодон и `3` стоп-кодона (`TAA`, `TAG`, `TGA`). При `WellFormedMenu P L` любой допустимый путь `ValidPath M s0 L C` разворачивается в ДНК $D = \mathrm{flatMap}(\mathrm{seq}, C)$, удовлетворяющую:

$$
|D| = 3|P|, \qquad
\mathrm{pathGC}(C) = \sum_{i=1}^{|P|} c_i.\mathrm{gc} = \mathrm{seqGC}(D), \qquad
\mathrm{translateDNA}(D) = \mathrm{some}(P),
$$

что гарантирует отсутствие сдвигов рамки считывания и внутренних или концевых стоп-кодонов.

## 5. Оптимальность Беллмана и конструктивное извлечение пути (`Spec/ExactDP.lean`)

### 5.1 Таблица Беллмана и конструктивный решатель с отслеживанием путей

На дискретной решётке состояний $(g, s) \in \{0,\dots,G_{\max}\} \times \{0,\dots,N-1\}$ модуль `Spec/ExactDP.lean` задаёт как рекуррентное соотношение `dpEval` / `dpBestScore`, так и конструктивный решатель `dpTrackEval` / `dpOptimize`.

$$
V_i(g', s') := \bigoplus_{s = 0}^{N - 1} \;\bigoplus_{\substack{c \in O_i : \; c.\mathrm{gc} \le g' \\ \mathrm{stepCodonSafe}(M, s, c.\mathrm{seq}) = (s', \mathrm{true})}}
\Bigl(V_{i-1}(g' - c.\mathrm{gc}, s) \otimes \mathrm{finite}(c.\mathrm{score})\Bigr),
\qquad V_0(g, s) = \begin{cases} 0 & (g,s)=(0,s_0), \\ -\infty & \text{otherwise.} \end{cases}
$$

Чтобы вернуть конкретный оптимальный список кодонов `some (v, cs)`, тип `DPCandidate := Option (Int × List CodonSpec)` хранит целочисленный балл и префиксный путь, обновляемый детерминированной функцией релаксации `relaxCand` (при равенстве сохраняется первый встреченный) и `extendCand`.

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

### 5.2 Корректность, полнота, отсечение и главная теорема `dpOptimizeEndToEnd`

> **Теоремы 5.1-5.3 (`dpSoundness`, `dpCompleteness`, `exactGlobalOptimality`) и Лемма (`exactOpt_witness_eq`).** При $s_0 < M.\mathrm{numStates}$ любая конечная ячейка $V_L(g, s) = \mathrm{finite}(v)$ свидетельствует о существовании `ValidPath` с параметрами $(g, s, v)$, а любой `ValidPath` ограничен сверху значением $V_L(\mathrm{pathGC}(C), \delta^*(s_0, D))$. Терминальная проекция `dpBestScore` ограничивает все пути `FeasibleCDS` и достигает каждого конечного глобального оптимума.

> **Теорема 5.4 (Главная теорема: `dpOptimizeEndToEnd`).** При `WellFormedMenu P L` и $s_0 = \delta^*(q_0, F_L)$:
> 1. **Согласованность значений:** если $\mathrm{safeSeq}(M, q_0, F_L) = \mathrm{true}$, то $\mathrm{candToTrop}(\mathrm{dpOptimize}(\dots)) = \mathrm{dpBestScore}(\dots)$.
> 2. **Полный критерий несовместности:** $\mathrm{dpOptimize}(\dots) = \mathrm{none}$ тогда и только тогда, когда $F_L$ небезопасен или не существует ни одного пути `FeasibleCDS`.
> 3. **8-пунктная конструктивная оптимальность:** если $\mathrm{dpOptimize}(\dots) = \mathrm{some}(v, C)$ и $D = \mathrm{flatMap}(\mathrm{seq}, C)$, то $C$ допустим, $\mathrm{pathScore}(C) = v$, $|D| = 3|P|$, $\mathrm{translateDNA}(D) = \mathrm{some}(P)$, $g_{\min} \le \mathrm{seqGC}(D) \le g_{\max}$, весь конструкт $F_L \mathbin{\Vert} D \mathbin{\Vert} F_R$ безопасен от $q_0$, и $\mathrm{pathScore}(C') \le v$ для любого допустимого конкурента $C'$.

> **Теоремы 5.5-5.6 (`gcEnvelopeAndPruningAdmissible`, `synonymousEnvelopeUnsat`).** Любое допустимое разбиение $C = C_{\mathrm{pre}} \mathbin{\Vert} C_{\mathrm{suf}}$ удовлетворяет $g_{\min} \le \mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMaxGC}(\mathcal{L}_{\mathrm{suf}})$ и $\mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMinGC}(\mathcal{L}_{\mathrm{suf}}) \le g_{\max}$, доказывая допустимость отсечения по суффиксным границам GC, а непересекающиеся с $[\mathrm{totalMinGC}(\mathcal{L}), \mathrm{totalMaxGC}(\mathcal{L})]$ окна GC не имеют решений.

> **Схема доказательства (`Proofs/ExactDP.lean`, 1 225 строк).** Используется индукция добавлением элемента в конец списка (`list_snoc_rec`) по слоям DP и вложенные инварианты свёртки по `List.range M.numStates` и `opts`. Гомоморфизм `candToTrop_dpTrackEval` связывает `dpTrackEval` с `dpEval` через `candToTrop (relaxCand x y) = oplus (candToTrop x) (candToTrop y)`, а `dpTrackSoundness` объединяет `proteinPreservationAndGC`, `fullConstructSafe` и `exactGlobalOptimality`.

## 6. Точная рациональная кинетика, порядок и допуски (`Spec/KineticAndParity.lean`)

> **Определение 6.1 (`ExactRat` и `rampTau`).** Точные рациональные числа $\mathrm{ExactRat} = \{(p, q) \in \mathbb{Z}^2 : q > 0\}$ сравниваются перекрёстным умножением ($a.p \cdot b.q < b.p \cdot a.q$) без деления и округления. Линейная интерполяция рампы замедления $\tau_{\mathrm{ramp}}(\tau_p, d, W) = \tau_p + \frac{d}{W}(1 - \tau_p)$ точно выражается как:

$$
\mathrm{rampTau}\bigl((p, q), d, W\bigr) := \frac{pW + d(q - p)}{qW}, \qquad (q > 0,\; W > 0).
$$

> **Теоремы 6.1-6.4 (`tasepRampBoundsAndMonotonicity`, `zeroWeightParity`, `pathLexTotalOrder`, `approxScoreExactness`).**
> - **Строгая внутренность и монотонность рампы:** при $0 < \tau_p < 1$ и $1 \le d < W$ выполняется $\tau_p <_{\mathbb{Q}} \mathrm{rampTau}(\tau_p, d, W) <_{\mathbb{Q}} 1$; $\mathrm{rampTau}$ строго возрастает по $d$ и инвариантна при $\tau_p = 1$.
> - **Эквивалентность при нулевых весах пауз:** при всех весах пауз равных $0$ функция `structFitness` совпадает с базовой во всех ячейках $(g, s)$ таблицы `dpEval`.
> - **Строгий лексикографический полный порядок:** компаратор префиксов `pathLexLt` иррефлексивен, транзитивен, асимметричен и трихотомичен на `List Nat`.
> - **Условный допуск целочисленных возмущений (`List Int`):** если пошаговая ошибка $|a_i - t_i| \le \varepsilon$, то $\bigl|\sum_{i=1}^L a_i - \sum_{i=1}^L t_i\bigr| \le L\varepsilon$, а $\tilde{S}_{\mathrm{alt}} + 2\Delta < \tilde{S}_{\mathrm{opt}}$ при $|\tilde{S} - S| \le \Delta$ гарантирует $S_{\mathrm{alt}} < S_{\mathrm{opt}}$.

> **Граница выполнения (`float` против `List Int` / `ExactRat`).** `approxScoreExactness` является условной теоремой над `List Int` (целочисленное квантование), а не доказательством погрешности binary64 `math.log`. Аналогично `round(..., 3)` в `TASEPKineticsEngine` нарушает строгое неравенство $< 1.0$ при $\tau_p \ge 0.999$ (например $\tau_p = 0.999, d = 2, W = 3 \mapsto 1.0$).

## 7. Конкретный 12-состоянийный автомат BsaI и трасса опровержения (`Witnesses.lean`)

Для доказательства невырожденности в ядре Lean модуль `Witnesses.lean` кодирует детерминированный 12-состоянийный автомат Aho-Corasick для BsaI (`GGTCTC` $\to$ терминальное состояние `6`; обратный комплемент `GAGACC` $\to$ `11`) и оптимизирует дипептид `"SL"` (`[.S, .L]`) при $5'$-фланге `"GGTC"`, стоп-хвосте `"TAA"` и окне GC `[2, 4]`:

1. **Проход фланга (`witness_leftFlank_safe`):** `"GGTC"` безопасно переходит $0 \xrightarrow{\mathrm{G}} 1 \xrightarrow{\mathrm{G}} 2 \xrightarrow{\mathrm{T}} 3 \xrightarrow{\mathrm{C}} 4$ (`s0 = 4`).
2. **Опровержение нарушения на стыке (`witness_tct_rejected`):** лучший кодон Серина `TCT` (балл `-223`) проходит $4 \xrightarrow{\mathrm{T}} 5 \xrightarrow{\mathrm{C}} \mathbf{6}$, образуя `"GGTCTC"` на $5'$-стыке, и отвергается с `(6, false)`.
3. **Опровержение некорректных входов (`witness_malformed_codon_rejected`):** `decide` отвергает `AAA` с `gc = 3`, `AAA` для `.S` и стоп-кодон `TAA` для `.Y`.
4. **Конструктивный глобальный оптимум (`witness_dpOptimize_sl_end_to_end`):** `dpOptimize` выбирает `AGC` ($4 \to 0 \to 1 \to 0$, балл `-357`, `gc = 2`), `CTG` ($0 \to 0 \to 0 \to 1$, балл `0`, `gc = 2`) и безопасный хвост `"TAA"` ($1 \to 0 \to 0 \to 0$), возвращая `some (-357, [AGC, CTG])` (`"AGCCTG"`, `seqGC = 4`).

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

## 8. Полные каталоги теорем, свидетельств, мутаций и формул

### 8.1 Все 20 аудированных теорем + 3 структурные леммы (`Audit.lean`)

Обозначения аксиом (`lake env lean FactorForgeFormal/Audit.lean`): **`none`** = 0 аксиом; **`P`** = `[propext]`; **`P, Q`** = `[propext, Quot.sound]`; **`P, C, Q`** = `[propext, Classical.choice, Quot.sound]` (без `sorryAx` и пользовательских аксиом).

| Модуль | Идентификатор Lean | `#print axioms` | Доказанное математическое утверждение |
| --- | --- | --- | --- |
| `Tropical` | `tropIntSemiringLaws` | `P, Q` | 12 законов идемпотентного max-plus полукольца над $\mathrm{Trop}(\mathbb{Z})$ |
| `Tropical` | `tropIntOrderLaws` | `P, Q` | Частичный порядок, точная верхняя грань и монотонность $\oplus$/$\otimes$ |
| `Automaton` | `stepSeqAppend` | `P` | $\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q, u), v)$ для всех $u, v$ |
| `Automaton` | `safeSeqAppend` | `P` | $\mathrm{safeSeq}(q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(q, u) \land \mathrm{safeSeq}(\delta^*(q, u), v)$ |
| `Automaton` | `stepCodonSafeSound` | `P` | `stepCodonSafe(q, c) = (q', true)` влечёт $\delta^*(q, c) = q'$ и `safeSeq(q, c)` |
| `Automaton` | `stepCodonSafeComplete` | `P` | `safeSeq(q, c) = true` влечёт `stepCodonSafe(q, c) = (stepSeq(q, c), true)` |
| `Automaton` | `fullConstructSafe` | `P` | Безопасные $5'$-фланг, кодоны и $3'$-хвост гарантируют безопасность всей ДНК |
| `GeneticCode` | `geneticCodePartition64` | `none` | Разбиение 64 триплетов ДНК на 61 смысловой и 3 стоп-кодона |
| `GeneticCode` | `validCodonForAA_destruct` *(лемма)* | `P, C, Q` | Разложение `ValidCodonForAA` на длину 3, точный GC и смысловую АА |
| `GeneticCode` | `translateDNA_cons3` *(лемма)* | `P` | Валидный смысловой триплет-префикс сохраняет рекурсивный `translateDNA` |
| `ExactDP` | `gcConservation` | `P, C, Q` | Сумма полей `gc` равна нуклеотидному `seqGC` |
| `ExactDP` | `proteinPreservationAndGC` | `P, C, Q` | `ValidPath` над `WellFormedMenu` сохраняет $3\lvert P\rvert$, `seqGC` и `some P` |
| `ExactDP` | `dpSoundness` | `P, C, Q` | Каждая конечная ячейка `dpEval` свидетельствует реальный `ValidPath` |
| `ExactDP` | `dpCompleteness` | `P, C, Q` | Любой `ValidPath` ограничен сверху значением `dpEval` в $(g, s)$ |
| `ExactDP` | `exactGlobalOptimality` | `P, C, Q` | `dpBestScore` ограничивает все `FeasibleCDS` и достигает конечных оптимумов |
| `ExactDP` | `exactOpt_witness_eq` *(лемма)* | `P, C, Q` | Допустимый свидетель, мажорирующий конкурентов, равен `dpBestScore` |
| `ExactDP` | `dpOptimizeEndToEnd` | `P, C, Q` | Совпадение значений `dpOptimize`, критерий `none` и 8-пунктная оптимальность |
| `ExactDP` | `gcEnvelopeAndPruningAdmissible` | `P, C, Q` | Суффиксные границы $[G_{\min}, G_{\max}]$ сохраняют все допустимые дополнения |
| `ExactDP` | `synonymousEnvelopeUnsat` | `P, C, Q` | Ноль допустимых путей вне оболочки $[G_{\min}, G_{\max}]$ |
| `KineticAndParity` | `tasepRampBoundsAndMonotonicity` | `P, Q` | Рациональная внутренность $(\tau_p, 1)$, строгая монотонность и $\tau_p = 1$ |
| `KineticAndParity` | `zeroWeightParity` | `P, Q` | Нулевые веса пауз сводят функцию приспособленности и таблицу DP к базе |
| `KineticAndParity` | `pathLexTotalOrder` | `P, Q` | Иррефлексивность, транзитивность, асимметрия и трихотомия `pathLexLt` |
| `KineticAndParity` | `approxScoreExactness` | `P, Q` | Условная граница ошибки `List Int` $L\varepsilon$ и сохранение argmax при $2\Delta$ |

### 8.2 Все 14 конкретных свидетельств и опровержений (`Witnesses.lean`)

| Идентификатор свидетельства | `#print axioms` | Проверенное ядром свойство |
| --- | --- | --- |
| `witness_malformed_codon_rejected` | `P` | Отвергает `AAA` с `gc = 3`, `AAA` для `.S` и стоп `TAA` для `.Y` |
| `witness_sl_wellFormedMenu` | `P` | Подтверждает `WellFormedMenu [.S, .L]` для 6 Серин + 6 Лейцин вариантов |
| `witness_leftFlank_safe` | `P, Q` | Левый фланг `"GGTC"` безопасен на BsaI DFA и переходит в состояние `4` |
| `witness_sl_feasible` | `P, Q` | Путь `AGCCTG` удовлетворяет `FeasibleCDS` на `"GGTC" + "SL" + "TAA"` |
| `witness_dpBest_sl_exact` | `P, C, Q` | Доказывает `dpBestScore(...) = finite (-357)` через `exactOpt_witness_eq` |
| `witness_dpOptimize_sl_end_to_end` | `P, C, Q` | Конструктивно извлекает `some (-357, cs)`, транслируемый в `[.S, .L]` |
| `witness_tct_rejected` | `P, Q` | Доказывает переход `TCT` из состояния `4` в запрещённое состояние `6` |
| `witness_gc_and_protein_preservation` | `P, C, Q` | Инстанцирует `proteinPreservationAndGC` на `optPathSL` (`AGCCTG`) |
| `witness_gc_pruning_admissible` | `P, C, Q` | Проверяет границы GC `[2, 4]` для префикса `AGC` + суффикса Лейцина |
| `witness_tasep_ramp` | `P, Q` | Доказывает $\frac{7}{20} < \mathrm{rampTau}(\frac{7}{20}, 1, 3) < 1$ в `ExactRat` |
| `witness_zero_weight_parity` | `P, Q` | Подтверждает точное сохранение балла `-357` при нулевых весах |
| `witness_path_lex_order` | `P, Q` | Доказывает `[14, 19] < [15, 19] < [48, 19] => [14, 19] < [48, 19]` |
| `witness_approx_margin_exactness` | `P, Q` | Доказывает допуск на 2 кодона $-511 + 2(2) < -357 \implies -510 < -356$ |
| `witness_unsat_gc` | `P, C, Q` | Доказывает ноль допустимых путей при целевом диапазоне `[5, 6] > 4` |

### 8.3 Мутационный аудит эталонной копии (`8/8` мутантов выявлены)

На 200 случайных экземплярах при `PYTHONHASHSEED` $\in \{0, 1, 2, 3\}$ рабочий `DPV2Optimizer` совпал с `BruteForceCDSOracle` по допустимости, трансляции, безопасности и оптимальному баллу, выявив различие политики разрешения ничьих на гомодипептидах (`FF`: `TTTTTC` против `TTCTTT`, равный балл в `(g = 1, s = 0)`). Все 8 семантических дефектов в `test_mutation_detection_audit.py` были обнаружены:

| ID мутанта | Результат | Внесённый дефект и выявляющая проверка |
| --- | --- | --- |
| `M1_WRONG_SYNONYMOUS_CODON` | **Выявлен** | Вставляет `AAA` (Lys, `gc = 0`) в меню Серина на `"SL"` (`[0.30, 0.67]` GC); пойман `translate_dna(seq) != "SL"`. |
| `M2_GC_COUNT_DROP_C` | **Выявлен** | Считает только `'G'` в `"TT"` (`[0.66, 0.67]` GC); пойман проверкой GC-окна и оракула. |
| `M3_DROP_REVERSE_COMPLEMENT` | **Выявлен** | Пропускает обратный комплемент `GAGACC` на `"GA" + "DL"`; порождает `GAGACC`. |
| `M4_IGNORE_LEFT_FLANK` | **Выявлен** | Стартует с `s0 = 0` вместо `step("GGTC") = 4` на `"GGTC" + "SL" + "TAA"`; порождает `TCT` (`GGTCTC`). |
| `M5_IGNORE_RIGHT_FLANK` | **Выявлен** | Пропускает проверку правого фланга на `"" + "G" + "CTC"`; порождает `GGT` (`GGTCTC`). |
| `M6_OFF_BY_ONE_MAX_GC` | **Выявлен** | Меняет `g <= max_gc` на `g < max_gc` в `"TT"` (`min_gc = max_gc = 4`); ложно вызывает `No in-band candidate`. |
| `M7_MIN_INSTEAD_OF_MAX` | **Выявлен** | Минимизирует log-CAI вместо максимизации; пойман сравнением с оптимальным баллом оракула. |
| `M8_CORRUPT_BACKPOINTER` | **Выявлен** | Сохраняет `prev_g = g + 1` на прямом проходе; падает при обратном ходе (`KeyError`). |

### 8.4 Матрица покрытия формул (`F1`-`F28`)

Уровни: **L1** = доказательство в ядре Lean 4; **O1** = переборный оракул/фаззер/мутанты; **C1** = модульные тесты основного репозитория; **(B)** = документированное отличие выполнения.

| ID | Формула | Якорь Lean 4 / Python | Уровень | Примечание |
| --- | --- | --- | --- | --- |
| `F1` | Частота кодонов $f(c)$ | `load_codon_usage_table` | `C1` | Загрузчик таблиц |
| `F2` | Относительная адаптивность $w(c)$ | `_build_codon_weights` | `C1 + O1` | Нижний порог $10^{-6}$ |
| `F3` | Геометрический CAI и лог-сумма | `pathScore`, `approxScoreExactness` | `L1 + O1 (B)` | `Int` vs `float` binary64 |
| `F4` | Число и доля GC | `seqGC`, `gcConservation` | `L1 + O1` | Точный целочисленный GC |
| `F5` | Генетический код из 64 триплетов | `translateTriplet`, `geneticCodePartition64` | `L1 + O1` | Биекция 64/64 |
| `F6` | Смысловая трансляция $\mathrm{Translate}(D)=P$ | `ValidCodonForAA`, `proteinPreservationAndGC` | `L1 + O1` | Корректность меню |
| `F7` | Запрещённые мотивы + RC | `Automaton`, `AutomatonCompiler` | `L1 + O1 (B)` | Переданная таблица DFA |
| `F8` | Безопасность стыков конструкта | `fullConstructSafe` | `L1 + O1` | Произвольные фланги |
| `F9` | Допустимое множество $\mathcal{F}(P,\theta)$ | `FeasibleCDS`, `synonymousEnvelopeUnsat` | `L1 + O1` | Целочисленное окно GC |
| `F10`-`F14` | Random, Greedy, Balanced, GC-target, SOP | `reverse_translator.py`, `sop_balancer.py`, `local_rewriter.py` | `C1` | Не-DP эвристики |
| `F15` | Тропическое max-plus полукольцо | `tropIntSemiringLaws`, `tropIntOrderLaws` | `L1 + O1` | Алгебра $\mathbb{Z}\cup\{-\infty\}$ |
| `F16` | Прямой переход Беллмана | `dpStep`, `dpSoundness`, `dpCompleteness` | `L1 + O1 (B)` | $5'$-рампа вне Lean |
| `F17` | Терминальный фильтр и оптимум | `dpBestScore`, `exactGlobalOptimality` | `L1 + O1 (B)` | Отказ в `O1` |
| `F18` | Обратный проход и развязка ничьих | `dpOptimizeEndToEnd`, `pathLexTotalOrder` | `L1 + O1 (B)` | 3 политики ничьих |
| `F19` | Суффиксная GC-оценка и рампа TASEP | `gcEnvelopeAndPruningAdmissible`, `tasepRampBoundsAndMonotonicity` | `L1 + O1 (B)` | `round(..., 3)` у $1.0$ |
| `F20`-`F26` | Проходные ворота, окна GC, гомополимеры, динуклеотиды | `SharedEvaluator`, `BenchmarkRunner` | `C1 (+ O1)` | Описательные метрики |
| `F27` | Целостность манифеста | `verify_all.py`, `REPRODUCIBILITY_MANIFEST.json` | `O1` | Хеши 229 файлов |
| `F28` | Эпистемический барьер | `UNVERIFIED_PUBLIC_CORPUS` | `Governance` | Нет мокрых данных |

## 9. Точные границы доказательства и протокол воспроизведения

Данный этап доказывает математическую корректность **явно заданной дискретной целочисленной DP-модели** FactorForge, а не универсальную формальную верификацию всего стека Python:

| Область | Текущий статус | Точная техническая граница |
| --- | --- | --- |
| **Дискретное целочисленное ядро DP и 64-кодонная трансляция (`FactorForgeFormal`)** | **Верифицировано в Lean 4** | 20 теорем + 3 леммы, 14 свидетельств, 34 проверки `#print axioms` (`0 sorry`), проверено `leanchecker`. Оптимальность доказана относительно переданных `WellFormedMenu` (корректность переданных вариантов; универсальное соответствие меню времени выполнения не доказано). |
| **Выборочное соответствие Python и воспроизводимый архив** | **Завершено (конечный набор)** | 28 проверок `pytest`, 4 прогона `PYTHONHASHSEED`, `8/8` мутантов выявлены и контроль 229 файлов (`python verify_all.py`). |
| **Универсальное уточнение Python-to-Lean и обратные указатели** | **Не доказано (будущая работа)** | В Lean `dpOptimize` хранит префиксные списки; рабочий Python использует изменяемые `(prev_g, prev_s)` и не извлечён из Lean. |
| **Оценки погрешности IEEE-754 `float` и порог `1e-12`** | **Не доказано (будущая работа)** | Рабочий DP суммирует binary64 `math.log` с нетранзитивным порогом `1e-12` (сосуществуют 3 политики равенства). `approxScoreExactness` условна над `List Int`. |
| **Общий компилятор подстрок и эвристики вне DP** | **Не доказано в Lean** | Lean принимает готовую таблицу DFA вместо доказательства общего алгоритма Aho-Corasick; `AutomatonCompiler` зависит от `PYTHONHASHSEED`; `round(..., 3)` нарушает строгость у $1.0$; клэмпинг $5'$ и эвристики находятся вне `ExactDP.lean`. |
| **Биологическая экспрессия и лабораторный выход** | **Недоступно** | `UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE`. Математическая оптимальность не гарантирует экспрессию или выход в эксперименте. |

Для полного локального воспроизведения архива (требуются Python 3.11+, `pytest`, `ruff` и `elan` `leanprover/lean4:v4.36.0`) распакуйте `FactorForge_Lean4_Verification_Package.zip` в короткий каталог и выполните:

```bash
python verify_all.py
```
