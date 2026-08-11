import { issue } from "../issue.js";

export function technicalCheck(ctx) {
  const issues = [];
  const { page, linkStatuses, imageStatuses, redirectCount, probes } = ctx;

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

  return {
    id: "technical",
    name: "Technical Bugs",
    issues,
    comingSoon: ["JS/console runtime error capture (headless browser)", "Form submission testing", "Cross-browser rendering checks"],
  };
}
