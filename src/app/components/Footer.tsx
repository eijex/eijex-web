const productLinks = [
  { label: "FactorForge", href: "https://factorforge.eijex.com" },
  { label: "Eijex MCP", href: "https://mcp.eijex.com" },
];

const resourceLinks = [
  { label: "Documentation", href: "https://eijex.github.io/factorforge-cds/" },
  { label: "GitHub", href: "https://github.com/eijex/factorforge-cds" },
  { label: "PyPI", href: "https://pypi.org/project/factorforge-cds/" },
  { label: "Zenodo / DOI", href: "https://doi.org/10.5281/zenodo.20407331" },
];

export default function Footer() {
  return (
    <footer
      className="px-6 pt-10 pb-6"
      style={{ background: "linear-gradient(90deg, #134e4a, #14532d)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div className="sm:col-span-1">
            <div className="font-extrabold text-lg text-teal-300 mb-2">eijex</div>
            <p className="text-xs text-teal-200/70 leading-relaxed mb-3">
              Open-source computational tools<br />for plant synthetic biology.
            </p>
            <a
              href="mailto:eijex.lab@gmail.com"
              className="text-xs text-teal-300/80 hover:text-teal-300 transition-colors"
            >
              eijex.lab@gmail.com
            </a>
          </div>
          <div>
            <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">
              Products
            </p>
            <ul className="space-y-2">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-200/70 hover:text-teal-200 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">
              Resources
            </p>
            <ul className="space-y-2">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-200/70 hover:text-teal-200 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
          <span className="text-xs text-teal-400/60">© 2026 eijex · FactorForge is AGPL-3.0</span>
        </div>
      </div>
    </footer>
  );
}
