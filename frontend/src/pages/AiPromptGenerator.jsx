import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import FileDropzone from "../components/FileDropzone";
import Button from "../components/Button";
import { api, extractErrorMessage } from "../config/api";

const tool = tools.find((t) => t.id === "ai-prompt-generator");

function PromptCard({ prompt }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm">
      <p className="leading-relaxed">{prompt}</p>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 text-slate-400 hover:text-indigo-500"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}

export default function AiPromptGenerator() {
  const [files, setFiles] = useState([]);
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prompts, setPrompts] = useState([]);

  const handleGenerate = async () => {
    setError("");
    setPrompts([]);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", files[0]);
      formData.append("count", count);

      const res = await api.post("/tools/ai-prompt-generator", formData);
      setPrompts(res.data.prompts || []);
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageShell
      icon={tool.icon}
      color={tool.color}
      title={tool.name}
      description="Upload an image and get AI image-generation prompts that describe it — no typing required."
    >
      <FileDropzone
        files={files}
        onChange={(f) => {
          setFiles(f);
          setPrompts([]);
        }}
        accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] }}
        multiple={false}
        label="Drag & drop an image here, or click to select"
      />

      <div className="mt-6 max-w-[160px]">
        <label className="block text-sm font-medium mb-1.5"># of prompts</label>
        <input
          type="number"
          min={1}
          max={10}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {prompts.length > 0 && (
        <div className="mt-6 space-y-2">
          {prompts.map((prompt, i) => (
            <PromptCard key={i} prompt={prompt} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button onClick={handleGenerate} loading={loading} disabled={files.length === 0}>
          Generate Prompts
        </Button>
      </div>
    </ToolPageShell>
  );
}
