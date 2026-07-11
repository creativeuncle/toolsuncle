import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi, setAdminToken } from "../adminApi";
import Button from "../../components/Button";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await adminApi.post("/admin/auth/login", { password });
      setAdminToken(res.data.token);
      navigate("/admin/blogs");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8"
      >
        <h1 className="text-xl font-semibold mb-1">Admin Login</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Sign in to manage Dctools content.
        </p>

        <label className="block text-sm font-medium mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <Button type="submit" loading={loading} className="w-full mt-6 justify-center">
          Log In
        </Button>
      </form>
    </div>
  );
}
