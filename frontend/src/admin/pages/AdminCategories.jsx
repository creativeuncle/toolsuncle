import { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash2, Check } from "lucide-react";
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

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editError, setEditError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditError("");
  };

  const saveEdit = async (id) => {
    setEditError("");
    try {
      await adminApi.put(`/admin/categories/${id}`, { name: editingName });
      setEditingId(null);
      await load();
    } catch (err) {
      setEditError(err.response?.data?.error || "Failed to update category");
    }
  };

  const handleDelete = async (cat) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete "${cat.name}"?`)) return;

    setDeletingId(cat._id);
    setError("");
    try {
      await adminApi.delete(`/admin/categories/${cat._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete category");
    } finally {
      setDeletingId(null);
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
          <div key={cat._id} className="flex items-center gap-3 px-5 py-3.5">
            {editingId === cat._id ? (
              <>
                <div className="flex-1">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {editError && <p className="mt-1 text-xs text-red-500">{editError}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => saveEdit(cat._id)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium">{cat.name}</span>
                <button
                  type="button"
                  onClick={() => startEdit(cat)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat)}
                  disabled={deletingId === cat._id}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
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
