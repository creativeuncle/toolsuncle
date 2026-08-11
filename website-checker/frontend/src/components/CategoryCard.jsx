import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { CATEGORY_META } from "../config/categories";
import IssueCard from "./IssueCard";

function scoreColor(score) {
  if (score >= 80) return "text-[#7cff6b]";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}

export default function CategoryCard({ category }) {
  const meta = CATEGORY_META[category.id];

  return (
    <div className="rounded-2xl border border-[#1c211c] bg-[#0c0e0c] p-4 flex flex-col">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-1 h-5 rounded-full shrink-0" style={{ backgroundColor: meta?.color }} />
        <HugeiconsIcon icon={meta?.icon} size={18} style={{ color: meta?.color }} className="shrink-0" />
        <h3 className="font-semibold text-white flex-1">{category.name}</h3>
        <span className="rounded-full bg-[#1c211c] text-[#a3ada3] text-xs font-semibold w-6 h-6 flex items-center justify-center">
          {category.issueCount}
        </span>
        <span className={`text-sm font-bold ${scoreColor(category.score)}`}>{category.score}</span>
      </div>

      {category.issues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} className="text-[#7cff6b]" />
          <p className="text-sm text-[#a3ada3]">No issues found in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {category.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      {category.comingSoon?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#1c211c]">
          <p className="text-[11px] uppercase tracking-wide text-[#5a6a5a] font-semibold mb-1.5">Coming soon</p>
          <ul className="space-y-1">
            {category.comingSoon.map((item) => (
              <li key={item} className="text-xs text-[#6b7a6b]">
                · {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
