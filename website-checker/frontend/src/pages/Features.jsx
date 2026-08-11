import { HugeiconsIcon } from "@hugeicons/react";
import { CodeIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { CATEGORY_META } from "../config/categories";

const FEATURES = [
  {
    id: "security",
    name: "Security",
    desc: "Exposed .env/.git files, missing security headers, insecure cookies, mixed content, open admin paths, and CORS misconfiguration.",
  },
  {
    id: "seo",
    name: "SEO",
    desc: "Title & meta description, H1 structure, alt text, canonical URLs, robots.txt, sitemap.xml, Open Graph tags, and thin content.",
  },
  {
    id: "aeo",
    name: "AEO (Answer-Engine Optimization)",
    desc: "Organization/FAQ/Article/Product schema, heading structure, and content depth — readiness for AI search engines.",
  },
  {
    id: "performance",
    name: "Performance",
    desc: "Load time, image weight, render-blocking resources, caching, compression, plus Core Web Vitals (LCP, CLS, FCP) on deep scan.",
  },
  {
    id: "accessibility",
    name: "Accessibility",
    desc: "Alt text, form labels, heading hierarchy, and — on deep scan — real WCAG color-contrast ratios and keyboard focus indicators.",
  },
  {
    id: "completeness",
    name: "Website Completeness",
    desc: "Missing contact/about/privacy/terms pages, social links, contact info, custom 404 page, and sitemap.",
  },
  {
    id: "technical",
    name: "Technical Bugs",
    desc: "Broken links, broken images, redirect chains, missing favicon — and on deep scan, real console errors, JS exceptions, and layout overflow.",
  },
  {
    id: "design",
    name: "UI/UX Design",
    desc: "Navigation/footer/main landmarks, CTA presence, and — on deep scan — overlapping elements and tap targets too small for mobile.",
  },
];

export default function Features() {
  return (
    <div className="bg-grid">
      <section className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
          Everything the scan checks
        </h1>
        <p className="max-w-xl mx-auto text-[#a3ada3] leading-relaxed">
          Every issue shown comes from a real fetch — the page HTML, response headers, and, on deep scan, an actual
          headless-browser render. No fake or estimated data.
        </p>
      </section>

      <section className="relative max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => {
            const meta = CATEGORY_META[f.id];
            return (
              <div key={f.id} className="rounded-2xl border border-[#1c211c] bg-[#0c0e0c] p-5">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <HugeiconsIcon icon={meta.icon} size={19} style={{ color: meta.color }} />
                  <p className="font-semibold text-white">{f.name}</p>
                </div>
                <p className="text-sm text-[#a3ada3] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-[#1c211c] bg-[#0c0e0c] p-5">
          <div className="flex items-center gap-2.5 mb-2.5">
            <HugeiconsIcon icon={CodeIcon} size={19} className="text-[#7cff6b]" />
            <p className="font-semibold text-white">Technology Stack</p>
          </div>
          <p className="text-sm text-[#a3ada3] leading-relaxed">
            In-house fingerprinting (same approach as Wappalyzer/BuiltWith) detects CMS, frontend framework, backend
            language, CDN, analytics tags, fonts, chat widgets, payment providers, and the SSL certificate issuer —
            no third-party API.
          </p>
        </div>
      </section>

      <section className="relative max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center mb-8">Quick scan vs. deep scan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#1c211c] bg-[#0c0e0c] p-5">
            <p className="font-semibold text-white mb-3">Quick scan (default)</p>
            <ul className="space-y-2 text-sm text-[#a3ada3]">
              {["One HTTP fetch of the homepage", "Every check above except browser-only ones", "Takes a few seconds"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-[#7cff6b] shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#2a3a2a] bg-[#0d0f0d] p-5">
            <p className="font-semibold text-white mb-3">Deep scan</p>
            <ul className="space-y-2 text-sm text-[#a3ada3]">
              {[
                "Real headless-browser render (Playwright)",
                "Console/JS errors, Core Web Vitals, contrast, keyboard focus",
                "Crawls up to ~12 internal pages",
                "Takes 15-30 seconds",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-[#7cff6b] shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
