import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import CategoriesDropdown from "./CategoriesDropdown";
import SearchBar from "./SearchBar";
import logoLight from "../assets/dctools-updated-light.png";
import logoDark from "../assets/dctools-updated-dark.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "All Tools", path: "/tools" },
  { label: "AI Tools", path: "/tools", search: "?category=ai-tools" },
  { label: "Blog", path: "/blog" },
];

function isLinkActive(link, location) {
  if (link.path === "/") return location.pathname === "/";
  if (link.search !== undefined) {
    return location.pathname === link.path && location.search === link.search;
  }
  if (link.path === "/tools") {
    return location.pathname === "/tools" && !location.search;
  }
  return location.pathname.startsWith(link.path);
}

function NavLinks({ location, className }) {
  return navLinks.map((link) => (
    <Link
      key={link.label}
      to={`${link.path}${link.search || ""}`}
      className={`${className} ${
        isLinkActive(link, location)
          ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
          : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
      }`}
    >
      {link.label}
    </Link>
  ));
}

export default function Layout({ children }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0">
            <img
              src={theme === "dark" ? logoDark : logoLight}
              alt="Dctools"
              style={{ height: "24px" }}
              className="w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLinks location={location} className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors" />
            <CategoriesDropdown />
          </nav>

          <div className="flex items-center gap-2">
            <SearchBar />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          <NavLinks
            location={location}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          />
          <CategoriesDropdown />
        </nav>
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
