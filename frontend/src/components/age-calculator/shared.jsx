export function SectionCard({ icon: Icon, iconColor, title, children, right }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="flex items-center gap-2 font-semibold">
          {Icon && <Icon size={18} className={iconColor} />}
          {title}
        </h3>
        {right}
      </div>
      {children}
    </div>
  );
}

export function StatTile({ value, label }) {
  return (
    <div className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-center">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

export function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}
