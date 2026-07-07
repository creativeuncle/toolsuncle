import { Router } from "express";
import sharp from "sharp";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "An image file is required" });
    }

    const quality = Math.min(100, Math.max(1, parseInt(req.body.quality, 10) || 70));
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();
    const format = metadata.format === "png" ? "png" : "jpeg";

    const output =
      format === "png"
        ? await image.png({ quality, compressionLevel: 9 }).toBuffer()
        : await image.jpeg({ quality, mozjpeg: true }).toBuffer();

    res.set({
      "Content-Type": `image/${format}`,
      "Content-Disposition": `attachment; filename=compressed.${format === "png" ? "png" : "jpg"}`,
      "X-Original-Size": req.file.buffer.length,
      "X-Compressed-Size": output.length,
    });
    res.send(output);
  } catch (err) {
    next(err);
  }
});

export default router;
