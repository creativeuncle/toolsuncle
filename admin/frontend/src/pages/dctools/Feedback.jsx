import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { dctoolsApi, extractErrorMessage } from "../../config/api";

const PAGE_SIZE = 20;

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPage = async (pageNum, append) => {
    setLoading(true);
    setError("");
    try {
      const res = await dctoolsApi.get("/admin/feedback", { params: { page: pageNum, limit: PAGE_SIZE } });
      setFeedback((prev) => (append ? [...prev, ...res.data.feedback] : res.data.feedback));
      setHasMore(res.data.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1, false);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Feedback</h1>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
        {feedback.map((item) => (
          <Link
            key={item._id}
            to={`/dctools/feedback/${item._id}`}
            className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{item.name}</p>
                <span className="text-xs text-slate-400 dark:text-slate-500 truncate">{item.email}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.message}</p>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </Link>
        ))}

        {!loading && feedback.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No feedback submitted yet.</p>
        )}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => loadPage(page + 1, true)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {loading && <HugeiconsIcon icon={Loading03Icon} size={15} className="animate-spin" />}
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
