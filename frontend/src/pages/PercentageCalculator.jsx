import { useMemo, useState } from "react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";

const tool = tools.find((t) => t.id === "percentage-calculator");

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-sm font-semibold mb-1.5";

const numFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 4 });
const fmt = (n) => (Number.isFinite(n) ? numFmt.format(n) : "—");

function ResultCard({ value, label, color = "text-indigo-600 dark:text-indigo-400" }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-1 text-center">
      <p className="text-3xl sm:text-4xl font-bold">{value}</p>
      <p className={`text-sm font-medium ${color}`}>{label}</p>
    </div>
  );
}

const MODES = [
  { id: "of", label: "X% of Y" },
  { id: "isWhatPercent", label: "X is what % of Y" },
  { id: "change", label: "% Increase / Decrease" },
  { id: "findWhole", label: "X is P% of what" },
];

function OfMode() {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const result = useMemo(() => (parseFloat(x) / 100) * parseFloat(y), [x, y]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Percentage (%)</label>
          <input type="number" value={x} onChange={(e) => setX(e.target.value)} placeholder="e.g. 20" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Of number</label>
          <input type="number" value={y} onChange={(e) => setY(e.target.value)} placeholder="e.g. 250" className={inputClass} />
        </div>
      </div>
      <ResultCard value={fmt(result)} label={`${x || 0}% of ${y || 0}`} />
    </>
  );
}

function IsWhatPercentMode() {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const result = useMemo(() => (parseFloat(x) / parseFloat(y)) * 100, [x, y]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>X</label>
          <input type="number" value={x} onChange={(e) => setX(e.target.value)} placeholder="e.g. 50" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Of Y</label>
          <input type="number" value={y} onChange={(e) => setY(e.target.value)} placeholder="e.g. 200" className={inputClass} />
        </div>
      </div>
      <ResultCard value={`${fmt(result)}%`} label={`${x || 0} is this % of ${y || 0}`} />
    </>
  );
}

function ChangeMode() {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const result = useMemo(() => ((parseFloat(y) - parseFloat(x)) / parseFloat(x)) * 100, [x, y]);
  const isIncrease = result >= 0;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>From (original value)</label>
          <input type="number" value={x} onChange={(e) => setX(e.target.value)} placeholder="e.g. 80" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>To (new value)</label>
          <input type="number" value={y} onChange={(e) => setY(e.target.value)} placeholder="e.g. 100" className={inputClass} />
        </div>
      </div>
      <ResultCard
        value={`${Number.isFinite(result) ? (result >= 0 ? "+" : "") + fmt(result) : "—"}%`}
        label={Number.isFinite(result) ? (isIncrease ? "Percentage increase" : "Percentage decrease") : "Enter values"}
        color={Number.isFinite(result) ? (isIncrease ? "text-emerald-600 dark:text-emerald-400" : "text-red-500") : undefined}
      />
    </>
  );
}

function FindWholeMode() {
  const [x, setX] = useState("");
  const [p, setP] = useState("");
  const result = useMemo(() => parseFloat(x) / (parseFloat(p) / 100), [x, p]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>X</label>
          <input type="number" value={x} onChange={(e) => setX(e.target.value)} placeholder="e.g. 40" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Is this % (P) of the total</label>
          <input type="number" value={p} onChange={(e) => setP(e.target.value)} placeholder="e.g. 25" className={inputClass} />
        </div>
      </div>
      <ResultCard value={fmt(result)} label={`${x || 0} is ${p || 0}% of this number`} />
    </>
  );
}

const MODE_COMPONENTS = {
  of: OfMode,
  isWhatPercent: IsWhatPercentMode,
  change: ChangeMode,
  findWhole: FindWholeMode,
};

export default function PercentageCalculator() {
  const [mode, setMode] = useState("of");
  const ModeComponent = MODE_COMPONENTS[mode];

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <div className="flex flex-wrap gap-2 mb-6">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              mode === m.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <ModeComponent />
    </ToolPageShell>
  );
}
