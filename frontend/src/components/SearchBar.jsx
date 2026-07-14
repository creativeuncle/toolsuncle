import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { tools } from "../config/tools";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const closeAndClear = () => {
    setOpen(false);
    setQuery("");
  };

  const goToTool = (path) => {
    navigate(path);
    closeAndClear();
  };

  return (
    <div ref={wrapperRef} className="relative">
      {open ? (
        <div className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && closeAndClear()}
            placeholder="Search tools…"
            className="w-40 sm:w-56 bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={closeAndClear}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search tools"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Search size={18} />
        </button>
      )}

      {open && query.trim() && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-2 z-20">
          {results.length > 0 ? (
            results.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => goToTool(tool.path)}
                  className="w-full flex items-center gap-3 rounded-xl p-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${tool.color} text-white shrink-0`}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-900 dark:text-white truncate">
                      {tool.name}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                      {tool.category}
                    </span>
                  </span>
                </button>
              );
            })
          ) : (
            <p className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">
              No tools match "{query}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
