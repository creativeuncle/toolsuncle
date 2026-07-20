import { Timer, Cake, Star, Sparkles, TrendingUp } from "lucide-react";
import { SectionCard, StatTile, InfoRow, Pill } from "./shared";
import { compactNumber } from "../../utils/ageCalculations";

const dateFmt = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" });
const weekdayFmt = new Intl.DateTimeFormat("en-US", { weekday: "long" });

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function OverviewTab({ data, isLive }) {
  const { ymd, live, birthdayProgress, pills, units, birthInfo, funAges, lifeProgress } = data;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-2">Your Age</p>
        <div className="flex items-end justify-center gap-6 sm:gap-10">
          {[
            { value: ymd.years, label: "Years" },
            { value: ymd.months, label: "Months" },
            { value: ymd.days, label: "Days" },
          ].map((b) => (
            <div key={b.label} className="text-center">
              <p className="text-4xl sm:text-5xl font-extrabold text-amber-500">{b.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{b.label}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-slate-800 text-white px-4 py-1.5 text-sm font-mono">
            <Timer size={14} />
            {live.days.toLocaleString()}d {pad(live.hours)}h {pad(live.minutes)}m {pad(live.seconds)}s
            {isLive && (
              <span className="ml-1 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-sans font-bold tracking-wide">
                LIVE
              </span>
            )}
          </span>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Last birthday</span>
            <span>Next birthday</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${birthdayProgress.pct}%` }} />
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300">
            <Cake size={14} />
            {birthdayProgress.daysUntil} days until your next birthday · {birthdayProgress.weekday}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {pills.map((p, i) => (
            <Pill key={i}>{p}</Pill>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard icon={Timer} iconColor="text-amber-500" title="Age in Units">
          <div className="grid grid-cols-2 gap-3">
            <StatTile value={compactNumber(units.months)} label="Months" />
            <StatTile value={compactNumber(units.weeks)} label="Weeks" />
            <StatTile value={compactNumber(units.days)} label="Days" />
            <StatTile value={compactNumber(units.hours)} label="Hours" />
            <StatTile value={compactNumber(units.minutes)} label="Minutes" />
            <StatTile value={compactNumber(units.seconds)} label="Seconds" />
          </div>
        </SectionCard>

        <SectionCard icon={Star} iconColor="text-indigo-500" title="Birth Info">
          <div>
            {birthInfo.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </SectionCard>

        <SectionCard icon={Sparkles} iconColor="text-fuchsia-500" title="Fun Ages">
          <div>
            {funAges.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </SectionCard>

        <SectionCard icon={TrendingUp} iconColor="text-emerald-500" title="Life Progress">
          <div>
            {lifeProgress.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export { dateFmt, weekdayFmt };
