import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fitLogoSize(width, height, maxW, maxH) {
  if (!width || !height) return { width: maxW, height: maxH };
  const aspect = width / height;
  let w = maxW;
  let h = w / aspect;
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }
  return { width: w, height: h };
}

export function generateSalarySlipPdf(data) {
  const { payPeriod, company, employeeFields, workingFields, earnings, deductions, totals } = data;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 15;
  let y = 15;

  if (company.logoDataUrl) {
    try {
      const { width, height } = fitLogoSize(company.logoWidth, company.logoHeight, 28, 20);
      doc.addImage(company.logoDataUrl, company.logoFormat, marginX, y, width, height, undefined, "FAST");
    } catch {
      // ignore unsupported image
    }
  }

  doc.setFont(undefined, "bold");
  doc.setFontSize(15);
  doc.text(company.name || "Company Name", pageWidth - marginX, y + 5, { align: "right" });
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  if (company.address) {
    const lines = doc.splitTextToSize(company.address, 90);
    doc.text(lines, pageWidth - marginX, y + 11, { align: "right" });
  }

  y += 28;
  doc.setDrawColor(220);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;

  doc.setFont(undefined, "bold");
  doc.setFontSize(13);
  doc.text(`Payslip for ${MONTHS[payPeriod.month]} ${payPeriod.year}`, pageWidth / 2, y, { align: "center" });
  y += 10;

  const employeePairs = employeeFields.filter((f) => f.value).map((f) => [f.label, f.value]);
  const half = Math.ceil(employeePairs.length / 2);
  const leftPairs = employeePairs.slice(0, half);
  const rightPairs = employeePairs.slice(half);
  const colWidth = (pageWidth - marginX * 2) / 2;

  doc.setFontSize(9.5);
  const maxRows = Math.max(leftPairs.length, rightPairs.length);
  for (let i = 0; i < maxRows; i++) {
    const rowY = y + i * 6;
    if (leftPairs[i]) {
      doc.setFont(undefined, "bold");
      doc.text(`${leftPairs[i][0]}:`, marginX, rowY);
      doc.setFont(undefined, "normal");
      doc.text(String(leftPairs[i][1]), marginX + 38, rowY);
    }
    if (rightPairs[i]) {
      doc.setFont(undefined, "bold");
      doc.text(`${rightPairs[i][0]}:`, marginX + colWidth, rowY);
      doc.setFont(undefined, "normal");
      doc.text(String(rightPairs[i][1]), marginX + colWidth + 38, rowY);
    }
  }
  y += maxRows * 6 + 6;

  const workingRow1 = workingFields.map((f) => f.label.split(" ")[0]);
  const workingRow2 = workingFields.map((f) => f.value || "0");
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [workingRow1],
    body: [workingRow2],
    headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
    styles: { fontSize: 8, halign: "center" },
  });
  y = doc.lastAutoTable.finalY + 8;

  const shortLabel = (label) => label.replace(/\s*[([].*$/, "").trim();

  const earningsRows = earnings
    .filter((e) => Number(e.value) > 0)
    .map((e) => [shortLabel(e.label), currency(e.value, payPeriod.currency)]);
  const deductionsRows = deductions
    .filter((d) => Number(d.currentValue) > 0)
    .map((d) => [shortLabel(d.label), currency(d.currentValue, payPeriod.currency)]);

  const tableWidth = (pageWidth - marginX * 2 - 8) / 2;

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: pageWidth - marginX - tableWidth },
    tableWidth,
    head: [["Earnings", "Amount"]],
    body: earningsRows.length ? earningsRows : [["-", "-"]],
    foot: [["Gross (Payable)", currency(totals.grossPayable, payPeriod.currency)]],
    headStyles: { fillColor: [16, 122, 87], fontSize: 9 },
    footStyles: { fillColor: [230, 245, 240], textColor: [16, 122, 87], fontStyle: "bold" },
    styles: { fontSize: 9 },
    columnStyles: { 1: { halign: "right" } },
  });
  const earningsFinalY = doc.lastAutoTable.finalY;

  autoTable(doc, {
    startY: y,
    margin: { left: marginX + tableWidth + 8, right: marginX },
    tableWidth,
    head: [["Deductions", "Amount"]],
    body: deductionsRows.length ? deductionsRows : [["-", "-"]],
    foot: [["Gross Deductions", currency(totals.grossDeductions, payPeriod.currency)]],
    headStyles: { fillColor: [153, 27, 27], fontSize: 9 },
    footStyles: { fillColor: [253, 232, 232], textColor: [153, 27, 27], fontStyle: "bold" },
    styles: { fontSize: 9 },
    columnStyles: { 1: { halign: "right" } },
  });

  y = Math.max(earningsFinalY, doc.lastAutoTable.finalY) + 12;

  doc.setFillColor(238, 242, 255);
  doc.roundedRect(marginX, y, pageWidth - marginX * 2, 14, 2, 2, "F");
  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.setTextColor(67, 56, 202);
  doc.text("Net Pay", marginX + 6, y + 9);
  doc.text(currency(totals.netPay, payPeriod.currency), pageWidth - marginX - 6, y + 9, { align: "right" });
  doc.setTextColor(0, 0, 0);

  const employeeName = employeeFields.find((f) => f.key === "employeeName")?.value || "employee";
  doc.save(`payslip-${employeeName.toLowerCase().replace(/\s+/g, "-")}-${MONTHS[payPeriod.month].toLowerCase()}-${payPeriod.year}.pdf`);
}

function currency(amount, code) {
  return `${code} ${(Number(amount) || 0).toFixed(2)}`;
}
