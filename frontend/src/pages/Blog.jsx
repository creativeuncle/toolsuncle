import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Button from "../components/Button";
import { api } from "../config/api";

const PAGE_SIZE = 12;

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPage = async (pageNum, append) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/posts", { params: { page: pageNum, limit: PAGE_SIZE } });
      setPosts((prev) => (append ? [...prev, ...res.data.posts] : res.data.posts));
      setHasMore(res.data.hasMore);
      setPage(pageNum);
    } catch {
      setError("Couldn't load blog posts right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1, false);
  }, []);

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Blog</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Tips, guides, and ideas on getting more out of your files.
        </p>
      </div>

      {error && <p className="text-center text-sm text-red-500 mb-6">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {!loading && posts.length === 0 && !error && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          No posts yet — check back soon.
        </p>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button onClick={() => loadPage(page + 1, true)} loading={loading}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
