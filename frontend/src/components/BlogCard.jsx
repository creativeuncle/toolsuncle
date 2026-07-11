export default function BlogCard({ post }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-none dark:hover:border-slate-700">
      <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <span className="inline-block rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-3">
          {post.category}
        </span>
        <h3 className="text-base font-semibold mb-1.5 leading-snug">{post.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {post.description}
        </p>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">By: {post.author}</p>
      </div>
    </article>
  );
}
