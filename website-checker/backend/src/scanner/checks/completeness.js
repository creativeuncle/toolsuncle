import { issue } from "../issue.js";

const SOCIAL_HOSTS = ["facebook.com", "twitter.com", "x.com", "instagram.com", "linkedin.com", "youtube.com", "tiktok.com", "pinterest.com"];

function linkMatches(links, patterns) {
  return links.some((l) => {
    const haystack = `${l.href || ""} ${l.text || ""}`.toLowerCase();
    return patterns.some((p) => haystack.includes(p));
  });
}

export function completenessCheck(ctx) {
  const issues = [];
  const { page, probes } = ctx;
  const links = page.links;

  if (!linkMatches(links, ["/contact", "contact us", "contact-us"])) {
    issues.push(issue({ title: "Contact page missing", description: "No link to a contact page was found on the homepage.", severity: "medium" }));
  }

  if (!linkMatches(links, ["/about", "about us", "about-us"])) {
    issues.push(issue({ title: "About page missing", description: "No link to an about page was found on the homepage.", severity: "low" }));
  }

  if (!linkMatches(links, ["privacy", "privacy-policy"])) {
    issues.push(issue({ title: "Privacy Policy missing", description: "No link to a privacy policy was found, which may be a legal compliance risk in many regions.", severity: "medium" }));
  }

  if (!linkMatches(links, ["terms", "terms-of-service", "terms-and-conditions", "tos"])) {
    issues.push(issue({ title: "Terms & Conditions missing", description: "No link to a terms of service page was found.", severity: "low" }));
  }

  const hasSocial = links.some((l) => l.href && SOCIAL_HOSTS.some((h) => l.href.includes(h)));
  if (!hasSocial) {
    issues.push(issue({ title: "Social links missing", description: "No links to social media profiles were found on the homepage.", severity: "low" }));
  }

  const hasMailto = links.some((l) => l.rawHref?.startsWith("mailto:"));
  const hasTel = links.some((l) => l.rawHref?.startsWith("tel:"));
  const hasPhonePattern = /(\+?\d[\d\s().-]{7,}\d)/.test(page.bodyText);
  if (!hasMailto && !hasTel && !hasPhonePattern) {
    issues.push(issue({ title: "Contact information missing", description: "No email link, phone link, or phone number pattern was found on the page.", severity: "medium" }));
  }

  if (probes.notFound && probes.notFound.status === 200) {
    issues.push(issue({ title: "404 page missing", description: "A random non-existent URL returned HTTP 200 instead of a proper 404, so visitors can't tell broken links from real pages.", severity: "medium" }));
  }

  if (!probes.sitemap?.ok || probes.sitemap.status !== 200) {
    issues.push(issue({ title: "Sitemap missing", description: "No XML sitemap was found at /sitemap.xml.", severity: "low" }));
  }

  return {
    id: "completeness",
    name: "Website Completeness",
    issues,
    comingSoon: ["Multi-page crawl for completeness (beyond homepage links)"],
  };
}
