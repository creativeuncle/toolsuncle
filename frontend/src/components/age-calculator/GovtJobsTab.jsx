import { useMemo, useState } from "react";
import { UserRound } from "lucide-react";
import { GOVT_EXAMS, examEligibility } from "../../utils/ageCalculations";

const FILTERS = ["All", "SSC", "UPSC", "Banking", "Railway", "Defence", "State"];

const STATUS_STYLE = {
  eligible: { label: "✓ Eligible", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
  "obc-scst": { label: "OBC/SC/ST", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  "pwd-only": { label: "PWD Only", cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400" },
  "not-eligible": { label: "Not Eligible", cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400" },
};

const BORDER_STYLE = {
  eligible: "border-emerald-200 dark:border-emerald-800",
  "obc-scst": "border-amber-200 dark:border-amber-800",
  "pwd-only": "border-blue-200 dark:border-blue-800",
  "not-eligible": "border-red-200 dark:border-red-800",
};

export default function GovtJobsTab({ age }) {
  const [filter, setFilter] = useState("All");

  const exams = useMemo(
    () => GOVT_EXAMS.map((exam) => ({ ...exam, ...examEligibility(age, exam) })),
    [age]
  );

  const eligibleCount = exams.filter((e) => e.status === "eligible").length;
  const visible = filter === "All" ? exams : exams.filter((e) => e.category === filter);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="flex items-center gap-2 font-semibold mb-4">
        <UserRound size={18} className="text-indigo-500" />
        Government Job Eligibility
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-amber-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">
        You are eligible for {eligibleCount} exam(s) under General category
      </p>

      <div className="space-y-2.5">
        {visible.map((exam) => {
          const style = STATUS_STYLE[exam.status];
          return (
            <div
              key={exam.name}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${BORDER_STYLE[exam.status]}`}
            >
              <div>
                <p className="font-medium text-sm">
                  {exam.name} <span className="text-slate-400 font-normal">({exam.category})</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {exam.minAge}-{exam.maxAge}yr
                  {exam.relax &&
                    ` · OBC +${exam.relax.obc || 0} · SC/ST +${exam.relax.scst || 0} · PWD +${exam.relax.pwd || 0} · Ex-SM +${exam.relax.exsm || 0}`}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${style.cls}`}>
                {style.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
