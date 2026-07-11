import { Router } from "express";
import Category from "../../models/Category.js";
import { requireAdmin } from "../../middleware/adminAuth.js";

const router = Router();

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const slug = slugify(name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({ error: "A category with this name already exists" });
    }

    const category = await Category.create({ name: name.trim(), slug });
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
});

export default router;
