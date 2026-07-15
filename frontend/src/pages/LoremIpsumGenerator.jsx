import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import { generateTitle, generateParagraphs, generateList } from "../utils/loremIpsum";

const tool = tools.find((t) => t.id === "lorem-ipsum-generator");

const MODES = [
  { id: "title", label: "Title" },
  { id: "paragraph", label: "Paragraph" },
  { id: "list", label: "List" },
];

export default function LoremIpsumGenerator() {
  const [mode, setMode] = useState("paragraph");
  const [count, setCount] = useState(3);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (mode === "title") setResult({ type: "title", value: generateTitle(count) });
    else if (mode === "paragraph") setResult({ type: "paragraph", value: generateParagraphs(count) });
    else setResult({ type: "list", value: generateList(count) });
    setCopied(false);
  };

  const asPlainText = () => {
    if (!result) return "";
    if (result.type === "paragraph") return result.value.join("\n\n");
    if (result.type === "list") return result.value.map((item) => `- ${item}`).join("\n");
    return result.value;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(asPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const countLabel = mode === "title" ? "Words" : mode === "paragraph" ? "Paragraphs" : "Items";

  return (
    <ToolPageShell
      icon={tool.icon}
      color={tool.color}
      title={tool.name}
      description={tool.description}
    >
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Type</label>
          <div className="flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  mode === m.id
                    ? "bg-indigo-600 text-white"
                    : "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">{countLabel}</label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <Button onClick={handleGenerate}>Generate</Button>
      </div>

      {result && (
        <div className="mt-6 rounded-xl bg-slate-100 dark:bg-slate-800 p-5 relative">
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 text-slate-400 hover:text-indigo-500"
            title="Copy"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>

          {result.type === "title" && (
            <h2 className="text-lg font-semibold pr-8">{result.value}</h2>
          )}
          {result.type === "paragraph" && (
            <div className="space-y-3 pr-8">
              {result.value.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {p}
                </p>
              ))}
            </div>
          )}
          {result.type === "list" && (
            <ul className="list-disc pl-5 space-y-1.5 pr-8">
              {result.value.map((item, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-300">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </ToolPageShell>
  );
}
