import { PLANETS } from "../../utils/ageCalculations";

export default function PlanetsTab({ totalDaysDecimal }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="font-semibold mb-1">Your Age on Other Planets</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Each planet has a different orbital period. Here is how old you would be if you lived there.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANETS.map((planet) => {
          const age = totalDaysDecimal / planet.orbitalDays;
          return (
            <div
              key={planet.name}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 text-center"
            >
              <p className="text-2xl">{planet.emoji}</p>
              <p className="mt-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">{age.toFixed(2)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{planet.name} years</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
