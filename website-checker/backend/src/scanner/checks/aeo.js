import { issue } from "../issue.js";

function hasSchemaType(jsonLd, type) {
  return jsonLd.some((entry) => {
    const nodes = Array.isArray(entry) ? entry : entry["@graph"] || [entry];
    return nodes.some((n) => {
      const t = n?.["@type"];
      if (!t) return false;
      const types = Array.isArray(t) ? t : [t];
      return types.some((x) => String(x).toLowerCase() === type.toLowerCase());
    });
  });
}

export function aeoCheck(ctx) {
  const issues = [];
  const { page } = ctx;

  if (!hasSchemaType(page.jsonLd, "Organization") && !hasSchemaType(page.jsonLd, "LocalBusiness")) {
    issues.push(issue({ title: "Organization schema", description: "Organization structured data was not found, which helps AI engines identify who runs this site.", severity: "medium" }));
  }

  const hasLogicalHeadings = page.headingCounts.h1 === 1 && page.headingCounts.h2 > 0;
  if (!hasLogicalHeadings) {
    issues.push(
      issue({
        title: "Answer-friendly heading structure",
        description: "Heading structure isn't clearly organized (single H1 with supporting H2s), making it harder for AI engines to extract answers.",
        severity: "medium",
      })
    );
  }

  if (!hasSchemaType(page.jsonLd, "FAQPage")) {
    issues.push(issue({ title: "FAQ schema", description: "FAQ schema is not present, a missed opportunity for AI/answer-engine visibility.", severity: "low" }));
  }

  if (!hasSchemaType(page.jsonLd, "Article") && !hasSchemaType(page.jsonLd, "BlogPosting") && !hasSchemaType(page.jsonLd, "NewsArticle")) {
    issues.push(issue({ title: "Article schema", description: "Article schema is not present on this page.", severity: "low" }));
  }

  if (!hasSchemaType(page.jsonLd, "Product")) {
    issues.push(issue({ title: "Product schema", description: "Product schema is not present on this page.", severity: "low" }));
  }

  if (page.wordCount < 300) {
    issues.push(
      issue({
        title: "Content depth",
        description: `The page is thin (~${page.wordCount} words), favor comprehensive content that AI engines can confidently cite.`,
        severity: "medium",
      })
    );
  }

  return {
    id: "aeo",
    name: "AEO",
    issues,
    comingSoon: ["LLM-crawlability audit (llms.txt, robots for AI bots)", "Answer-snippet extraction test"],
  };
}
