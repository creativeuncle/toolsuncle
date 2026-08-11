import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Globe02Icon, Search01Icon, Loading03Icon } from "@hugeicons/core-free-icons";

export default function ScanForm({ onScan, loading, size = "lg" }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    onScan(url.trim());
  };

  const isCompact = size === "sm";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex flex-col sm:flex-row items-stretch gap-2 rounded-2xl border transition-colors ${
          isCompact ? "p-1.5" : "p-2"
        } border-[#2a3a2a] focus-within:border-[#7cff6b]/70 bg-[#0d0f0d]`}
      >
        <div className="flex items-center flex-1 gap-2 px-3">
          <HugeiconsIcon icon={Globe02Icon} size={isCompact ? 16 : 18} className="text-[#6b7a6b] shrink-0" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourwebsite.com"
            className={`w-full bg-transparent outline-none placeholder:text-[#5a6a5a] text-white ${
              isCompact ? "py-2 text-sm" : "py-3 text-base"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black font-semibold hover:bg-[#e8ffe4] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0 ${
            isCompact ? "px-4 py-2 text-sm" : "px-6 py-3"
          }`}
        >
          {loading ? (
            <HugeiconsIcon icon={Loading03Icon} size={isCompact ? 15 : 17} className="animate-spin" />
          ) : (
            <HugeiconsIcon icon={Search01Icon} size={isCompact ? 15 : 17} />
          )}
          {loading ? "Scanning…" : "Scan free"}
        </button>
      </div>
    </form>
  );
}
