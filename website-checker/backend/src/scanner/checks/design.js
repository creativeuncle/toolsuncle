import { issue } from "../issue.js";

// Objective structural signals only — a full design/UX critique needs visual
// rendering and human/AI judgement, which is a planned Phase 2 addition.
export function designCheck(ctx) {
  const issues = [];
  const { page, $ } = ctx;

  const hasNav = $("nav").length > 0 || $('[role="navigation"]').length > 0;
  if (!hasNav) {
    issues.push(issue({ title: "No navigation landmark", description: "No <nav> element or role=\"navigation\" was found, making the site structure harder to scan.", severity: "low" }));
  }

  const hasFooter = $("footer").length > 0 || $('[role="contentinfo"]').length > 0;
  if (!hasFooter) {
    issues.push(issue({ title: "No footer landmark", description: "No <footer> element was found; footers usually anchor navigation, legal links, and contact info.", severity: "low" }));
  }

  const hasMain = $("main").length > 0 || $('[role="main"]').length > 0;
  if (!hasMain) {
    issues.push(issue({ title: "No main content landmark", description: "No <main> element was found, which helps both accessibility tools and readability of page structure.", severity: "low" }));
  }

  if (!page.viewportMeta) {
    issues.push(issue({ title: "No responsive viewport meta", description: "Without a viewport meta tag, layout and UX will likely break on mobile devices.", severity: "medium" }));
  }

  const ctaButtons = $('button, a.btn, a[class*="button"], [class*="cta" i]').length;
  if (ctaButtons === 0) {
    issues.push(issue({ title: "No obvious call-to-action", description: "No clear button/CTA elements were detected on the page.", severity: "low" }));
  }

  return {
    id: "design",
    name: "UI/UX Design",
    issues,
    comingSoon: ["AI-powered visual design review", "UX flow and conversion-path analysis", "Layout, spacing and typography consistency scoring"],
  };
}
