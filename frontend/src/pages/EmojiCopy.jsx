import { useMemo, useState } from "react";
import { Search, Check } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import { EMOJI_GROUPS, searchEmojis } from "../utils/emojiData";

const tool = tools.find((t) => t.id === "emoji-copy");

export default function EmojiCopy() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState(0);
  const [copied, setCopied] = useState(null);

  const results = useMemo(() => searchEmojis(query), [query]);
  const isSearching = query.trim().length > 0;
  const shown = isSearching ? results : EMOJI_GROUPS[activeGroup].emojis;

  const handleCopy = async (emoji) => {
    await navigator.clipboard.writeText(emoji.emoji);
    setCopied(emoji.slug);
    setTimeout(() => setCopied((prev) => (prev === emoji.slug ? null : prev)), 1200);
  };

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search emoji, e.g. heart, cat, fire…"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {!isSearching && (
        <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
          {EMOJI_GROUPS.map((group, i) => {
            const Icon = group.icon;
            const active = i === activeGroup;
            return (
              <button
                key={group.name}
                type="button"
                onClick={() => setActiveGroup(i)}
                title={group.name}
                className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        {isSearching ? `${shown.length} results` : EMOJI_GROUPS[activeGroup].name} · click an emoji to copy it
      </p>

      {shown.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">No emoji found.</p>
      ) : (
        <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 max-h-[480px] overflow-y-auto">
          {shown.map((emoji) => (
            <button
              key={emoji.slug}
              type="button"
              onClick={() => handleCopy(emoji)}
              title={emoji.name}
              className="relative flex items-center justify-center aspect-square rounded-lg text-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {emoji.emoji}
              {copied === emoji.slug && (
                <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-emerald-500/90 text-white">
                  <Check size={16} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </ToolPageShell>
  );
}
