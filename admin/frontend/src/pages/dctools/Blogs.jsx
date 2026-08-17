import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { dctoolsApi, extractErrorMessage } from "../../config/api";

const PAGE_SIZE = 20;

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadPage = async (pageNum, append) => {
    setLoading(true);
    setError("");
    try {
      const res = await dctoolsApi.get("/admin/posts", { params: { page: pageNum, limit: PAGE_SIZE } });
      setPosts((prev) => (append ? [...prev, ...res.data.posts] : res.data.posts));
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

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    setDeletingId(post._id);
    try {
      await dctoolsApi.delete(`/admin/posts/${post._id}`);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Blogs</h1>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
        {posts.map((post) => (
          <div key={post._id} className="flex items-center gap-4 px-5 py-4">
            {post.thumbnailUrl ? (
              <img src={post.thumbnailUrl} alt="" className="h-12 w-16 rounded-lg object-cover shrink-0 bg-slate-100 dark:bg-slate-800" />
            ) : (
              <div className="h-12 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{post.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {post.category?.name || "Uncategorized"} · By: {post.author}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(post)}
              disabled={deletingId === post._id}
              title="Delete"
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors disabled:opacity-50 shrink-0"
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </button>
          </div>
        ))}

        {!loading && posts.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No posts yet.</p>
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
