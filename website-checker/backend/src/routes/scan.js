import { Router } from "express";
import { runScan, normalizeUrl } from "../scanner/runScan.js";
import { assertPublicUrl } from "../scanner/guardUrl.js";
import { saveReport, getReport } from "../scanner/shareStore.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const rawUrl = (req.body?.url || "").toString().trim();
    const deep = Boolean(req.body?.deep);
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

    const result = await runScan(normalized, { deep });
    if (result.error) {
      return res.status(422).json({ error: result.error });
    }

    const shareId = saveReport(result);
    res.json({ ...result, shareId });
  } catch (err) {
    next(err);
  }
});

router.get("/report/:id", (req, res) => {
  const result = getReport(req.params.id);
  if (!result) {
    return res.status(404).json({ error: "This report has expired or doesn't exist." });
  }
  res.json({ ...result, shareId: req.params.id });
});

export default router;
