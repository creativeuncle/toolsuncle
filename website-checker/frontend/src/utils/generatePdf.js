import { jsPDF } from "jspdf";

const MARGIN = 15;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function ensureSpace(doc, y, needed) {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

export function generateReportPdf(result) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Website Checker Report", MARGIN, y);
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(result.finalUrl, MARGIN, y);
  y += 5;
  doc.text(`Scanned ${new Date(result.scannedAt).toLocaleString()}`, MARGIN, y);
  y += 5;
  doc.text(`Overall score: ${result.overallScore}/100 · ${result.totalIssues} issues found` + (result.deep ? ` · deep scan (${result.pagesScanned} pages)` : ""), MARGIN, y);
  y += 10;
  doc.setTextColor(0);

  if (result.techStack?.groups?.length > 0) {
    y = ensureSpace(doc, y, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`Technology Stack  (${result.techStack.detectedCount} detected)`, MARGIN, y);
    y += 7;

    result.techStack.groups.forEach((group) => {
      y = ensureSpace(doc, y, 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(60);
      doc.text(group.label + ":", MARGIN + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      const lines = doc.splitTextToSize(group.items.join(", "), CONTENT_WIDTH - 35);
      doc.text(lines, MARGIN + 35, y);
      y += 4.5 * Math.max(1, lines.length) + 1;
    });
    y += 6;
  }

  result.categories.forEach((cat) => {
    y = ensureSpace(doc, y, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`${cat.name}  —  score ${cat.score}/100  (${cat.issueCount} issue${cat.issueCount === 1 ? "" : "s"})`, MARGIN, y);
    y += 7;

    if (cat.issues.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(90);
      doc.text("No issues found.", MARGIN + 2, y);
      doc.setTextColor(0);
      y += 8;
      return;
    }

    cat.issues.forEach((issue) => {
      y = ensureSpace(doc, y, 18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      const titleLine = `[${issue.severity.toUpperCase()}] ${issue.title}`;
      doc.text(titleLine, MARGIN + 2, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(80);
      const lines = doc.splitTextToSize(issue.description, CONTENT_WIDTH - 4);
      lines.forEach((line) => {
        y = ensureSpace(doc, y, 5);
        doc.text(line, MARGIN + 2, y);
        y += 4.5;
      });
      doc.setTextColor(0);
      y += 3;
    });

    y += 3;
  });

  const hostname = (() => {
    try {
      return new URL(result.finalUrl).hostname;
    } catch {
      return "site";
    }
  })();
  doc.save(`website-checker-${hostname}-${new Date(result.scannedAt).toISOString().slice(0, 10)}.pdf`);
}
