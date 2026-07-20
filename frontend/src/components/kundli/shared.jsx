export function InfoGrid({ rows }) {
  const left = rows.filter((_, i) => i % 2 === 0);
  const right = rows.filter((_, i) => i % 2 === 1);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <div>
        {left.map((r) => (
          <div key={r.label} className="flex items-center justify-between py-2.5 px-1 odd:bg-slate-50 dark:odd:bg-slate-800/50 rounded text-sm">
            <span className="text-slate-500 dark:text-slate-400">{r.label}</span>
            <span className="font-medium text-right">{r.value}</span>
          </div>
        ))}
      </div>
      <div>
        {right.map((r) => (
          <div key={r.label} className="flex items-center justify-between py-2.5 px-1 odd:bg-slate-50 dark:odd:bg-slate-800/50 rounded text-sm">
            <span className="text-slate-500 dark:text-slate-400">{r.label}</span>
            <span className="font-medium text-right">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionCard({ title, right, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}
