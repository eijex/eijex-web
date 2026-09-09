import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evidence Toolkit | Reviewable package contracts — eijex",
  description:
    "Development-stage, sequence-free contracts for assembling linked research evidence packages.",
};

const responsibilities = [
  {
    name: "FactorForge",
    owns: "Computational design evidence and automated review decisions",
    contributes: "A versioned, sequence-free Design Evidence record",
  },
  {
    name: "AgentOS",
    owns: "Workflow state, selection rationale, and human-checkpoint references",
    contributes: "A Selection Record; human approval is never inferred",
  },
  {
    name: "ValidationHub",
    owns: "Experimental-evidence identity and review state",
    contributes: "An Evidence Reference Index, not embedded permissioned data",
  },
  {
    name: "Evidence Toolkit",
    owns: "Package structure, checksum verification, cross-links, and rendering",
    contributes: "A deterministic review package and explicit validation result",
  },
] as const;

const scope = [
  "Versioned JSON contracts for three source-system records",
  "SHA-256 integrity and cross-system identity checks",
  "Rejection of raw-sequence fields and sequence-like values",
  "A standalone HTML review view using synthetic fixtures",
] as const;

const exclusions = [
  "No raw DNA or protein sequences, wet-lab files, or partner records",
  "No scientific sufficiency judgment or human approval generation",
  "No regulatory submission assembly or regulatory-acceptance claim",
  "No claim of GLP, GMP, or 21 CFR Part 11 compliance",
] as const;

export default function EvidenceToolkitPage() {
  return (
    <main className="bg-white text-slate-950 dark:bg-slate-900 dark:text-white">
      <section className="border-b border-slate-200 px-6 py-20 dark:border-slate-800">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
            Evidence Toolkit · Development
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Assemble review context without collapsing system responsibilities.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            The toolkit is a local-first, sequence-free contract for linking design,
            selection, and validation-evidence references. Its v0.1 implementation
            validates synthetic packages; live adapters are a later milestone.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contract"
              className="rounded-full bg-amber-700 px-5 py-3 text-sm font-bold text-white hover:bg-amber-800"
            >
              Read the contract
            </a>
            <Link
              href="/#ecosystem"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:border-slate-500 dark:border-slate-700 dark:text-slate-200"
            >
              View the Eijex stack
            </Link>
          </div>
        </div>
      </section>

      <section id="contract" className="scroll-mt-24 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-extrabold">A contract between owners, not one shared truth store.</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">
            Each system remains authoritative only for its own record. The toolkit
            verifies that identifiers and artifact digests agree; it does not copy
            authority from one system into another.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {responsibilities.map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700 dark:bg-slate-950"
              >
                <h3 className="text-xl font-extrabold">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <b>Owns:</b> {item.owns}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <b>Contributes:</b> {item.contributes}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-16 dark:bg-slate-950">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">Included in contract v0.1</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {scope.map((item) => <li key={item}>✓ {item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">Intentionally outside v0.1</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {exclusions.map((item) => <li key={item}>— {item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-amber-300 bg-amber-50 p-8 dark:border-amber-900 dark:bg-amber-950/40">
          <h2 className="text-2xl font-extrabold">Current connection status</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-700 dark:text-slate-200">
            FactorForge&apos;s report contract is the first real source format. AgentOS
            and ValidationHub are represented by explicit sequence-free contracts and
            synthetic fixtures. Direct API or MCP adapters and controlled artifact
            storage have not been implemented in this milestone.
          </p>
        </div>
      </section>
    </main>
  );
}
