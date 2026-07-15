import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function money(amount, symbol) {
  return `${symbol}${(Number(amount) || 0).toFixed(2)}`;
}

export function generateInvoicePdf(invoice) {
  const {
    logoDataUrl,
    logoFormat,
    invoiceNumber,
    yourDetails,
    billTo,
    invoiceDate,
    paymentTerms,
    dueDate,
    poNumber,
    lineItems,
    discount,
    tax,
    shipping,
    amountPaid,
    notes,
    terms,
    currencySymbol,
  } = invoice;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 15;
  let y = 15;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, logoFormat, marginX, y, 30, 30, undefined, "FAST");
    } catch {
      // ignore unsupported image data
    }
  }

  doc.setFontSize(22);
  doc.setFont(undefined, "bold");
  doc.text("INVOICE", pageWidth - marginX, y + 8, { align: "right" });
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Invoice #: ${invoiceNumber || "-"}`, pageWidth - marginX, y + 15, { align: "right" });

  y += 40;

  const colWidth = (pageWidth - marginX * 2) / 2;

  doc.setFont(undefined, "bold");
  doc.text("Your Details", marginX, y);
  doc.text("Bill To", marginX + colWidth, y);
  doc.setFont(undefined, "normal");

  const detailLines = (details) =>
    [details.companyName, details.address, details.phone, details.email].filter(Boolean);

  const yourLines = detailLines(yourDetails);
  const billLines = detailLines(billTo);
  const maxLines = Math.max(yourLines.length, billLines.length, 1);

  for (let i = 0; i < maxLines; i++) {
    const lineY = y + 6 + i * 5;
    if (yourLines[i]) doc.text(yourLines[i], marginX, lineY);
    if (billLines[i]) doc.text(billLines[i], marginX + colWidth, lineY);
  }

  y += 6 + maxLines * 5 + 8;

  const metaCols = [
    ["Invoice Date", invoiceDate],
    ["Payment Terms", paymentTerms],
    ["Due Date", dueDate],
    ["PO Number", poNumber],
  ];
  const metaColWidth = (pageWidth - marginX * 2) / 4;
  metaCols.forEach(([label, value], i) => {
    const x = marginX + i * metaColWidth;
    doc.setFont(undefined, "bold");
    doc.text(label, x, y);
    doc.setFont(undefined, "normal");
    doc.text(value || "-", x, y + 5);
  });

  y += 14;

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [["Item", "Quantity", "Rate", "Amount"]],
    body: lineItems.map((item) => [
      item.item || "-",
      String(item.quantity || 0),
      money(item.rate, currencySymbol),
      money((item.quantity || 0) * (item.rate || 0), currencySymbol),
    ]),
    headStyles: { fillColor: [30, 41, 59] },
    styles: { fontSize: 10 },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  const subtotal = lineItems.reduce((sum, i) => sum + (i.quantity || 0) * (i.rate || 0), 0);
  const discountAmount = subtotal * ((discount || 0) / 100);
  const taxAmount = (subtotal - discountAmount) * ((tax || 0) / 100);
  const total = subtotal - discountAmount + taxAmount + (shipping || 0);
  const balanceDue = total - (amountPaid || 0);

  const totalsX = pageWidth - marginX;
  const totalsLabelX = totalsX - 55;
  const totalsRows = [
    ["Subtotal", money(subtotal, currencySymbol)],
    [`Discount (${discount || 0}%)`, money(discountAmount, currencySymbol)],
    [`Tax (${tax || 0}%)`, money(taxAmount, currencySymbol)],
    ["Shipping", money(shipping, currencySymbol)],
  ];

  doc.setFontSize(10);
  totalsRows.forEach(([label, value]) => {
    doc.text(label, totalsLabelX, y);
    doc.text(value, totalsX, y, { align: "right" });
    y += 6;
  });

  doc.setDrawColor(200);
  doc.line(totalsLabelX, y, totalsX, y);
  y += 6;

  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.text("Total", totalsLabelX, y);
  doc.text(money(total, currencySymbol), totalsX, y, { align: "right" });
  y += 8;

  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text("Amount Paid", totalsLabelX, y);
  doc.text(money(amountPaid, currencySymbol), totalsX, y, { align: "right" });
  y += 6;

  doc.setFont(undefined, "bold");
  doc.text("Balance Due", totalsLabelX, y);
  doc.text(money(balanceDue, currencySymbol), totalsX, y, { align: "right" });
  y += 14;

  doc.setFont(undefined, "normal");
  if (notes) {
    doc.setFont(undefined, "bold");
    doc.text("Notes", marginX, y);
    doc.setFont(undefined, "normal");
    y += 5;
    const noteLines = doc.splitTextToSize(notes, pageWidth - marginX * 2);
    doc.text(noteLines, marginX, y);
    y += noteLines.length * 5 + 6;
  }

  if (terms) {
    doc.setFont(undefined, "bold");
    doc.text("Terms", marginX, y);
    doc.setFont(undefined, "normal");
    y += 5;
    const termLines = doc.splitTextToSize(terms, pageWidth - marginX * 2);
    doc.text(termLines, marginX, y);
  }

  doc.save(`invoice-${invoiceNumber || "draft"}.pdf`);
}
