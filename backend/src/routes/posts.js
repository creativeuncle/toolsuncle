import { Router } from "express";
import Post from "../models/Post.js";

const router = Router();

function excerptFrom(html) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 150 ? `${text.slice(0, 150).trim()}…` : text;
}

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category", "name slug")
        .select("title slug content thumbnailUrl author category createdAt"),
      Post.countDocuments(),
    ]);

    const shaped = posts.map((post) => ({
      id: post._id,
      slug: post.slug,
      title: post.title,
      description: excerptFrom(post.content),
      image: post.thumbnailUrl,
      category: post.category?.name || "Uncategorized",
      author: post.author,
      createdAt: post.createdAt,
    }));

    res.json({ posts: shaped, total, hasMore: page * limit < total });
  } catch (err) {
    next(err);
  }
});

export default router;
