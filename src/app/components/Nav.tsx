export default function Nav() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="font-extrabold text-lg bg-gradient-to-r from-teal-400 to-green-900 bg-clip-text text-transparent">
          eijex
        </span>
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <a href="#products" className="hover:text-slate-900 transition-colors hidden sm:block">
            Products
          </a>
          <a href="#about" className="hover:text-slate-900 transition-colors hidden sm:block">
            About
          </a>
          <a
            href="https://github.com/eijex"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors hidden sm:block"
          >
            GitHub
          </a>
          <a
            href="https://factorforge.eijex.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Get started →
          </a>
        </div>
      </div>
    </nav>
  );
}
