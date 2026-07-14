import { Router } from "express";
import Post from "../../models/Post.js";
import { requireAdmin } from "../../middleware/adminAuth.js";

const router = Router();

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category", "name slug"),
      Post.countDocuments(),
    ]);

    res.json({ posts, total, hasMore: page * limit < total });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { title, category, content, thumbnailUrl, seoTitle, seoDescription } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    let slug = slugify(title);
    const existing = await Post.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const post = await Post.create({
      title: title.trim(),
      slug,
      category,
      content,
      thumbnailUrl: thumbnailUrl || "",
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAdmin, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("category", "name slug");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { title, category, content, thumbnailUrl, seoTitle, seoDescription } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (title.trim() !== post.title) {
      let slug = slugify(title);
      const existing = await Post.findOne({ slug, _id: { $ne: post._id } });
      if (existing) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
      post.slug = slug;
    }

    post.title = title.trim();
    post.category = category;
    post.content = content;
    post.thumbnailUrl = thumbnailUrl || "";
    post.seoTitle = seoTitle || "";
    post.seoDescription = seoDescription || "";
    await post.save();

    res.json({ post });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
