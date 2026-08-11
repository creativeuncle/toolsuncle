import { issue } from "../issue.js";

const LARGE_IMAGE_BYTES = 250 * 1024;

export function performanceCheck(ctx) {
  const issues = [];
  const { page, headers, timeMs, imageStatuses } = ctx;

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

  return {
    id: "performance",
    name: "Performance",
    issues,
    comingSoon: ["Core Web Vitals (LCP, CLS, INP) via real browser measurement", "Waterfall / resource timeline"],
  };
}
