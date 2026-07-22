import { Router } from "express";
import Feedback from "../../models/Feedback.js";
import { requireAdmin } from "../../middleware/adminAuth.js";

const router = Router();

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const [feedback, total] = await Promise.all([
      Feedback.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Feedback.countDocuments(),
    ]);

    res.json({ feedback, total, hasMore: page * limit < total });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAdmin, async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json({ feedback });
  } catch (err) {
    next(err);
  }
});

export default router;
