import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockPasswordIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import { dctoolsApi, setToken, extractErrorMessage } from "../config/api";

export default function Login() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await dctoolsApi.post("/admin/auth/login", { password });
      setToken(data.token);
      navigate("/dctools");
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto mb-5">
          <HugeiconsIcon icon={LockPasswordIcon} size={22} />
        </div>
        <h1 className="text-xl font-semibold text-center mb-1">Super Admin</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">Sign in to manage dctools.in</p>

        <label className="block text-sm font-medium mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
        >
          {loading && <HugeiconsIcon icon={Loading03Icon} size={16} className="animate-spin" />}
          Sign in
        </button>
      </form>
    </div>
  );
}
