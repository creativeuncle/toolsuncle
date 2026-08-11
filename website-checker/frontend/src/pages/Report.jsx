import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import ResultsView from "../components/ResultsView";
import { api, extractErrorMessage } from "../config/api";

export default function Report() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/scan/report/${id}`)
      .then(({ data }) => setResult(data))
      .catch(async (err) => setError(await extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-grid relative">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,255,107,0.25), transparent 70%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#a3ada3] hover:text-white transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
          Scan another site
        </Link>
      </div>

      <div className="pt-10">
        {loading && <p className="text-center text-[#6b7a6b] py-20">Loading report…</p>}

        {error && (
          <div className="relative max-w-xl mx-auto px-6 py-10">
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 text-center">
              {error}
            </div>
          </div>
        )}

        {result && <ResultsView result={result} />}
      </div>
    </div>
  );
}
