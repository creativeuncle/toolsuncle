import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { parseDateLocal, diffYMD } from "../../utils/ageCalculations";

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

export default function CompareTab({ birth, target }) {
  const [otherDob, setOtherDob] = useState("");

  const result = useMemo(() => {
    const other = parseDateLocal(otherDob);
    if (!other) return null;

    const older = birth <= other ? birth : other;
    const younger = birth <= other ? other : birth;
    const gap = diffYMD(older, younger);
    const daysBetween = Math.round(Math.abs(other - birth) / 86400000);

    const otherAge = diffYMD(other, target);
    const isSelfOlder = birth < other;

    return { gap, daysBetween, otherAge, isSelfOlder, isSame: birth.getTime() === other.getTime() };
  }, [otherDob, birth, target]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="flex items-center gap-2 font-semibold mb-4">
        <Users size={18} className="text-violet-500" />
        Compare Ages
      </h3>

      <div className="max-w-xs">
        <label className={labelClass}>Other person's date of birth</label>
        <input type="date" value={otherDob} onChange={(e) => setOtherDob(e.target.value)} className={inputClass} />
      </div>

      {result && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Their current age</p>
            <p className="text-lg font-bold mt-1">
              {result.otherAge.years}y {result.otherAge.months}m {result.otherAge.days}d
            </p>
          </div>
          <div className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Days between birthdays</p>
            <p className="text-lg font-bold mt-1">{result.daysBetween.toLocaleString()} days</p>
          </div>
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-500/10 px-4 py-3 sm:col-span-2">
            <p className="text-xs text-indigo-600 dark:text-indigo-400">Age gap</p>
            <p className="text-lg font-bold mt-1 text-indigo-700 dark:text-indigo-400">
              {result.isSame
                ? "Same birthday!"
                : `${result.isSelfOlder ? "You are" : "They are"} older by ${result.gap.years}y ${result.gap.months}m ${result.gap.days}d`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
