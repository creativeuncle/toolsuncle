import { fetchText, headOrGetStatus } from "./fetchUrl.js";
import { analyzePage } from "./analyzePage.js";
import { scoreFromIssues } from "./issue.js";
import { securityCheck } from "./checks/security.js";
import { seoCheck } from "./checks/seo.js";
import { aeoCheck } from "./checks/aeo.js";
import { performanceCheck } from "./checks/performance.js";
import { accessibilityCheck } from "./checks/accessibility.js";
import { completenessCheck } from "./checks/completeness.js";
import { technicalCheck } from "./checks/technical.js";
import { designCheck } from "./checks/design.js";

const ADMIN_PATHS = ["/wp-admin/", "/admin/", "/administrator/"];
const MAX_LINKS_TO_CHECK = 15;
const MAX_IMAGES_TO_CHECK = 20;

export function normalizeUrl(input) {
  let value = input.trim();
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  const url = new URL(value);
  return url.toString();
}

function dedupe(arr) {
  return [...new Set(arr)];
}

async function probeContentLength(url) {
  const result = await headOrGetStatus(url);
  if (!result.ok) return { ok: false, status: null, contentLength: null };
  const len = result.headers?.get?.("content-length");
  return { ok: true, status: result.status, contentLength: len ? Number(len) : null };
}

export async function runScan(rawUrl) {
  const targetUrl = normalizeUrl(rawUrl);
  const mainFetch = await fetchText(targetUrl, { timeoutMs: 15000 });

  if (!mainFetch.ok) {
    return { error: mainFetch.error === "timeout" ? "The site took too long to respond." : `Could not reach the site (${mainFetch.error}).` };
  }
  if (!mainFetch.body) {
    return { error: "The site responded with no readable HTML content." };
  }

  const page = analyzePage(mainFetch.body, mainFetch.finalUrl);
  const origin = page.origin;

  const [envProbe, gitConfigProbe, gitHeadProbe, robotsProbe, sitemapProbe, notFoundProbe, faviconProbe, ...adminProbes] = await Promise.all([
    headOrGetStatus(`${origin}/.env`),
    headOrGetStatus(`${origin}/.git/config`),
    headOrGetStatus(`${origin}/.git/HEAD`),
    headOrGetStatus(`${origin}/robots.txt`),
    headOrGetStatus(`${origin}/sitemap.xml`),
    headOrGetStatus(`${origin}/__dctools-not-found-check-${Date.now().toString(36)}`),
    page.favicon ? Promise.resolve({ ok: true, status: 200 }) : headOrGetStatus(`${origin}/favicon.ico`),
    ...ADMIN_PATHS.map((p) => headOrGetStatus(`${origin}${p}`)),
  ]);

  const adminHit = adminProbes.find((p) => p.ok && p.status === 200);
  const probes = {
    env: envProbe,
    gitConfig: gitConfigProbe,
    gitHead: gitHeadProbe,
    robots: robotsProbe,
    sitemap: sitemapProbe,
    notFound: notFoundProbe,
    favicon: faviconProbe,
    admin: adminHit ? { ok: true, status: 200, path: ADMIN_PATHS[adminProbes.indexOf(adminHit)] } : { ok: false },
  };

  const internalLinks = dedupe(page.links.filter((l) => l.isInternal && l.href && l.href !== mainFetch.finalUrl).map((l) => l.href)).slice(
    0,
    MAX_LINKS_TO_CHECK
  );
  const linkStatuses = await Promise.all(internalLinks.map((url) => headOrGetStatus(url).then((r) => ({ url, ...r }))));

  const imageUrls = dedupe(page.images.map((i) => i.src)).slice(0, MAX_IMAGES_TO_CHECK);
  const imageStatuses = await Promise.all(imageUrls.map((url) => probeContentLength(url).then((r) => ({ url, ...r }))));

  const ctx = {
    page,
    $: page.$,
    targetUrl,
    finalUrl: mainFetch.finalUrl,
    origin,
    headers: mainFetch.headers,
    status: mainFetch.status,
    redirectCount: mainFetch.redirectCount,
    timeMs: mainFetch.timeMs,
    probes,
    linkStatuses,
    imageStatuses,
    duplicateTitles: false,
  };

  const categories = [securityCheck(ctx), seoCheck(ctx), aeoCheck(ctx), performanceCheck(ctx), accessibilityCheck(ctx), completenessCheck(ctx), technicalCheck(ctx), designCheck(ctx)].map(
    (cat) => ({ ...cat, score: scoreFromIssues(cat.issues), issueCount: cat.issues.length })
  );

  const totalIssues = categories.reduce((sum, c) => sum + c.issueCount, 0);
  const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  return {
    url: targetUrl,
    finalUrl: mainFetch.finalUrl,
    scannedAt: new Date().toISOString(),
    loadTimeMs: mainFetch.timeMs,
    totalIssues,
    overallScore,
    categories,
  };
}
