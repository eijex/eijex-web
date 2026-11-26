---
lang: "ko"
langLabel: "한국어"
title: "Lean 4를 이용한 FactorForge 이산 동적 계획법 모델의 형식 검증"
summary: "FactorForge 이산 정수 DP 모델의 건전성, 완전성, 유전암호 번역 보존 및 구성적 최적성을 Lean 4.36.0으로 증명한 수학적 블루프린트와 부동소수점 Python 최적화기와의 대응 경계."
version: "기술 모노그래프 v1.0.3 · Lean 4.36.0"
evidenceScope: "독립 실행형 Lean 4.36.0 증명 및 유한 Python 대응 테스트; 전체 Python 정제 증명 및 생물학적 검증은 포함되지 않음"
abstract: "제약 조건 인식 코딩 서열(CDS) 설계는 측면 서열(flank)과 코돈 간 접합부에서 금지 모티프를 회피하고, 전역 뉴클레오타이드 GC 범위 제약을 만족하며, 가법적 코돈 적합도 목적 함수를 최대화하는 동시에 목표 아미노산 서열을 보존하는 동의어 코돈을 선택합니다. 유한 단위 테스트는 표본 입력에 대해서만 일치 여부를 확인할 뿐이며, 비형식적이거나 제약 없는 AI 생성 증명은 독립적인 증명 커널의 검증 없이는 명세가 약화될 위험이 있습니다. 본 노트에서는 외부 Mathlib 의존성이 없는 Lean 4.36.0 형식화(14개 모듈, 2,500줄 이상, sorry 0건, leanchecker 교차 검증 완료)인 FactorForgeFormal의 전체 수학적 블루프린트를 제시합니다. Tropical max-plus 대수, 전장 수준 DFA 안전성, 64개 삼염기 표준 유전암호(ValidCodonForAA), 구성적 역추적 DP 최적성(dpOptimizeEndToEnd), 엄밀 유리수 멈춤 램프 보간(ExactRat), 조건부 정수 섭동 마진에 걸쳐 핵심 정리 20개, 보조정리 3개, 구체적 반박·증거 정리 14개를 증명했으며, fail-closed Python 대응 검증 및 8/8 참조-복사본 변이 테스트 스위트와 함께 제공합니다."
pdfLabel: "전체 기술 모노그래프 v1.0.3 다운로드 (PDF, 14p)"
bundleLabel: "재현 가능한 Lean 4 + 오라클 아카이브 다운로드 (.zip)"
toc:
  - id: "sec-1"
    number: "1"
    title: "검증 아키텍처와 역할 분리 신뢰 구조"
  - id: "sec-2"
    number: "2"
    title: "Tropical Max-Plus 대수 (Spec/Tropical.lean)"
  - id: "sec-3"
    number: "3"
    title: "전장 수준 DFA 안전성 (Spec/Automaton.lean)"
  - id: "sec-4"
    number: "4"
    title: "64개 삼염기 유전암호와 메뉴 타당성"
  - id: "sec-5"
    number: "5"
    title: "Bellman 최적성과 구성적 dpOptimize"
  - id: "sec-6"
    number: "6"
    title: "엄밀 유리수 동역학, 동점 순서 및 오차 마진"
  - id: "sec-7"
    number: "7"
    title: "12-상태 BsaI 오토마타 및 반박 추적"
  - id: "sec-8"
    number: "8"
    title: "정리, 증거, 변이 및 F1-F28 커버리지 목록"
  - id: "sec-9"
    number: "9"
    title: "정확한 증명 경계 및 재현 프로토콜"
---

## 1. 검증 아키텍처와 역할 분리 신뢰 구조

유한 단위 테스트만으로 동적 계획법(DP) 코딩 서열 컴파일러를 검증하면 선택된 표본 입력에서의 입출력 일치는 확인할 수 있지만, 임의의 단백질 길이 $L$, 좁은 정수 GC 구간 $[g_{\min}, g_{\max}]$, 또는 $5'$ 측면 서열·코딩 삼염기·$3'$ 종결 꼬리를 가로지르는 교차 접합부 모티프에 대한 보편적 불변량은 증명할 수 없습니다. 반대로 명세 설계와 증명 작성을 단일 비제약 자동화 워크플로우에 모두 맡기면 두 가지 전형적인 실패 모드가 발생합니다:

1. **명세 약화(Specification weakening) 및 공허한 참(Vacuity):** 형식화가 동의어 번역 불변성($\mathrm{Translate}(D) = P$)을 누락하거나, 후보 레코드의 검증되지 않은 메타데이터(예: `AAA` 코돈이 `gc = 3`이라고 거짓 표기하거나, 종결 코돈 `TAA`가 센스 메뉴에 포함되는 경우)를 신뢰하거나, 전제가 만족 불가능한 보편 함의를 증명할 수 있습니다.
2. **모델-코드 혼동:** $\mathbb{Z} \cup \{-\infty\}$ 위의 이산 정수 모델에 대한 Bellman 최적성을 증명하는 것은, IEEE-754 binary64 `math.log` 부동소수점을 누적하고 `1e-12` 상태 내 동점 허용 오차를 적용하며 가변 튜플 역포인터로 경로를 재구성하는 실제 Python 최적화기의 보편적 코드 정제(refinement)를 증명하는 것과 같지 않습니다.

조용한 명세 이탈을 방지하고 런타임 경계를 명시적으로 측정하기 위해 `FactorForgeFormal`은 4계층 신뢰 분리를 강제합니다:

- **암호학적으로 잠긴 Lean 4 명세 (`formal/FactorForgeFormal/Spec/`):** 6개 모듈(`Tropical.lean`, `Automaton.lean`, `GeneticCode.lean`, `ExactDP.lean`, `KineticAndParity.lean`, 통합 `Spec.lean`)이 모든 자료구조, 알고리즘, 목표 명제(`Prop_*`)를 `sorry` 없이 선언하며 `spec_lock_manifest.json`의 해시 다이제스트에 고정됩니다.
- **격리된 택틱 증명 (`formal/FactorForgeFormal/Proofs/`):** 5개 증명 모듈은 `Spec/`을 읽기 전용으로 불러와 외부 Mathlib 의존성 및 `native_decide` 없이 구조적 귀납법, fold 불변량 승격, 커널 축약(`decide`), 선형 정수 산술(`omega`)만으로 **핵심 정리 20개**와 **구조적 보조정리 3개**를 증명합니다.
- **구체적 비공허성 증거 및 커널 공리 감사 (`Witnesses.lean`, `Audit.lean`):** 커널 검증을 거친 14개 정리가 12-상태 BsaI(`GGTCTC` / `GAGACC`) 오토마타와 `"GGTC" + "SL" + "TAA"` 컨스트럭트 위에서 명세를 인스턴스화하여, 잘못된 코돈의 거부와 양자화 점수 `-357`의 최적 서열 `AGCCTG` 구성적 선택을 증명합니다. `Audit.lean`은 34개 선언 전체에 `#print axioms`를 실행하고 `leanchecker`로 독립 재검증합니다.
- **표본 Python 대응 및 참조-변이 테스트 (`tests/`):** 자체 포함된 `factorforge_snapshot/`을 DFA 독립적 부분문자열 전수 열거기(`BruteForceCDSOracle`), 정수 미러(`LeanExactMirrorDP`), 4개 `PYTHONHASHSEED` 설정의 200-인스턴스 축소 퍼저, 8-결함 참조-복사본 변이 스위트와 교차 검증합니다. **중요한 점은, 개발 중 수행된 내부 다중 에이전트 적대적 검토는 자동화된 엔지니어링 점검일 뿐, 외부 인간 수학자나 형식 검증 전문가의 독립 감사를 대체하지 않는다는 것입니다.**

## 2. Tropical Max-Plus 대수 (`Spec/Tropical.lean`)

도달 가능한 유한 상태 위에서의 가법적 log-CAI 최대화는 도달 불가능한 `(gc, state)` 셀을 $-\infty$로 두고, 경로 확장은 정수 점수를 더하며, 상태 완화는 최댓값을 취하는 확장 정수 반환(semiring) $\mathrm{Trop}(\mathbb{Z}) = \mathbb{Z} \cup \{-\infty\}$ 위에서 형식화됩니다.

> **정의 2.1 (Tropical 운반체, 연산 및 부분 순서).** 운반체 타입 $\alpha$에 대해 귀납 타입 `Trop α`는 생성자 `negInf`($-\infty$, 덧셈 항등원 $\mathbb{0}$)와 `finite a`(곱셈 항등원 $\mathbb{1} = \mathrm{finite}(0)$)를 가집니다. $\alpha = \mathbb{Z}$ 위에서 완화 $\oplus$, 확장 $\otimes$, 부분 순서 $\le$는 다음과 같이 정의됩니다:

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

> **정리 2.1 (`tropIntSemiringLaws`) 및 정리 2.2 (`tropIntOrderLaws`).** $(\mathrm{Trop}(\mathbb{Z}), \oplus, \otimes, -\infty, 0)$은 $\oplus$의 결합·교환·멱등성($a \oplus a = a$)·항등원, $\otimes$의 결합·단위원 $0$·$-\infty$ 영원 소멸, 좌우 분배법칙 $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$ 등 12가지 멱등 max-plus 반환 항등식을 모두 만족하며, $(\mathrm{Trop}(\mathbb{Z}), \le)$는 $\oplus$가 최소 상계이고 $\otimes$가 양쪽 인수에 대해 단조인 부분 순서입니다.

> **증명 스케치 (`Proofs/Tropical.lean`).** 3중 생성자 케이스 분해(`cases a <;> cases b <;> cases c`)를 통해 유한 분기를 선형 정수 `max` 및 `+` 목표로 환원하고 `omega`로 종결합니다(`#print axioms`: `[propext, Quot.sound]`).

## 3. 전장 수준 유한 상태 오토마타 안전성 (`Spec/Automaton.lean`)

금지 제한효소 인식 부위(예: BsaI `GGTCTC` 및 역상보 `GAGACC`)와 금지 모티프는 $5'$-측면-CDS 접합부, 코돈 간 경계, CDS-종결/터미네이터 접합부를 가로질러 발생할 수 있습니다. `Spec/Automaton.lean`은 $\Sigma = \{\mathrm{A}, \mathrm{C}, \mathrm{G}, \mathrm{T}\}$ 위의 유계 결정적 유한 오토마타(DFA)를 모델링합니다.

> **정의 3.1 (유계 DFA 및 접두사 안전 전이).** `Automaton` $M = (N, q_0, \delta, T, h_0, h_\delta)$는 상태 수 $N = \text{numStates}$, 초기 상태 $q_0 < N$, 상태 폐쇄 전이 함수 $\delta : \mathbb{N} \times \Sigma \to \mathbb{N}$($q < N \implies \delta(q,b) < N$), 금지 종결 상태 판별자 $T : \mathbb{N} \to \mathbb{B}$로 구성됩니다. 다중 염기 전이 $\delta^* = \text{stepSeq}$와 접두사 금지 상태 회피 $\mathrm{safeSeq}$는 염기 리스트 위에서 재귀적으로 정의되며, `stepCodonSafe`는 중간 염기가 종결 상태를 방문하는 즉시 `(s', false)`로 중단함으로써 `CompiledAutomaton.step_codon`을 그대로 반영합니다.

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

> **정리 3.1-3.5 (`stepSeqAppend`, `safeSeqAppend`, `stepCodonSafeSound`, `stepCodonSafeComplete`, `fullConstructSafe`).** 다중 염기 전이는 준동형적으로 합성되며($\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q,u), v)$), 접두사 안전성은 중간 상태를 기준으로 분해되고($\mathrm{safeSeq}(M, q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(M, q, u) \land \mathrm{safeSeq}(M, \delta^*(q, u), v)$), `stepCodonSafe`는 `(stepSeq, safeSeq)`에 대해 건전하고 완전합니다. 따라서 임의의 $5'$ 측면 $F_L$, 코돈 리스트 $C$, $3'$ 꼬리 $F_R$과 $q_L = \delta^*(q_0, F_L)$, $q_{\mathrm{end}} = \delta^*(q_L, \mathrm{flatten}(C))$에 대해 다음이 성립합니다:

$$
\mathrm{safeSeq}(M, q_0, F_L) \;\land\; \mathrm{safeCodonList}(M, q_L, C) \;\land\; \mathrm{safeSeq}(M, q_{\mathrm{end}}, F_R)
\;\Longrightarrow\;
\mathrm{safeSeq}\bigl(M, q_0, F_L \mathbin{\Vert} \mathrm{flatten}(C) \mathbin{\Vert} F_R\bigr).
$$

> **증명 스케치 (`Proofs/Automaton.lean`).** 시작 상태 `s`를 일반화한 `xs` 구조적 귀납법으로 `M.isTerminal (M.stepSym s b)`를 분기합니다. 보조정리 `safeCodonList_implies_safeSeq`가 `stepCodonSafeSound`를 `cds : List (List Base)`로 승격한 뒤 `fullConstructSafe`가 `List.append_assoc`과 `safeSeqAppend`를 두 번 적용합니다(`#print axioms`: `[propext]`만 사용).

## 4. 표준 64개 삼염기 유전암호와 동의어 메뉴 타당성 (`Spec/GeneticCode.lean`)

잘못된 후보 메뉴가 아미노산 충실도를 우회하거나 저장된 GC 개수를 위조하는 것을 막기 위해 `Spec/GeneticCode.lean`은 64개 삼염기 전체(`translateTriplet`)와 재귀적 프레임 엄밀 번역(`translateDNA`)을 인코딩하며, 이는 Python `STANDARD_GENETIC_CODE`와 64대 64로 대조 검증됩니다.

> **정의 4.1 (`ValidCodonForAA` 및 `WellFormedMenu`).** 후보 코돈 레코드 $c = (\mathrm{seq}, \mathrm{gc}, \mathrm{score})$가 목표 잔기 $a \in \mathcal{A}$에 대해 타당하다는 것은 길이가 정확히 3이고, 뉴클레오타이드 GC 개수가 저장된 `gc` 필드와 일치하며, 센스 번역 결과가 $a$와 같음을 뜻합니다:

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

> **정리 4.1 (`geneticCodePartition64`, 공리 0개), 보조정리 4.2-4.3 (`validCodonForAA_destruct`, `translateDNA_cons3`), 및 정리 4.4-4.5 (`gcConservation`, `proteinPreservationAndGC`).** Lean 커널 내부에서 **어떠한 공리도 없이** 64개 DNA 삼염기가 정확히 `61`개 센스 코돈과 `3`개 종결 코돈(`TAA`, `TAG`, `TGA`)으로 분할됨이 증명됩니다. `WellFormedMenu P L` 아래에서 모든 `ValidPath M s0 L C`는 다음을 만족하는 코딩 DNA $D = \mathrm{flatMap}(\mathrm{seq}, C)$로 평탄화됩니다:

$$
|D| = 3|P|, \qquad
\mathrm{pathGC}(C) = \sum_{i=1}^{|P|} c_i.\mathrm{gc} = \mathrm{seqGC}(D), \qquad
\mathrm{translateDNA}(D) = \mathrm{some}(P),
$$

이로써 리딩 프레임 이동 0건과 내부·말단 종결 코돈 0건이 보장됩니다.

## 5. Bellman 최적성과 구성적 증거 경로 추출 (`Spec/ExactDP.lean`)

### 5.1 Tropical Bellman 테이블 vs. 구성적 후보 추적 솔버

이산 상태 격자 $(g, s) \in \{0,\dots,G_{\max}\} \times \{0,\dots,N-1\}$ 위에서 `Spec/ExactDP.lean`은 Tropical 값 점화식 `dpEval` / `dpBestScore`와 구성적 접두사 추적 솔버 `dpTrackEval` / `dpOptimize`를 함께 정의합니다.

$$
V_i(g', s') := \bigoplus_{s = 0}^{N - 1} \;\bigoplus_{\substack{c \in O_i : \; c.\mathrm{gc} \le g' \\ \mathrm{stepCodonSafe}(M, s, c.\mathrm{seq}) = (s', \mathrm{true})}}
\Bigl(V_{i-1}(g' - c.\mathrm{gc}, s) \otimes \mathrm{finite}(c.\mathrm{score})\Bigr),
\qquad V_0(g, s) = \begin{cases} 0 & (g,s)=(0,s_0), \\ -\infty & \text{otherwise.} \end{cases}
$$

단순 존재성 증명이 아니라 명시적인 최적 코돈 리스트 `some (v, cs)`를 반환하기 위해, `DPCandidate := Option (Int × List CodonSpec)`는 정수 점수와 접두사 코돈 리스트를 결합하며 결정적 완화 함수 `relaxCand`(동점 시 먼저 본 후보 유지)와 `extendCand`를 사용합니다.

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

### 5.2 건전성, 완전성, 가지치기 및 핵심 정리 `dpOptimizeEndToEnd`

> **정리 5.1-5.3 (`dpSoundness`, `dpCompleteness`, `exactGlobalOptimality`) 및 보조정리 (`exactOpt_witness_eq`).** $s_0 < M.\mathrm{numStates}$일 때 모든 유한 테이블 항목 $V_L(g, s) = \mathrm{finite}(v)$는 일치하는 $(g, s, v)$를 갖는 실제 `ValidPath`의 증거가 되며, 모든 `ValidPath`는 $V_L(\mathrm{pathGC}(C), \delta^*(s_0, D))$에 의해 상계됩니다. 종단 투영 `dpBestScore`는 모든 `FeasibleCDS` 경로를 상계하고 모든 유한 전역 최적값을 달성합니다.

> **정리 5.4 (핵심 정리: `dpOptimizeEndToEnd`).** `WellFormedMenu P L` 및 $s_0 = \delta^*(q_0, F_L)$ 아래에서 `dpOptimize`는 다음 세 가지를 동시에 만족합니다:
> 1. **값 정제 일치:** $\mathrm{safeSeq}(M, q_0, F_L) = \mathrm{true}$이면 $\mathrm{candToTrop}(\mathrm{dpOptimize}(\dots)) = \mathrm{dpBestScore}(\dots)$.
> 2. **완전한 실행 불가 인증:** $\mathrm{dpOptimize}(\dots) = \mathrm{none}$인 것은 $F_L$이 안전하지 않거나 `FeasibleCDS` 경로가 하나도 없을 때와 필요충분조건입니다.
> 3. **8항목 구성적 서열 최적성:** $\mathrm{dpOptimize}(\dots) = \mathrm{some}(v, C)$이고 $D = \mathrm{flatMap}(\mathrm{seq}, C)$이면, $C$는 실행 가능하며 $\mathrm{pathScore}(C) = v$, $|D| = 3|P|$, $\mathrm{translateDNA}(D) = \mathrm{some}(P)$, $g_{\min} \le \mathrm{seqGC}(D) \le g_{\max}$, 전장 컨스트럭트 $F_L \mathbin{\Vert} D \mathbin{\Vert} F_R$은 $q_0$부터 금지 상태를 한 번도 방문하지 않으며, 모든 실행 가능 경쟁자 $C'$에 대해 $\mathrm{pathScore}(C') \le v$입니다.

> **정리 5.5-5.6 (`gcEnvelopeAndPruningAdmissible`, `synonymousEnvelopeUnsat`).** 임의의 실행 가능 분할 $C = C_{\mathrm{pre}} \mathbin{\Vert} C_{\mathrm{suf}}$는 $g_{\min} \le \mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMaxGC}(\mathcal{L}_{\mathrm{suf}})$ 및 $\mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMinGC}(\mathcal{L}_{\mathrm{suf}}) \le g_{\max}$를 만족하므로 접미사 GC 가지치기가 최적 완성을 버리지 않음이 증명되며, $[\mathrm{totalMinGC}(\mathcal{L}), \mathrm{totalMaxGC}(\mathcal{L})]$와 서로소인 목표 GC 창에는 해가 0개입니다.

> **증명 스케치 (`Proofs/ExactDP.lean`, 1,225줄).** DP 계층에 대한 후위 추가 귀납법(`list_snoc_rec`)과 `List.range M.numStates`·`opts` 중첩 fold 불변량 보조정리를 사용합니다. 준동형 보조정리 `candToTrop_dpTrackEval`이 `candToTrop (relaxCand x y) = oplus (candToTrop x) (candToTrop y)`를 통해 `candToTrop (dpTrackEval ...) = dpEval ...`을 증명하고, `dpTrackSoundness`가 경로 타당성을 끌어올려 `proteinPreservationAndGC`, `fullConstructSafe`, `exactGlobalOptimality`를 결합합니다.

## 6. 엄밀 유리수 동역학, 동점 순서 및 섭동 마진 (`Spec/KineticAndParity.lean`)

> **정의 6.1 (`ExactRat` 및 `rampTau`).** 엄밀 유리수 $\mathrm{ExactRat} = \{(p, q) \in \mathbb{Z}^2 : q > 0\}$는 나눗셈이나 부동소수점 반올림 없이 교차 곱셈($a.p \cdot b.q < b.p \cdot a.q$)으로 대소를 비교합니다. 상류 감속 램프 보간 $\tau_{\mathrm{ramp}}(\tau_p, d, W) = \tau_p + \frac{d}{W}(1 - \tau_p)$는 다음과 같이 정확히 표현됩니다:

$$
\mathrm{rampTau}\bigl((p, q), d, W\bigr) := \frac{pW + d(q - p)}{qW}, \qquad (q > 0,\; W > 0).
$$

> **정리 6.1-6.4 (`tasepRampBoundsAndMonotonicity`, `zeroWeightParity`, `pathLexTotalOrder`, `approxScoreExactness`).**
> - **엄밀 램프 내부성 및 단조성:** $0 < \tau_p < 1$이고 $1 \le d < W$이면 $\tau_p <_{\mathbb{Q}} \mathrm{rampTau}(\tau_p, d, W) <_{\mathbb{Q}} 1$이며, $\mathrm{rampTau}$는 $d$에 대해 엄밀 단조 증가하고 $\tau_p = 1$에서 불변입니다.
> - **영가중치 멈춤 등가성:** 활성 멈춤 가중치가 모두 $0$이면 구조 인식 `structFitness`가 `dpEval`의 모든 $(g, s)$ 항목에서 기준 적합도와 동일하게 축약됩니다.
> - **사전식 엄밀 전순서:** 접두사 순위 비교기 `pathLexLt`는 `List Nat` 위에서 비반사성, 추이성, 비대칭성, 삼분법을 만족합니다.
> - **조건부 정수 섭동 마진 (`List Int`):** 단계별 정수 오차가 $|a_i - t_i| \le \varepsilon$이면 $\bigl|\sum_{i=1}^L a_i - \sum_{i=1}^L t_i\bigr| \le L\varepsilon$이고, $\tilde{S}_{\mathrm{alt}} + 2\Delta < \tilde{S}_{\mathrm{opt}}$와 $|\tilde{S} - S| \le \Delta$가 $S_{\mathrm{alt}} < S_{\mathrm{opt}}$를 보장합니다.

> **실행 경계 (`float` vs. `List Int` / `ExactRat`).** `approxScoreExactness`는 `List Int`(고정소수점 양자화 마진) 위의 조건부 정리이지, 실제 Python의 binary64 `math.log` 부동소수점 오차 증명이 아닙니다. 마찬가지로 Python `TASEPKineticsEngine`의 `round(..., 3)`은 $\tau_p \ge 0.999$ 부근에서 엄밀한 $< 1.0$ 내부성을 붕괴시킵니다(예: $\tau_p = 0.999, d = 2, W = 3 \mapsto 1.0$).

## 7. 구체적 12-상태 BsaI 오토마타 및 반박 추적 (`Witnesses.lean`)

Lean 커널 내부에서 공허한 참이 아님을 증명하기 위해, `Witnesses.lean`은 BsaI(`GGTCTC` $\to$ 종결 상태 `6`; 역상보 `GAGACC` $\to$ 종결 상태 `11`)용 결정적 12-상태 Aho-Corasick 오토마타를 인코딩하고 $5'$ 측면 `"GGTC"`, $3'$ 종결 꼬리 `"TAA"`, GC 범위 `[2, 4]`에서 이펩타이드 `"SL"`(`[.S, .L]`)을 최적화합니다:

1. **측면 전이 (`witness_leftFlank_safe`):** `"GGTC"`가 $0 \xrightarrow{\mathrm{G}} 1 \xrightarrow{\mathrm{G}} 2 \xrightarrow{\mathrm{T}} 3 \xrightarrow{\mathrm{C}} 4$로 안전하게 전이합니다(`s0 = 4`).
2. **접합부 위반 반박 (`witness_tct_rejected`):** 최고 점수 세린 코돈 `TCT`(양자화 점수 `-223`)는 $4 \xrightarrow{\mathrm{T}} 5 \xrightarrow{\mathrm{C}} \mathbf{6}$으로 전이하여 $5'$ 접합부에서 `"GGTCTC"`를 완성하므로 `(6, false)`로 거부됩니다.
3. **잘못된 후보 반박 (`witness_malformed_codon_rejected`):** 커널 `decide`가 `gc = 3`을 주장하는 `AAA`, 세린 `.S`를 주장하는 `AAA`, 타이로신 `.Y`를 주장하는 종결 코돈 `TAA`를 모두 거부합니다.
4. **구성적 전역 최적해 (`witness_dpOptimize_sl_end_to_end`):** `dpOptimize`는 `AGC`($4 \to 0 \to 1 \to 0$, 점수 `-357`, `gc = 2`)와 `CTG`($0 \to 0 \to 0 \to 1$, 점수 `0`, `gc = 2`), 그리고 안전한 종결 꼬리 `"TAA"`($1 \to 0 \to 0 \to 0$)를 선택해 `some (-357, [AGC, CTG])`(`"AGCCTG"`, `seqGC = 4`)를 출력합니다.

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

## 8. 정리, 증거, 변이 및 F1-F28 커버리지 전체 목록

### 8.1 감사 완료 핵심 정리 20개 + 구조적 보조정리 3개 (`Audit.lean`)

`lake env lean FactorForgeFormal/Audit.lean` 공리 범례: **`none`** = 공리 0개; **`P`** = `[propext]`; **`P, Q`** = `[propext, Quot.sound]`; **`P, C, Q`** = `[propext, Classical.choice, Quot.sound]` (`sorryAx` 0건, 사용자 공리 0건).

| 모듈 | Lean 정리 / 보조정리 식별자 | `#print axioms` | 검증된 수학적 명제 |
| --- | --- | --- | --- |
| `Tropical` | `tropIntSemiringLaws` | `P, Q` | $\mathrm{Trop}(\mathbb{Z})$ 위의 12가지 멱등 max-plus 반환 법칙 |
| `Tropical` | `tropIntOrderLaws` | `P, Q` | 부분 순서, 최소 상계 및 $\oplus$/$\otimes$ 단조성 |
| `Automaton` | `stepSeqAppend` | `P` | 모든 염기 리스트 $u, v$에 대한 $\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q, u), v)$ |
| `Automaton` | `safeSeqAppend` | `P` | $\mathrm{safeSeq}(q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(q, u) \land \mathrm{safeSeq}(\delta^*(q, u), v)$ |
| `Automaton` | `stepCodonSafeSound` | `P` | `stepCodonSafe(q, c) = (q', true)`이면 $\delta^*(q, c) = q'$ 및 `safeSeq(q, c)` |
| `Automaton` | `stepCodonSafeComplete` | `P` | `safeSeq(q, c) = true`이면 `stepCodonSafe(q, c) = (stepSeq(q, c), true)` |
| `Automaton` | `fullConstructSafe` | `P` | 안전한 $5'$ 측면, 안전한 코돈, 안전한 $3'$ 꼬리가 안전한 전장 DNA 보장 |
| `GeneticCode` | `geneticCodePartition64` | `none` | 64개 DNA 삼염기의 61개 센스 코돈 + 3개 종결 코돈 분할 |
| `GeneticCode` | `validCodonForAA_destruct` *(보조)* | `P, C, Q` | `ValidCodonForAA`를 길이 3, 엄밀 GC, 센스 아미노산으로 분해 |
| `GeneticCode` | `translateDNA_cons3` *(보조)* | `P` | 유효 센스 삼염기 접두사의 재귀적 `translateDNA` 보존 |
| `ExactDP` | `gcConservation` | `P, C, Q` | 타당한 코돈 `gc` 합이 평탄화된 뉴클레오타이드 `seqGC`와 일치 |
| `ExactDP` | `proteinPreservationAndGC` | `P, C, Q` | `WellFormedMenu` 위의 `ValidPath`가 길이 $3\lvert P\rvert$, `seqGC`, `some P` 보존 |
| `ExactDP` | `dpSoundness` | `P, C, Q` | 모든 유한 `dpEval` 항목이 $(g, s, v)$ 일치 `ValidPath`를 증언 |
| `ExactDP` | `dpCompleteness` | `P, C, Q` | 모든 `ValidPath` 점수가 $(g, s)$의 `dpEval`에 의해 상계됨 |
| `ExactDP` | `exactGlobalOptimality` | `P, C, Q` | `dpBestScore`가 모든 `FeasibleCDS`를 상계하고 유한 최적값을 달성 |
| `ExactDP` | `exactOpt_witness_eq` *(보조)* | `P, C, Q` | 모든 경쟁자를 상계하는 실행 가능 증거가 `dpBestScore`와 일치 |
| `ExactDP` | `dpOptimizeEndToEnd` | `P, C, Q` | 구성적 `dpOptimize` 값 일치, `none`-iff-불능, 8항목 최적성 |
| `ExactDP` | `gcEnvelopeAndPruningAdmissible` | `P, C, Q` | 도달 가능 접미사 GC 경계 $[G_{\min}, G_{\max}]$가 모든 실행 가능 완성 보존 |
| `ExactDP` | `synonymousEnvelopeUnsat` | `P, C, Q` | $[G_{\min}, G_{\max}]$ 밖의 목표 GC 구간에 해가 0개 |
| `KineticAndParity` | `tasepRampBoundsAndMonotonicity` | `P, Q` | 엄밀 유리수 램프 내부성 $(\tau_p, 1)$, 단조성, $\tau_p = 1$ 불변성 |
| `KineticAndParity` | `zeroWeightParity` | `P, Q` | 영가중치 멈춤 맵에서 단계 적합도 및 전체 DP 테이블이 기준과 일치 |
| `KineticAndParity` | `pathLexTotalOrder` | `P, Q` | `pathLexLt`의 비반사성, 추이성, 비대칭성, 삼분법 |
| `KineticAndParity` | `approxScoreExactness` | `P, Q` | 조건부 `List Int` 오차 한계 $L\varepsilon$ 및 $2\Delta$ 엄밀 argmax 보존 |

### 8.2 구체적 증거 및 반박 정리 14개 (`Witnesses.lean`)

| 증거 정리 식별자 | `#print axioms` | 커널 검증 속성 |
| --- | --- | --- |
| `witness_malformed_codon_rejected` | `P` | `gc = 3`인 `AAA`, `.S`로 위장된 `AAA`, `.Y`로 위장된 종결 코돈 `TAA` 거부 |
| `witness_sl_wellFormedMenu` | `P` | 세린 6개 + 류신 6개 옵션이 `WellFormedMenu [.S, .L]`을 만족함을 인증 |
| `witness_leftFlank_safe` | `P, Q` | 왼쪽 측면 `"GGTC"`가 12-상태 BsaI DFA에서 안전하며 상태 `4`에 도달 |
| `witness_sl_feasible` | `P, Q` | 경로 `AGCCTG`가 `"GGTC" + "SL" + "TAA"`에서 `FeasibleCDS`를 만족 |
| `witness_dpBest_sl_exact` | `P, C, Q` | `exactOpt_witness_eq`를 통해 `dpBestScore(...) = finite (-357)` 증명 |
| `witness_dpOptimize_sl_end_to_end` | `P, C, Q` | `[.S, .L]`로 번역되는 `some (-357, cs)`를 구성적으로 추출 |
| `witness_tct_rejected` | `P, Q` | 상태 `4`에서 세린 코돈 `TCT`가 금지 BsaI 상태 `6`에 도달함을 증명 |
| `witness_gc_and_protein_preservation` | `P, C, Q` | `optPathSL`(`AGCCTG`)에 대해 `proteinPreservationAndGC` 인스턴스화 |
| `witness_gc_pruning_admissible` | `P, C, Q` | 접두사 `AGC` + 접미사 류신 GC 포락선 경계 `[2, 4]` 검증 |
| `witness_tasep_ramp` | `P, Q` | `ExactRat`에서 $\frac{7}{20} < \mathrm{rampTau}(\frac{7}{20}, 1, 3) < 1$ 인증 |
| `witness_zero_weight_parity` | `P, Q` | 영가중치 멈춤 항목이 점수 `-357`을 동일하게 보존함을 확인 |
| `witness_path_lex_order` | `P, Q` | `[14, 19] < [15, 19] < [48, 19] => [14, 19] < [48, 19]` 인증 |
| `witness_approx_margin_exactness` | `P, Q` | 2-코돈 마진 $-511 + 2(2) < -357 \implies -510 < -356$ 인증 |
| `witness_unsat_gc` | `P, C, Q` | 목표 GC 구간이 `[5, 6] > 4`일 때 실행 가능 경로가 0개임을 인증 |

### 8.3 참조-복사본 변이 감사 (`8/8` 주입 의미 결함 검출)

`PYTHONHASHSEED` $\in \{0, 1, 2, 3\}$에서 200개 시드 무작위 인스턴스를 반복 실행한 결과, 실제 `DPV2Optimizer`는 실행 가능성, 아미노산 번역, 모티프 안전성, 최적 점수에서 `BruteForceCDSOracle`과 일치했으며 동형 이펩타이드(`FF`: `TTTTTC` vs `TTCTTT`, `(g = 1, s = 0)` 동일 점수)에서 구체적 동점 처리 차이를 확인했습니다. `test_mutation_detection_audit.py`에서는 계측된 참조 솔버 복사본에 8가지 의미 결함을 주입해 모두 검출했습니다:

| 변이 ID | 감사 결과 | 주입된 결함 및 검출 오라클 단언 |
| --- | --- | --- |
| `M1_WRONG_SYNONYMOUS_CODON` | **검출(Killed)** | `"SL"`(`[0.30, 0.67]` GC)의 세린 메뉴에 라이신 `AAA`(`gc = 0`) 주입; `translate_dna(seq) != "SL"`로 검출 |
| `M2_GC_COUNT_DROP_C` | **검출(Killed)** | `"TT"`(`[0.66, 0.67]` GC)에서 `'G' + 'C'` 대신 `'G'`만 계수; 뉴클레오타이드 GC 범위 및 오라클 집합 검사로 검출 |
| `M3_DROP_REVERSE_COMPLEMENT` | **검출(Killed)** | `"GA" + "DL"`에서 역상보 `GAGACC` 누락; 접합부 `GAGACC` 생성을 원시 부분문자열 검사로 검출 |
| `M4_IGNORE_LEFT_FLANK` | **검출(Killed)** | `"GGTC" + "SL" + "TAA"`에서 `step("GGTC") = 4` 대신 `s0 = 0`으로 시작; `TCT`(`GGTCTC`) 생성을 부분문자열 검사로 검출 |
| `M5_IGNORE_RIGHT_FLANK` | **검출(Killed)** | `"" + "G" + "CTC"`에서 종단 오른쪽 측면 검사 생략; `GGT`(`GGTCTC`) 생성을 부분문자열 검사로 검출 |
| `M6_OFF_BY_ONE_MAX_GC` | **검출(Killed)** | `"TT"`(`min_gc = max_gc = 4`)에서 `g <= max_gc`를 `g < max_gc`로 변경; `No in-band candidate` 오작동 검출 |
| `M7_MIN_INSTEAD_OF_MAX` | **검출(Killed)** | 상태 완화 시 log-CAI를 최대화 대신 최소화; `BruteForceCDSOracle` 최적 점수 비교로 검출 |
| `M8_CORRUPT_BACKPOINTER` | **검출(Killed)** | 순방향 패스에서 `prev_g = g + 1` 저장; 역추적 시 `KeyError` 또는 서열 불일치로 검출 |

### 8.4 수학적 수식 커버리지 매트릭스 (`F1`-`F28`)

등급: **L1** = Lean 4 커널 증명; **O1** = 본 아카이브의 전수/퍼저/변이 스위트; **C1** = 주 저장소 결정적 단위 테스트; **(B)** = 문서화된 런타임 차이.

| ID | 수식 항목 | Lean 4 / Python 앵커 | 검증 등급 | 범위 비고 |
| --- | --- | --- | --- | --- |
| `F1` | 코돈 빈도 $f(c)$ | `load_codon_usage_table` | `C1` | 테이블 로더 |
| `F2` | 상대 적응도 $w(c)$ | `_build_codon_weights` | `C1 + O1` | 하한 $10^{-6}$ 고정 |
| `F3` | 기하 CAI 및 로그 합 | `pathScore`, `approxScoreExactness` | `L1 + O1 (B)` | `Int` vs binary64 `float` |
| `F4` | 뉴클레오타이드 GC 수 및 비율 | `seqGC`, `gcConservation` | `L1 + O1` | 엄밀 정수 GC |
| `F5` | 64개 삼염기 유전암호 | `translateTriplet`, `geneticCodePartition64` | `L1 + O1` | 64/64 일대일 대응 |
| `F6` | 센스 번역 $\mathrm{Translate}(D)=P$ | `ValidCodonForAA`, `proteinPreservationAndGC` | `L1 + O1` | 메뉴 건전성 |
| `F7` | 금지 모티프 + RC 폐포 | `Automaton`, `AutomatonCompiler` | `L1 + O1 (B)` | 제공된 DFA 테이블 |
| `F8` | 전장 접합부 안전성 | `fullConstructSafe` | `L1 + O1` | 임의 측면 서열 |
| `F9` | 실행 가능 CDS 집합 $\mathcal{F}(P,\theta)$ | `FeasibleCDS`, `synonymousEnvelopeUnsat` | `L1 + O1` | 정수 GC 구간 |
| `F10`-`F14` | Random, Greedy, Balanced, GC-target, SOP / 국소 재작성 | `reverse_translator.py`, `sop_balancer.py`, `local_rewriter.py` | `C1` | 비-DP 휴리스틱 |
| `F15` | Tropical max-plus 반환 | `tropIntSemiringLaws`, `tropIntOrderLaws` | `L1 + O1` | $\mathbb{Z}\cup\{-\infty\}$ 대수 |
| `F16` | 순방향 Bellman 계층 전이 | `dpStep`, `dpSoundness`, `dpCompleteness` | `L1 + O1 (B)` | $5'$ 램프는 Lean 외부 |
| `F17` | 종단 필터 및 전역 최적값 | `dpBestScore`, `exactGlobalOptimality` | `L1 + O1 (B)` | 폴백은 `O1` |
| `F18` | 구성적 역추적 및 동점 규칙 | `dpOptimizeEndToEnd`, `pathLexTotalOrder` | `L1 + O1 (B)` | 3가지 상이한 동점 정책 |
| `F19` | 접미사 GC 가지치기 및 TASEP 램프 | `gcEnvelopeAndPruningAdmissible`, `tasepRampBoundsAndMonotonicity` | `L1 + O1 (B)` | $1.0$ 부근 `round(..., 3)` |
| `F20`-`F26` | 후보 통과 게이트, 구간 GC, 호모폴리머, 다이뉴클레오타이드, 평균 | `SharedEvaluator`, `BenchmarkRunner` | `C1 (+ O1)` | 기술 통계량 |
| `F27` | 매니페스트 무결성 바인딩 | `verify_all.py`, `REPRODUCIBILITY_MANIFEST.json` | `O1` | 229개 파일 해시 잠금 |
| `F28` | 인식론적 분류 게이트 | `UNVERIFIED_PUBLIC_CORPUS` | `Governance` | 습식 실험 주장 없음 |

## 9. 정확한 증명 경계 및 Fail-Closed 재현 프로토콜

본 마일스톤은 전체 Python 소프트웨어 스택에 대한 보편적 형식 검증이 아니라, FactorForge의 **명시적으로 지정된 이산 정수 DP 모델**의 수학적 건전성을 증명합니다:

| 영역 | 현재 상태 | 정확한 기술적 경계 |
| --- | --- | --- |
| **이산 정수 DP 코어 및 64코돈 번역 (`FactorForgeFormal`)** | **Lean 4 검증 완료** | 핵심 정리 20개 + 보조정리 3개, 증거 14개, `#print axioms` 34건(`sorry` 0건), `leanchecker` 검증 완료. 최적성은 제공된 `WellFormedMenu` 기준입니다(제공된 후보의 타당성을 증명하며 런타임 메뉴와의 보편적 대응은 미증명). |
| **표본 Python DP 대응 및 재현 아카이브** | **완료 (유한 스위트)** | `pytest` 28건, 4개 `PYTHONHASHSEED` 실행, 참조-복사본 변이 `8/8` 검출, 229개 파일 매니페스트 무결성 검사(`python verify_all.py`). |
| **보편적 Python-Lean 정제 및 역포인터 증명** | **미증명 (향후 범위)** | Lean의 `dpOptimize`는 접두사 리스트를 추적하고, 실제 Python은 `(prev_g, prev_s)` 역포인터를 재구성하며 Lean에서 추출된 코드가 아닙니다. |
| **IEEE-754 `float` 및 `1e-12` 엡실론 오차 한계** | **미증명 (향후 범위)** | 실제 DP는 비추이적 `1e-12` 상태 내 동점 허용 오차로 binary64 `math.log`를 누적합니다(`relaxCand` 선착순, `LeanExactMirrorDP` `PathRank`, 실제 `DPV2Optimizer` 마지막 코돈 비교 등 3가지 동점 규칙 공존). `approxScoreExactness`는 `List Int` 위의 조건부 정리입니다. |
| **일반 부분문자열 모티프 컴파일러 및 비-DP 휴리스틱** | **Lean 미증명** | Lean은 임의 모티프 집합의 Aho-Corasick 실패 링크 컴파일 대신 주어진 DFA 전이 테이블을 가정하며, `AutomatonCompiler`는 `PYTHONHASHSEED`에 따라 내부 상태 ID를 순열화합니다. `round(..., 3)`은 $1.0$ 부근 엄밀 내부성을 붕괴시키며, $5'$ 개시 클램핑과 휴리스틱은 `ExactDP.lean` 외부에 있습니다. |
| **생물학적 발현 및 습식 실험 성능** | **데이터 없음** | `UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE`. 수학적 최적화 정합성은 습식 실험 발현, 접힘, 수율을 전혀 보장하지 않습니다. |

로컬 클린 상태에서 전체 검증 아카이브를 재현하려면(Python 3.11+, `pytest`, `ruff`, `elan` `leanprover/lean4:v4.36.0` 설치 필요) `FactorForge_Lean4_Verification_Package.zip`을 짧은 경로에 압축 해제한 뒤 실행하세요:

```bash
python verify_all.py
```
