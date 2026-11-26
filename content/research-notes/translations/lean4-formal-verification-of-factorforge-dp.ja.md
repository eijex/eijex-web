---
lang: "ja"
langLabel: "日本語"
title: "Lean 4によるFactorForge離散動的計画法モデルの形式検証"
summary: "FactorForgeの離散整数DPモデルの健全性、完全性、遺伝暗号翻訳保存、および構成的最適性をLean 4.36.0で証明した数学的ブループリントと、浮動小数点Pythonオプティマイザとの対応境界。"
version: "技術モノグラフ v1.0.3 · Lean 4.36.0"
evidenceScope: "独立したLean 4.36.0証明および有限Python対応テスト（完全なPython洗練証明および生物学的検証は含まない）"
abstract: "制約認識型コード配列（CDS）最適化は、隣接フランク配列やコドン境界を跨ぐ禁止モチーフを回避し、全体GC含量の上下限を満たしつつ、加法的コドン適応度目的関数を最大化する同義コドンを選択します。有限の単体テストはサンプル入力での一致しか確認できず、非形式的な証明や無制約なAI生成証明は独立した証明カーネルによる検査なしには仕様の弱体化を招く恐れがあります。本稿では、外部Mathlib依存を持たないLean 4.36.0形式化（14モジュール、2,500行超、sorry 0件、leanchecker検証済み）であるFactorForgeFormalの完全な数学的ブループリントを提示します。Tropical max-plus代数、コンストラクト全体のDFA安全性、64コドン標準遺伝暗号（ValidCodonForAA）、構成的バックトラックDP最適性（dpOptimizeEndToEnd）、厳密有理数ポーズランプ補間（ExactRat）、条件付き整数摂動マージンにわたり、20個の中核定理、3個の補題、14個の具体証人・反駁定理を証明し、fail-closedなPython対応検証および8/8参照コピー変異テストと併せて報告します。"
pdfLabel: "技術モノグラフ v1.0.3 をダウンロード (PDF, 14p)"
bundleLabel: "再現可能な Lean 4 + オラクルアーカイブ (.zip)"
toc:
  - id: "sec-1"
    number: "1"
    title: "検証アーキテクチャと役割分離型トラスト"
  - id: "sec-2"
    number: "2"
    title: "Tropical Max-Plus代数 (Spec/Tropical.lean)"
  - id: "sec-3"
    number: "3"
    title: "コンストラクト全体のDFA安全性 (Spec/Automaton.lean)"
  - id: "sec-4"
    number: "4"
    title: "64トリプレット遺伝暗号とメニュー妥当性"
  - id: "sec-5"
    number: "5"
    title: "Bellman最適性と構成的 dpOptimize"
  - id: "sec-6"
    number: "6"
    title: "厳密有理数キネティクス・タイ順序・マージン"
  - id: "sec-7"
    number: "7"
    title: "12状態 BsaI オートマトンと反駁トレース"
  - id: "sec-8"
    number: "8"
    title: "定理・証人・変異・F1-F28 カタログ"
  - id: "sec-9"
    number: "9"
    title: "厳密な証明境界と再現プロトコル"
---

## 1. 検証アーキテクチャと役割分離型トラスト

動的計画法（DP）コード配列コンパイラを有限の単体テストのみで検査しても、任意のタンパク質長 $L$、狭い整数GC区間 $[g_{\min}, g_{\max}]$、または $5'$ フランク・コード配列・$3'$ 終止テールを跨ぐモチーフ架橋に対する普遍的不変量を証明することはできません。逆に、仕様設計と証明記述の双方を単一の無制約な自動ワークフローに委ねると、次の2つの典型的な失敗モードが生じます:

1. **仕様の弱体化と空虚な真（Vacuity）:** 形式化が同義翻訳不変性（$\mathrm{Translate}(D) = P$）を欠落させたり、候補レコードの未検証メタデータ（例：`gc = 3` と偽称するコドン `AAA` や、センスメニュー内の終止コドン `TAA`）を信頼したり、前件が充足不能な含意を証明したりする恐れがあります。
2. **モデルと実装の混同:** $\mathbb{Z} \cup \{-\infty\}$ 上の離散整数モデルに対するBellman最適性の証明は、IEEE-754 binary64 の `math.log` 浮動小数点を累積し、`1e-12` の状態内タイ許容誤差を用い、可変タプルバックポインタで経路を再構成する実運用Pythonオプティマイザの普遍的なコード洗練証明（refinement proof）とは異なります。

暗黙の仕様ドリフトを防ぎ、ランタイム境界を明示的に測定するため、`FactorForgeFormal` は4層のトラスト分離を強制します:

- **暗号学的にロックされた Lean 4 仕様 (`formal/FactorForgeFormal/Spec/`):** 6つのモジュール（`Tropical.lean`, `Automaton.lean`, `GeneticCode.lean`, `ExactDP.lean`, `KineticAndParity.lean`, 統合 `Spec.lean`）が全データ構造・アルゴリズム・目標命題（`Prop_*`）を `sorry` ゼロで宣言し、`spec_lock_manifest.json` のハッシュに固定します。
- **分離されたタクティク証明 (`formal/FactorForgeFormal/Proofs/`):** 5つの証明モジュールが `Spec/` を読み取り専用でインポートし、外部Mathlibや `native_decide` を使わずに構造帰納法、fold不変量リフト、カーネル簡約（`decide`）、線形整数算術（`omega`）によって **20個の中核定理** と **3個の構造補題** を証明します。
- **具体的な非空虚性証人・反駁とカーネル公理監査 (`Witnesses.lean`, `Audit.lean`):** カーネル検証済みの14定理が12状態 BsaI（`GGTCTC` / `GAGACC`）オートマトンとコンストラクト `"GGTC" + "SL" + "TAA"` 上で仕様をインスタンス化し、不正コドンの棄却と量子化スコア `-357` における最適配列 `AGCCTG` の構成的選択を証明します。`Audit.lean` は全34宣言に対して `#print axioms` を実行し、`leanchecker` による別プロセス再検証を行います。
- **有限 Python 対応検証・参照変異スイート (`tests/`):** 同梱された `factorforge_snapshot/` をDFA非依存の部分文字列全列挙器（`BruteForceCDSOracle`）、整数ミラー（`LeanExactMirrorDP`）、4つの `PYTHONHASHSEED` 設定による200インスタンス縮小ファザー、および8欠陥参照コピー変異スイートで交差検証します。**なお、開発中に実施されたマルチエージェント敵対的レビューは内部の自動工学チェックであり、外部の数学者や形式検証専門家による独立監査の代替ではありません。**

## 2. Tropical Max-Plus代数 (`Spec/Tropical.lean`)

到達可能な有限状態上での加法的 log-CAI 最大化は、到達不能な `(gc, state)` セルを $-\infty$ とし、経路延長で整数スコアを加算し、状態緩和で最大値を取る拡張整数半環 $\mathrm{Trop}(\mathbb{Z}) = \mathbb{Z} \cup \{-\infty\}$ 上で形式化されます。

> **定義 2.1 (Tropical 台集合、演算および半順序).** 台型 $\alpha$ に対する帰納型 `Trop α` はコンストラクタ `negInf`（$-\infty$、加法単位元 $\mathbb{0}$）と `finite a`（乗法単位元 $\mathbb{1} = \mathrm{finite}(0)$）を持ちます。$\alpha = \mathbb{Z}$ 上の緩和 $\oplus$、延長 $\otimes$、半順序 $\le$ は次のように定義されます:

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

> **定理 2.1 (`tropIntSemiringLaws`) および 定理 2.2 (`tropIntOrderLaws`).** $(\mathrm{Trop}(\mathbb{Z}), \oplus, \otimes, -\infty, 0)$ は、$\oplus$ の結合律・交換律・冪等律（$a \oplus a = a$）・単位元、$\otimes$ の結合律・単位元 $0$・$-\infty$ 零元吸収、左右分配律 $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$ の全12個の冪等 max-plus 半環公理を満たし、$(\mathrm{Trop}(\mathbb{Z}), \le)$ は $\oplus$ が最小上界かつ $\otimes$ が両引数で単調となる半順序をなします。

> **証明スケッチ (`Proofs/Tropical.lean`).** 3重コンストラクタの場合分け（`cases a <;> cases b <;> cases c`）により、有限分岐を線形整数の `max` および `+` のゴールへ帰着させ、`omega` で閉じます（`#print axioms`: `[propext, Quot.sound]`）。

## 3. コンストラクト全体の有限状態オートマトン安全性 (`Spec/Automaton.lean`)

禁止制限酵素認識部位（BsaI `GGTCTC` および相補鎖 `GAGACC` 等）や禁止モチーフは、$5'$ フランクとCDSの境界、コドン間境界、およびCDSと終止・ターミネータ配列の境界を跨いで出現し得ます。`Spec/Automaton.lean` は $\Sigma = \{\mathrm{A}, \mathrm{C}, \mathrm{G}, \mathrm{T}\}$ 上の有界決定性有限オートマトン（DFA）をモデル化します。

> **定義 3.1 (有界 DFA と接頭辞安全遷移).** `Automaton` $M = (N, q_0, \delta, T, h_0, h_\delta)$ は状態数 $N = \text{numStates}$、初期状態 $q_0 < N$、状態閉じた遷移写像 $\delta : \mathbb{N} \times \Sigma \to \mathbb{N}$（$q < N \implies \delta(q,b) < N$）、禁止受理状態述語 $T : \mathbb{N} \to \mathbb{B}$ からなります。複数塩基遷移 $\delta^* = \text{stepSeq}$ と接頭辞ごとの禁止状態回避 $\mathrm{safeSeq}$ は塩基リスト上で再帰定義され、`stepCodonSafe` は途中塩基が受理状態に入った瞬間に `(s', false)` で停止することで `CompiledAutomaton.step_codon` に一致します。

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

> **定理 3.1-3.5 (`stepSeqAppend`, `safeSeqAppend`, `stepCodonSafeSound`, `stepCodonSafeComplete`, `fullConstructSafe`).** 複数塩基遷移は準同型に合成され（$\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q,u), v)$）、接頭辞安全性は中間状態で分解され（$\mathrm{safeSeq}(M, q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(M, q, u) \land \mathrm{safeSeq}(M, \delta^*(q, u), v)$）、`stepCodonSafe` は `(stepSeq, safeSeq)` に対して健全かつ完全です。従って任意の $5'$ フランク $F_L$、コドン列 $C$、$3'$ テール $F_R$（$q_L = \delta^*(q_0, F_L)$、$q_{\mathrm{end}} = \delta^*(q_L, \mathrm{flatten}(C))$）に対し次が成立します:

$$
\mathrm{safeSeq}(M, q_0, F_L) \;\land\; \mathrm{safeCodonList}(M, q_L, C) \;\land\; \mathrm{safeSeq}(M, q_{\mathrm{end}}, F_R)
\;\Longrightarrow\;
\mathrm{safeSeq}\bigl(M, q_0, F_L \mathbin{\Vert} \mathrm{flatten}(C) \mathbin{\Vert} F_R\bigr).
$$

> **証明スケッチ (`Proofs/Automaton.lean`).** 開始状態 `s` を一般化した `xs` に対する構造帰納法で `M.isTerminal (M.stepSym s b)` を分岐します。補題 `safeCodonList_implies_safeSeq` が `stepCodonSafeSound` を `cds : List (List Base)` へ持ち上げ、`fullConstructSafe` が `List.append_assoc` と `safeSeqAppend` を2回適用します（`#print axioms`: `[propext]` のみ）。

## 4. 標準64トリプレット遺伝暗号と同義コドンメニュー妥当性 (`Spec/GeneticCode.lean`)

不正な候補メニューがアミノ酸忠実性を回避したり GC カウントを偽装したりするのを防ぐため、`Spec/GeneticCode.lean` は全 $4^3 = 64$ トリプレット（`translateTriplet`）とフレーム厳密デコーダ（`translateDNA`）を符号化し、Python 側の `STANDARD_GENETIC_CODE` と 64対64 で一致検証されます。

> **定義 4.1 (`ValidCodonForAA` と `WellFormedMenu`).** 候補コドンレコード $c = (\mathrm{seq}, \mathrm{gc}, \mathrm{score})$ が目標残基 $a \in \mathcal{A}$ に対して妥当であるとは、長さが厳密に 3 であり、塩基 GC 数が `gc` フィールドと一致し、かつセンス翻訳が $a$ となることを指します:

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

> **定理 4.1 (`geneticCodePartition64`, 公理ゼロ), 補題 4.2-4.3 (`validCodonForAA_destruct`, `translateDNA_cons3`), および 定理 4.4-4.5 (`gcConservation`, `proteinPreservationAndGC`).** Lean カーネル内部で **公理を一切使わず** 64個のDNAトリプレットが `61` 個のセンスコドンと `3` 個の終止コドン（`TAA`, `TAG`, `TGA`）に分割されることが証明されます。`WellFormedMenu P L` の下では、任意の `ValidPath M s0 L C` から展開されたコード配列 $D = \mathrm{flatMap}(\mathrm{seq}, C)$ は次を満たします:

$$
|D| = 3|P|, \qquad
\mathrm{pathGC}(C) = \sum_{i=1}^{|P|} c_i.\mathrm{gc} = \mathrm{seqGC}(D), \qquad
\mathrm{translateDNA}(D) = \mathrm{some}(P),
$$

これによりフレームシフトゼロおよび内部・末端終止コドンゼロが保証されます。

## 5. Bellman最適性と構成的証人経路抽出 (`Spec/ExactDP.lean`)

### 5.1 Tropical Bellman テーブル vs. 構成的候補追跡ソルバ

離散状態格子 $(g, s) \in \{0,\dots,G_{\max}\} \times \{0,\dots,N-1\}$ 上で、`Spec/ExactDP.lean` は Tropical 値漸化式 `dpEval` / `dpBestScore` と、構成的接頭辞追跡ソルバ `dpTrackEval` / `dpOptimize` を定義します。

$$
V_i(g', s') := \bigoplus_{s = 0}^{N - 1} \;\bigoplus_{\substack{c \in O_i : \; c.\mathrm{gc} \le g' \\ \mathrm{stepCodonSafe}(M, s, c.\mathrm{seq}) = (s', \mathrm{true})}}
\Bigl(V_{i-1}(g' - c.\mathrm{gc}, s) \otimes \mathrm{finite}(c.\mathrm{score})\Bigr),
\qquad V_0(g, s) = \begin{cases} 0 & (g,s)=(0,s_0), \\ -\infty & \text{otherwise.} \end{cases}
$$

存在証明だけでなく具体的な最適コドン列 `some (v, cs)` を返すため、`DPCandidate := Option (Int × List CodonSpec)` は整数スコアと接頭辞コドン列をペアにし、決定的緩和関数 `relaxCand`（同点時は先出を保持）と `extendCand` を用います。

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

### 5.2 健全性・完全性・枝刈りおよび中核定理 `dpOptimizeEndToEnd`

> **定理 5.1-5.3 (`dpSoundness`, `dpCompleteness`, `exactGlobalOptimality`) と補題 (`exactOpt_witness_eq`).** $s_0 < M.\mathrm{numStates}$ の下で、すべての有限テーブル値 $V_L(g, s) = \mathrm{finite}(v)$ は一致する $(g, s, v)$ を持つ真の `ValidPath` を証言し、すべての `ValidPath` は $V_L(\mathrm{pathGC}(C), \delta^*(s_0, D))$ により上から抑えられます。終端射影 `dpBestScore` は全 `FeasibleCDS` 経路を上界で抑え、すべての有限大域最適値を達成します。

> **定理 5.4 (中核定理: `dpOptimizeEndToEnd`).** `WellFormedMenu P L` および $s_0 = \delta^*(q_0, F_L)$ の下で `dpOptimize` は次を同時に満たします:
> 1. **値の洗練一致:** $\mathrm{safeSeq}(M, q_0, F_L) = \mathrm{true}$ のとき $\mathrm{candToTrop}(\mathrm{dpOptimize}(\dots)) = \mathrm{dpBestScore}(\dots)$。
> 2. **完全な充足不能証明書:** $\mathrm{dpOptimize}(\dots) = \mathrm{none}$ は、$F_L$ が安全でないか `FeasibleCDS` 経路が存在しないことの必要十分条件です。
> 3. **8項目構成的配列最適性:** $\mathrm{dpOptimize}(\dots) = \mathrm{some}(v, C)$ かつ $D = \mathrm{flatMap}(\mathrm{seq}, C)$ のとき、$C$ は実行可能であり、$\mathrm{pathScore}(C) = v$、$|D| = 3|P|$、$\mathrm{translateDNA}(D) = \mathrm{some}(P)$、$g_{\min} \le \mathrm{seqGC}(D) \le g_{\max}$、全配列 $F_L \mathbin{\Vert} D \mathbin{\Vert} F_R$ は $q_0$ から禁止状態を一切経由せず、任意の実行可能競合 $C'$ について $\mathrm{pathScore}(C') \le v$ が成立します。

> **定理 5.5-5.6 (`gcEnvelopeAndPruningAdmissible`, `synonymousEnvelopeUnsat`).** 任意の実行可能分割 $C = C_{\mathrm{pre}} \mathbin{\Vert} C_{\mathrm{suf}}$ は $g_{\min} \le \mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMaxGC}(\mathcal{L}_{\mathrm{suf}})$ および $\mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMinGC}(\mathcal{L}_{\mathrm{suf}}) \le g_{\max}$ を満たすため接尾辞 GC 枝刈りは最適完了を落とさず、$[\mathrm{totalMinGC}(\mathcal{L}), \mathrm{totalMaxGC}(\mathcal{L})]$ と交わらない目標 GC 帯域には実行可能解が 0 個となります。

> **証明スケッチ (`Proofs/ExactDP.lean`, 1,225行).** DP 層に対する末尾追加帰納法（`list_snoc_rec`）と `List.range M.numStates`・`opts` の入れ子 fold 不変量補題を用います。準同型補題 `candToTrop_dpTrackEval` が `candToTrop (relaxCand x y) = oplus (candToTrop x) (candToTrop y)` を通じて `candToTrop (dpTrackEval ...) = dpEval ...` を示し、`dpTrackSoundness` が経路妥当性を引き上げて `proteinPreservationAndGC`、`fullConstructSafe`、`exactGlobalOptimality` を統合します。

## 6. 厳密有理数キネティクス・タイ順序・摂動マージン (`Spec/KineticAndParity.lean`)

> **定義 6.1 (`ExactRat` と `rampTau`).** 厳密有理数 $\mathrm{ExactRat} = \{(p, q) \in \mathbb{Z}^2 : q > 0\}$ は除算や浮動小数点丸めを行わず、たすき掛け（$a.p \cdot b.q < b.p \cdot a.q$）で比較します。上流減速ランプ補間 $\tau_{\mathrm{ramp}}(\tau_p, d, W) = \tau_p + \frac{d}{W}(1 - \tau_p)$ は次のように厳密表現されます:

$$
\mathrm{rampTau}\bigl((p, q), d, W\bigr) := \frac{pW + d(q - p)}{qW}, \qquad (q > 0,\; W > 0).
$$

> **定理 6.1-6.4 (`tasepRampBoundsAndMonotonicity`, `zeroWeightParity`, `pathLexTotalOrder`, `approxScoreExactness`).**
> - **厳密ランプ内部性と単調性:** $0 < \tau_p < 1$ かつ $1 \le d < W$ ならば $\tau_p <_{\mathbb{Q}} \mathrm{rampTau}(\tau_p, d, W) <_{\mathbb{Q}} 1$ であり、$\mathrm{rampTau}$ は $d$ に関して狭義単調増加し $\tau_p = 1$ で不変です。
> - **零重みポーズ等価性:** 有効ポーズ重みがすべて $0$ のとき、構造認識 `structFitness` は `dpEval` の全 $(g, s)$ セルでベースライン適応度と一致します。
> - **辞書式狭義全順序:** 接頭辞ランク比較 `pathLexLt` は `List Nat` 上で非反射律・推移律・非対称律・三分律を満たします。
> - **条件付き整数摂動マージン (`List Int`):** ステップ誤差が $|a_i - t_i| \le \varepsilon$ なら $\bigl|\sum_{i=1}^L a_i - \sum_{i=1}^L t_i\bigr| \le L\varepsilon$ となり、$\tilde{S}_{\mathrm{alt}} + 2\Delta < \tilde{S}_{\mathrm{opt}}$ かつ $|\tilde{S} - S| \le \Delta$ が $S_{\mathrm{alt}} < S_{\mathrm{opt}}$ を保証します。

> **ランタイム境界 (`float` vs. `List Int` / `ExactRat`).** `approxScoreExactness` は `List Int`（固定小数点量子化マージン）上の条件付き定理であり、実運用 Python の binary64 `math.log` 浮動小数点誤差証明ではありません。同様に Python の `TASEPKineticsEngine` の `round(..., 3)` は $\tau_p \ge 0.999$ 付近で $< 1.0$ の狭義内部性を崩壊させます（例: $\tau_p = 0.999, d = 2, W = 3 \mapsto 1.0$）。

## 7. 具体12状態 BsaI オートマトンと反駁トレース (`Witnesses.lean`)

Lean カーネル内で非空虚性を証明するため、`Witnesses.lean` は BsaI（`GGTCTC` $\to$ 受理状態 `6`; 逆相補鎖 `GAGACC` $\to$ 受理状態 `11`）の決定性12状態 Aho-Corasick オートマトンを符号化し、$5'$ フランク `"GGTC"`、$3'$ 終止テール `"TAA"`、GC 帯域 `[2, 4]` 上でジペプチド `"SL"`（`[.S, .L]`）を最適化します:

1. **フランク遷移 (`witness_leftFlank_safe`):** `"GGTC"` は $0 \xrightarrow{\mathrm{G}} 1 \xrightarrow{\mathrm{G}} 2 \xrightarrow{\mathrm{T}} 3 \xrightarrow{\mathrm{C}} 4$ と安全に遷移します（`s0 = 4`）。
2. **境界違反の反駁 (`witness_tct_rejected`):** 最高スコアのセリンコドン `TCT`（量子化スコア `-223`）は $4 \xrightarrow{\mathrm{T}} 5 \xrightarrow{\mathrm{C}} \mathbf{6}$ へ進み $5'$ 境界に `"GGTCTC"` を形成するため `(6, false)` で棄却されます。
3. **不正入力の反駁 (`witness_malformed_codon_rejected`):** カーネル `decide` は `gc = 3` と偽称する `AAA`、セリン `.S` と偽称する `AAA`、チロシン `.Y` と偽称する終止コドン `TAA` をすべて棄却します。
4. **構成的大域最適解 (`witness_dpOptimize_sl_end_to_end`):** `dpOptimize` は `AGC`（$4 \to 0 \to 1 \to 0$、スコア `-357`、`gc = 2`）と `CTG`（$0 \to 0 \to 0 \to 1$、スコア `0`、`gc = 2`）、安全な終止テール `"TAA"`（$1 \to 0 \to 0 \to 0$）を選び、`some (-357, [AGC, CTG])`（`"AGCCTG"`、`seqGC = 4`）を出力します。

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

## 8. 定理・証人・変異・F1-F28 カバレッジ全カタログ

### 8.1 監査済み20中核定理 + 3構造補題 (`Audit.lean`)

`lake env lean FactorForgeFormal/Audit.lean` の公理凡例: **`none`** = 公理ゼロ; **`P`** = `[propext]`; **`P, Q`** = `[propext, Quot.sound]`; **`P, C, Q`** = `[propext, Classical.choice, Quot.sound]`（`sorryAx` ゼロ・独自公理ゼロ）。

| モジュール | Lean 定理 / 補題識別子 | `#print axioms` | 検証済み数学的命題 |
| --- | --- | --- | --- |
| `Tropical` | `tropIntSemiringLaws` | `P, Q` | $\mathrm{Trop}(\mathbb{Z})$ 上の12個の冪等 max-plus 半環法則 |
| `Tropical` | `tropIntOrderLaws` | `P, Q` | 半順序、最小上界、および $\oplus$/$\otimes$ の単調性 |
| `Automaton` | `stepSeqAppend` | `P` | 任意の塩基列 $u, v$ に対する $\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q, u), v)$ |
| `Automaton` | `safeSeqAppend` | `P` | $\mathrm{safeSeq}(q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(q, u) \land \mathrm{safeSeq}(\delta^*(q, u), v)$ |
| `Automaton` | `stepCodonSafeSound` | `P` | `stepCodonSafe(q, c) = (q', true)` ならば $\delta^*(q, c) = q'$ かつ `safeSeq(q, c)` |
| `Automaton` | `stepCodonSafeComplete` | `P` | `safeSeq(q, c) = true` ならば `stepCodonSafe(q, c) = (stepSeq(q, c), true)` |
| `Automaton` | `fullConstructSafe` | `P` | 安全な $5'$ フランク・コドン列・$3'$ テールが安全な全配列を保証 |
| `GeneticCode` | `geneticCodePartition64` | `none` | 64 DNA トリプレットの 61 センス + 3 終止コドン分割 |
| `GeneticCode` | `validCodonForAA_destruct` *(補題)* | `P, C, Q` | `ValidCodonForAA` を長さ3・厳密GC・センスAAへ分解 |
| `GeneticCode` | `translateDNA_cons3` *(補題)* | `P` | 妥当なセンストリプレット接頭辞の再帰的 `translateDNA` 保存 |
| `ExactDP` | `gcConservation` | `P, C, Q` | 妥当コドン `gc` の総和が展開後塩基 `seqGC` と一致 |
| `ExactDP` | `proteinPreservationAndGC` | `P, C, Q` | `WellFormedMenu` 上の `ValidPath` が長さ $3\lvert P\rvert$、`seqGC`、`some P` を保存 |
| `ExactDP` | `dpSoundness` | `P, C, Q` | すべての有限 `dpEval` セルが一致する `ValidPath` を証言 |
| `ExactDP` | `dpCompleteness` | `P, C, Q` | すべての `ValidPath` スコアが $(g, s)$ の `dpEval` で上から抑えられる |
| `ExactDP` | `exactGlobalOptimality` | `P, C, Q` | `dpBestScore` が全 `FeasibleCDS` を上界で抑え有限最適値を達成 |
| `ExactDP` | `exactOpt_witness_eq` *(補題)* | `P, C, Q` | 全競合を上界で抑える実行可能証人が `dpBestScore` と一致 |
| `ExactDP` | `dpOptimizeEndToEnd` | `P, C, Q` | 構成的 `dpOptimize` 値一致、`none`-iff-不能、8項目最適性 |
| `ExactDP` | `gcEnvelopeAndPruningAdmissible` | `P, C, Q` | 到達可能接尾辞 GC 境界 $[G_{\min}, G_{\max}]$ が全実行可能完了を保存 |
| `ExactDP` | `synonymousEnvelopeUnsat` | `P, C, Q` | $[G_{\min}, G_{\max}]$ 外の目標 GC 帯域に実行可能解が 0 個 |
| `KineticAndParity` | `tasepRampBoundsAndMonotonicity` | `P, Q` | 厳密有理数ランプ内部性 $(\tau_p, 1)$・単調性・$\tau_p = 1$ 不変性 |
| `KineticAndParity` | `zeroWeightParity` | `P, Q` | 零重みポーズマップでステップ適応度と全 DP テーブルが基準に一致 |
| `KineticAndParity` | `pathLexTotalOrder` | `P, Q` | `pathLexLt` の非反射律・推移律・非対称律・三分律 |
| `KineticAndParity` | `approxScoreExactness` | `P, Q` | 条件付き `List Int` 誤差上界 $L\varepsilon$ と $2\Delta$ 厳密 argmax 保存 |

### 8.2 14個の具体証人・反駁定理 (`Witnesses.lean`)

| 証人定理識別子 | `#print axioms` | カーネル検証済み性質 |
| --- | --- | --- |
| `witness_malformed_codon_rejected` | `P` | `gc = 3` を偽称する `AAA`、`.S` とする `AAA`、`.Y` とする終止 `TAA` を棄却 |
| `witness_sl_wellFormedMenu` | `P` | セリン6種 + ロイシン6種が `WellFormedMenu [.S, .L]` を満たすことを証明 |
| `witness_leftFlank_safe` | `P, Q` | 左フランク `"GGTC"` が12状態 BsaI DFA 上で安全に状態 `4` へ到達 |
| `witness_sl_feasible` | `P, Q` | 経路 `AGCCTG` が `"GGTC" + "SL" + "TAA"` 上で `FeasibleCDS` を満たす |
| `witness_dpBest_sl_exact` | `P, C, Q` | `exactOpt_witness_eq` により `dpBestScore(...) = finite (-357)` を証明 |
| `witness_dpOptimize_sl_end_to_end` | `P, C, Q` | `[.S, .L]` に翻訳される `some (-357, cs)` を構成的に抽出 |
| `witness_tct_rejected` | `P, Q` | 状態 `4` からセリンコドン `TCT` が禁止状態 `6` へ入ることを証明 |
| `witness_gc_and_protein_preservation` | `P, C, Q` | `optPathSL` (`AGCCTG`) 上で `proteinPreservationAndGC` をインスタンス化 |
| `witness_gc_pruning_admissible` | `P, C, Q` | 接頭辞 `AGC` + 接尾辞ロイシン GC エンベロープ境界 `[2, 4]` を検証 |
| `witness_tasep_ramp` | `P, Q` | `ExactRat` 上で $\frac{7}{20} < \mathrm{rampTau}(\frac{7}{20}, 1, 3) < 1$ を証明 |
| `witness_zero_weight_parity` | `P, Q` | 零重みポーズ項目がスコア `-357` を同一に保つことを確認 |
| `witness_path_lex_order` | `P, Q` | `[14, 19] < [15, 19] < [48, 19] => [14, 19] < [48, 19]` を証明 |
| `witness_approx_margin_exactness` | `P, Q` | 2コドンマージン $-511 + 2(2) < -357 \implies -510 < -356$ を証明 |
| `witness_unsat_gc` | `P, C, Q` | 目標 GC 帯域が `[5, 6] > 4` のとき実行可能経路が 0 個であることを証明 |

### 8.3 参照コピー変異監査 (`8/8` 注入意味欠陥を検出)

`PYTHONHASHSEED` $\in \{0, 1, 2, 3\}$ で200個のシード付きランダム事例を反復検証した結果、実運用 `DPV2Optimizer` は実行可能性・アミノ酸翻訳・モチーフ安全性・最適スコアで `BruteForceCDSOracle` と一致し、同型ジペプチド（`FF`: `TTTTTC` vs `TTCTTT`, `(g = 1, s = 0)` 同スコア）における具体的なタイブレーク差異を特定しました。`test_mutation_detection_audit.py` では計測用参照ソルバのコピーに8種類の意味的欠陥を注入し、すべて検出しました:

| 変異 ID | 監査結果 | 注入された欠陥と検出したオラクル表明 |
| --- | --- | --- |
| `M1_WRONG_SYNONYMOUS_CODON` | **検出 (Killed)** | `"SL"` (`[0.30, 0.67]` GC) のセリンメニューへリシン `AAA` (`gc = 0`) を混入; `translate_dna(seq) != "SL"` で検出 |
| `M2_GC_COUNT_DROP_C` | **検出 (Killed)** | `"TT"` (`[0.66, 0.67]` GC) で `'G' + 'C'` の代わりに `'G'` のみ計数; 塩基GC範囲・オラクル集合検査で検出 |
| `M3_DROP_REVERSE_COMPLEMENT` | **検出 (Killed)** | `"GA" + "DL"` で逆相補鎖 `GAGACC` を省略; 境界 `GAGACC` 発生を部分文字列検査で検出 |
| `M4_IGNORE_LEFT_FLANK` | **検出 (Killed)** | `"GGTC" + "SL" + "TAA"` で `step("GGTC") = 4` ではなく `s0 = 0` から開始; `TCT` (`GGTCTC`) を部分文字列検査で検出 |
| `M5_IGNORE_RIGHT_FLANK` | **検出 (Killed)** | `"" + "G" + "CTC"` で右フランク終端検査を省略; `GGT` (`GGTCTC`) を部分文字列検査で検出 |
| `M6_OFF_BY_ONE_MAX_GC` | **検出 (Killed)** | `"TT"` (`min_gc = max_gc = 4`) で `g <= max_gc` を `g < max_gc` に改変; `No in-band candidate` 誤動作で検出 |
| `M7_MIN_INSTEAD_OF_MAX` | **検出 (Killed)** | 状態緩和で log-CAI を最大化ではなく最小化; `BruteForceCDSOracle` 最適スコア比較で検出 |
| `M8_CORRUPT_BACKPOINTER` | **検出 (Killed)** | 順方向パスで `prev_g = g + 1` を保存; バックトラック時の `KeyError` または配列不一致で検出 |

### 8.4 数式カバレッジマトリクス (`F1`-`F28`)

階層: **L1** = Lean 4 カーネル証明; **O1** = 本アーカイブの全列挙/ファザー/変異スイート; **C1** = 本体リポジトリの決定的単体テスト; **(B)** = 文書化されたランタイム差異。

| ID | 数式項目 | Lean 4 / Python アンカー | 検証階層 | 境界注記 |
| --- | --- | --- | --- | --- |
| `F1` | コドン頻度 $f(c)$ | `load_codon_usage_table` | `C1` | テーブルローダ |
| `F2` | 相対適応度 $w(c)$ | `_build_codon_weights` | `C1 + O1` | 下限 $10^{-6}$ クランプ |
| `F3` | 幾何 CAI と対数和 | `pathScore`, `approxScoreExactness` | `L1 + O1 (B)` | `Int` vs binary64 `float` |
| `F4` | 塩基 GC 数と割合 | `seqGC`, `gcConservation` | `L1 + O1` | 厳密整数 GC |
| `F5` | 64トリプレット遺伝暗号 | `translateTriplet`, `geneticCodePartition64` | `L1 + O1` | 64/64 全単射 |
| `F6` | センス翻訳 $\mathrm{Translate}(D)=P$ | `ValidCodonForAA`, `proteinPreservationAndGC` | `L1 + O1` | メニュー健全性 |
| `F7` | 禁止モチーフ + RC 閉包 | `Automaton`, `AutomatonCompiler` | `L1 + O1 (B)` | 与えられた DFA テーブル |
| `F8` | コンストラクト境界安全性 | `fullConstructSafe` | `L1 + O1` | 任意フランク配列 |
| `F9` | 実行可能 CDS 集合 $\mathcal{F}(P,\theta)$ | `FeasibleCDS`, `synonymousEnvelopeUnsat` | `L1 + O1` | 整数 GC 帯域 |
| `F10`-`F14` | Random, Greedy, Balanced, GC-target, SOP / 局所書換 | `reverse_translator.py`, `sop_balancer.py`, `local_rewriter.py` | `C1` | 非DPヒューリスティクス |
| `F15` | Tropical max-plus 半環 | `tropIntSemiringLaws`, `tropIntOrderLaws` | `L1 + O1` | $\mathbb{Z}\cup\{-\infty\}$ 代数 |
| `F16` | 順方向 Bellman 層遷移 | `dpStep`, `dpSoundness`, `dpCompleteness` | `L1 + O1 (B)` | $5'$ ランプは Lean 外 |
| `F17` | 終端フィルタと大域最適値 | `dpBestScore`, `exactGlobalOptimality` | `L1 + O1 (B)` | フォールバックは `O1` |
| `F18` | 構成的バックトラックとタイ規則 | `dpOptimizeEndToEnd`, `pathLexTotalOrder` | `L1 + O1 (B)` | 3種類のタイ規約 |
| `F19` | 接尾辞 GC 枝刈りと TASEP ランプ | `gcEnvelopeAndPruningAdmissible`, `tasepRampBoundsAndMonotonicity` | `L1 + O1 (B)` | $1.0$ 近傍 `round(..., 3)` |
| `F20`-`F26` | 通過ゲート・区間 GC・ホモポリマー・ジヌクレオチド・平均 | `SharedEvaluator`, `BenchmarkRunner` | `C1 (+ O1)` | 記述統計量 |
| `F27` | マニフェスト整合性バインディング | `verify_all.py`, `REPRODUCIBILITY_MANIFEST.json` | `O1` | 229ファイルハッシュ固定 |
| `F28` | 認識論的分類ゲート | `UNVERIFIED_PUBLIC_CORPUS` | `Governance` | ウェットラボ主張ゼロ |

## 9. 厳密な証明境界と Fail-Closed 再現プロトコル

本マイルストーンは Python ソフトウェアスタック全体の普遍的検証ではなく、FactorForge の **明示的に定義された離散整数 DP モデル** の数学的健全性を証明するものです:

| 対象領域 | 現在の状態 | 厳密な技術的境界 |
| --- | --- | --- |
| **離散整数 DP コアと 64コドン翻訳 (`FactorForgeFormal`)** | **Lean 4 検証済み** | 中核20定理 + 補題3個、証人14個、`#print axioms` 34件（`sorry` 0件）、`leanchecker` 検証済み。最適性は与えられた `WellFormedMenu` に対する相対的性質です（与えられた候補の妥当性を証明し、実行時メニューとの普遍的対応は未証明）。 |
| **有限 Python DP 対応と再現アーカイブ** | **完了（有限スイート）** | `pytest` 28件、4種の `PYTHONHASHSEED` 実行、参照コピー変異 `8/8` 検出、229ファイルのマニフェスト整合性検査（`python verify_all.py`）。 |
| **普遍的 Python-to-Lean 洗練およびバックポインタ証明** | **未証明（将来範囲）** | Lean の `dpOptimize` は接頭辞リストを保持し、実運用 Python は `(prev_g, prev_s)` バックポインタを再構成するため、Lean からのコード抽出物ではありません。 |
| **IEEE-754 `float` と `1e-12` イプシロン誤差上界** | **未証明（将来範囲）** | 実運用 DP は非推移的な `1e-12` 状態内タイ許容誤差で binary64 `math.log` を累積します（`relaxCand` 先着、`LeanExactMirrorDP` `PathRank`、実運用 `DPV2Optimizer` 最終コドン比較の3方針が併存）。`approxScoreExactness` は `List Int` 上の条件付き定理です。 |
| **一般部分文字列モチーフコンパイラと非DP手法** | **Lean 未証明** | Lean は任意モチーフ集合の Aho-Corasick 失敗リンク構築ではなく与えられた DFA 遷移表を仮定し、`AutomatonCompiler` は `PYTHONHASHSEED` により内部状態 ID を順列化します。`round(..., 3)` は $1.0$ 近傍の狭義内部性を崩壊させ、$5'$ 開始クランプとヒューリスティクスは `ExactDP.lean` の範囲外です。 |
| **生物学的発現およびウェットラボ性能** | **データなし** | `UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE`. 数学的最適化の正当性はウェットラボでの発現・フォールディング・収量を一切保証しません。 |

ローカル環境で検証アーカイブ全体をクリーン状態から再現するには（Python 3.11+、`pytest`、`ruff`、`elan` `leanprover/lean4:v4.36.0` が必要）、`FactorForge_Lean4_Verification_Package.zip` を短いディレクトリパスに展開して以下を実行してください:

```bash
python verify_all.py
```
