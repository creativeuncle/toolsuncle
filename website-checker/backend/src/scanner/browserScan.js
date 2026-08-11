import { chromium } from "playwright";

let browserPromise = null;

function getBrowser() {
  if (!browserPromise) {
    // Allows pinning a system/prebuilt Chromium binary (useful in Docker to
    // avoid bundling Playwright's own download) via env var; falls back to
    // Playwright's managed browser otherwise.
    const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined;
    browserPromise = chromium.launch({ headless: true, args: ["--no-sandbox"], executablePath });
  }
  return browserPromise;
}

const VITALS_INIT_SCRIPT = `
window.__vitals = { lcp: null, cls: 0, fcp: null };
try {
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1];
    if (last) window.__vitals.lcp = last.renderTime || last.loadTime || null;
  }).observe({ type: "largest-contentful-paint", buffered: true });
} catch {}
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
    }
  }).observe({ type: "layout-shift", buffered: true });
} catch {}
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") window.__vitals.fcp = entry.startTime;
    }
  }).observe({ type: "paint", buffered: true });
} catch {}
`;

// Runs entirely inside the page context in one round trip: contrast ratios,
// keyboard-focus indicators, layout overflow, overlapping elements, tiny tap
// targets, and a static (non-submitting) read of forms on the page.
const PAGE_AUDIT_SCRIPT = `
(() => {
  function luminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
  function parseRgb(str) {
    const m = str.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
    if (parts.length < 3) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  }
  function contrastRatio(fg, bg) {
    const l1 = luminance(fg.r, fg.g, fg.b) + 0.05;
    const l2 = luminance(bg.r, bg.g, bg.b) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
  }
  function effectiveBg(el) {
    let node = el;
    while (node) {
      const style = getComputedStyle(node);
      const bg = parseRgb(style.backgroundColor);
      if (bg && bg.a > 0.05) return bg;
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }
  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const style = getComputedStyle(el);
    return style.visibility !== "hidden" && style.display !== "none" && parseFloat(style.opacity) > 0;
  }

  const contrastIssues = [];
  const textEls = Array.from(document.querySelectorAll("body *")).filter((el) => {
    if (el.children.length > 0) return false;
    const text = (el.textContent || "").trim();
    return text.length > 1;
  });
  let checked = 0;
  for (const el of textEls) {
    if (checked >= 200) break;
    if (!isVisible(el)) continue;
    checked += 1;
    const style = getComputedStyle(el);
    const fg = parseRgb(style.color);
    if (!fg) continue;
    const bg = effectiveBg(el);
    const ratio = contrastRatio(fg, bg);
    const fontSize = parseFloat(style.fontSize);
    const bold = parseInt(style.fontWeight, 10) >= 700;
    const isLarge = fontSize >= 24 || (fontSize >= 18.66 && bold);
    const threshold = isLarge ? 3 : 4.5;
    if (ratio < threshold) {
      contrastIssues.push({ text: (el.textContent || "").trim().slice(0, 40), ratio: Math.round(ratio * 100) / 100 });
    }
  }

  const focusable = Array.from(
    document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
  ).filter(isVisible).slice(0, 100);
  let noFocusIndicator = 0;
  const activeElBefore = document.activeElement;
  for (const el of focusable) {
    el.focus({ preventScroll: true });
    const style = getComputedStyle(el);
    const hasOutline = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
    const hasBoxShadow = style.boxShadow && style.boxShadow !== "none";
    if (!hasOutline && !hasBoxShadow) noFocusIndicator += 1;
  }
  if (activeElBefore && activeElBefore.blur) activeElBefore.blur();

  const horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth + 5;

  const interactive = Array.from(document.querySelectorAll('a[href], button, input, [role="button"]'))
    .filter(isVisible)
    .slice(0, 80);
  const rects = interactive.map((el) => ({ el, rect: el.getBoundingClientRect() }));
  let overlappingCount = 0;
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i];
      const b = rects[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const xOverlap = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left));
      const yOverlap = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top));
      const overlapArea = xOverlap * yOverlap;
      const smallerArea = Math.min(a.rect.width * a.rect.height, b.rect.width * b.rect.height);
      if (smallerArea > 0 && overlapArea / smallerArea > 0.5) overlappingCount += 1;
    }
  }

  const tapTargets = Array.from(document.querySelectorAll('a[href], button, input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], [role="button"]')).filter(isVisible);
  const tinyTapTargets = tapTargets.filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width < 44 || r.height < 44;
  }).length;

  const forms = Array.from(document.querySelectorAll("form")).map((form) => {
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
    return {
      hasAction: Boolean(form.getAttribute("action")),
      hasOnSubmitAttr: Boolean(form.getAttribute("onsubmit")),
      hasSubmitButton: Boolean(submitBtn),
      fieldCount: form.querySelectorAll("input, textarea, select").length,
    };
  });

  // Post-JS-execution snapshot for tech-stack fingerprinting — a static
  // fetch only sees the initial HTML, which is near-empty for client-side-
  // rendered apps (React/Vue/etc. inject their scripts and content after
  // load). This captures what's actually in the DOM once JS has run.
  const scriptSrcs = Array.from(document.scripts).map((s) => s.src).filter(Boolean);
  const linkHrefs = Array.from(document.querySelectorAll("link[href]")).map((l) => l.href);
  const metaGenerator = document.querySelector('meta[name="generator"]')?.getAttribute("content") || "";
  const htmlAttrs = {};
  for (const attr of document.documentElement.attributes) htmlAttrs[attr.name] = attr.value;

  return {
    contrastIssues,
    contrastChecked: checked,
    keyboard: { totalFocusable: focusable.length, noFocusIndicator },
    horizontalOverflow,
    overlappingCount,
    tinyTapTargets,
    tapTargetCount: tapTargets.length,
    forms,
    renderedHtml: document.documentElement.outerHTML,
    scriptSrcs,
    linkHrefs,
    metaGenerator,
    htmlAttrs,
  };
})();
`;

export async function runBrowserChecks(url, { timeoutMs = 20000 } = {}) {
  const browser = await getBrowser();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, userAgent: "Mozilla/5.0 (compatible; WebsiteCheckerBot/1.0)" });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      consoleErrors.push({ type: msg.type(), text: msg.text().slice(0, 300) });
    }
  });
  page.on("pageerror", (err) => {
    pageErrors.push(String(err.message || err).slice(0, 300));
  });
  page.on("requestfailed", (req) => {
    failedRequests.push({ url: req.url(), reason: req.failure()?.errorText || "failed" });
  });

  await page.addInitScript(VITALS_INIT_SCRIPT);

  try {
    await page.goto(url, { waitUntil: "load", timeout: timeoutMs });
    await page.waitForTimeout(1500);

    const vitals = await page.evaluate(() => window.__vitals);
    const navTiming = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      return nav ? { ttfb: nav.responseStart } : { ttfb: null };
    });
    const audit = await page.evaluate(PAGE_AUDIT_SCRIPT);

    await context.close();

    return {
      ok: true,
      consoleErrors: consoleErrors.slice(0, 20),
      pageErrors: pageErrors.slice(0, 20),
      failedRequests: failedRequests.slice(0, 20),
      webVitals: { lcp: vitals?.lcp ?? null, cls: vitals?.cls ?? null, fcp: vitals?.fcp ?? null, ttfb: navTiming.ttfb },
      ...audit,
    };
  } catch (err) {
    await context.close().catch(() => {});
    return { ok: false, error: err.message || String(err) };
  }
}

export async function closeBrowser() {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}
