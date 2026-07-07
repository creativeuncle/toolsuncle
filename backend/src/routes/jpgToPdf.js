import { Router } from "express";
import { PDFDocument } from "pdf-lib";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", upload.array("images", 30), async (req, res, next) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      const isPng = file.mimetype === "image/png";
      const buffer = Buffer.from(file.buffer);
      const image = isPng
        ? await pdfDoc.embedPng(buffer)
        : await pdfDoc.embedJpg(buffer);

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }

    const pdfBytes = await pdfDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=converted.pdf",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    next(err);
  }
});

export default router;
