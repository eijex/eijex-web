import Link from "next/link";
import { products, publicLinks } from "@/app/lib/ecosystem";

const productLinks = products.map((product) => ({
  label: product.name,
  href: product.primary.href,
}));

const resourceLinks = [
  { label: "Sponsor Research (GitHub)", href: "https://github.com/sponsors/eijex" },
  { label: "Donate via PayPal", href: "https://paypal.me/munkyukim" },
  { label: "FactorForge documentation", href: publicLinks.factorforgeDocs },
  { label: "Share Wet-lab Results (GitHub)", href: "https://github.com/eijex/factorforge-cds/issues/new?template=wet_lab_result.yml" },
  { label: "Eijex GitHub", href: publicLinks.eijexGitHub },
  { label: "PyPI", href: "https://pypi.org/project/factorforge-cds/" },
  { label: "Software DOI: 10.5281/zenodo.20407330", href: "https://doi.org/10.5281/zenodo.20407330" },
  { label: "Benchmark Data DOI: 10.5281/zenodo.20676276", href: "https://doi.org/10.5281/zenodo.20676276" },
];

export default function Footer() {
  return (
    <footer
      className="px-6 pt-10 pb-6"
      style={{ background: "linear-gradient(90deg, #134e4a, #14532d)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-1">
            <div className="font-extrabold text-lg text-teal-300 mb-2">eijex</div>
            <p className="text-xs text-teal-200/70 leading-relaxed mb-3">
              Open research software for plant bio-design,<br />workflow governance, and evidence traceability.
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
              {productLinks.map((l) =>
                l.href.startsWith("/") ? (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-xs text-teal-200/70 hover:text-teal-200 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ) : (
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
                )
              )}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-teal-400">
              Research
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/#research" className="text-xs text-teal-200/70 transition-colors hover:text-teal-200">
                  Paper 1 · Computational case study
                </Link>
              </li>
              <li>
                <Link href="/#research" className="text-xs text-teal-200/70 transition-colors hover:text-teal-200">
                  Paper 2 · Planning scaffold
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">
              Open source & resources
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
          <span className="text-xs text-teal-400/60">© 2026 eijex · Open research software · Repository licenses apply</span>
        </div>
      </div>
    </footer>
  );
}
