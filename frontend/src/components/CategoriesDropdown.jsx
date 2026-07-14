import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LayoutGrid, ArrowUpRight } from "lucide-react";
import { categories } from "../config/categories";
import { tools } from "../config/tools";

export default function CategoriesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          open
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
            : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
      >
        Categories
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[560px] max-w-[90vw] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-3 z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  to={`/tools?category=${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span
                    className={`flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} text-white shrink-0`}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                      {cat.name}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                      {cat.count} tool{cat.count !== 1 ? "s" : ""} · {cat.summary}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <Link
            to="/tools"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800"
          >
            <span className="flex items-center gap-2">
              <LayoutGrid size={16} />
              Browse all {tools.length} tools
            </span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
