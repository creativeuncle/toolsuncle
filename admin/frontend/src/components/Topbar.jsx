import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Notification03Icon, Sun02Icon, Moon02Icon, Logout01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useTool } from "../context/ToolContext";
import { useTheme } from "../hooks/useTheme";
import { clearToken } from "../config/api";

export default function Topbar() {
  const { tool, toolId, setToolId, tools } = useTool();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setToolId(id);
    setOpen(false);
    navigate(`/${id}`);
  };

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-end gap-2 px-6">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <HugeiconsIcon icon={tool.icon} size={16} />
          {tool.name}
          <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-slate-400" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-2 z-20 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1.5">
              {tools.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelect(t.id)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <HugeiconsIcon icon={t.icon} size={16} />
                  <span className="flex-1">{t.name}</span>
                  {t.id === toolId && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-indigo-500" />}
                  {!t.available && <span className="text-[10px] text-slate-400">Soon</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        title="Notifications"
        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <HugeiconsIcon icon={Notification03Icon} size={18} />
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        title="Toggle theme"
        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <HugeiconsIcon icon={theme === "dark" ? Sun02Icon : Moon02Icon} size={18} />
      </button>

      <button
        type="button"
        onClick={handleLogout}
        title="Log out"
        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <HugeiconsIcon icon={Logout01Icon} size={18} />
      </button>
    </header>
  );
}
