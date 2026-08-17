import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { News01Icon, TagsIcon, Message01Icon } from "@hugeicons/core-free-icons";
import { dctoolsApi } from "../../config/api";

const CARDS = [
  { key: "posts", label: "Blog Posts", icon: News01Icon, path: "/dctools/blogs", endpoint: "/admin/posts" },
  { key: "categories", label: "Categories", icon: TagsIcon, path: "/dctools/categories", endpoint: "/admin/categories" },
  { key: "feedback", label: "Feedback", icon: Message01Icon, path: "/dctools/feedback", endpoint: "/admin/feedback" },
];

export default function Overview() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    CARDS.forEach((card) => {
      dctoolsApi
        .get(card.endpoint, { params: { limit: 1 } })
        .then((res) => {
          const total = res.data.total ?? res.data.categories?.length ?? 0;
          setCounts((prev) => ({ ...prev, [card.key]: total }));
        })
        .catch(() => setCounts((prev) => ({ ...prev, [card.key]: null })));
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dc Tools Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            to={card.path}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
          >
            <HugeiconsIcon icon={card.icon} size={20} className="text-indigo-600 dark:text-indigo-400 mb-3" />
            <p className="text-3xl font-bold">{counts[card.key] ?? "—"}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
