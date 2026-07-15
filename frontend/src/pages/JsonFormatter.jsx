import { useState } from "react";
import { Copy, Check, Wand2, Minimize2 } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";

const tool = tools.find((t) => t.id === "json-formatter");

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = (indent) => {
    if (!input.trim()) {
      setError("");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <label className="block text-sm font-medium mb-1.5">Paste your JSON</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        placeholder='{"name": "Dctools", "tools": 14}'
        spellCheck={false}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={() => format(2)}>
          <Wand2 size={16} />
          Format & Validate
        </Button>
        <Button variant="secondary" onClick={() => format(0)}>
          <Minimize2 size={16} />
          Minify
        </Button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          Invalid JSON: {error}
        </div>
      )}

      {!error && output && (
        <div className="mt-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400">
          Valid JSON
        </div>
      )}

      {output && (
        <div className="mt-4 relative">
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-slate-800/90 dark:bg-slate-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <pre className="w-full max-h-[420px] overflow-auto rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 font-mono text-sm whitespace-pre-wrap break-words">
            {output}
          </pre>
        </div>
      )}
    </ToolPageShell>
  );
}
