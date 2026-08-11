import {
  Shield01Icon,
  Search01Icon,
  AiMagicIcon,
  ZapIcon,
  UniversalAccessIcon,
  ClipboardListIcon,
  Bug01Icon,
  PaintBrush01Icon,
} from "@hugeicons/core-free-icons";

export const CATEGORY_META = {
  security: { icon: Shield01Icon, color: "#7cff6b" },
  seo: { icon: Search01Icon, color: "#5ee6d0" },
  aeo: { icon: AiMagicIcon, color: "#b98bff" },
  performance: { icon: ZapIcon, color: "#ffd166" },
  accessibility: { icon: UniversalAccessIcon, color: "#6fb1ff" },
  completeness: { icon: ClipboardListIcon, color: "#8ea2ff" },
  technical: { icon: Bug01Icon, color: "#ff8b7c" },
  design: { icon: PaintBrush01Icon, color: "#ff8bd0" },
};

export const SEVERITY_META = {
  critical: { label: "Critical", className: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  medium: { label: "Medium", className: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  low: { label: "Low", className: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
};
