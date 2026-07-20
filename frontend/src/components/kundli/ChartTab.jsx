import { RASHIS } from "../../utils/kundliCalculations";

const PLANET_ABBR = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
  Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke", Ascendant: "As",
};

const HOUSE_LABEL_POS = [
  { x: 150, y: 45 }, { x: 90, y: 45 }, { x: 45, y: 90 }, { x: 55, y: 150 },
  { x: 45, y: 210 }, { x: 90, y: 255 }, { x: 150, y: 255 }, { x: 210, y: 255 },
  { x: 255, y: 210 }, { x: 245, y: 150 }, { x: 255, y: 90 }, { x: 210, y: 45 },
];

export default function ChartTab({ ascRashiIdx, planetsByHouse }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="font-semibold mb-4">Lagna Chart (North Indian style)</h3>
      <div className="flex justify-center">
        <svg viewBox="0 0 300 300" className="w-full max-w-md">
          <rect x="0" y="0" width="300" height="300" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-slate-600" />
          <line x1="0" y1="0" x2="300" y2="300" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-slate-600" />
          <line x1="300" y1="0" x2="0" y2="300" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-slate-600" />
          <line x1="150" y1="0" x2="300" y2="150" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-slate-600" />
          <line x1="300" y1="150" x2="150" y2="300" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-slate-600" />
          <line x1="150" y1="300" x2="0" y2="150" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-slate-600" />
          <line x1="0" y1="150" x2="150" y2="0" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-slate-600" />

          {HOUSE_LABEL_POS.map((pos, i) => {
            const houseNum = i + 1;
            const rashiIdx = (ascRashiIdx + houseNum - 1) % 12;
            const planets = planetsByHouse[houseNum] || [];
            return (
              <g key={houseNum}>
                <text x={pos.x} y={pos.y - 14} textAnchor="middle" fontSize="9" className="fill-slate-400 dark:fill-slate-500">
                  {rashiIdx + 1}
                </text>
                {planets.map((p, pi) => (
                  <text
                    key={p}
                    x={pos.x}
                    y={pos.y + pi * 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    className="fill-indigo-600 dark:fill-indigo-400"
                  >
                    {PLANET_ABBR[p] || p}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
        House 1 (Ascendant) = {RASHIS[ascRashiIdx]}. Numbers show which sign occupies each house.
      </p>
    </div>
  );
}
