import { useMemo, useRef, useState } from "react";
import { Copy, Check, Share2, Download, Trash2, Settings } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import { downloadBlob } from "../config/api";
import { CASE_CONVERTERS } from "../utils/textCase";

const tool = tools.find((t) => t.id === "convert-case");

const BADGE_COLORS = {
  sentence: "bg-orange-600",
  lower: "bg-green-600",
  upper: "bg-sky-600",
  capitalized: "bg-purple-600",
  alternating: "bg-amber-600",
  title: "bg-emerald-600",
  inverse: "bg-pink-600",
};

const CLEANUP_ACTIONS = [
  {
    id: "trim",
    label: "Trim whitespace",
    fn: (text) => text.trim(),
  },
  {
    id: "extra-spaces",
    label: "Remove extra spaces",
    fn: (text) => text.replace(/[ \t]+/g, " "),
  },
  {
    id: "extra-lines",
    label: "Remove extra line breaks",
    fn: (text) => text.replace(/\n{3,}/g, "\n\n"),
  },
  {
    id: "all-lines",
    label: "Remove all line breaks",
    fn: (text) => text.replace(/\n+/g, " "),
  },
];

export default function ConvertCase() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef(null);

  const stats = useMemo(() => {
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    return { characters, words, lines };
  }, [text]);

  const applyCase = (fn) => setText((prev) => fn(prev));
  const applyCleanup = (fn) => {
    setText((prev) => fn(prev));
    setShowSettings(false);
  };

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    if (!text) return;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // user cancelled share sheet, nothing to do
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, "converted-text.txt");
  };

  const handleClear = () => {
    setText("");
    textareaRef.current?.focus();
  };

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <div className="rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Type or paste your content here"
          className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none resize-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 px-3 py-2">
          <div className="flex items-center gap-1 relative">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              title="Copy"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={!text}
              title="Share"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Share2 size={15} />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!text}
              title="Download as .txt"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={15} />
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={!text}
              title="Clear"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={15} />
            </button>
            <button
              type="button"
              onClick={() => setShowSettings((v) => !v)}
              title="More tools"
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                showSettings
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Settings size={15} />
            </button>

            {showSettings && (
              <div className="absolute left-0 top-full mt-2 z-10 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1.5">
                {CLEANUP_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => applyCleanup(action.fn)}
                    className="w-full text-left px-3.5 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Character Count: {stats.characters} | Word Count: {stats.words} | Line Count: {stats.lines}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CASE_CONVERTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => applyCase(c.fn)}
            disabled={!text}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold text-white shrink-0 ${BADGE_COLORS[c.id]}`}
            >
              {c.short}
            </span>
            {c.label}
          </button>
        ))}
      </div>
    </ToolPageShell>
  );
}
