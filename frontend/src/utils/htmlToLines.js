export function htmlToLines(html) {
  if (!html) return [];

  const withBreaks = html
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

  const text = withBreaks
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
