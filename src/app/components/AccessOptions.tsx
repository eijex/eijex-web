const biocondaSoon = true; // Bioconda PR #65834 머지 후 false로 변경

const options = [
  {
    label: "pip install factorforge-cds",
    href: "https://pypi.org/project/factorforge-cds/",
    soon: false,
  },
  {
    label: "conda install factorforge-cds",
    href: "https://anaconda.org/bioconda/factorforge-cds",
    soon: biocondaSoon,
  },
  {
    label: "docker pull eijex/factorforge",
    href: "https://hub.docker.com/r/eijex/factorforge",
    soon: false,
  },
];

export default function AccessOptions() {
  return (
    <div className="bg-white border-t border-b border-slate-200 py-5 px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Available via
        </span>
        {options.map((opt) => (
          <a
            key={opt.label}
            href={opt.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 hover:border-slate-300 transition-colors"
          >
            <code className="text-xs text-slate-800">{opt.label}</code>
            {opt.soon && (
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-1.5 py-0.5 rounded">
                soon
              </span>
            )}
          </a>
        ))}
        <a
          href="https://factorforge.eijex.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 hover:border-teal-300 transition-colors"
        >
          <span className="text-xs font-semibold text-teal-700">Web App ↗</span>
        </a>
      </div>
    </div>
  );
}
