import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
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
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState("");
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prompts, setPrompts] = useState([]);

  const handleGenerate = async () => {
    setError("");
    setPrompts([]);
    setLoading(true);
    try {
      const res = await api.post("/tools/ai-prompt-generator", { idea, style, count });
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
      description={tool.description}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Image idea</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={3}
            placeholder="e.g. a lighthouse on a stormy cliff at night"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Style (optional)</label>
            <input
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g. watercolor"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
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
        </div>
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
        <Button onClick={handleGenerate} loading={loading} disabled={!idea.trim()}>
          Generate Prompts
        </Button>
      </div>
    </ToolPageShell>
  );
}
