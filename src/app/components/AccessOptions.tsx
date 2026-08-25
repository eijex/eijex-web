const biocondaSoon = true; // set to false once the upstream Bioconda recipe PR merges

const options = [
  {
    label: "pip install factorforge-cds",
    href: "https://pypi.org/project/factorforge-cds/",
    soon: false,
  },
  {
    label: "conda install factorforge-cds",
    href: null, // no link yet -- Bioconda recipe not merged
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
    <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-teal-200 bg-teal-50 px-5 py-5 dark:border-teal-900 dark:bg-teal-950/30">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          FactorForge available via
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

      </div>
    </div>
  );
}
