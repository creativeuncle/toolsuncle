import { issue } from "../issue.js";

export function technicalCheck(ctx) {
  const issues = [];
  const { page, linkStatuses, imageStatuses, redirectCount, probes, browser } = ctx;

  const brokenLinks = linkStatuses.filter((l) => !l.ok || (l.status && l.status >= 400));
  if (brokenLinks.length > 0) {
    issues.push(
      issue({
        title: "Broken links (404)",
        description: `${brokenLinks.length} of ${linkStatuses.length} checked internal link(s) returned an error or 404 status.`,
        severity: "critical",
      })
    );
  }

  const brokenImages = imageStatuses.filter((i) => !i.ok || (i.status && i.status >= 400));
  if (brokenImages.length > 0) {
    issues.push(
      issue({
        title: "Images not loading",
        description: `${brokenImages.length} of ${imageStatuses.length} checked image(s) failed to load.`,
        severity: "medium",
      })
    );
  }

  if (redirectCount > 2) {
    issues.push(issue({ title: "Redirect problems", description: `The homepage went through ${redirectCount} redirect hops before responding, which slows down every visit.`, severity: "medium" }));
  }

  if (!page.favicon && (!probes.favicon?.ok || probes.favicon.status !== 200)) {
    issues.push(issue({ title: "Missing favicon", description: "No favicon link tag was found and /favicon.ico is not reachable.", severity: "low" }));
  }

  const placeholderLinks = page.links.filter((l) => l.isPlaceholder && !l.hasOnclick).length;
  if (placeholderLinks > 0) {
    issues.push(
      issue({
        title: "Placeholder / dead-looking links",
        description: `${placeholderLinks} link(s) point to "#" or an empty href with no click handler detected in the HTML.`,
        severity: "low",
      })
    );
  }

  if (!page.viewportMeta) {
    issues.push(issue({ title: "Mobile responsive issues", description: "No <meta name=\"viewport\"> tag was found, so the page likely won't adapt to mobile screens.", severity: "critical" }));
  }

  const comingSoon = ["Cross-browser rendering checks"];

  if (browser?.ok) {
    if (browser.consoleErrors.filter((c) => c.type === "error").length > 0) {
      const errs = browser.consoleErrors.filter((c) => c.type === "error");
      issues.push(
        issue({
          title: "Console errors",
          description: `${errs.length} console error(s) were logged while loading the page, e.g. "${errs[0].text}".`,
          severity: "critical",
        })
      );
    }
    if (browser.pageErrors.length > 0) {
      issues.push(
        issue({
          title: "JS runtime errors",
          description: `${browser.pageErrors.length} uncaught JavaScript error(s) occurred, e.g. "${browser.pageErrors[0]}".`,
          severity: "critical",
        })
      );
    }
    if (browser.failedRequests.length > 0) {
      issues.push(
        issue({
          title: "Failed network requests",
          description: `${browser.failedRequests.length} request(s) failed to load in the browser (scripts, styles, or other assets).`,
          severity: "medium",
        })
      );
    }
    if (browser.horizontalOverflow) {
      issues.push(
        issue({
          title: "Horizontal scroll on desktop viewport",
          description: "The page content is wider than the viewport, causing an unwanted horizontal scrollbar.",
          severity: "medium",
        })
      );
    }
    const weakForms = browser.forms.filter((f) => !f.hasAction && !f.hasOnSubmitAttr && f.fieldCount > 0);
    if (weakForms.length > 0) {
      issues.push(
        issue({
          title: "Forms may not submit",
          description: `${weakForms.length} form(s) have no action attribute or onsubmit handler detected, so they may not be wired up. (We don't actually submit forms on live sites to avoid side effects — this is a static readiness check.)`,
          severity: "medium",
        })
      );
    }
  } else {
    comingSoon.unshift("JS/console runtime error capture, form readiness, layout overflow (browser check unavailable for this scan)");
  }

  return {
    id: "technical",
    name: "Technical Bugs",
    issues,
    comingSoon,
  };
}
