import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, RotateCcw, LayoutGrid, Orbit, HeartPulse, Trophy, UserRound, Users } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import OverviewTab from "../components/age-calculator/OverviewTab";
import PlanetsTab from "../components/age-calculator/PlanetsTab";
import LifeStatsTab from "../components/age-calculator/LifeStatsTab";
import MilestonesTab from "../components/age-calculator/MilestonesTab";
import GovtJobsTab from "../components/age-calculator/GovtJobsTab";
import CompareTab from "../components/age-calculator/CompareTab";
import {
  parseDateLocal,
  combineDateTime,
  diffYMD,
  msBreakdown,
  getZodiac,
  getChineseZodiac,
  getBirthstone,
  getBirthFlower,
  getSeason,
  getGeneration,
  getNurseryRhyme,
  getWeekdayName,
  isLeapYear,
  dogYears,
  catYears,
  koreanAge,
  getNextBirthday,
  getLastBirthday,
  getHalfBirthday,
  LEGAL_MILESTONES,
  LIFE_MILESTONES,
} from "../utils/ageCalculations";

const tool = tools.find((t) => t.id === "age-calculator");

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const dateFmtLong = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const weekdayFmt = new Intl.DateTimeFormat("en-US", { weekday: "long" });

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "planets", label: "Planets", icon: Orbit },
  { id: "life-stats", label: "Life Stats", icon: HeartPulse },
  { id: "milestones", label: "Milestones", icon: Trophy },
  { id: "govt-jobs", label: "Govt Jobs", icon: UserRound },
  { id: "compare", label: "Compare", icon: Users },
];

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [ageOnDate, setAgeOnDate] = useState(todayStr());
  const [tab, setTab] = useState("overview");
  const [now, setNow] = useState(new Date());

  const isLive = ageOnDate === todayStr();

  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [isLive]);

  const birth = useMemo(() => combineDateTime(dob, tob), [dob, tob]);
  const target = useMemo(() => (isLive ? now : combineDateTime(ageOnDate, null)), [isLive, now, ageOnDate]);

  const handleReset = () => {
    setDob("");
    setTob("");
    setAgeOnDate(todayStr());
  };

  const data = useMemo(() => {
    if (!birth || !target || target < birth) return null;

    const ymd = diffYMD(birth, target);
    const totalMs = target - birth;
    const live = msBreakdown(totalMs);
    const totalDaysDecimal = totalMs / 86400000;

    const totalDays = live.days;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = ymd.years * 12 + ymd.months;
    const totalHours = Math.floor(totalMs / 3600000);
    const totalMinutes = Math.floor(totalMs / 60000);
    const totalSeconds = Math.floor(totalMs / 1000);

    const month = birth.getMonth();
    const day = birth.getDate();
    const dow = birth.getDay();
    const zodiac = getZodiac(month + 1, day);
    const chinese = getChineseZodiac(birth.getFullYear());
    const season = getSeason(month);

    const lastBirthday = getLastBirthday(birth, target);
    const nextBirthday = getNextBirthday(birth, target);
    const birthdayProgress = {
      pct: Math.min(100, Math.max(0, ((target - lastBirthday) / (nextBirthday - lastBirthday)) * 100)),
      daysUntil: Math.ceil((nextBirthday - target) / 86400000),
      weekday: weekdayFmt.format(nextBirthday),
    };

    const decimalAge = totalDaysDecimal / 365.2425;
    const halfBirthday = getHalfBirthday(birth, target);

    const retirementDate = new Date(birth.getFullYear() + 60, month, day);
    const nextRoundAge = Math.ceil((ymd.years + 1) / 10) * 10;
    const nextRoundDate = new Date(birth.getFullYear() + nextRoundAge, month, day);

    const pills = [
      `📅 Born ${getWeekdayName(dow)}`,
      `${zodiac.symbol} ${zodiac.sign}`,
      `${chinese.emoji} ${chinese.animal}`,
      getGeneration(birth.getFullYear()),
      `${decimalAge.toFixed(2)} yrs`,
      `Korean Age: ${koreanAge(birth.getFullYear(), target.getFullYear())}`,
    ];

    const birthInfo = [
      { label: "Born on", value: getWeekdayName(dow) },
      { label: "Season", value: `${season.name} ${season.emoji}` },
      { label: "Zodiac", value: `${zodiac.sign} (${zodiac.element}) ${zodiac.symbol}` },
      { label: "Trait", value: zodiac.trait },
      { label: "Chinese Zodiac", value: `${chinese.animal} ${chinese.emoji}` },
      { label: "Birthstone", value: getBirthstone(month) },
      { label: "Birth Flower", value: getBirthFlower(month) },
      { label: "Generation", value: getGeneration(birth.getFullYear()) },
      { label: "Leap Year", value: isLeapYear(birth.getFullYear()) ? "Yes" : "No" },
      { label: "Nursery Rhyme", value: getNurseryRhyme(dow) },
    ];

    const funAges = [
      { label: "Dog Years", value: `${dogYears(decimalAge).toFixed(1)} yrs` },
      { label: "Cat Years", value: `${catYears(decimalAge).toFixed(1)} yrs` },
      { label: "Korean Age", value: koreanAge(birth.getFullYear(), target.getFullYear()) },
      { label: "Decimal Age", value: `${decimalAge.toFixed(2)} yrs` },
      { label: "Moon Cycles", value: Math.floor(totalDaysDecimal / 29.53).toLocaleString() },
      { label: "Half Birthday", value: dateFmtLong.format(halfBirthday) },
    ];

    const lifeProgress = [
      {
        label: "Retirement (60)",
        value: retirementDate <= target ? "Reached!" : dateFmtLong.format(retirementDate),
      },
      { label: `Next round birthday (${nextRoundAge})`, value: dateFmtLong.format(nextRoundDate) },
    ];

    const lifeMilestones = LIFE_MILESTONES.map((m) => {
      const date = new Date(birth.getTime() + (m.unit === "days" ? m.value * 86400000 : m.value * 1000));
      const reached = date <= target;
      return { ...m, date, reached, daysUntil: reached ? 0 : Math.ceil((date - target) / 86400000) };
    });

    const legalMilestones = LEGAL_MILESTONES.map((m) => ({ ...m, reached: ymd.years >= m.age }));

    const lifeStats = [
      { label: "Heartbeats", value: (totalMinutes * 70).toLocaleString(), emoji: "❤️" },
      { label: "Breaths", value: (totalMinutes * 16).toLocaleString(), emoji: "🫁" },
      { label: "Nights Slept", value: totalDays.toLocaleString(), emoji: "🌙" },
      { label: "Meals Eaten", value: (totalDays * 3).toLocaleString(), emoji: "🍽️" },
      { label: "Steps Walked", value: (totalDays * 5000).toLocaleString(), emoji: "👣" },
      { label: "Blinks", value: Math.round(totalDays * 16 * 60 * 15).toLocaleString(), emoji: "👁️" },
      { label: "Dreams", value: (totalDays * 4).toLocaleString(), emoji: "💭" },
      { label: "Laughs", value: (totalDays * 15).toLocaleString(), emoji: "😄" },
      { label: "Moon Cycles", value: Math.floor(totalDaysDecimal / 29.53).toLocaleString(), emoji: "🌕" },
      { label: "Earth Orbits", value: ymd.years.toLocaleString(), emoji: "🌍" },
    ];

    return {
      ymd,
      live,
      birthdayProgress,
      pills,
      units: {
        months: totalMonths,
        weeks: totalWeeks,
        days: totalDays,
        hours: totalHours,
        minutes: totalMinutes,
        seconds: totalSeconds,
      },
      birthInfo,
      funAges,
      lifeProgress,
      totalDaysDecimal,
      lifeMilestones,
      legalMilestones,
      lifeStats,
    };
  }, [birth, target]);

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <div className="max-w-5xl space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="font-semibold mb-4">Your details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>
                <Calendar size={13} />
                Date of Birth
              </label>
              <input type="date" value={dob} max={todayStr()} onChange={(e) => setDob(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>
                <Clock size={13} />
                Time of birth (optional)
              </label>
              <input type="time" value={tob} onChange={(e) => setTob(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>
                <Calendar size={13} />
                Age on Date
              </label>
              <input
                type="date"
                value={ageOnDate}
                onChange={(e) => setAgeOnDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </div>

        {data && (
          <>
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    tab === t.id
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <t.icon size={15} />
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "overview" && <OverviewTab data={data} isLive={isLive} />}
            {tab === "planets" && <PlanetsTab totalDaysDecimal={data.totalDaysDecimal} />}
            {tab === "life-stats" && <LifeStatsTab stats={data.lifeStats} />}
            {tab === "milestones" && (
              <MilestonesTab lifeMilestones={data.lifeMilestones} legalMilestones={data.legalMilestones} />
            )}
            {tab === "govt-jobs" && <GovtJobsTab age={data.ymd.years} />}
            {tab === "compare" && <CompareTab birth={birth} target={target} />}
          </>
        )}

        {!data && dob && (
          <p className="text-sm text-red-500">"Age on Date" can't be before the date of birth.</p>
        )}
      </div>
    </ToolPageShell>
  );
}
