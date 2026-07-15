import { useMemo, useState } from "react";
import { ExternalLink, Loader2, Search } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import { api, extractErrorMessage } from "../config/api";
import { estimateRevenue } from "../utils/youtubeRevenue";

const tool = tools.find((t) => t.id === "youtube-money-calculator");

const numberFmt = new Intl.NumberFormat("en-US");
const dateFmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });
const moneyFmt = (n) => `$${numberFmt.format(n)}`;

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            value === opt.value
              ? "bg-indigo-600 text-white"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function YoutubeMoneyCalculator() {
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [contentType, setContentType] = useState("long");

  const revenue = useMemo(() => {
    if (!channel) return null;
    return estimateRevenue({
      totalViews: channel.viewCount,
      publishedAt: channel.publishedAt,
      period,
      contentType,
    });
  }, [channel, period, contentType]);

  const handleCalculate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/tools/youtube-channel", { params: { query: query.trim() } });
      setChannel(data);
    } catch (err) {
      setError(await extractErrorMessage(err));
      setChannel(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCalculate();
  };

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      {channel && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Channel summary</h2>
            <a
              href={`https://youtube.com/channel/${channel.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Open the channel
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <img
              src={channel.thumbnail}
              alt={channel.title}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="w-14 h-14 rounded-full object-cover bg-slate-200 dark:bg-slate-700 shrink-0"
            />
            <div>
              <p className="font-semibold">{channel.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Channel ID: {channel.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard
              label="Subscribers"
              value={channel.subscriberCount != null ? numberFmt.format(channel.subscriberCount) : "Hidden"}
            />
            <StatCard label="Views" value={numberFmt.format(channel.viewCount)} />
            <StatCard label="Videos" value={numberFmt.format(channel.videoCount)} />
            <StatCard label="Registration" value={dateFmt.format(new Date(channel.publishedAt))} />
          </div>
        </>
      )}

      <label className="block text-sm font-medium mb-1.5">
        {channel ? "Try another YouTube Channel URL" : "YouTube Channel URL or @handle"}
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="@channelname or youtube.com/@channelname"
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button onClick={handleCalculate} loading={loading}>
          {!loading && <Search size={16} />}
          Calculate
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {channel && revenue && (
        <div className="mt-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <span className="rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              {contentType === "long" ? "Long-form" : "Shorts"} · {period === "monthly" ? "Monthly" : "Yearly"}
            </span>
            <div className="flex flex-col items-end gap-2">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 text-right">Revenue window</p>
                <ToggleGroup
                  value={period}
                  onChange={setPeriod}
                  options={[
                    { value: "monthly", label: "Monthly" },
                    { value: "yearly", label: "Yearly" },
                  ]}
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 text-right">Content focus</p>
                <ToggleGroup
                  value={contentType}
                  onChange={setContentType}
                  options={[
                    { value: "long", label: "Long-form" },
                    { value: "shorts", label: "Shorts" },
                  ]}
                />
              </div>
            </div>
          </div>

          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            {moneyFmt(revenue.totalRevenue)}
          </p>
          <p className="font-semibold mt-1">estimated {period === "monthly" ? "monthly" : "yearly"} revenue</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Baseline daily views: {numberFmt.format(revenue.baselineDailyViews)}
          </p>

          <div className="border-t border-slate-200 dark:border-slate-700 my-5" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Effective RPM</span>
              <span className="font-medium">${revenue.effectiveRpm.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Views this period</span>
              <span className="font-medium">{numberFmt.format(revenue.viewsThisPeriod)}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 my-5" />

          <p className="font-semibold mb-3">
            Revenue Structure ({period === "monthly" ? "Monthly" : "Yearly"})
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Ads</span>
              <span className="font-medium">{moneyFmt(revenue.adsRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Premium</span>
              <span className="font-medium">{moneyFmt(revenue.premiumRevenue)}</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
            Estimates only, based on public channel stats and typical industry RPMs. Actual earnings vary by niche,
            audience location, and seasonality.
          </p>
        </div>
      )}

      {loading && !channel && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 size={16} className="animate-spin" />
          Fetching channel data…
        </div>
      )}
    </ToolPageShell>
  );
}
