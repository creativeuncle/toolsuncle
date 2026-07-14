import { FileText, Image as ImageIcon, Sparkles } from "lucide-react";
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
];

export const categories = categoryMeta.map((cat) => {
  const catTools = tools.filter((t) => t.categorySlug === cat.slug);
  return {
    ...cat,
    count: catTools.length,
    summary: catTools.map((t) => t.name).join(", "),
  };
});
