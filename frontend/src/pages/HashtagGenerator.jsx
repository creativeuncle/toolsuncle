import { useState } from "react";
import { Copy, Check, Sparkles, RefreshCcw } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import { generateHashtags, CATEGORY_LABELS } from "../utils/hashtagBank";

const tool = tools.find((t) => t.id === "hashtag-generator");

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function HashtagGenerator() {
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("general");
  const [count, setCount] = useState(20);
  const [hashtags, setHashtags] = useState([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTag, setCopiedTag] = useState("");

  const handleGenerate = () => {
    if (!keywords.trim()) {
      setHashtags([]);
      return;
    }
    setHashtags(generateHashtags(keywords, category, count));
  };

  const handleCopyAll = async () => {
    if (!hashtags.length) return;
    await navigator.clipboard.writeText(hashtags.join(" "));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const handleCopyTag = async (tag) => {
    await navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(""), 1200);
  };

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Topic or keywords</label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows={2}
            placeholder="e.g. sunset photography, travel, beach"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Number of hashtags</label>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} className={inputClass}>
              {[10, 15, 20, 25, 30].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={handleGenerate}>
          <Sparkles size={16} />
          Generate Hashtags
        </Button>
      </div>

      {hashtags.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {hashtags.length} hashtags
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleGenerate}>
                <RefreshCcw size={14} />
                Shuffle
              </Button>
              <Button variant="secondary" onClick={handleCopyAll}>
                {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                {copiedAll ? "Copied" : "Copy All"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4">
            {hashtags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleCopyTag(tag)}
                title="Click to copy"
                className="rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
              >
                {copiedTag === tag ? "Copied!" : tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </ToolPageShell>
  );
}
