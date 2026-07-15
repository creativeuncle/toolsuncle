import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="font-semibold">{title}</span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}
