---
lang: "zh"
langLabel: "中文"
title: "使用 Lean 4 对 FactorForge 离散动态规划模型进行形式化验证"
summary: "在 Lean 4.36.0 中证明 FactorForge 离散整数 DP 模型的可靠性、完备性、遗传密码翻译保持性与构造性最优性的数学蓝图，及其与浮点 Python 优化器的精确边界。"
version: "技术专著 v1.0.3 · Lean 4.36.0"
evidenceScope: "独立的 Lean 4.36.0 形式化证明与有限 Python 对应测试；不包含全量 Python 精化证明或生物学实验验证"
abstract: "约束感知编码序列（CDS）设计需要在保留目标氨基酸序列的同时，避免侧翼与密码子连接处出现禁用基序、满足全局核苷酸 GC 含量界限，并最大化可加性密码子适应度目标。有限的单元测试仅能检验采样输入上的输入输出一致性，而非形式化或无约束 AI 生成的证明若未经独立证明内核检验，则存在规格削弱风险。本文给出 FactorForgeFormal 的完整数学蓝图，这是一个无外部 Mathlib 依赖的 Lean 4.36.0 形式化工程（14 个模块、超过 2,500 行、0 个 sorry，经 leanchecker 独立内核复核），围绕 Tropical max-plus 代数、全构建体 DFA 安全性、64 三联体标准遗传密码（ValidCodonForAA）、构造性回溯 DP 最优性（dpOptimizeEndToEnd）、精确有理数停顿斜坡插值（ExactRat）以及条件整数扰动边界，证明了 20 条核心定理、3 条辅助引理及 14 条具体见证与反驳定理，并配套防失效（fail-closed）Python 对应测试与 8/8 参考副本变异测试。"
pdfLabel: "下载完整技术专著 v1.0.3 (PDF, 14页)"
bundleLabel: "下载可复现 Lean 4 + 预言机打包归档 (.zip)"
toc:
  - id: "sec-1"
    number: "1"
    title: "验证架构与职责分离信任模型"
  - id: "sec-2"
    number: "2"
    title: "Tropical Max-Plus 代数 (Spec/Tropical.lean)"
  - id: "sec-3"
    number: "3"
    title: "全构建体 DFA 安全性 (Spec/Automaton.lean)"
  - id: "sec-4"
    number: "4"
    title: "64 三联体遗传密码与菜单良构性"
  - id: "sec-5"
    number: "5"
    title: "Bellman 最优性与构造性 dpOptimize"
  - id: "sec-6"
    number: "6"
    title: "精确有理数动力学、平局序与扰动边界"
  - id: "sec-7"
    number: "7"
    title: "12 状态 BsaI 自动机与反驳轨迹"
  - id: "sec-8"
    number: "8"
    title: "定理、见证、变异与 F1-F28 覆盖目录"
  - id: "sec-9"
    number: "9"
    title: "精确证明边界与复现协议"
---

## 1. 验证架构与职责分离信任模型

仅通过有限单元测试检验动态规划（DP）编码序列编译器，只能确认选定样本上的输入输出一致，无法证明在任意蛋白质长度 $L$、紧凑整数 GC 区间 $[g_{\min}, g_{\max}]$ 或跨越 $5'$ 侧翼、编码三联体与 $3'$ 终止尾的跨连接基序上的普遍不变量。反之，将规格设计与证明编写同时交给单一无约束自动化流程，会引入两种典型风险：

1. **规格削弱与空真性（Vacuity）：** 形式化可能遗漏同义翻译不变性（$\mathrm{Translate}(D) = P$），信任候选记录上未验证的元数据（例如允许 `AAA` 密码子虚报 `gc = 3`，或允许终止密码子 `TAA` 进入有义密码子菜单），或者证明前提永不满足的蕴涵式。
2. **模型与实现混淆：** 为 $\mathbb{Z} \cup \{-\infty\}$ 上的理想整数模型证明 Bellman 最优性，并不等价于证明实际运行中的 Python 优化器在累加 IEEE-754 binary64 `math.log` 浮点数、应用 `1e-12` 状态内平局容差以及通过可变元组回溯指针重建路径时也满足精化（refinement）关系。

为杜绝隐式规格漂移并明确度量运行时边界，`FactorForgeFormal` 强制执行四层职责分离：

- **加密锁定的 Lean 4 规格 (`formal/FactorForgeFormal/Spec/`)：** 6 个模块（`Tropical.lean`、`Automaton.lean`、`GeneticCode.lean`、`ExactDP.lean`、`KineticAndParity.lean` 及聚合根 `Spec.lean`）以零 `sorry` 声明所有数据结构、算法与目标命题（`Prop_*`），并绑定到 `spec_lock_manifest.json` 中的哈希摘要。
- **隔离的策略证明 (`formal/FactorForgeFormal/Proofs/`)：** 5 个证明模块以只读方式导入 `Spec/`，在不引入外部 Mathlib 依赖和 `native_decide` 的前提下，仅通过结构归纳、折叠不变量提升、内核归约（`decide`）与线性整数算术（`omega`）证明 **20 条核心定理** 与 **3 条结构引理**。
- **具体非空虚见证与内核公理审计 (`Witnesses.lean`, `Audit.lean`)：** 14 条经内核检验的定理在 12 状态 BsaI（`GGTCTC` / `GAGACC`）自动机及构建体 `"GGTC" + "SL" + "TAA"` 上实例化上述规格，同时证明畸形密码子被拒绝以及量化分数 `-357` 下的最优序列 `AGCCTG` 被构造性选出。`Audit.lean` 对全部 34 个声明执行 `#print axioms`，并由 `leanchecker` 独立复核。
- **采样 Python 对应与参考变异测试 (`tests/`)：** 将自包含的 `factorforge_snapshot/` 与独立于 Aho-Corasick 的子串穷举器（`BruteForceCDSOracle`）、精确整数镜像（`LeanExactMirrorDP`）、跨越 4 个 `PYTHONHASHSEED` 设置的 200 实例缩减模糊测试器及 8 缺陷参考副本变异测试集进行交叉比对。**需要指出的是，开发期间的内部多智能体对抗审查属于自动化工程检查，不能替代外部人类数学家或形式化方法专家的独立审计。**

## 2. Tropical Max-Plus 代数 (`Spec/Tropical.lean`)

可达有限状态上的可加性 log-CAI 最大化在扩展整数半环 $\mathrm{Trop}(\mathbb{Z}) = \mathbb{Z} \cup \{-\infty\}$ 上形式化：不可达的 `(gc, state)` 单元格取值为 $-\infty$，路径扩展累加整数得分，状态松弛取最大值。

> **定义 2.1 (Tropical 载体、运算与偏序).** 对于载体类型 $\alpha$，归纳类型 `Trop α` 具有构造子 `negInf`（$-\infty$，加法零元 $\mathbb{0}$）和 `finite a`（乘法单位元 $\mathbb{1} = \mathrm{finite}(0)$）。在 $\alpha = \mathbb{Z}$ 上，松弛 $\oplus$、扩展 $\otimes$ 与偏序 $\le$ 定义如下：

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

> **定理 2.1 (`tropIntSemiringLaws`) 与 定理 2.2 (`tropIntOrderLaws`).** $(\mathrm{Trop}(\mathbb{Z}), \oplus, \otimes, -\infty, 0)$ 满足全部 12 条幂等 max-plus 半环公理 ($\oplus$ 的结合律、交换律、幂等律 $a \oplus a = a$ 与零元；$\otimes$ 的结合律、单位元 $0$ 与 $-\infty$ 零化律；左右分配律 $a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c)$)，且 $(\mathrm{Trop}(\mathbb{Z}), \le)$ 构成偏序，其中 $\oplus$ 为最小上界，$\otimes$ 对两个参数均单调。

> **证明概要 (`Proofs/Tropical.lean`).** 通过三重构造子分情况讨论（`cases a <;> cases b <;> cases c`），将有限分支归约为线性整数 `max` 与 `+` 目标并由 `omega` 关闭（`#print axioms`: `[propext, Quot.sound]`）。

## 3. 全构建体有限状态自动机安全性 (`Spec/Automaton.lean`)

禁用限制性内切酶识别位点（如 BsaI `GGTCTC` 及其反向互补序列 `GAGACC`）和禁用基序不仅会出现在单个密码子内部，还可能跨越 $5'$ 侧翼-CDS 连接处、密码子间边界以及 CDS-终止子连接处。`Spec/Automaton.lean` 对 $\Sigma = \{\mathrm{A}, \mathrm{C}, \mathrm{G}, \mathrm{T}\}$ 上的有界确定性有限自动机（DFA）进行了建模。

> **定义 3.1 (有界 DFA 与前缀安全转移).** `Automaton` $M = (N, q_0, \delta, T, h_0, h_\delta)$ 由状态数 $N = \text{numStates}$、初始状态 $q_0 < N$、状态封闭转移映射 $\delta : \mathbb{N} \times \Sigma \to \mathbb{N}$（$q < N \implies \delta(q,b) < N$）以及禁用终态谓词 $T : \mathbb{N} \to \mathbb{B}$ 组成。多碱基转移 $\delta^* = \text{stepSeq}$ 与前缀禁用状态规避 $\mathrm{safeSeq}$ 在碱基列表上递归定义，而 `stepCodonSafe` 在任一中间碱基进入终态时立即返回 `(s', false)`，精确对应 `CompiledAutomaton.step_codon`。

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

> **定理 3.1-3.5 (`stepSeqAppend`, `safeSeqAppend`, `stepCodonSafeSound`, `stepCodonSafeComplete`, `fullConstructSafe`).** 多碱基转移满足同态复合（$\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q,u), v)$），前缀安全性在中间状态处精确分解（$\mathrm{safeSeq}(M, q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(M, q, u) \land \mathrm{safeSeq}(M, \delta^*(q, u), v)$），且 `stepCodonSafe` 相对 `(stepSeq, safeSeq)` 既可靠又完备。因此，对任意 $5'$ 侧翼 $F_L$、密码子列 $C$、$3'$ 尾部 $F_R$（设 $q_L = \delta^*(q_0, F_L)$，$q_{\mathrm{end}} = \delta^*(q_L, \mathrm{flatten}(C))$），成立：

$$
\mathrm{safeSeq}(M, q_0, F_L) \;\land\; \mathrm{safeCodonList}(M, q_L, C) \;\land\; \mathrm{safeSeq}(M, q_{\mathrm{end}}, F_R)
\;\Longrightarrow\;
\mathrm{safeSeq}\bigl(M, q_0, F_L \mathbin{\Vert} \mathrm{flatten}(C) \mathbin{\Vert} F_R\bigr).
$$

> **证明概要 (`Proofs/Automaton.lean`).** 对 `xs` 施以泛化起始状态 `s` 的结构归纳，并对 `M.isTerminal (M.stepSym s b)` 分情况讨论。引理 `safeCodonList_implies_safeSeq` 将 `stepCodonSafeSound` 提升至 `cds : List (List Base)`，随后 `fullConstructSafe` 改写 `List.append_assoc` 并两次应用 `safeSeqAppend`（`#print axioms` 仅含 `[propext]`）。

## 4. 标准 64 三联体遗传密码与同义菜单良构性 (`Spec/GeneticCode.lean`)

为防止畸形候选菜单绕过氨基酸保真度或伪造存储的 GC 计数，`Spec/GeneticCode.lean` 完整编码了全部 $4^3 = 64$ 个三联体（`translateTriplet`）和严格读码框解码器（`translateDNA`），并与 Python 的 `STANDARD_GENETIC_CODE` 逐一核对（64/64 一致）。

> **定义 4.1 (`ValidCodonForAA` 与 `WellFormedMenu`).** 候选密码子记录 $c = (\mathrm{seq}, \mathrm{gc}, \mathrm{score})$ 对目标残基 $a \in \mathcal{A}$ 有效，当且仅当其长度严格为 3、核苷酸 GC 计数与其 `gc` 字段一致，且有义翻译结果为 $a$：

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

> **定理 4.1 (`geneticCodePartition64`, 零公理), 引理 4.2-4.3 (`validCodonForAA_destruct`, `translateDNA_cons3`), 与 定理 4.4-4.5 (`gcConservation`, `proteinPreservationAndGC`).** 在 Lean 内核中以 **零公理** 证明全部 64 个 DNA 三联体精确划分为 `61` 个有义密码子和 `3` 个终止密码子（`TAA`、`TAG`、`TGA`）。在 `WellFormedMenu P L` 下，任何 `ValidPath M s0 L C` 展平所得编码 DNA $D = \mathrm{flatMap}(\mathrm{seq}, C)$ 均满足：

$$
|D| = 3|P|, \qquad
\mathrm{pathGC}(C) = \sum_{i=1}^{|P|} c_i.\mathrm{gc} = \mathrm{seqGC}(D), \qquad
\mathrm{translateDNA}(D) = \mathrm{some}(P),
$$

从而保证零移码且零内部或末端终止密码子。

## 5. Bellman 最优性与构造性见证提取 (`Spec/ExactDP.lean`)

### 5.1 Tropical Bellman 值表与构造性候选求解器

在离散状态格点 $(g, s) \in \{0,\dots,G_{\max}\} \times \{0,\dots,N-1\}$ 上，`Spec/ExactDP.lean` 同时定义了 Tropical 值递推 `dpEval` / `dpBestScore` 与构造性前缀跟踪求解器 `dpTrackEval` / `dpOptimize`。

$$
V_i(g', s') := \bigoplus_{s = 0}^{N - 1} \;\bigoplus_{\substack{c \in O_i : \; c.\mathrm{gc} \le g' \\ \mathrm{stepCodonSafe}(M, s, c.\mathrm{seq}) = (s', \mathrm{true})}}
\Bigl(V_{i-1}(g' - c.\mathrm{gc}, s) \otimes \mathrm{finite}(c.\mathrm{score})\Bigr),
\qquad V_0(g, s) = \begin{cases} 0 & (g,s)=(0,s_0), \\ -\infty & \text{otherwise.} \end{cases}
$$

为返回显式的最优密码子列表 `some (v, cs)` 而非仅证明存在性，`DPCandidate := Option (Int × List CodonSpec)` 将整数得分与前缀密码子列表配对，并通过确定性松弛函数 `relaxCand`（分数相等时保留先见项）和 `extendCand` 进行更新。

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

### 5.2 可靠性、完备性、剪枝与核心定理 `dpOptimizeEndToEnd`

> **定理 5.1-5.3 (`dpSoundness`, `dpCompleteness`, `exactGlobalOptimality`) 与引理 (`exactOpt_witness_eq`).** 当 $s_0 < M.\mathrm{numStates}$ 时，每个有限表项 $V_L(g, s) = \mathrm{finite}(v)$ 均见证一条参数 $(g, s, v)$ 匹配的真实 `ValidPath`，且每条 `ValidPath` 均以 $V_L(\mathrm{pathGC}(C), \delta^*(s_0, D))$ 为上界。终态投影 `dpBestScore` 是所有 `FeasibleCDS` 路径的上界，并能达到每个有限全局最优值。

> **定理 5.4 (核心定理: `dpOptimizeEndToEnd`).** 在 `WellFormedMenu P L` 与 $s_0 = \delta^*(q_0, F_L)$ 下，`dpOptimize` 同时满足以下三条保障：
> 1. **值精化等价：** 当 $\mathrm{safeSeq}(M, q_0, F_L) = \mathrm{true}$ 时，$\mathrm{candToTrop}(\mathrm{dpOptimize}(\dots)) = \mathrm{dpBestScore}(\dots)$。
> 2. **完备不可行证书：** $\mathrm{dpOptimize}(\dots) = \mathrm{none}$ 当且仅当 $F_L$ 不安全或不存在任何 `FeasibleCDS` 路径。
> 3. **8 项构造性序列最优性：** 每当 $\mathrm{dpOptimize}(\dots) = \mathrm{some}(v, C)$ 且 $D = \mathrm{flatMap}(\mathrm{seq}, C)$ 时，$C$ 可行、$\mathrm{pathScore}(C) = v$、$|D| = 3|P|$、$\mathrm{translateDNA}(D) = \mathrm{some}(P)$、$g_{\min} \le \mathrm{seqGC}(D) \le g_{\max}$、全构建体 $F_L \mathbin{\Vert} D \mathbin{\Vert} F_R$ 从 $q_0$ 出发零禁用状态访问，且对一切可行竞争路径 $C'$ 均有 $\mathrm{pathScore}(C') \le v$。

> **定理 5.5-5.6 (`gcEnvelopeAndPruningAdmissible`, `synonymousEnvelopeUnsat`).** 任意可行分割 $C = C_{\mathrm{pre}} \mathbin{\Vert} C_{\mathrm{suf}}$ 满足 $g_{\min} \le \mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMaxGC}(\mathcal{L}_{\mathrm{suf}})$ 及 $\mathrm{pathGC}(C_{\mathrm{pre}}) + \mathrm{totalMinGC}(\mathcal{L}_{\mathrm{suf}}) \le g_{\max}$，证明后缀 GC 剪枝绝不会丢弃最优补全；且与 $[\mathrm{totalMinGC}(\mathcal{L}), \mathrm{totalMaxGC}(\mathcal{L})]$ 不相交的目标 GC 窗口存在零条可行解。

> **证明概要 (`Proofs/ExactDP.lean`, 1,225 行).** 对 DP 层使用尾部追加归纳法（`list_snoc_rec`）及 `List.range M.numStates` 与 `opts` 嵌套折叠不变量引理。同态引理 `candToTrop_dpTrackEval` 利用 `candToTrop (relaxCand x y) = oplus (candToTrop x) (candToTrop y)` 证明 `candToTrop (dpTrackEval ...) = dpEval ...`，而 `dpTrackSoundness` 提升路径有效性与 `proteinPreservationAndGC`、`fullConstructSafe` 及 `exactGlobalOptimality` 结合。

## 6. 精确有理数动力学、平局序与扰动边界 (`Spec/KineticAndParity.lean`)

> **定义 6.1 (`ExactRat` 与 `rampTau`).** 精确有理数 $\mathrm{ExactRat} = \{(p, q) \in \mathbb{Z}^2 : q > 0\}$ 通过交叉相乘（$a.p \cdot b.q < b.p \cdot a.q$）进行比较，完全避免除法与浮点舍入。上游减速斜坡插值 $\tau_{\mathrm{ramp}}(\tau_p, d, W) = \tau_p + \frac{d}{W}(1 - \tau_p)$ 精确表示为：

$$
\mathrm{rampTau}\bigl((p, q), d, W\bigr) := \frac{pW + d(q - p)}{qW}, \qquad (q > 0,\; W > 0).
$$

> **定理 6.1-6.4 (`tasepRampBoundsAndMonotonicity`, `zeroWeightParity`, `pathLexTotalOrder`, `approxScoreExactness`).**
> - **严格斜坡内部性与单调性：** 当 $0 < \tau_p < 1$ 且 $1 \le d < W$ 时，$\tau_p <_{\mathbb{Q}} \mathrm{rampTau}(\tau_p, d, W) <_{\mathbb{Q}} 1$；$\mathrm{rampTau}$ 关于 $d$ 严格递增且在 $\tau_p = 1$ 处保持不变。
> - **零权重停顿等价性：** 当所有有效停顿权重均为 $0$ 时，结构感知 `structFitness` 在 `dpEval` 的每个 $(g, s)$ 处与基线适应度完全重合。
> - **字典序严格全序：** 前缀秩比较器 `pathLexLt` 在 `List Nat` 上满足非自反性、传递性、非对称性与三分律。
> - **条件整数扰动边界 (`List Int`)：** 若逐项整数误差满足 $|a_i - t_i| \le \varepsilon$，则 $\bigl|\sum_{i=1}^L a_i - \sum_{i=1}^L t_i\bigr| \le L\varepsilon$，且 $\tilde{S}_{\mathrm{alt}} + 2\Delta < \tilde{S}_{\mathrm{opt}}$ 配合 $|\tilde{S} - S| \le \Delta$ 保证 $S_{\mathrm{alt}} < S_{\mathrm{opt}}$。

> **运行边界 (`float` vs. `List Int` / `ExactRat`).** `approxScoreExactness` 是针对 `List Int`（定点整数量化边界）的条件定理，而非实际 Python 运行时 binary64 `math.log` 浮点误差证明。同样，Python `TASEPKineticsEngine` 中的 `round(..., 3)` 会在 $\tau_p \ge 0.999$ 附近破坏严格 $< 1.0$ 的内部性（例如 $\tau_p = 0.999, d = 2, W = 3 \mapsto 1.0$）。

## 7. 具体 12 状态 BsaI 自动机与反驳轨迹 (`Witnesses.lean`)

为在 Lean 内核中证明命题非空虚，`Witnesses.lean` 编码了针对 BsaI（`GGTCTC` $\to$ 终态 `6`；反向互补 `GAGACC` $\to$ 终态 `11`）的确定性 12 状态 Aho-Corasick 自动机，并在 $5'$ 侧翼 `"GGTC"`、$3'$ 终止尾 `"TAA"` 及 GC 窗口 `[2, 4]` 下优化二肽 `"SL"`（`[.S, .L]`）：

1. **侧翼步进 (`witness_leftFlank_safe`)：** `"GGTC"` 安全转移 $0 \xrightarrow{\mathrm{G}} 1 \xrightarrow{\mathrm{G}} 2 \xrightarrow{\mathrm{T}} 3 \xrightarrow{\mathrm{C}} 4$（`s0 = 4`）。
2. **连接处违规反驳 (`witness_tct_rejected`)：** 最高分丝氨酸密码子 `TCT`（量化得分 `-223`）经 $4 \xrightarrow{\mathrm{T}} 5 \xrightarrow{\mathrm{C}} \mathbf{6}$ 在 $5'$ 连接处拼出 `"GGTCTC"`，被立即拒绝为 `(6, false)`。
3. **畸形候选反驳 (`witness_malformed_codon_rejected`)：** 内核 `decide` 拒绝虚报 `gc = 3` 的 `AAA`、冒充丝氨酸 `.S` 的 `AAA` 以及冒充酪氨酸 `.Y` 的终止密码子 `TAA`。
4. **构造性全局最优解 (`witness_dpOptimize_sl_end_to_end`)：** `dpOptimize` 选出 `AGC`（$4 \to 0 \to 1 \to 0$，得分 `-357`，`gc = 2`）、`CTG`（$0 \to 0 \to 0 \to 1$，得分 `0`，`gc = 2`）与安全终止尾 `"TAA"`（$1 \to 0 \to 0 \to 0$），输出 `some (-357, [AGC, CTG])`（`"AGCCTG"`，`seqGC = 4`）。

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

## 8. 完整定理、见证、变异与 F1-F28 覆盖目录

### 8.1 全部 20 条审计核心定理 + 3 条结构引理 (`Audit.lean`)

`lake env lean FactorForgeFormal/Audit.lean` 公理图例：**`none`** = 零公理；**`P`** = `[propext]`；**`P, Q`** = `[propext, Quot.sound]`；**`P, C, Q`** = `[propext, Classical.choice, Quot.sound]`（零 `sorryAx` 且零自定义公理）。

| 模块 | Lean 定理 / 引理标识符 | `#print axioms` | 已验证数学命题 |
| --- | --- | --- | --- |
| `Tropical` | `tropIntSemiringLaws` | `P, Q` | $\mathrm{Trop}(\mathbb{Z})$ 上的 12 条幂等 max-plus 半环定律 |
| `Tropical` | `tropIntOrderLaws` | `P, Q` | 偏序、最小上界与 $\oplus$/$\otimes$ 单调性 |
| `Automaton` | `stepSeqAppend` | `P` | 任意碱基列表 $u, v$ 的 $\delta^*(q, u \mathbin{\Vert} v) = \delta^*(\delta^*(q, u), v)$ |
| `Automaton` | `safeSeqAppend` | `P` | $\mathrm{safeSeq}(q, u \mathbin{\Vert} v) = \mathrm{safeSeq}(q, u) \land \mathrm{safeSeq}(\delta^*(q, u), v)$ |
| `Automaton` | `stepCodonSafeSound` | `P` | `stepCodonSafe(q, c) = (q', true)` 蕴含 $\delta^*(q, c) = q'$ 与 `safeSeq(q, c)` |
| `Automaton` | `stepCodonSafeComplete` | `P` | `safeSeq(q, c) = true` 蕴含 `stepCodonSafe(q, c) = (stepSeq(q, c), true)` |
| `Automaton` | `fullConstructSafe` | `P` | 安全 $5'$ 侧翼、安全密码子与安全 $3'$ 尾保证全构建体安全 |
| `GeneticCode` | `geneticCodePartition64` | `none` | 64 个 DNA 三联体划分为 61 个有义密码子与 3 个终止密码子 |
| `GeneticCode` | `validCodonForAA_destruct` *(引理)* | `P, C, Q` | 将 `ValidCodonForAA` 分解为 3 碱基、精确 GC 与有义氨基酸 |
| `GeneticCode` | `translateDNA_cons3` *(引理)* | `P` | 有效有义三联体前缀保持递归 `translateDNA` 解码 |
| `ExactDP` | `gcConservation` | `P, C, Q` | 良构密码子 `gc` 之和等于展平核苷酸 `seqGC` |
| `ExactDP` | `proteinPreservationAndGC` | `P, C, Q` | `WellFormedMenu` 上的 `ValidPath` 保持长度 $3|P|$、`seqGC` 与 `some P` |
| `ExactDP` | `dpSoundness` | `P, C, Q` | 每个有限 `dpEval` 项均见证一条 $(g, s, v)$ 匹配的真实 `ValidPath` |
| `ExactDP` | `dpCompleteness` | `P, C, Q` | 每条 `ValidPath` 得分均以 $(g, s)$ 处的 `dpEval` 为上界 |
| `ExactDP` | `exactGlobalOptimality` | `P, C, Q` | `dpBestScore` 上界约束所有 `FeasibleCDS` 并达到有限最优值 |
| `ExactDP` | `exactOpt_witness_eq` *(引理)* | `P, C, Q` | 上界约束所有可行竞争者的可行见证等于 `dpBestScore` |
| `ExactDP` | `dpOptimizeEndToEnd` | `P, C, Q` | 构造性 `dpOptimize` 值等价、`none`-iff-无解与 8 项最优性 |
| `ExactDP` | `gcEnvelopeAndPruningAdmissible` | `P, C, Q` | 可达后缀 GC 界 $[G_{\min}, G_{\max}]$ 保留所有可行补全 |
| `ExactDP` | `synonymousEnvelopeUnsat` | `P, C, Q` | 落在 $[G_{\min}, G_{\max}]$ 之外的目标 GC 区间有零条可行路径 |
| `KineticAndParity` | `tasepRampBoundsAndMonotonicity` | `P, Q` | 精确有理数斜坡内部性 $(\tau_p, 1)$、严格单调性与 $\tau_p = 1$ 不变性 |
| `KineticAndParity` | `zeroWeightParity` | `P, Q` | 零权重停顿映射使步长适应度与完整 DP 表坍缩至基线 |
| `KineticAndParity` | `pathLexTotalOrder` | `P, Q` | `pathLexLt` 的非自反性、传递性、非对称性与三分律 |
| `KineticAndParity` | `approxScoreExactness` | `P, Q` | 条件 `List Int` 误差界 $L\varepsilon$ 与 $2\Delta$ 严格 argmax 保持 |

### 8.2 全部 14 条具体见证与反駁定理 (`Witnesses.lean`)

| 见证定理标识符 | `#print axioms` | 内核验证的具体性质 |
| --- | --- | --- |
| `witness_malformed_codon_rejected` | `P` | 拒绝虚报 `gc = 3` 的 `AAA`、冒充 `.S` 的 `AAA` 与冒充 `.Y` 的终止密码子 `TAA` |
| `witness_sl_wellFormedMenu` | `P` | 证明 6 个丝氨酸 + 6 个亮氨酸选项满足 `WellFormedMenu [.S, .L]` |
| `witness_leftFlank_safe` | `P, Q` | 左侧翼 `"GGTC"` 在 12 状态 BsaI DFA 上安全并抵达状态 `4` |
| `witness_sl_feasible` | `P, Q` | 路径 `AGCCTG` 在 `"GGTC" + "SL" + "TAA"` 上满足 `FeasibleCDS` |
| `witness_dpBest_sl_exact` | `P, C, Q` | 通过 `exactOpt_witness_eq` 证明 `dpBestScore(...) = finite (-357)` |
| `witness_dpOptimize_sl_end_to_end` | `P, C, Q` | 构造性提取翻译为 `[.S, .L]` 的 `some (-357, cs)` |
| `witness_tct_rejected` | `P, Q` | 证明丝氨酸密码子 `TCT` 从状态 `4` 命中禁用 BsaI 状态 `6` |
| `witness_gc_and_protein_preservation` | `P, C, Q` | 在 `optPathSL` (`AGCCTG`) 上实例化 `proteinPreservationAndGC` |
| `witness_gc_pruning_admissible` | `P, C, Q` | 验证前缀 `AGC` + 后缀亮氨酸 GC 包络界 `[2, 4]` |
| `witness_tasep_ramp` | `P, Q` | 在 `ExactRat` 中认证 $\frac{7}{20} < \mathrm{rampTau}(\frac{7}{20}, 1, 3) < 1$ |
| `witness_zero_weight_parity` | `P, Q` | 确认零权重停顿项精确保持得分 `-357` |
| `witness_path_lex_order` | `P, Q` | 证明 `[14, 19] < [15, 19] < [48, 19] => [14, 19] < [48, 19]` |
| `witness_approx_margin_exactness` | `P, Q` | 证明 2 密码子边界 $-511 + 2(2) < -357 \implies -510 < -356$ |
| `witness_unsat_gc` | `P, C, Q` | 证明目标 GC 区间为 `[5, 6] > 4` 时存在零条可行路径 |

### 8.3 参考副本变异审计 (`8/8` 注入语义缺陷全部检出)

在 `PYTHONHASHSEED` $\in \{0, 1, 2, 3\}$ 下重复运行 200 个随机种子实例，实际 `DPV2Optimizer` 在可行性、氨基酸翻译、基序安全性与最优得分上均与 `BruteForceCDSOracle` 一致，同时在同形二肽（`FF`: `TTTTTC` vs `TTCTTT`，在 `(g = 1, s = 0)` 处同分）上揭示了具体平局打破规则差异。`test_mutation_detection_audit.py` 向插桩参考求解器副本注入 8 种语义缺陷，均被成功检出：

| 变异 ID | 审计结果 | 注入缺陷与捕获的预言机断言 |
| --- | --- | --- |
| `M1_WRONG_SYNONYMOUS_CODON` | **检出 (Killed)** | 向 `"SL"`（`[0.30, 0.67]` GC）的丝氨酸菜单注入赖氨酸 `AAA`（`gc = 0`）；被 `translate_dna(seq) != "SL"` 捕获 |
| `M2_GC_COUNT_DROP_C` | **检出 (Killed)** | 在 `"TT"`（`[0.66, 0.67]` GC）中仅计数 `'G'` 而非 `'G' + 'C'`；被核苷酸 GC 窗口与预言机集合检查捕获 |
| `M3_DROP_REVERSE_COMPLEMENT` | **检出 (Killed)** | 在 `"GA" + "DL"` 中省略反向互补 `GAGACC`；产生跨界 `GAGACC`，被原始子串检查捕获 |
| `M4_IGNORE_LEFT_FLANK` | **检出 (Killed)** | 在 `"GGTC" + "SL" + "TAA"` 中从 `s0 = 0` 而非 `step("GGTC") = 4` 起步；生成 `TCT`（`GGTCTC`），被子串检查捕获 |
| `M5_IGNORE_RIGHT_FLANK` | **检出 (Killed)** | 在 `"" + "G" + "CTC"` 中跳过右端侧翼检查；生成 `GGT`（`GGTCTC`），被子串检查捕获 |
| `M6_OFF_BY_ONE_MAX_GC` | **检出 (Killed)** | 在 `"TT"`（`min_gc = max_gc = 4`）中将 `g <= max_gc` 改为 `g < max_gc`；误报 `No in-band candidate` |
| `M7_MIN_INSTEAD_OF_MAX` | **检出 (Killed)** | 状态松弛时最小化而非最大化 log-CAI；被 `BruteForceCDSOracle` 最优得分比对捕获 |
| `M8_CORRUPT_BACKPOINTER` | **检出 (Killed)** | 前向传递存储 `prev_g = g + 1`；回溯时因 `KeyError` 或序列不匹配被捕获 |

### 8.4 数学公式覆盖矩阵 (`F1`-`F28`)

层级：**L1** = Lean 4 内核证明；**O1** = 本归档穷举/模糊/变异套件；**C1** = 主仓库确定性单元测试；**(B)** = 已记录的运行时差异。

| ID | 公式内容 | Lean 4 / Python 锚点 | 验证层级 | 范围说明 |
| --- | --- | --- | --- | --- |
| `F1` | 密码子频率 $f(c)$ | `load_codon_usage_table` | `C1` | 频率表加载器 |
| `F2` | 相对适应度 $w(c)$ | `_build_codon_weights` | `C1 + O1` | 下限钳位 $10^{-6}$ |
| `F3` | 几何 CAI 与对数和 | `pathScore`, `approxScoreExactness` | `L1 + O1 (B)` | `Int` vs binary64 `float` |
| `F4` | 核苷酸 GC 计数与比例 | `seqGC`, `gcConservation` | `L1 + O1` | 精确整数 GC |
| `F5` | 64 三联体遗传密码 | `translateTriplet`, `geneticCodePartition64` | `L1 + O1` | 64/64 双射 |
| `F6` | 有义翻译 $\mathrm{Translate}(D)=P$ | `ValidCodonForAA`, `proteinPreservationAndGC` | `L1 + O1` | 菜单可靠性 |
| `F7` | 禁用基序 + RC 闭包 | `Automaton`, `AutomatonCompiler` | `L1 + O1 (B)` | 给定 DFA 转移表 |
| `F8` | 全构建体连接安全性 | `fullConstructSafe` | `L1 + O1` | 任意侧翼序列 |
| `F9` | 可行 CDS 集合 $\mathcal{F}(P,\theta)$ | `FeasibleCDS`, `synonymousEnvelopeUnsat` | `L1 + O1` | 整数 GC 区间 |
| `F10`-`F14` | Random、Greedy、Balanced、GC-target、SOP / 局部重写 | `reverse_translator.py`, `sop_balancer.py`, `local_rewriter.py` | `C1` | 非 DP 启发式算法 |
| `F15` | Tropical max-plus 半环 | `tropIntSemiringLaws`, `tropIntOrderLaws` | `L1 + O1` | $\mathbb{Z}\cup\{-\infty\}$ 代数 |
| `F16` | 前向 Bellman 层转移 | `dpStep`, `dpSoundness`, `dpCompleteness` | `L1 + O1 (B)` | $5'$ 斜坡位于 Lean 外 |
| `F17` | 终态过滤与全局最优 | `dpBestScore`, `exactGlobalOptimality` | `L1 + O1 (B)` | 回退逻辑在 `O1` |
| `F18` | 构造性回溯与平局序 | `dpOptimizeEndToEnd`, `pathLexTotalOrder` | `L1 + O1 (B)` | 3 种独立平局策略 |
| `F19` | 后缀 GC 剪枝与 TASEP 斜坡 | `gcEnvelopeAndPruningAdmissible`, `tasepRampBoundsAndMonotonicity` | `L1 + O1 (B)` | $1.0$ 附近 `round(..., 3)` |
| `F20`-`F26` | 候选通过门控、窗口 GC、均聚物、二核苷酸、均值 | `SharedEvaluator`, `BenchmarkRunner` | `C1 (+ O1)` | 描述性统计指标 |
| `F27` | 清单文件完整性绑定 | `verify_all.py`, `REPRODUCIBILITY_MANIFEST.json` | `O1` | 229 文件哈希锁定 |
| `F28` | 认识论分类门控 | `UNVERIFIED_PUBLIC_CORPUS` | `Governance` | 零湿实验结论 |

## 9. 精确证明边界与防失效复现协议

本里程碑证明的是 FactorForge **显式指定的离散整数 DP 模型** 的数学可靠性，而非对整个 Python 软件栈的普遍形式化验证：

| 范围领域 | 当前状态 | 精确技术边界 |
| --- | --- | --- |
| **离散整数 DP 核心与 64 密码子翻译 (`FactorForgeFormal`)** | **已在 Lean 4 中验证** | 20 条核心定理 + 3 条辅助引理、14 条见证、34 项 `#print axioms` 检查（`0 sorry`）、`leanchecker` 复核通过。最优性相对于传入的 `WellFormedMenu` 成立（61 个有义密码子的完备性由 Python 的 `AA_TO_CODONS` 核对）。 |
| **采样 Python DP 对应与可复现归档** | **已完成（有限测试集）** | 28 项 `pytest` 检查、4 轮 `PYTHONHASHSEED` 运行、`8/8` 参考副本变异检出与 229 文件清单完整性核验（`python verify_all.py`）。 |
| **全量 Python-to-Lean 精化与回溯指针证明** | **未证明（未来范围）** | Lean 的 `dpOptimize` 追踪前缀列表；实际 Python 通过可变 `(prev_g, prev_s)` 回溯指针重建序列，且并非从 Lean 提取。 |
| **IEEE-754 `float` 与 `1e-12` 容差误差界** | **未证明（未来范围）** | 实际 DP 使用非传递的 `1e-12` 状态内平局容差累加 binary64 `math.log` 浮点数（`relaxCand` 先见、`LeanExactMirrorDP` `PathRank` 与实际 `DPV2Optimizer` 末密码子比较三种策略共存）。`approxScoreExactness` 是 `List Int` 上的条件定理。 |
| **通用子串基序编译器与非 DP 启发式** | **未在 Lean 中证明** | Lean 假设已提供 DFA 转移表，而非为任意基序集合形式化通用 Aho-Corasick 失败指针构建；`AutomatonCompiler` 随 `PYTHONHASHSEED` 排列内部状态 ID；`round(..., 3)` 在 $1.0$ 附近破坏严格内部性；$5'$ 起始钳位与启发式基线位于 `ExactDP.lean` 之外。 |
| **生物表达与湿实验表现** | **无数据** | `UNVERIFIED_PUBLIC_CORPUS · Biological validation: NOT_AVAILABLE`。数学优化正确性不代表任何湿实验表达、折叠或产量保证。 |

如需在本地干净环境中完整复现验证归档（需安装 Python 3.11+、`pytest`、`ruff` 与 `elan` `leanprover/lean4:v4.36.0`），请将 `FactorForge_Lean4_Verification_Package.zip` 解压至较短路径并运行：

```bash
python verify_all.py
```
