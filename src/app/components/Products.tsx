const products = [
  {
    name: "FactorForge",
    tag: "CDS Design Engine",
    tagColor: "text-teal-600 dark:text-teal-400",
    description:
      "Constraint-aware synonymous CDS design for plant workflows. Reviews CAI, GC%, PolyA motifs, and assembly-site conflicts with reproducible outputs.",
    code: "pip install factorforge-cds",
    codeColor: "text-teal-700 dark:text-teal-400",
    primary: { label: "Docs ↗", href: "https://eijex.github.io/factorforge-cds/" },
    secondary: { label: "GitHub", href: "https://github.com/eijex/factorforge-cds" },
    primaryBg: "bg-teal-600 hover:bg-teal-700",
  },
  {
    name: "Eijex MCP",
    tag: "MCP Access",
    tagColor: "text-teal-900 dark:text-teal-300",
    description:
      "Use FactorForge through MCP-compatible clients with explicit public-tool boundaries. No installation required.",
    code: "mcp.eijex.com",
    codeColor: "text-teal-900 dark:text-teal-300",
    primary: { label: "Connect ↗", href: "https://mcp.eijex.com" },
    secondary: { label: "GitHub", href: "https://github.com/eijex/eijex-mcp" },
    primaryBg: "bg-teal-900 hover:bg-teal-800",
  },
];

export default function Products() {
  return (
    <section id="products" className="py-16 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Products
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Tools built for the bench and the pipeline.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {products.map((p) => (
            <div
              key={p.name}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7"
            >
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-1">{p.name}</h3>
              <p className={`text-sm font-semibold uppercase tracking-wide mb-3 ${p.tagColor}`}>
                {p.tag}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{p.description}</p>
              <code className={`block bg-slate-100 dark:bg-slate-900 rounded-md px-3 py-2 text-sm mb-5 ${p.codeColor}`}>
                {p.code}
              </code>
              <div className="flex gap-2">
                <a
                  href={p.primary.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
