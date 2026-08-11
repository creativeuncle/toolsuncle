import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, SquareLock02Icon } from "@hugeicons/core-free-icons";

const FREE_FEATURES = [
  "Quick scan — unlimited, no signup",
  "Deep scan — headless-browser checks, unlimited",
  "All 8 categories + Technology Stack detection",
  "PDF export & shareable report links",
];

const PRO_FEATURES = [
  "AI-generated fix suggestions for every issue",
  "Scheduled monitoring with email alerts on new issues",
  "Scan history dashboard & before/after comparison",
  "White-label PDF reports for agencies",
  "Priority scan queue",
];

export default function Pricing() {
  return (
    <div className="bg-grid">
      <section className="relative max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">Simple pricing</h1>
        <p className="max-w-xl mx-auto text-[#a3ada3] leading-relaxed">
          Everything below is free while we're building this out — no plan is enforced yet. This page shows where
          we're headed.
        </p>
      </section>

      <section className="relative max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#2a3a2a] bg-[#0d0f0d] p-7">
            <p className="text-sm font-semibold text-[#7cff6b] mb-1">Free</p>
            <p className="text-3xl font-extrabold text-white mb-1">₹0</p>
            <p className="text-sm text-[#6b7a6b] mb-6">Available now</p>

            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#c8d3c8]">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-[#7cff6b] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to="/"
              className="block w-full text-center rounded-xl bg-white text-black font-semibold py-2.5 hover:bg-[#e8ffe4] transition-colors"
            >
              Start scanning free
            </Link>
          </div>

          <div className="rounded-2xl border border-[#1c211c] bg-[#0c0e0c] p-7">
            <p className="text-sm font-semibold text-[#a3ada3] mb-1">Pro</p>
            <p className="text-3xl font-extrabold text-white mb-1">
              Coming soon
            </p>
            <p className="text-sm text-[#6b7a6b] mb-6">Pricing to be announced</p>

            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#6b7a6b]">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-[#3a4a3a] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              disabled
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#232823] text-[#6b7a6b] font-semibold py-2.5 cursor-not-allowed"
            >
              <HugeiconsIcon icon={SquareLock02Icon} size={15} />
              Coming soon
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
