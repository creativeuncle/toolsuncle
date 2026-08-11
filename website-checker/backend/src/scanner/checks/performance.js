import { issue } from "../issue.js";

const LARGE_IMAGE_BYTES = 250 * 1024;

export function performanceCheck(ctx) {
  const issues = [];
  const { page, headers, timeMs, imageStatuses, browser } = ctx;

  if (timeMs > 2000) {
    issues.push(
      issue({
        title: "Slow page load time",
        description: `The initial HTML response took ${(timeMs / 1000).toFixed(2)}s to arrive; aim for under 1-2s.`,
        severity: timeMs > 4000 ? "critical" : "medium",
      })
    );
  }

  const largeImages = imageStatuses.filter((i) => i.contentLength && i.contentLength > LARGE_IMAGE_BYTES);
  if (largeImages.length > 0) {
    issues.push(
      issue({
        title: "Large images",
        description: `${largeImages.length} image(s) are larger than ${Math.round(LARGE_IMAGE_BYTES / 1024)}KB, slowing down page load.`,
        severity: "medium",
      })
    );
  }

  const imagesWithoutDimensions = page.images.filter((i) => !i.hasWidthHeight).length;
  if (imagesWithoutDimensions > 0) {
    issues.push(
      issue({
        title: "Unoptimized images",
        description: `${imagesWithoutDimensions} image(s) are missing width/height attributes, which can cause layout shift and hints they aren't size-optimized.`,
        severity: "low",
      })
    );
  }

  const externalScripts = page.scripts.filter((s) => s.src);
  if (externalScripts.length > 12) {
    issues.push(
      issue({
        title: "Too much JavaScript",
        description: `${externalScripts.length} external script(s) are loaded on this page, which can slow down parsing and execution.`,
        severity: "medium",
      })
    );
  }

  const renderBlocking = page.scripts.filter((s) => s.src && s.inHead && !s.async && !s.defer).length;
  const blockingStyles = page.stylesheets.filter((s) => !s.media || s.media === "all" || s.media === "screen").length;
  if (renderBlocking > 0 || blockingStyles > 2) {
    issues.push(
      issue({
        title: "Render-blocking resources",
        description: `${renderBlocking} synchronous script(s) in <head> and ${blockingStyles} stylesheet(s) may block first paint.`,
        severity: "medium",
      })
    );
  }

  const cacheControl = headers?.get?.("cache-control");
  if (!cacheControl) {
    issues.push(issue({ title: "Cache headers", description: "No Cache-Control header was found on the HTML response.", severity: "low" }));
  }

  const encoding = headers?.get?.("content-encoding");
  if (!encoding) {
    issues.push(issue({ title: "Compression", description: "Response is not served with gzip/Brotli compression (no Content-Encoding header).", severity: "medium" }));
  }

  const comingSoon = ["Waterfall / resource timeline", "INP (needs real user interaction, not measurable on an automated scan)"];

  if (browser?.ok) {
    const { lcp, cls, fcp } = browser.webVitals;
    if (lcp != null && lcp > 2500) {
      issues.push(
        issue({
          title: "Slow Largest Contentful Paint (LCP)",
          description: `LCP is ${(lcp / 1000).toFixed(2)}s; Google's "good" threshold is under 2.5s.`,
          severity: lcp > 4000 ? "critical" : "medium",
        })
      );
    }
    if (cls != null && cls > 0.1) {
      issues.push(
        issue({
          title: "Layout shift (CLS)",
          description: `Cumulative Layout Shift is ${cls.toFixed(3)}; Google's "good" threshold is under 0.1.`,
          severity: cls > 0.25 ? "critical" : "medium",
        })
      );
    }
    if (fcp != null && fcp > 1800) {
      issues.push(
        issue({
          title: "Slow First Contentful Paint (FCP)",
          description: `FCP is ${(fcp / 1000).toFixed(2)}s; Google's "good" threshold is under 1.8s.`,
          severity: "low",
        })
      );
    }
  } else {
    comingSoon.unshift("Core Web Vitals (LCP, CLS, FCP) — browser check unavailable for this scan");
  }

  return {
    id: "performance",
    name: "Performance",
    issues,
    comingSoon,
  };
}
