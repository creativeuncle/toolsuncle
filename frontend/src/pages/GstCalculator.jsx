import { useMemo, useState } from "react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";

const tool = tools.find((t) => t.id === "gst-calculator");

const GST_RATES = [0, 5, 18, 40];

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-sm font-semibold mb-1.5";

const moneyFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
const rupee = (n) => `₹${moneyFmt.format(n)}`;

export default function GstCalculator() {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState(0);
  const [taxType, setTaxType] = useState("exclusive");

  const { actual, gst, total } = useMemo(() => {
    const value = parseFloat(amount) || 0;
    const rate = gstRate / 100;

    if (taxType === "inclusive") {
      const actualAmount = value / (1 + rate);
      const gstAmount = value - actualAmount;
      return { actual: actualAmount, gst: gstAmount, total: value };
    }

    const gstAmount = value * rate;
    return { actual: value, gst: gstAmount, total: value + gstAmount };
  }, [amount, gstRate, taxType]);

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Amount</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>GST %</label>
          <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className={inputClass}>
            {GST_RATES.map((rate) => (
              <option key={rate} value={rate}>
                {rate}%
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tax</label>
          <select value={taxType} onChange={(e) => setTaxType(e.target.value)} className={inputClass}>
            <option value="exclusive">Exclusive</option>
            <option value="inclusive">Inclusive</option>
          </select>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-center">
        <div>
          <p className="text-3xl sm:text-4xl font-bold">{rupee(actual)}</p>
          <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">Actual Amount</p>
        </div>
        <span className="text-2xl font-semibold text-slate-400">+</span>
        <div>
          <p className="text-3xl sm:text-4xl font-bold">{rupee(gst)}</p>
          <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">GST Amount</p>
        </div>
        <span className="text-2xl font-semibold text-slate-400">=</span>
        <div>
          <p className="text-3xl sm:text-4xl font-bold">{rupee(total)}</p>
          <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">Total Amount</p>
        </div>
      </div>
    </ToolPageShell>
  );
}
