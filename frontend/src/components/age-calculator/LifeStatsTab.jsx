export default function LifeStatsTab({ stats }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="font-semibold mb-1">Life Stats</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Fun, approximate estimates based on your total time alive — not exact measurements.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 text-center"
          >
            <p className="text-2xl">{s.emoji}</p>
            <p className="mt-2 text-lg font-bold">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
