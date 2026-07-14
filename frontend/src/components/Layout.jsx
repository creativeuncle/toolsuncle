import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import logoLight from "../assets/dctools-updated-light.png";
import logoDark from "../assets/dctools-updated-dark.png";

export default function Layout({ children }) {
  const location = useLocation();
  const isToolPage = location.pathname.startsWith("/tools/");
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <img
              src={theme === "dark" ? logoDark : logoLight}
              alt="Dctools"
              style={{ height: "30px" }}
              className="w-auto"
            />
          </Link>

          <nav className="flex items-center gap-5">
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

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
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
