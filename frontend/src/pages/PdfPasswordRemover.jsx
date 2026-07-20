import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import FileDropzone from "../components/FileDropzone";
import Button from "../components/Button";
import { api, downloadBlob, extractErrorMessage } from "../config/api";

const tool = tools.find((t) => t.id === "pdf-password-remover");

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

export default function PdfPasswordRemover() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnlock = async () => {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", files[0]);
      formData.append("password", password);

      const res = await api.post("/tools/pdf-password-remover", formData, {
        responseType: "blob",
      });
      downloadBlob(res.data, "unlocked.pdf");
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <FileDropzone
        files={files}
        onChange={setFiles}
        accept={{ "application/pdf": [".pdf"] }}
        multiple={false}
        label="Drag & drop a password-protected PDF here, or click to select"
      />

      <div className="mt-4">
        <label className={labelClass}>PDF Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter the current password"
            className={`${inputClass} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
          You need to know the PDF's current password — this tool removes it, it doesn't crack unknown passwords.
        </p>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex justify-end">
        <Button onClick={handleUnlock} loading={loading} disabled={files.length === 0 || !password}>
          Remove Password
        </Button>
      </div>
    </ToolPageShell>
  );
}
