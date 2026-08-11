import { fetchText } from "./fetchUrl.js";
import { analyzePage } from "./analyzePage.js";

const MAX_PAGES = 12;
const PER_PAGE_TIMEOUT_MS = 8000;

function dedupe(arr) {
  return [...new Set(arr)];
}

// Lightweight BFS crawl (plain HTTP fetch, no browser) of same-origin pages
// starting from the homepage, used for site-wide duplicate-title detection
// and a broader broken-link sweep than a single-page scan can offer.
export async function crawlSite(homepageUrl, homepagePage) {
  const origin = homepagePage.origin;
  const visited = new Set([homepageUrl]);
  const queue = dedupe(homepagePage.links.filter((l) => l.isInternal && l.href).map((l) => l.href)).filter(
    (u) => !visited.has(u)
  );

  const pages = [{ url: homepageUrl, title: homepagePage.title, links: homepagePage.links }];

  while (queue.length > 0 && pages.length < MAX_PAGES) {
    const nextUrl = queue.shift();
    if (visited.has(nextUrl)) continue;
    visited.add(nextUrl);

    const result = await fetchText(nextUrl, { timeoutMs: PER_PAGE_TIMEOUT_MS });
    if (!result.ok || !result.body) continue;
    if (result.status && result.status >= 400) continue;

    try {
      const analyzed = analyzePage(result.body, result.finalUrl || nextUrl);
      pages.push({ url: nextUrl, title: analyzed.title, links: analyzed.links });
    } catch {
      continue;
    }
  }

  const titleCounts = {};
  pages.forEach((p) => {
    const key = (p.title || "").trim().toLowerCase();
    if (!key) return;
    titleCounts[key] = (titleCounts[key] || 0) + 1;
  });
  const duplicateTitleGroups = Object.entries(titleCounts).filter(([, count]) => count > 1);

  const allInternalLinks = dedupe(
    pages.flatMap((p) => p.links.filter((l) => l.isInternal && l.href).map((l) => l.href))
  );

  return {
    pagesVisited: pages.length,
    pageUrls: pages.map((p) => p.url),
    duplicateTitleGroups,
    allInternalLinks,
  };
}
