import { Router } from "express";
import { PDFDocument } from "pdf-lib";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", upload.array("pdfs", 20), async (req, res, next) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: "At least two PDF files are required" });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdf = await PDFDocument.load(Buffer.from(file.buffer));
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=merged.pdf",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    next(err);
  }
});

export default router;
