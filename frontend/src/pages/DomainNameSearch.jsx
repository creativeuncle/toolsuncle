import { useState } from "react";
import { Search, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import { api, extractErrorMessage } from "../config/api";

const tool = tools.find((t) => t.id === "domain-name-search");

function StatusDot({ status }) {
  if (status === "available") {
    return <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />;
  }
  if (status === "taken") {
    return <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />;
  }
  return <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />;
}

function ResultRow({ result }) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      <StatusDot status={result.status} />
      <span
        className={`text-sm truncate ${
          result.status === "available"
            ? "text-slate-800 dark:text-slate-100"
            : "text-slate-400 dark:text-slate-500 line-through"
        }`}
      >
        {result.domain}
      </span>
    </div>
  );
}

export default function DomainNameSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const { data } = await api.get("/tools/domain-search", { params: { keyword: trimmed } });
      setResults(data.results);
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const topResult = results?.find((r) => r.tld === "com") || results?.[0];
  const rest = results?.filter((r) => r !== topResult) || [];
  const availableCount = results?.filter((r) => r.status === "available").length || 0;

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <label className="block text-sm font-medium mb-1.5">Search a domain keyword</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. mybrand"
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button onClick={handleSearch} loading={loading}>
          {!loading && <Search size={16} />}
          Search
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {results && (
        <div className="mt-8">
          {topResult && (
            <div
              className={`flex items-center justify-between gap-4 rounded-2xl border p-5 mb-6 ${
                topResult.status === "available"
                  ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-500/10"
                  : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-500/10"
              }`}
            >
              <div>
                <p className="text-xl font-semibold">{topResult.domain}</p>
                <p
                  className={`text-sm font-medium ${
                    topResult.status === "available"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {topResult.status === "available"
                    ? "Available"
                    : topResult.status === "taken"
                    ? "Already taken"
                    : "Status unknown"}
                </p>
              </div>
              {topResult.status === "available" ? (
                <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />
              ) : topResult.status === "taken" ? (
                <XCircle size={28} className="text-red-500 shrink-0" />
              ) : (
                <HelpCircle size={28} className="text-slate-400 shrink-0" />
              )}
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Other extensions</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {availableCount} of {results.length} available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-0 divide-y divide-slate-100 dark:divide-slate-800 sm:divide-y-0">
            {rest.map((r) => (
              <ResultRow key={r.domain} result={r} />
            ))}
          </div>

          <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
            Availability is estimated using DNS lookups and may occasionally be inaccurate. Always confirm with a
            registrar before purchasing.
          </p>
        </div>
      )}
    </ToolPageShell>
  );
}
