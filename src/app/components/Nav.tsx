import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import EcosystemLink from "./EcosystemLink";
import { publicLinks } from "@/app/lib/ecosystem";

export default function Nav() {
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
        <Link
          href="/"
          className="font-extrabold text-lg bg-gradient-to-r from-teal-400 to-green-900 bg-clip-text text-transparent"
        >
          eijex
        </Link>
        <div className="flex items-center gap-3 sm:gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              About
            </Link>
            <EcosystemLink className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Stack
            </EcosystemLink>
            <Link href="/factorforge" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              FactorForge
            </Link>
            <Link href="/agentos" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              AgentOS
            </Link>
            <Link href="/validationhub" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              ValidationHub
            </Link>
          </div>
          <a
            href={publicLinks.eijexGitHub}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors hidden lg:block"
          >
            GitHub
          </a>
          <details className="group relative md:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500">
              Menu <span aria-hidden="true">▾</span>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <Link href="/about" className="block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                About Eijex
              </Link>
              <EcosystemLink className="block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                Stack
              </EcosystemLink>
              <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
              <Link href="/factorforge" className="block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                FactorForge
              </Link>
              <Link href="/agentos" className="block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                AgentOS
              </Link>
              <Link href="/validationhub" className="block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                ValidationHub
              </Link>
              <a
                href={publicLinks.mcpService}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Eijex MCP ↗
              </a>
            </div>
          </details>
          <ThemeToggle />
          <a
            href={publicLinks.factorforgeApp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">Try FactorForge </span>
            <span className="sm:hidden">Try </span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
