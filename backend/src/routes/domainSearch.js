import { Router } from "express";
import dns from "dns";

const router = Router();

const TLDS = [
  "com", "net", "org", "in", "io", "xyz", "co", "app", "info", "dev",
  "store", "online", "site", "tech", "bond", "lol", "blog", "me", "art",
  "chat", "link", "cloud", "fun", "space", "host", "life", "world", "plus",
  "group", "events", "travel", "digital", "media", "email", "news", "design",
  "photos", "studio", "global", "business", "live",
];

async function checkDomain(domain) {
  try {
    const records = await dns.promises.resolve(domain, "NS");
    return records && records.length > 0 ? "taken" : "available";
  } catch (err) {
    if (err.code === "ENOTFOUND" || err.code === "ENODATA") {
      return "available";
    }
    return "unknown";
  }
}

router.get("/", async (req, res, next) => {
  try {
    const keyword = (req.query.keyword || "").toString().trim().toLowerCase();
    if (!keyword) {
      return res.status(400).json({ error: "Provide a keyword to search." });
    }
    if (!/^[a-z0-9-]+$/.test(keyword)) {
      return res.status(400).json({ error: "Keyword can only contain letters, numbers, and hyphens." });
    }

    const results = await Promise.all(
      TLDS.map(async (tld) => {
        const domain = `${keyword}.${tld}`;
        const status = await checkDomain(domain);
        return { tld, domain, status };
      })
    );

    res.json({ keyword, results });
  } catch (err) {
    next(err);
  }
});

export default router;
