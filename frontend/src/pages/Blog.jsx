import { useState } from "react";
import { blogPosts } from "../config/blogPosts";
import BlogCard from "../components/BlogCard";
import Button from "../components/Button";

const PAGE_SIZE = 12;

export default function Blog() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visiblePosts = blogPosts.slice(0, visibleCount);
  const hasMore = visibleCount < blogPosts.length;

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Blog</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Tips, guides, and ideas on getting more out of your files.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>Load More</Button>
        </div>
      )}
    </div>
  );
}
