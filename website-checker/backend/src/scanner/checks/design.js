import { issue } from "../issue.js";

// Objective structural signals only — a full design/UX critique needs visual
// rendering and human/AI judgement, which is a planned Phase 2 addition.
export function designCheck(ctx) {
  const issues = [];
  const { page, $, browser } = ctx;

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

  const comingSoon = [
    "UX flow and conversion-path analysis",
    "Layout, spacing and typography consistency scoring",
    "AI-powered visual design review (needs a vision-capable LLM API key — not yet configured)",
  ];

  if (browser?.ok) {
    if (browser.overlappingCount > 0) {
      issues.push(
        issue({
          title: "Overlapping interactive elements",
          description: `${browser.overlappingCount} pair(s) of clickable elements visually overlap by more than half their area, which can make one of them un-clickable.`,
          severity: "medium",
        })
      );
    }
    if (browser.tinyTapTargets > 0) {
      issues.push(
        issue({
          title: "Tap targets too small for mobile",
          description: `${browser.tinyTapTargets} of ${browser.tapTargetCount} interactive element(s) are smaller than the recommended 44x44px minimum, hard to tap accurately on a phone.`,
          severity: "low",
        })
      );
    }
  } else {
    comingSoon.unshift("Overlapping-element and tap-target sizing checks — browser check unavailable for this scan");
  }

  return {
    id: "design",
    name: "UI/UX Design",
    issues,
    comingSoon,
  };
}
