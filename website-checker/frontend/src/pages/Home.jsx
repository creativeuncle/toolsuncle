import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  ShieldEnergyIcon,
  Rocket01Icon,
  PaintBrush01Icon,
  UniversalAccessIcon,
} from "@hugeicons/core-free-icons";
import ScanForm from "../components/ScanForm";
import ResultsView from "../components/ResultsView";
import { api, extractErrorMessage } from "../config/api";

const FEATURES = [
  { icon: ShieldEnergyIcon, title: "Security & config", desc: "Exposed files, missing headers, insecure cookies — caught before attackers find them." },
  { icon: Search01Icon, title: "SEO & AEO", desc: "Titles, metadata, schema, and answer-engine readiness in one pass." },
  { icon: Rocket01Icon, title: "Performance", desc: "Load time, image weight, render-blocking resources, and caching." },
  { icon: UniversalAccessIcon, title: "Accessibility", desc: "Alt text, form labels, heading structure, keyboard reachability." },
  { icon: PaintBrush01Icon, title: "UI/UX signals", desc: "Structural cues — navigation, footer, CTAs, and mobile readiness." },
];

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultsRef = useRef(null);

  const handleScan = async (url, deep) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await api.post("/scan", { url, deep });
      setResult(data);
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result || error) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result, error]);

  return (
    <div className="min-h-screen bg-grid relative">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,255,107,0.25), transparent 70%)" }}
      />

      <header className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#2a3a2a] bg-[#0d0f0d] px-4 py-1.5 text-xs font-medium text-[#a3ada3] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7cff6b]" />
          Security · SEO · AEO in one scan
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
          Find every issue on
          <br />
          your site in <span className="text-[#7cff6b]">seconds.</span>
        </h1>

        <p className="max-w-xl mx-auto text-[#a3ada3] mb-10 leading-relaxed">
          Enter your URL for a free instant audit. We'll show you exactly what's wrong — security, SEO and
          AI-search — then generate the fixes when you're ready.
        </p>

        <div className="max-w-xl mx-auto">
          <ScanForm onScan={handleScan} loading={loading} />
          <p className="mt-3 text-xs text-[#5a6a5a]">Free instant scan · no signup · we'll show every issue we find</p>
        </div>
      </header>

      <div ref={resultsRef} />

      {error && (
        <div className="relative max-w-xl mx-auto px-6 pb-16">
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 text-center">
            {error}
          </div>
        </div>
      )}

      {result && <ResultsView result={result} />}

      {!result && !loading && (
        <section className="relative max-w-6xl mx-auto px-6 pb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Everything you need to ship a healthy site
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-[#1c211c] bg-[#0c0e0c] p-5">
                <HugeiconsIcon icon={f.icon} size={22} className="text-[#7cff6b] mb-3" />
                <p className="font-semibold text-white mb-1.5">{f.title}</p>
                <p className="text-sm text-[#a3ada3] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
