import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { adminApi } from "../adminApi";
import Button from "../../components/Button";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.get("/admin/categories");
      setCategories(res.data.categories);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await adminApi.post("/admin/categories", { name });
      setName("");
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(err.response?.data?.error || "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mb-6 flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
        >
          <div className="flex-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              autoFocus
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formError && <p className="mt-2 text-sm text-red-500">{formError}</p>}
          </div>
          <Button type="submit" loading={saving}>
            Save
          </Button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="rounded-xl p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
        {categories.map((cat) => (
          <div key={cat._id} className="px-5 py-3.5 text-sm font-medium">
            {cat.name}
          </div>
        ))}

        {!loading && categories.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            No categories yet. Click "Add Category" to create one.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
