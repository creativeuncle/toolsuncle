import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Layout({ children }) {
  const location = useLocation();
  const isToolPage = location.pathname.startsWith("/tools/");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center rounded-lg bg-slate-900 px-3 py-2">
            <img src={logo} alt="Dctools" className="h-5 w-auto" />
          </Link>

          <nav className="flex items-center gap-6">
            {isToolPage ? (
              <Link
                to="/"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                ← All tools
              </Link>
            ) : (
              <Link
                to="/blog"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/blog"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                Blog
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-sm text-slate-500 dark:text-slate-400 text-center">
          Built with care — Dctools
        </div>
      </footer>
    </div>
  );
}
