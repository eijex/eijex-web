import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import Nav from "@/app/components/Nav";
import { publicDataBoundary, publicLinks } from "@/app/lib/ecosystem";

export const metadata: Metadata = {
  title: "ValidationHub | Versioned evidence registry — eijex",
  description:
    "A public evidence-registry foundation for canonical identity, append-only lineage, review states, and permissioned research records.",
  alternates: { canonical: "/validationhub" },
  openGraph: {
    title: "ValidationHub — Versioned evidence, explicit scientific states",
    description:
      "Open schemas and registry code for traceable design-to-evidence infrastructure without publishing permissioned records.",
    url: "/validationhub",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "ValidationHub — Versioned evidence registry",
    description:
      "Open schemas and registry code for identity, lineage, review, and permissioned evidence boundaries.",
    images: [],
  },
};

const lineage = [
  { title: "Design package", note: "candidate identity" },
  { title: "Construct", note: "material identity" },
  { title: "Experiment", note: "protocol context" },
  { title: "Outcome", note: "observed result" },
  { title: "Evidence review", note: "human decision" },
  { title: "Evidence package", note: "versioned projection" },
] as const;

const evidenceStates = [
  {
    label: "Prediction",
    tone: "teal",
    description:
      "A model or design method proposes an expected property. It remains a computational statement.",
  },
  {
    label: "Computational check",
    tone: "cyan",
    description:
      "A deterministic or analytical check records what the software measured, with version and artifact identity.",
  },
  {
    label: "Experimental observation",
    tone: "violet",
    description:
      "A wet-lab outcome is linked to its construct and experimental context without inheriting a computational claim.",
  },
] as const;

const stateTone = {
  teal: "border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-100",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100",
  violet:
    "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-100",
} as const;

export default function ValidationHubPage() {
  return (
    <main className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <Nav />

      <section className="border-b border-violet-100 bg-gradient-to-br from-violet-50 via-white to-cyan-50 px-6 py-24 dark:border-violet-950 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/30">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="text-sm font-bold text-violet-800 transition-colors hover:text-violet-950 dark:text-violet-300 dark:hover:text-violet-100"
          >
            ← eijex home
          </Link>
          <p className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-violet-700 dark:text-violet-300">
            ValidationHub · Public code
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
            Versioned evidence, without collapsing scientific states.
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">
            ValidationHub is the open evidence-registry foundation for canonical
            identity, append-only lineage, review state, and evidence-package
            references across Eijex research workflows.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 text-sm font-bold">
            {["Evidence registry", "Append-only lineage", "Permissioned records"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-violet-900 dark:border-violet-800 dark:bg-slate-900/80 dark:text-violet-200"
                >
                  {label}
                </span>
              ),
            )}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={publicLinks.validationhubGitHub}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-violet-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-800"
            >
              View source on GitHub ↗
            </a>
            <a
              href={publicLinks.validationhubSecurity}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-slate-500 dark:border-slate-600 dark:text-slate-200"
            >
              Security policy ↗
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
              Evidence lineage
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Keep the chain inspectable from design to reviewed package.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              Each stage has its own identity and version. Links preserve
              provenance; they do not make a prediction equivalent to an
              experiment or turn a review decision into a biological result.
            </p>
          </div>

          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lineage.map((node, index) => (
              <li
                key={node.title}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-bold">{node.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {node.note}
                </p>
                {index < lineage.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 text-lg font-bold text-violet-400 sm:hidden"
                  >
                    ↓
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <div className="mt-5 rounded-xl border border-dashed border-violet-300 bg-violet-50/70 px-5 py-4 font-mono text-xs text-violet-900 dark:border-violet-800 dark:bg-violet-950/20 dark:text-violet-200">
            identity + version + content hash + reviewer state
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
            Scientific-state separation
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            Related records are not interchangeable evidence.
          </h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {evidenceStates.map((state) => (
              <article
                key={state.label}
                className={`rounded-2xl border p-6 ${stateTone[state.tone]}`}
              >
                <h3 className="text-lg font-bold">{state.label}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-80">
                  {state.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
              Registry v0
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              A testable foundation, not a completed platform.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              The public repository provides the local standard-library SQLite
              registry foundation, schemas, policy documents, tests, and
              synthetic examples needed to inspect the contract.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-200">
                Public implementation
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-emerald-950/80 dark:text-emerald-100/80">
                <li>• Append-only local ledger</li>
                <li>• Schema and hash checks</li>
                <li>• Synthetic fixtures and tests</li>
                <li>• Public-safe intake contracts</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
              <h3 className="font-bold text-amber-900 dark:text-amber-200">
                Not yet represented
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-950/80 dark:text-amber-100/80">
                <li>• No hosted public evidence database</li>
                <li>• No live PostgreSQL connection</li>
                <li>• No automatic public claim generation</li>
                <li>• No regulatory or clinical authority</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-amber-200 bg-amber-50 px-6 py-16 dark:border-amber-900 dark:bg-amber-950/20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
            Data boundary
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            Open infrastructure does not mean open experimental records.
          </h2>
          <p className="mt-4 max-w-4xl leading-relaxed text-amber-950 dark:text-amber-100">
            {publicDataBoundary}
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-amber-900/80 dark:text-amber-200/80">
            Public summaries require separate consent and review. The registry
            preserves references and decisions; it does not silently publish
            the underlying permissioned material.
          </p>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">Inspect the public registry foundation.</h2>
            <p className="mt-2 text-sm text-slate-400">
              Review the schemas, policies, tests, and synthetic examples.
            </p>
          </div>
          <a
            href={publicLinks.validationhubGitHub}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-500"
          >
            Open ValidationHub on GitHub ↗
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
