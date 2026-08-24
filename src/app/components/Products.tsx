const products = [
  {
    name: "FactorForge",
    tag: "CDS Design Review",
    tagColor: "text-teal-600 dark:text-teal-400",
    status: "Open source · Available",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    description:
      "Pre-synthesis sequence review for plant CDS workflows. Generates reproducible CDS candidates and reviews CAI, GC%, configured sequence motifs, and assembly-relevant restriction-site conflicts.",
    code: "pip install factorforge-cds",
    codeColor: "text-teal-700 dark:text-teal-400",
    primary: { label: "Learn More", href: "/factorforge" },
    secondary: { label: "GitHub", href: "https://github.com/eijex/factorforge-cds" },
    primaryBg: "bg-teal-600 hover:bg-teal-700",
  },
  {
    name: "Eijex MCP",
    tag: "MCP Access",
    tagColor: "text-teal-900 dark:text-teal-300",
    status: "Open source · Available",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    description:
      "Use FactorForge through MCP-compatible clients with explicit public-tool boundaries. No installation required.",
    code: "mcp.eijex.com",
    codeColor: "text-teal-900 dark:text-teal-300",
    primary: { label: "Connect ↗", href: "https://mcp.eijex.com" },
    secondary: { label: "GitHub", href: "https://github.com/eijex/eijex-mcp" },
    primaryBg: "bg-teal-900 hover:bg-teal-800",
  },
  {
    name: "AgentOS",
    tag: "Workflow Integrity",
    tagColor: "text-cyan-700 dark:text-cyan-300",
    status: "Open source · Public",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    description:
      "Human-supervised orchestration for permissioned intake, boundary checks, approval gates, audit trails, and evidence-safe public projection.",
    code: "Human approval at every public boundary",
    codeColor: "text-cyan-700 dark:text-cyan-300",
    primary: { label: "GitHub ↗", href: "https://github.com/eijex/eijex-agentOps" },
    secondary: { label: "Security", href: "https://github.com/eijex/eijex-agentOps/security" },
    primaryBg: "bg-cyan-700 hover:bg-cyan-800",
  },
  {
    name: "ValidationHub",
    tag: "Evidence Registry",
    tagColor: "text-violet-700 dark:text-violet-300",
    status: "Open source · Public",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    description:
      "Schema-driven registry infrastructure for normalizing, reviewing, and curating validation evidence while keeping permissioned research records outside the public codebase.",
    code: "Open schemas · Permissioned evidence",
    codeColor: "text-violet-700 dark:text-violet-300",
    primary: { label: "GitHub ↗", href: "https://github.com/eijex/eijex-validationHub" },
    secondary: { label: "Security", href: "https://github.com/eijex/eijex-validationHub/security" },
    primaryBg: "bg-violet-700 hover:bg-violet-800",
  },
];

export default function Products() {
  return (
    <section id="products" className="py-16 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Open-source stack
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Infrastructure for the bench and the pipeline.
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Public software releases are staged independently from permissioned research data.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {products.map((p) => (
            <div
              key={p.name}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">{p.name}</h3>
                <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ${p.statusColor}`}>
                  {p.status}
                </span>
              </div>
              <p className={`text-sm font-semibold uppercase tracking-wide mb-3 ${p.tagColor}`}>
                {p.tag}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{p.description}</p>
              <code className={`block bg-slate-100 dark:bg-slate-900 rounded-md px-3 py-2 text-sm mb-5 ${p.codeColor}`}>
                {p.code}
              </code>
              {p.primary && p.secondary ? (
                <div className="flex gap-2">
                  <a
                    href={p.primary.href}
                    target={p.primary.href.startsWith("/") ? undefined : "_blank"}
                    rel={p.primary.href.startsWith("/") ? undefined : "noopener noreferrer"}
                    className={`flex-1 text-center text-white text-sm font-bold py-2.5 rounded-lg transition-colors ${p.primaryBg}`}
                  >
                    {p.primary.label}
                  </a>
                  <a
                    href={p.secondary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm py-2.5 rounded-lg hover:border-slate-300 dark:hover:border-slate-500 transition-colors"
                  >
                    {p.secondary.label}
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          Open source refers to the software and public schemas. Raw sequences,
          partner documents, personal information, and other permissioned evidence
          are not included in public repositories.
        </div>
      </div>
    </section>
  );
}
