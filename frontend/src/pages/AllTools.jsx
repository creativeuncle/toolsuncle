import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { tools } from "../config/tools";
import { categories } from "../config/categories";
import ToolCard from "../components/ToolCard";

export default function AllTools() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const visibleTools = useMemo(
    () => (categorySlug ? tools.filter((t) => t.categorySlug === categorySlug) : tools),
    [categorySlug]
  );

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {activeCategory ? activeCategory.name : "All Tools"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {activeCategory
            ? `${visibleTools.length} tool${visibleTools.length !== 1 ? "s" : ""} in this category.`
            : `Browse all ${tools.length} tools.`}
        </p>
        {activeCategory && (
          <Link
            to="/tools"
            className="inline-block mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400"
          >
            ← View all tools
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
