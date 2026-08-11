import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#1c211c] bg-[#0a0b0a]/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-white tracking-tight">
          Website <span className="text-[#7cff6b]">Checker</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-white" : "text-[#a3ada3] hover:text-white"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/"
          className="inline-flex items-center rounded-lg bg-white text-black text-sm font-semibold px-4 py-2 hover:bg-[#e8ffe4] transition-colors"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
