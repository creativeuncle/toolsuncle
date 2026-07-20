const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function DashaTab({ sequence }) {
  const now = new Date();
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="font-semibold mb-1">Vimshottari Mahadasha</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        The 120-year Vimshottari Dasha cycle, starting from the nakshatra lord of your Moon at birth.
      </p>
      <div className="space-y-2">
        {sequence.map((d) => {
          const isCurrent = now >= d.start && now < d.end;
          return (
            <div
              key={`${d.lord}-${d.start.getTime()}`}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                isCurrent
                  ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-500/10"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div>
                <p className="font-medium text-sm">
                  {d.lord} Mahadasha
                  {isCurrent && (
                    <span className="ml-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">Current</span>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {dateFmt.format(d.start)} — {dateFmt.format(d.end)}
                </p>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">{d.years.toFixed(1)} yrs</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
