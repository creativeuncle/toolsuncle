import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../config/api";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/posts/${slug}`)
      .then((res) => setPost(res.data.post))
      .catch(() => setError("This post couldn't be found."))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = post.seoTitle || post.title;
    }
    return () => {
      document.title = "Dctools — Free Tools to Make Everything Simple";
    };
  }, [post]);

  if (loading) return null;

  if (error || !post) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
        <Link to="/blog" className="text-indigo-600 dark:text-indigo-400 font-medium">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Link
        to="/blog"
        className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        ← Back to Blog
      </Link>

      <div className="mt-4 mb-6">
        {post.categorySlug && (
          <Link
            to={`/blog/category/${post.categorySlug}`}
            className="inline-block rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-4 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
          >
            {post.category}
          </Link>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{post.title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          By {post.author} · {formatDate(post.createdAt)}
        </p>
      </div>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded-2xl mb-8 bg-slate-100 dark:bg-slate-800 object-cover max-h-96"
        />
      )}

      <div className="rte-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
