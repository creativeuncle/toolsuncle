import { Trophy, CheckCircle2, Hourglass, Check, Circle } from "lucide-react";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function MilestonesTab({ lifeMilestones, legalMilestones }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h3 className="flex items-center gap-2 font-semibold mb-4">
          <Trophy size={18} className="text-amber-500" />
          Life Milestones
        </h3>
        <div className="space-y-2.5">
          {lifeMilestones.map((m) => (
            <div
              key={m.label}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                m.reached
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-500/10"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {m.reached ? (
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                ) : (
                  <Hourglass size={18} className="text-slate-400 shrink-0" />
                )}
                <div>
                  <p className="font-medium">{m.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{dateFmt.format(m.date)}</p>
                </div>
              </div>
              <span
                className={`text-sm font-medium ${
                  m.reached ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                }`}
              >
                {m.reached ? "Reached!" : `${m.daysUntil} days away`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h3 className="font-semibold mb-4">Indian Legal Milestones</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {legalMilestones.map((m) => (
            <div
              key={m.age}
              className={`rounded-xl border px-4 py-3 ${
                m.reached
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-500/10"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {m.reached ? (
                  <Check size={14} className="text-emerald-500 shrink-0" />
                ) : (
                  <Circle size={12} className="text-slate-400 shrink-0" />
                )}
                <span className="font-medium text-sm">Age {m.age}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
