import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link02Icon, FileDownloadIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import CategoryCard from "./CategoryCard";
import TechStackCard from "./TechStackCard";
import { generateReportPdf } from "../utils/generatePdf";

export default function ResultsView({ result }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/report/${result.shareId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownloadPdf = () => generateReportPdf(result);

  return (
    <section className="relative max-w-6xl mx-auto px-6 pb-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[#6b7a6b] mb-1">Results for</p>
          <div className="flex flex-wrap items-end gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white break-all">{new URL(result.finalUrl).hostname}</h2>
            <span className="text-sm text-[#6b7a6b]">
              {result.totalIssues} issues found · overall score {result.overallScore}/100
              {result.deep ? ` · deep scan · ${result.pagesScanned} page${result.pagesScanned === 1 ? "" : "s"} crawled` : ""}
            </span>
          </div>
        </div>

        {result.shareId && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a3a2a] bg-[#0d0f0d] px-3.5 py-2 text-sm font-medium text-[#a3ada3] hover:text-white hover:border-[#3a4a3a] transition-colors"
            >
              <HugeiconsIcon icon={copied ? CheckmarkCircle01Icon : Link02Icon} size={15} className={copied ? "text-[#7cff6b]" : ""} />
              {copied ? "Copied!" : "Copy share link"}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a3a2a] bg-[#0d0f0d] px-3.5 py-2 text-sm font-medium text-[#a3ada3] hover:text-white hover:border-[#3a4a3a] transition-colors"
            >
              <HugeiconsIcon icon={FileDownloadIcon} size={15} />
              Download PDF
            </button>
          </div>
        )}
      </div>

      <TechStackCard techStack={result.techStack} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {result.categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}
