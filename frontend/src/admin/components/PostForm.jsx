import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { adminApi } from "../adminApi";
import Button from "../../components/Button";

export default function PostForm({ initialPost, onSubmit, submitLabel }) {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState(initialPost?.title || "");
  const [category, setCategory] = useState(initialPost?.category?._id || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialPost?.thumbnailUrl || "");
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.get("/admin/categories").then((res) => setCategories(res.data.categories));
  }, []);

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !category || !content.trim()) {
      setError("Title, category, and content are required");
      return;
    }

    setSaving(true);
    try {
      let thumbnailUrl = initialPost?.thumbnailUrl || "";
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("image", thumbnailFile);
        const res = await adminApi.post("/admin/media", formData);
        thumbnailUrl = res.data.url;
      }

      await onSubmit({
        title,
        category,
        content,
        thumbnailUrl,
        seoTitle,
        seoDescription,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save post");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1.5">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Thumbnail</label>
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt=""
            className="h-32 w-full max-w-xs rounded-xl object-cover mb-3 bg-slate-100 dark:bg-slate-800"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 dark:file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200 dark:hover:file:bg-slate-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">SEO Title</label>
        <input
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">SEO Description</label>
        <textarea
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
