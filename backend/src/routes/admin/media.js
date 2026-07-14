import { Router } from "express";
import Media from "../../models/Media.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import { upload } from "../../middleware/upload.js";

const router = Router();

router.post("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "An image file is required" });
    }

    const media = await Media.create({
      mimeType: req.file.mimetype,
      data: req.file.buffer,
    });

    const publicUrl = `${req.protocol}://${req.get("host")}/api/admin/media/${media._id}`;
    res.status(201).json({ url: publicUrl });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: "Not found" });
    }
    res.set("Content-Type", media.mimeType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(media.data);
  } catch (err) {
    next(err);
  }
});

export default router;
