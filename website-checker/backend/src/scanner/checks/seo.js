import { issue } from "../issue.js";

export function seoCheck(ctx) {
  const issues = [];
  const { page, probes, duplicateTitles } = ctx;

  if (!page.title) {
    issues.push(issue({ title: "Missing <title>", description: "The page has no <title> tag, which hurts search rankings and click-through rate.", severity: "critical" }));
  } else if (page.title.length > 60) {
    issues.push(issue({ title: "Title tag too long", description: `Title is ${page.title.length} characters; search engines typically truncate around 60.`, severity: "low" }));
  }

  if (!page.metaDescription) {
    issues.push(issue({ title: "Missing meta description", description: "No meta description was found, so search engines will auto-generate a snippet.", severity: "medium" }));
  } else if (page.metaDescription.length < 50 || page.metaDescription.length > 160) {
    issues.push(
      issue({
        title: "Meta description length not ideal",
        description: `Meta description is ${page.metaDescription.length} characters; the recommended range is roughly 50-160.`,
        severity: "low",
      })
    );
  }

  if (page.headingCounts.h1 === 0) {
    issues.push(issue({ title: "H1 heading", description: "The page has no H1 heading.", severity: "medium" }));
  } else if (page.headingCounts.h1 > 1) {
    issues.push(issue({ title: "Multiple H1 headings", description: `Found ${page.headingCounts.h1} H1 tags; pages should generally have exactly one.`, severity: "medium" }));
  }

  const missingAlt = page.images.filter((i) => !i.hasAlt).length;
  if (missingAlt > 0) {
    issues.push(
      issue({
        title: "Image alt text missing",
        description: `${missingAlt} of ${page.images.length} image(s) are missing descriptive alt text.`,
        severity: "medium",
      })
    );
  }

  if (!page.canonical) {
    issues.push(issue({ title: "Canonical URL", description: "No canonical URL is declared, risking duplicate-content dilution.", severity: "low" }));
  }

  if (!probes.robots?.ok || probes.robots.status !== 200) {
    issues.push(issue({ title: "robots.txt", description: "No robots.txt was found at the site root.", severity: "low" }));
  }

  if (!probes.sitemap?.ok || probes.sitemap.status !== 200) {
    issues.push(issue({ title: "XML sitemap", description: "No XML sitemap was found.", severity: "medium" }));
  }

  const og = page.ogTags;
  if (!og.title || !og.description || !og.image) {
    issues.push(issue({ title: "Open Graph tags", description: "Open Graph tags are missing or incomplete.", severity: "low" }));
  }

  if (!page.twitterCard) {
    issues.push(issue({ title: "Twitter card tags", description: "Twitter card tags are missing.", severity: "low" }));
  }

  if (page.wordCount < 150) {
    issues.push(issue({ title: "Thin content", description: `The page has only about ${page.wordCount} words of visible text, which may read as thin to search engines.`, severity: "medium" }));
  }

  if (duplicateTitles) {
    issues.push(issue({ title: "Duplicate page titles", description: "Multiple crawled pages share the same <title>, which can dilute search rankings.", severity: "medium" }));
  }

  return {
    id: "seo",
    name: "SEO",
    issues,
    comingSoon: ["Full-site duplicate title/description crawl", "Keyword and search intent analysis"],
  };
}
