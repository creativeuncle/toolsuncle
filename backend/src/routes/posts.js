import { Router } from "express";
import Post from "../models/Post.js";
import Category from "../models/Category.js";

const router = Router();

function excerptFrom(html) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 150 ? `${text.slice(0, 150).trim()}…` : text;
}

function shapeListItem(post) {
  return {
    id: post._id,
    slug: post.slug,
    title: post.title,
    description: excerptFrom(post.content),
    image: post.thumbnailUrl,
    category: post.category?.name || "Uncategorized",
    categorySlug: post.category?.slug || "",
    author: post.author,
    createdAt: post.createdAt,
  };
}

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));

    const filter = {};
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (!category) {
        return res.json({ posts: [], total: 0, hasMore: false });
      }
      filter.category = category._id;
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category", "name slug")
        .select("title slug content thumbnailUrl author category createdAt"),
      Post.countDocuments(filter),
    ]);

    res.json({ posts: posts.map(shapeListItem), total, hasMore: page * limit < total });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("category", "name slug");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      post: {
        id: post._id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        image: post.thumbnailUrl,
        category: post.category?.name || "Uncategorized",
        categorySlug: post.category?.slug || "",
        author: post.author,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        createdAt: post.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
