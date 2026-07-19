import { FileText, Image as ImageIcon, Sparkles, Type, Wrench, Receipt, FileUser, SquarePlay, IdCard } from "lucide-react";
import { tools } from "./tools";

const categoryMeta = [
  {
    slug: "pdf-tools",
    name: "PDF Tools",
    icon: FileText,
    color: "from-orange-500 to-amber-400",
  },
  {
    slug: "image-tools",
    name: "Image Tools",
    icon: ImageIcon,
    color: "from-emerald-500 to-teal-400",
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    icon: Sparkles,
    color: "from-fuchsia-500 to-pink-400",
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    icon: Type,
    color: "from-blue-500 to-indigo-400",
  },
  {
    slug: "utilities",
    name: "Utilities",
    icon: Wrench,
    color: "from-slate-700 to-slate-500",
  },
  {
    slug: "business-tools",
    name: "Business Tools",
    icon: Receipt,
    color: "from-green-600 to-emerald-500",
  },
  {
    slug: "career-tools",
    name: "Career Tools",
    icon: FileUser,
    color: "from-blue-600 to-cyan-500",
  },
  {
    slug: "creator-tools",
    name: "Creator Tools",
    icon: SquarePlay,
    color: "from-red-600 to-rose-500",
  },
  {
    slug: "design-tools",
    name: "Design Tools",
    icon: IdCard,
    color: "from-violet-600 to-fuchsia-500",
  },
];

export const categories = categoryMeta
  .map((cat) => {
    const catTools = tools.filter((t) => t.categorySlug === cat.slug);
    return {
      ...cat,
      count: catTools.length,
      summary: catTools.map((t) => t.name).join(", "),
    };
  })
  .filter((cat) => cat.count > 0);
