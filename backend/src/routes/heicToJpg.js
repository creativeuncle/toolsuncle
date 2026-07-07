import { Router } from "express";
import heicConvert from "heic-convert";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", upload.single("heic"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "A HEIC file is required" });
    }

    const outputBuffer = await heicConvert({
      buffer: req.file.buffer,
      format: "JPEG",
      quality: 0.9,
    });

    res.set({
      "Content-Type": "image/jpeg",
      "Content-Disposition": "attachment; filename=converted.jpg",
    });
    res.send(outputBuffer);
  } catch (err) {
    next(err);
  }
});

export default router;
