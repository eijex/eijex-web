import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import Nav from "@/app/components/Nav";
import { publicDataBoundary, publicLinks } from "@/app/lib/ecosystem";

export const metadata: Metadata = {
  title: "Policies | Eijex",
  description:
    "Privacy, research-use, security disclosure, and licensing boundaries for Eijex public research software.",
  alternates: { canonical: "/policies" },
  openGraph: {
    title: "Eijex policies and public-use boundaries",
    description:
      "How Eijex handles public-site data, research-use limitations, security reports, and repository licenses.",
    url: "/policies",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Eijex policies and public-use boundaries",
    description:
      "Privacy, research-use, security disclosure, and licensing boundaries for Eijex.",
    images: [],
  },
};

const sections = [
  {
    id: "privacy",
    eyebrow: "Privacy & data handling",
    title: "Keep private research data out of public surfaces.",
    body: [
      "Eijex.com is an informational site and does not provide a sequence-upload form. Linked products and external services have their own data boundaries and notices.",
      publicDataBoundary,
      "Hosting providers may process standard request metadata needed to serve and protect the site. If you contact Eijex by email, the information you send is used to respond to that communication. Do not include raw sequences, patient data, credentials, partner-confidential material, or unpublished evidence in public issues or feedback channels.",
    ],
  },
  {
    id: "research-use",
    eyebrow: "Research-use disclaimer",
    title: "Computational output is not experimental proof.",
    body: [
      "Eijex software supports research, review, and reproducible computational workflows. In-silico scores, generated candidates, checks, and reports do not establish expression, yield, synthesis acceptance, folding, safety, efficacy, biological activity, or experimental validity.",
      "Public software and documentation do not constitute medical advice, a clinical decision, regulatory approval, or a regulatory submission. Researchers remain responsible for independent review, appropriate experimental validation, intellectual-property assessment, biosafety, and compliance with requirements that apply to their work.",
    ],
  },
  {
    id: "security",
    eyebrow: "Security disclosure",
    title: "Report vulnerabilities privately before publishing details.",
    body: [
      "Please send a concise description, affected component, reproduction conditions, and potential impact to eijex.lab@gmail.com. Do not include secrets, private research records, or unnecessary personal data.",
      "Do not open a public issue for an unpatched vulnerability. Repository-specific security policies and reporting channels take precedence when they are available.",
    ],
  },
  {
    id: "licenses",
    eyebrow: "Licenses",
    title: "The license in each repository is authoritative.",
    body: [
      "Eijex projects are released independently. The LICENSE file and notices in each repository govern that software version; a license shown for one project does not automatically apply to another project, dataset, paper, or third-party dependency.",
      "Dataset records, archived releases, publications, and external dependencies may carry separate terms. Check the cited DOI, repository, package metadata, and bundled notices before redistribution or commercial use.",
    ],
  },
] as const;

export default function PoliciesPage() {
  return (
    <main className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <Nav />

      <section className="border-b border-teal-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50 px-6 py-20 dark:border-teal-950 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/30">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="text-sm font-bold text-teal-800 transition-colors hover:text-teal-950 dark:text-teal-300 dark:hover:text-teal-100"
          >
            ← eijex home
          </Link>
          <p className="mt-10 text-sm font-bold uppercase tracking-[0.25em] text-teal-700 dark:text-teal-300">
            Public-use boundaries
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Policies for using and reviewing Eijex software.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            A concise reference for public-site data handling, scientific claims,
            vulnerability reporting, and project licenses.
          </p>
          <nav aria-label="Policy sections" className="mt-8 flex flex-wrap gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-bold text-teal-900 transition hover:border-teal-400 dark:border-teal-800 dark:bg-slate-900/80 dark:text-teal-200"
              >
                {section.eyebrow}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-6">
          {sections.map((section, index) => (
            <article
              id={section.id}
              key={section.id}
              className="scroll-mt-24 rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="grid gap-5 md:grid-cols-[11rem_1fr] md:gap-10">
                <div>
                  <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {section.eyebrow}
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.id === "security" && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={publicLinks.agentosSecurity}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold transition hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:hover:border-teal-500 dark:hover:text-teal-300"
                      >
                        AgentOS security ↗
                      </a>
                      <a
                        href={publicLinks.validationhubSecurity}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold transition hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:hover:border-teal-500 dark:hover:text-teal-300"
                      >
                        ValidationHub security ↗
                      </a>
                    </div>
                  )}
                  {section.id === "licenses" && (
                    <a
                      href={publicLinks.eijexGitHub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500"
                    >
                      Review Eijex repositories ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
