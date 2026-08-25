import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import Nav from "@/app/components/Nav";
import { publicDataBoundary, publicLinks } from "@/app/lib/ecosystem";

export const metadata: Metadata = {
  title: "AgentOS | Human-supervised workflow integrity — eijex",
  description:
    "Public workflow-control code for policy checks, approval gates, audit trails, and evidence-safe projection across Eijex research software.",
  alternates: { canonical: "/agentos" },
  openGraph: {
    title: "AgentOS — Human-supervised workflow integrity",
    description:
      "An open control-plane foundation for explicit boundaries, human approvals, and auditable research workflows.",
    url: "/agentos",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "AgentOS — Human-supervised workflow integrity",
    description:
      "Public workflow-control code for explicit boundaries, approval gates, and audit trails.",
    images: [],
  },
};

const controls = [
  {
    number: "01",
    title: "Intake and boundary checks",
    description:
      "Classify an incoming task and its data boundary before a tool or record is allowed into the workflow.",
  },
  {
    number: "02",
    title: "Claim review and approval",
    description:
      "Keep external statements behind an explicit human decision instead of allowing an automated run to publish them directly.",
  },
  {
    number: "03",
    title: "Audit and replay",
    description:
      "Retain structured decisions, policy results, and artifact references so a workflow can be reviewed without treating the log as scientific evidence itself.",
  },
] as const;

export default function AgentOSPage() {
  return (
    <main className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <Nav />

      <section className="border-b border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-teal-50 px-6 py-24 dark:border-cyan-950 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/30">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="text-sm font-bold text-cyan-800 transition-colors hover:text-cyan-950 dark:text-cyan-300 dark:hover:text-cyan-100"
          >
            ← eijex home
          </Link>
          <p className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-300">
            AgentOS · Public code
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
            Human-supervised workflow integrity.
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">
            AgentOS is the open control-plane foundation for policy checks,
            approval gates, audit trails, and evidence-safe public projection
            across Eijex research workflows.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 text-sm font-bold">
            {[
              "Control plane",
              "Human approval required",
              "Synthetic fixtures",
            ].map((label) => (
              <span
                key={label}
                className="rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-cyan-900 dark:border-cyan-800 dark:bg-slate-900/80 dark:text-cyan-200"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={publicLinks.agentosGitHub}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-cyan-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-800"
            >
              View source on GitHub ↗
            </a>
            <a
              href={publicLinks.agentosSecurity}
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
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
              Responsibility boundary
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Control, not scientific truth.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              AgentOS governs how work moves between tools and people. It does
              not replace FactorForge&apos;s computation, own ValidationHub&apos;s
              evidence records, or decide that a biological claim is true.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-9">
            <div className="mx-auto max-w-3xl rounded-2xl border-2 border-cyan-400 bg-cyan-50 p-5 text-center dark:border-cyan-700 dark:bg-cyan-950/30">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
                AgentOS control plane
              </p>
              <p className="mt-2 font-bold">
                Policy · approval · audit · public projection
              </p>
            </div>
            <div aria-hidden="true" className="mx-auto h-8 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-teal-200 bg-white p-5 dark:border-teal-900 dark:bg-slate-950">
                <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
                  FactorForge
                </p>
                <h3 className="mt-2 text-lg font-bold">Design computation</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Produces reproducible CDS candidates and computational review
                  artifacts within its own scientific boundary.
                </p>
              </div>
              <div className="rounded-2xl border border-violet-200 bg-white p-5 dark:border-violet-900 dark:bg-slate-950">
                <p className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                  ValidationHub
                </p>
                <h3 className="mt-2 text-lg font-bold">Evidence registry</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Preserves identity, lineage, review state, and evidence-package
                  references without turning workflow approval into evidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
            Control surfaces
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            Explicit decisions at every public boundary.
          </h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {controls.map((control) => (
              <article
                key={control.number}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950"
              >
                <span className="font-mono text-sm font-bold text-cyan-700 dark:text-cyan-300">
                  {control.number}
                </span>
                <h3 className="mt-4 text-lg font-bold">{control.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {control.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
              Approval contract
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Automation can prepare. A person authorizes release.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              Public projection remains a distinct action with an attributable
              decision. A successful tool execution alone is not permission to
              publish a claim or a permissioned record.
            </p>
          </div>
          <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-6 text-sm leading-7 text-cyan-300 shadow-xl">
            <code>{`{
  "artifact_hash": "sha256:…",
  "boundary_check": "pass",
  "approval_state": "required",
  "public_projection": false
}`}</code>
          </pre>
        </div>
      </section>

      <section className="border-t border-amber-200 bg-amber-50 px-6 py-16 dark:border-amber-900 dark:bg-amber-950/20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
            Current public boundary
          </p>
          <h2 className="mt-3 text-2xl font-bold">What is available today</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-200 bg-white/70 p-5 dark:border-amber-900 dark:bg-slate-950/50">
              <h3 className="font-bold">Public</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Workflow code, schemas, policy checks, tests, documentation, and
                synthetic fixtures in the canonical GitHub repository.
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-white/70 p-5 dark:border-amber-900 dark:bg-slate-950/50">
              <h3 className="font-bold">Not implied</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                No separate hosted AgentOS application, autonomous scientific
                authority, or public store of permissioned research evidence.
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-amber-950 dark:text-amber-100">
            {publicDataBoundary}
          </p>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">Inspect the public control plane.</h2>
            <p className="mt-2 text-sm text-slate-400">
              Start with the source, schemas, tests, and synthetic examples.
            </p>
          </div>
          <a
            href={publicLinks.agentosGitHub}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-cyan-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-500"
          >
            Open AgentOS on GitHub ↗
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
