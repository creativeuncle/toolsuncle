import { HugeiconsIcon } from "@hugeicons/react";
import {
  LayersIcon,
  CodeIcon,
  ServerStackIcon,
  CloudIcon,
  Analytics01Icon,
  TextFontIcon,
  Message01Icon,
  CreditCardIcon,
  LockPasswordIcon,
} from "@hugeicons/core-free-icons";

const CATEGORY_ICONS = {
  cms: LayersIcon,
  frontend: CodeIcon,
  backend: ServerStackIcon,
  cdn: CloudIcon,
  analytics: Analytics01Icon,
  fonts: TextFontIcon,
  chat: Message01Icon,
  payment: CreditCardIcon,
  security: LockPasswordIcon,
};

export default function TechStackCard({ techStack }) {
  if (!techStack || techStack.groups.length === 0) {
    return (
      <div className="rounded-2xl border border-[#1c211c] bg-[#0c0e0c] p-5 mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <HugeiconsIcon icon={CodeIcon} size={18} className="text-[#7cff6b]" />
          <h3 className="font-semibold text-white">Technology Stack</h3>
        </div>
        <p className="text-sm text-[#6b7a6b]">No known technologies were fingerprinted on this page.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#1c211c] bg-[#0c0e0c] p-5 mb-8">
      <div className="flex items-center gap-2.5 mb-4">
        <HugeiconsIcon icon={CodeIcon} size={18} className="text-[#7cff6b]" />
        <h3 className="font-semibold text-white">Technology Stack</h3>
        <span className="text-xs text-[#6b7a6b]">{techStack.detectedCount} detected</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {techStack.groups.map((group) => (
          <div key={group.category}>
            <div className="flex items-center gap-1.5 mb-2">
              <HugeiconsIcon icon={CATEGORY_ICONS[group.category] || CodeIcon} size={14} className="text-[#6b7a6b]" />
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a6b]">{group.label}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#2a3a2a] bg-[#0d0f0d] px-2.5 py-1 text-xs text-[#c8d3c8]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 pt-4 border-t border-[#1c211c] text-xs text-[#5a6a5a]">
        Detected via pattern-matching on HTML, headers, and scripts — same approach as Wappalyzer/BuiltWith. May
        miss technologies that don't leave a public fingerprint.
      </p>
    </div>
  );
}
