import { useMemo, useState } from "react";
import { Copy, Check, Trash2, ChevronDown } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import { transliterate } from "../utils/hindiTransliteration";

const tool = tools.find((t) => t.id === "english-to-hindi-typing");

const TIPS = [
  { roman: "aa, ee, oo", hindi: "आ / ी / ू", example: "aap → आप, ji → जी, oon → ऊन" },
  { roman: "ai, au", hindi: "ऐ / औ", example: "hai → है, aur → और" },
  { roman: "sh, Sh", hindi: "श / ष", example: "shukriya → शुक्रिया" },
  { roman: "ch, chh", hindi: "च / छ", example: "chalo → चलो, chhota → छोटा" },
  { roman: "kh, gh, th, dh, ph, bh", hindi: "ख घ थ ध फ भ", example: "khana → खाना" },
  { roman: "tt, dd", hindi: "ट / ड (double for retroflex)", example: "tt → ट" },
  { roman: "M / n + consonant", hindi: "ं (anusvara)", example: "rang → रंग" },
  { roman: "gy / jn", hindi: "ज्ञ", example: "gyaan → ज्ञान" },
];

export default function EnglishToHindiTyping() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const hindiText = useMemo(() => transliterate(text), [text]);

  const handleCopy = async () => {
    if (!hindiText) return;
    await navigator.clipboard.writeText(hindiText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => setText("");

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <label className="block text-sm font-medium mb-1.5">Type in English (Roman letters)</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Type here… e.g. aap kaise ho"
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex items-center justify-between mt-6 mb-1.5">
        <label className="block text-sm font-medium">Hindi output</label>
        <div className="flex items-center gap-1">
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
            onClick={handleCopy}
            disabled={!hindiText}
            title="Copy"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
          </button>
        </div>
      </div>
      <div
        className="w-full min-h-[8rem] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-xl leading-relaxed whitespace-pre-wrap break-words"
        lang="hi"
      >
        {hindiText || <span className="text-base text-slate-400 dark:text-slate-500">आपका हिंदी टेक्स्ट यहाँ दिखेगा…</span>}
      </div>

      <button
        type="button"
        onClick={() => setShowTips((v) => !v)}
        className="mt-6 flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400"
      >
        <ChevronDown size={16} className={`transition-transform ${showTips ? "rotate-180" : ""}`} />
        Typing tips
      </button>

      {showTips && (
        <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            This tool converts common Hindi words phonetically as you type. For best results, double up long
            vowels and use these patterns:
          </p>
          <div className="space-y-2">
            {TIPS.map((tip) => (
              <div key={tip.roman} className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm">
                <code className="font-mono font-medium text-indigo-600 dark:text-indigo-400 sm:w-48 shrink-0">
                  {tip.roman}
                </code>
                <span className="text-slate-500 dark:text-slate-400">{tip.example}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolPageShell>
  );
}
