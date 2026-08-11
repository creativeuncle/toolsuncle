import { Router } from "express";
import { runScan, normalizeUrl } from "../scanner/runScan.js";
import { assertPublicUrl } from "../scanner/guardUrl.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const rawUrl = (req.body?.url || "").toString().trim();
    if (!rawUrl) {
      return res.status(400).json({ error: "Enter a URL to scan." });
    }

    let normalized;
    try {
      normalized = normalizeUrl(rawUrl);
      assertPublicUrl(normalized);
    } catch (err) {
      return res.status(400).json({ error: err.message || "That doesn't look like a valid URL." });
    }

    const result = await runScan(normalized);
    if (result.error) {
      return res.status(422).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
