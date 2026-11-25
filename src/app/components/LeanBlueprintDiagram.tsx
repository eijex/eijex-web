export default function LeanBlueprintDiagram() {
  return (
    <figure className="my-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Figure 1 · Lean 4 Kernel Dependency Blueprint
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Module &amp; Theorem Dependency Graph (<code>FactorForgeFormal</code>, 14 Modules,{" "}
            <code>0 sorry</code>)
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-slate-500 bg-slate-200 dark:bg-slate-800" />
            Locked Spec (6)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-teal-600 bg-teal-50 dark:bg-teal-950" />
            Kernel Theorems (20+3)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-emerald-500 bg-emerald-100 dark:bg-emerald-950" />
            Witnesses &amp; Audit (14)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 430"
          role="img"
          aria-label="Lean 4 theorem dependency blueprint from Spec modules to dpOptimizeEndToEnd, Witnesses.lean, and Audit.lean"
          className="mx-auto w-full min-w-[700px] text-slate-800 dark:text-slate-100"
        >
          <defs>
            <marker
              id="bp-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" className="fill-slate-400 dark:fill-slate-500" />
            </marker>
          </defs>

          {/* Row 1: Spec Modules */}
          <g className="font-mono text-[11px]">
            <rect
              x="20"
              y="14"
              width="200"
              height="52"
              rx="8"
              className="fill-white stroke-slate-400 stroke-[1.5] dark:fill-slate-950 dark:stroke-slate-600"
            />
            <text x="120" y="35" textAnchor="middle" className="fill-current font-bold">
              Spec/Tropical.lean
            </text>
            <text
              x="120"
              y="52"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[10px]"
            >
              Trop(Z) = Z u &#123;-inf&#125;
            </text>

            <rect
              x="246"
              y="14"
              width="200"
              height="52"
              rx="8"
              className="fill-white stroke-slate-400 stroke-[1.5] dark:fill-slate-950 dark:stroke-slate-600"
            />
            <text x="346" y="35" textAnchor="middle" className="fill-current font-bold">
              Spec/Automaton.lean
            </text>
            <text
              x="346"
              y="52"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[10px]"
            >
              stepSeq, safeSeq, stepCodonSafe
            </text>

            <rect
              x="472"
              y="14"
              width="200"
              height="52"
              rx="8"
              className="fill-white stroke-slate-400 stroke-[1.5] dark:fill-slate-950 dark:stroke-slate-600"
            />
            <text x="572" y="35" textAnchor="middle" className="fill-current font-bold">
              Spec/GeneticCode.lean
            </text>
            <text
              x="572"
              y="52"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[10px]"
            >
              64 triplets (61 sense + 3 stop)
            </text>

            <rect
              x="698"
              y="14"
              width="202"
              height="52"
              rx="8"
              className="fill-white stroke-slate-400 stroke-[1.5] dark:fill-slate-950 dark:stroke-slate-600"
            />
            <text x="799" y="35" textAnchor="middle" className="fill-current font-bold">
              Spec/KineticAndParity
            </text>
            <text
              x="799"
              y="52"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[10px]"
            >
              ExactRat, pathLexLt, Margins
            </text>
          </g>

          {/* Row 2: Layer 1 Theorems */}
          <g className="font-mono text-[10.5px]">
            <rect
              x="20"
              y="98"
              width="200"
              height="54"
              rx="8"
              className="fill-teal-50/80 stroke-teal-600 stroke-[1.4] dark:fill-teal-950/40 dark:stroke-teal-500"
            />
            <text x="120" y="120" textAnchor="middle" className="fill-current font-semibold">
              tropIntSemiringLaws
            </text>
            <text x="120" y="138" textAnchor="middle" className="fill-current font-semibold">
              tropIntOrderLaws
            </text>

            <rect
              x="246"
              y="98"
              width="200"
              height="54"
              rx="8"
              className="fill-teal-50/80 stroke-teal-600 stroke-[1.4] dark:fill-teal-950/40 dark:stroke-teal-500"
            />
            <text x="346" y="119" textAnchor="middle" className="fill-current font-semibold">
              stepCodonSafeSound/Comp
            </text>
            <text x="346" y="138" textAnchor="middle" className="fill-current font-semibold">
              fullConstructSafe
            </text>

            <rect
              x="472"
              y="98"
              width="200"
              height="54"
              rx="8"
              className="fill-teal-50/80 stroke-teal-600 stroke-[1.4] dark:fill-teal-950/40 dark:stroke-teal-500"
            />
            <text x="572" y="119" textAnchor="middle" className="fill-current font-semibold">
              geneticCodePartition64
            </text>
            <text x="572" y="138" textAnchor="middle" className="fill-current font-semibold">
              proteinPreservationAndGC
            </text>

            <rect
              x="698"
              y="98"
              width="202"
              height="54"
              rx="8"
              className="fill-teal-50/80 stroke-teal-600 stroke-[1.4] dark:fill-teal-950/40 dark:stroke-teal-500"
            />
            <text x="799" y="119" textAnchor="middle" className="fill-current font-semibold">
              tasepRampBounds · zeroParity
            </text>
            <text x="799" y="138" textAnchor="middle" className="fill-current font-semibold">
              pathLexTotal · approxExact
            </text>
          </g>

          {/* Row 3: ExactDP Bellman Core */}
          <g className="font-mono text-[10.5px]">
            <rect
              x="60"
              y="188"
              width="270"
              height="58"
              rx="8"
              className="fill-teal-50/80 stroke-teal-600 stroke-[1.4] dark:fill-teal-950/40 dark:stroke-teal-500"
            />
            <text x="195" y="210" textAnchor="middle" className="fill-current font-bold">
              dpSoundness &amp; dpCompleteness
            </text>
            <text
              x="195"
              y="229"
              textAnchor="middle"
              className="fill-slate-600 dark:fill-slate-300 text-[10px]"
            >
              exactGlobalOptimality · exactOpt_witness_eq
            </text>

            <rect
              x="370"
              y="188"
              width="280"
              height="58"
              rx="8"
              className="fill-teal-50/80 stroke-teal-600 stroke-[1.4] dark:fill-teal-950/40 dark:stroke-teal-500"
            />
            <text x="510" y="210" textAnchor="middle" className="fill-current font-bold">
              gcEnvelopeAndPruningAdmissible
            </text>
            <text
              x="510"
              y="229"
              textAnchor="middle"
              className="fill-slate-600 dark:fill-slate-300 text-[10px]"
            >
              synonymousEnvelopeUnsat · candToTrop_dpTrackEval
            </text>
          </g>

          {/* Row 4: Crown Theorem */}
          <g className="font-mono">
            <rect
              x="105"
              y="280"
              width="520"
              height="60"
              rx="10"
              className="fill-teal-100/90 stroke-teal-700 stroke-[2] dark:fill-teal-900/50 dark:stroke-teal-400"
            />
            <text
              x="365"
              y="304"
              textAnchor="middle"
              className="fill-teal-950 dark:fill-teal-200 text-[12px] font-extrabold"
            >
              Crown Jewel Theorem: dpOptimizeEndToEnd (Proofs/ExactDP.lean)
            </text>
            <text
              x="365"
              y="324"
              textAnchor="middle"
              className="fill-slate-700 dark:fill-slate-300 text-[10px]"
            >
              Value Parity + none-iff-Unsat + Translation(D)=P + GC in [g_min,g_max] + Flank Safety + Max Score
            </text>
          </g>

          {/* Row 5: Witnesses & Audit */}
          <g className="font-mono text-[10.5px]">
            <rect
              x="80"
              y="368"
              width="365"
              height="50"
              rx="8"
              className="fill-emerald-50 stroke-emerald-600 stroke-[1.5] dark:fill-emerald-950/40 dark:stroke-emerald-500"
            />
            <text x="262" y="390" textAnchor="middle" className="fill-current font-bold">
              Witnesses.lean (14 Concrete Theorems)
            </text>
            <text
              x="262"
              y="407"
              textAnchor="middle"
              className="fill-slate-600 dark:fill-slate-300 text-[10px]"
            >
              12-State BsaI &quot;GGTC&quot;+&quot;SL&quot;+&quot;TAA&quot; -&gt; AGCCTG (-357)
            </text>

            <rect
              x="485"
              y="368"
              width="380"
              height="50"
              rx="8"
              className="fill-emerald-50 stroke-emerald-600 stroke-[1.5] dark:fill-emerald-950/40 dark:stroke-emerald-500"
            />
            <text x="675" y="390" textAnchor="middle" className="fill-current font-bold">
              Audit.lean + leanchecker Replay
            </text>
            <text
              x="675"
              y="407"
              textAnchor="middle"
              className="fill-slate-600 dark:fill-slate-300 text-[10px]"
            >
              34 #print axioms Checks · Zero Custom Axioms · Exit 0
            </text>
          </g>

          {/* Connectors */}
          <g
            fill="none"
            markerEnd="url(#bp-arrow)"
            className="stroke-slate-400 stroke-[1.4] dark:stroke-slate-500"
          >
            <path d="M 120 66 L 120 96" />
            <path d="M 346 66 L 346 96" />
            <path d="M 572 66 L 572 96" />
            <path d="M 799 66 L 799 96" />

            <path d="M 120 152 L 165 186" />
            <path d="M 310 152 L 235 186" />
            <path d="M 365 152 L 455 186" />
            <path d="M 550 152 L 525 186" />

            <path d="M 195 246 L 285 278" />
            <path d="M 480 246 L 415 278" />
            <path d="M 585 152 C 665 205, 655 245, 555 278" />

            <path d="M 295 340 L 265 366" />
            <path d="M 465 340 L 610 366" />
            <path d="M 799 152 L 760 366" />
            <path d="M 445 393 L 483 393" />
          </g>
        </svg>
      </div>
      <figcaption className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Every box represents a compiled Lean 4 module or kernel-checked theorem family in{" "}
        <code>FactorForgeFormal</code>. Arrows point from foundational specifications and lemmas to
        dependent theorems, culminating in constructive solver verification (
        <code>dpOptimizeEndToEnd</code>), concrete BsaI automaton instantiation (
        <code>Witnesses.lean</code>), and fresh-kernel replay (<code>leanchecker</code>).
      </figcaption>
    </figure>
  );
}
