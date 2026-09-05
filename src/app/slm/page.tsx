import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import { publicLinks } from "@/app/lib/ecosystem";

export const metadata: Metadata = {
  title: "FactorForge SLM Research Track | eijex",
  description:
    "An evidence-bounded research track for language-model CDS proposals governed by deterministic evaluation, hard constraints, and human review.",
};

const pipeline = [
  ["01", "Propose", "A future trained model may generate synonymous CDS candidates."],
  ["02", "Measure", "One shared evaluator computes versioned, inspectable metrics."],
  ["03", "Enforce", "AgentOS rules reject candidates that violate deterministic constraints."],
  ["04", "Interpret", "Soft metrics remain a profile, not a universal biological score."],
  ["05", "Approve", "A human decides whether an eligible candidate moves forward."],
] as const;

const promotionGates = [
  "Frozen model weights, tokenizer, decoding configuration, and seed",
  "Verified protein inputs and publication-to-accession reference mapping",
  "Canonical CAI and GC computation shared by every comparison arm",
  "Translation, internal-stop, restriction-site, and assembly-rule validation",
  "Repeated controls, uncertainty analysis, and prospective wet-lab testing",
] as const;

export default function FactorForgeSLMPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <Nav />

      <section className="relative overflow-hidden border-b border-teal-100 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 px-6 py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_18%_20%,rgba(45,212,191,0.32),transparent_28%),radial-gradient(circle_at_82%_70%,rgba(34,197,94,0.20),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/factorforge" className="text-sm font-bold text-teal-300 transition hover:text-teal-100">
            ← FactorForge
          </Link>
          <div className="mt-10 inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-200">
            Exploratory research track
          </div>
          <h1 className="mt-7 max-w-5xl text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
            Language-model proposals.
            <span className="block text-teal-300">Deterministic boundaries.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            FactorForge SLM is an exploratory sequence-generation track. Its goal is to propose synonymous CDS candidates while AgentOS keeps feasibility, evidence, and human approval outside the model&apos;s authority.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={publicLinks.mcpService}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-teal-300 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-teal-200"
            >
              Use current MCP tools ↗
            </a>
            <Link
              href="/research-notes/agentos-integrity-framework-prototype-boundaries"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-extrabold text-white transition hover:border-white/60"
            >
              Read the integrity note
            </Link>
          </div>
          <p className="mt-5 max-w-2xl text-xs leading-relaxed text-slate-400">
            The public MCP surface currently exposes documented FactorForge capabilities. It does not represent a public trained-SLM endpoint.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">The problem</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Confidence is not a constraint.</h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                A probabilistic decoder can assign high likelihood to a sequence that still contains an internal stop, changes the encoded protein, or conflicts with an assembly policy. Those properties can be checked directly; they should not depend on model confidence.
              </p>
              <p>
                The FactorForge direction therefore separates proposal generation from authority. AI may suggest. Deterministic algorithms measure. Rules decide feasibility. Humans decide use.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20 dark:border-slate-800 dark:bg-slate-900/60 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">The governed path</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">Five responsibilities. No hidden handoff.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {pipeline.map(([number, title, description]) => (
              <article key={number} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">{number}</p>
                <h3 className="mt-6 text-lg font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            AI proposes. Algorithms optimize. Rules guarantee defined invariants. Fuzzy logic interprets. Humans approve. Evidence is preserved.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 dark:border-amber-900/70 dark:bg-amber-950/20 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">20-target engineering fixture</p>
                <h2 className="mt-4 text-4xl font-extrabold tracking-tight">A useful pipeline test. Not yet a model benchmark.</h2>
                <p className="mt-5 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  The current artifact contains 102 target-arm rows across a mixed panel of 20 protein fragments and domains. It is useful for testing table shape, orchestration, and claim gates. Code inspection shows that it does not execute a trained SLM or canonical comparative evaluation.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 dark:bg-slate-900">
                  <p className="text-3xl font-black text-slate-950 dark:text-white">102</p>
                  <p className="mt-2 text-sm font-bold">recorded target-arm rows</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">An artifact count, not 102 validated biological designs.</p>
                </div>
                <div className="rounded-2xl bg-white p-5 dark:bg-slate-900">
                  <p className="text-3xl font-black text-slate-950 dark:text-white">0</p>
                  <p className="mt-2 text-sm font-bold">generation-cache hits</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">The run cannot support a cache-driven runtime claim.</p>
                </div>
                <div className="rounded-2xl bg-white p-5 dark:bg-slate-900 sm:col-span-2">
                  <p className="text-sm font-extrabold text-amber-800 dark:text-amber-200">Why the attractive charts were withheld</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    The displayed CAI was computed directly from GC-base counts, the hard gate scanned only one restriction motif, and the nominal SLM arm used deterministic codon substitutions. A scatter plot or 100% bar derived from those fixtures cannot establish biological fitness, hallucination elimination, or superiority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 px-6 py-20 text-white dark:border-slate-800 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-teal-300">The proof standard</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Promotion requires evidence, not a label.</h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              We will call it a Real SLM benchmark only after the model, inputs, metrics, controls, and validation path can be independently replayed.
            </p>
          </div>
          <ol className="space-y-3">
            {promotionGates.map((gate, index) => (
              <li key={gate} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-300 text-sm font-black text-slate-950">{index + 1}</span>
                <span className="pt-1 text-sm font-semibold leading-relaxed text-slate-200">{gate}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-20 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">Build on the available surface</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Use today&apos;s deterministic tools. Follow the SLM evidence as it matures.</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Eijex MCP provides agent-compatible access to documented public FactorForge capabilities. The SLM track will not be presented as available until its public endpoint and validation evidence exist.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={publicLinks.mcpService} target="_blank" rel="noopener noreferrer" className="rounded-full bg-teal-600 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-teal-700">
              Open Eijex MCP ↗
            </a>
            <a href={publicLinks.mcpGitHub} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-extrabold text-slate-700 transition hover:border-slate-500 dark:border-slate-700 dark:text-slate-200">
              View MCP source ↗
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

