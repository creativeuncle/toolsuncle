import { CheckCircle2, AlertTriangle } from "lucide-react";

function DoshaCard({ title, present, description, presentText, absentText }) {
  return (
    <div
      className={`rounded-xl border px-5 py-4 ${
        present
          ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-500/10"
          : "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-500/10"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {present ? (
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
        ) : (
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
        )}
        <h4 className="font-semibold">{title}</h4>
        <span
          className={`ml-auto text-xs font-semibold rounded-full px-2.5 py-1 ${
            present
              ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
          }`}
        >
          {present ? "Present" : "Not Present"}
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5">{present ? presentText : absentText}</p>
    </div>
  );
}

export default function DoshaTab({ mangal, kaalSarp }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
      <h3 className="font-semibold mb-1">Dosha Analysis</h3>
      <DoshaCard
        title="Mangal Dosha (Kuja Dosha)"
        present={mangal.present}
        description="Occurs when Mars is placed in houses 1, 2, 4, 7, 8, or 12 counted from the Ascendant."
        presentText={`Mars is in house ${mangal.house} from your Ascendant, which is one of the Mangal Dosha houses. Many astrologers suggest checking compatibility carefully for marriage matters, or performing remedial measures.`}
        absentText={`Mars is in house ${mangal.house} from your Ascendant, which is outside the Mangal Dosha houses — no Mangal Dosha by this rule.`}
      />
      <DoshaCard
        title="Kaal Sarp Dosha"
        present={kaalSarp.present}
        description="Occurs when all seven classical planets fall between Rahu and Ketu on one side of the chart."
        presentText="All the classical planets fall on one side of the Rahu-Ketu axis, indicating Kaal Sarp Dosha. This is traditionally considered significant and often calls for remedial measures."
        absentText="Your classical planets are spread on both sides of the Rahu-Ketu axis — no Kaal Sarp Dosha."
      />
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Dosha analysis follows traditional rule-based checks and is meant for general reference — consult a
        qualified astrologer for important life decisions.
      </p>
    </div>
  );
}
