import { Link, useLocation } from "react-router-dom";
import { Wrench } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
              <Wrench size={18} />
            </span>
            ToolsUncle
          </Link>
          {!isHome && (
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              ← All tools
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-sm text-slate-500 dark:text-slate-400 text-center">
          Built with care — ToolsUncle
        </div>
      </footer>
    </div>
  );
}
