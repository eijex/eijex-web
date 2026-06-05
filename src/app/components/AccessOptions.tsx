const biocondaSoon = true; // Bioconda PR #65834 머지 후 false로 변경

const options = [
  {
    label: "pip install factorforge-cds",
    href: "https://pypi.org/project/factorforge-cds/",
    soon: false,
  },
  {
    label: "conda install factorforge-cds",
    href: null, // Bioconda pending — 링크 없음
    soon: biocondaSoon,
  },
  {
    label: "docker pull ghcr.io/eijex/factorforge-cds:latest",
    href: "https://github.com/eijex/factorforge-cds/pkgs/container/factorforge-cds",
    soon: false,
  },
];

export default function AccessOptions() {
  return (
    <div className="bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-700 py-5 px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Available via
        </span>
        {options.map((opt) =>
          opt.href ? (
            <a
              key={opt.label}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 hover:border-slate-300 dark:hover:border-slate-500 transition-colors"
            >
              <code className="text-sm text-slate-800 dark:text-slate-200">{opt.label}</code>
              {opt.soon && (
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 text-xs font-semibold px-1.5 py-0.5 rounded">
                  soon
                </span>
              )}
            </a>
          ) : (
            <div
              key={opt.label}
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 cursor-default"
            >
              <code className="text-sm text-slate-400 dark:text-slate-500">{opt.label}</code>
              {opt.soon && (
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 text-xs font-semibold px-1.5 py-0.5 rounded">
                  soon
                </span>
              )}
            </div>
          )
        )}
        <a
          href="https://factorforge.eijex.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg px-4 py-2.5 hover:border-teal-300 dark:hover:border-teal-600 transition-colors"
        >
          <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">Web App ↗</span>
        </a>
      </div>
    </div>
  );
}
