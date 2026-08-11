import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, SquareLock02Icon } from "@hugeicons/core-free-icons";
import { SEVERITY_META } from "../config/categories";

export default function IssueCard({ issue }) {
  const severity = SEVERITY_META[issue.severity] || SEVERITY_META.low;

  return (
    <div className="rounded-xl border border-[#232823] bg-[#101210] p-4">
      <div className="flex items-start gap-2 mb-2">
        <HugeiconsIcon icon={AlertCircleIcon} size={17} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="font-semibold text-sm text-white leading-snug">{issue.title}</p>
      </div>
      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${severity.className}`}>
        {severity.label}
      </span>
      <p className="mt-2.5 text-sm text-[#a3ada3] leading-relaxed">{issue.description}</p>
      <div className="mt-3 pt-3 border-t border-[#1c211c] flex items-center gap-1.5 text-xs text-[#6b7a6b]">
        <HugeiconsIcon icon={SquareLock02Icon} size={13} />
        AI fix available on upgrade
      </div>
    </div>
  );
}
