import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import Nav from "@/app/components/Nav";

export const metadata: Metadata = {
  title: "About Eijex | Why the name exists",
  description:
    "The origin and design philosophy of Eijex: a coined name inspired by eigenstate and joint expression.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Eijex — Engineering Intrinsic Expression",
    description:
      "Why Eijex connects context-dependent expression design with workflow control and reviewable evidence.",
    url: "/about",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "About Eijex — Engineering Intrinsic Expression",
    description:
      "A coined name inspired by eigenstate, joint expression, and evidence-linked engineering.",
    images: [],
  },
};

const principles = [
  {
    number: "01",
    title: "Design",
    description:
      "Explore reproducible sequence-design candidates within explicit computational constraints.",
  },
  {
    number: "02",
    title: "Govern",
    description:
      "Keep workflow boundaries, policy checks, and human approval visible rather than implicit.",
  },
  {
    number: "03",
    title: "Preserve evidence",
    description:
      "Connect computational artifacts and experimental observations without treating them as interchangeable evidence.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <Nav />

      <section className="border-b border-teal-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50 px-6 py-24 dark:border-teal-950 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/30">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="text-sm font-bold text-teal-800 transition-colors hover:text-teal-950 dark:text-teal-300 dark:hover:text-teal-100"
          >
            ← eijex home
          </Link>
          <p className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-teal-700 dark:text-teal-300">
            About Eijex
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
            Why Eijex?
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">
            Eijex is a coined name inspired by <em>eigenstate</em> and
            <em> joint expression</em>—a way to describe our direction without
            reducing biological expression to a single score.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3 text-sm font-bold">
            <span className="rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-teal-900 dark:border-teal-800 dark:bg-slate-900/80 dark:text-teal-200">
              AY-jeks · 아이젝스
            </span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
              A coined name
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
            The name
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold">
            A mathematical metaphor joined to an engineering practice.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-teal-200 bg-teal-50 p-7 dark:border-teal-900 dark:bg-teal-950/20">
              <p className="font-mono text-sm font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
                Ei · Eigen
              </p>
              <h3 className="mt-4 text-2xl font-bold">A distinctive state within a system.</h3>
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                In mathematics, eigenvalues and eigenstates describe structure
                relative to a defined system. For Eijex, that idea is a metaphor
                for examining expression designs in their specific biological
                and experimental context.
              </p>
            </article>
            <article className="rounded-3xl border border-cyan-200 bg-cyan-50 p-7 dark:border-cyan-900 dark:bg-cyan-950/20">
              <p className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
                Jex · Joint Expression
              </p>
              <h3 className="mt-4 text-2xl font-bold">Design, workflow, and evidence connected.</h3>
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                Expression is shaped by interacting choices and conditions. Our
                engineering approach connects sequence design, human-supervised
                workflow control, and reviewable evidence without collapsing
                those responsibilities into one system.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
              Brand expression
            </p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight">
              Engineering Intrinsic Expression
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-slate-600 dark:text-slate-300">
              발현에 내재된 설계 조건을 탐색하고, 그 근거를 연결합니다.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-950">
            <p className="font-bold">What this means in practice</p>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              Eijex builds open, evidence-linked software for exploring and
              reviewing context-dependent plant expression designs—from
              reproducible CDS candidates to governed workflows and traceable
              evidence records.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
            Engineering principles
          </p>
          <h2 className="mt-3 text-3xl font-bold">One direction, three responsibilities.</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-300">
                  {principle.number}
                </span>
                <h3 className="mt-4 text-lg font-bold">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-amber-200 bg-amber-50 px-6 py-16 dark:border-amber-900 dark:bg-amber-950/20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
            Scientific boundary
          </p>
          <h2 className="mt-3 text-2xl font-bold">A philosophy, not a performance claim.</h2>
          <p className="mt-4 max-w-4xl leading-relaxed text-amber-950 dark:text-amber-100">
            The name is a design philosophy. It does not claim that every
            protein has one universal optimum, that a single computational
            state determines expression, or that in-silico metrics alone
            predict biological expression or yield.
          </p>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">See how the Eijex stack works.</h2>
            <p className="mt-2 text-sm text-slate-400">
              Design candidates, govern workflows, and preserve evidence.
            </p>
          </div>
          <Link
            href="/#ecosystem"
            className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-500"
          >
            Explore the stack →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
