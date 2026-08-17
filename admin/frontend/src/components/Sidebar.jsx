import { NavLink } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTool } from "../context/ToolContext";
import { PAGES_BY_TOOL } from "../config/pages";

export default function Sidebar() {
  const { toolId, tool } = useTool();
  const pages = PAGES_BY_TOOL[toolId] || [];

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
      <div className="h-16 flex items-center px-5 font-semibold border-b border-slate-200 dark:border-slate-800">
        Super Admin
      </div>

      <p className="px-5 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {tool.name}
      </p>

      <nav className="flex-1 p-3 space-y-1">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <NavLink
              key={page.path}
              to={page.path}
              end={page.exact}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
            >
              <HugeiconsIcon icon={Icon} size={17} />
              {page.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
