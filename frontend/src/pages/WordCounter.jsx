import { useMemo, useState } from "react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";

const tool = tools.find((t) => t.id === "word-counter");

function countStats(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed]).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim()).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime };
}

const STAT_LABELS = [
  { key: "words", label: "Words" },
  { key: "characters", label: "Characters" },
  { key: "charactersNoSpaces", label: "Characters (no spaces)" },
  { key: "sentences", label: "Sentences" },
  { key: "paragraphs", label: "Paragraphs" },
  { key: "readingTime", label: "Reading time (min)" },
];

export default function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => countStats(text), [text]);

  return (
    <ToolPageShell
      icon={tool.icon}
      color={tool.color}
      title={tool.name}
      description={tool.description}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Start typing or paste your text here…"
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STAT_LABELS.map((stat) => (
          <div
            key={stat.key}
            className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-center"
          >
            <p className="text-2xl font-bold">{stats[stat.key]}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </ToolPageShell>
  );
}
