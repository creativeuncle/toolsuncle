import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { upload } from "../middleware/upload.js";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "An image file is required" });
    }

    const count = Math.min(10, Math.max(1, parseInt(req.body.count, 10) || 4));

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: req.file.buffer.toString("base64"),
        },
      },
      `Look at this image and generate ${count} detailed AI image generation prompts that could recreate a similar image. Describe the subject, composition, lighting, color palette, and artistic style you observe. Return ONLY a JSON array of strings, no other text, no markdown code fences.`,
    ]);

    const text = result.response.text().replace(/```json|```/g, "").trim();
    let prompts;
    try {
      prompts = JSON.parse(text);
    } catch {
      prompts = text.split("\n").filter(Boolean);
    }

    res.json({ prompts });
  } catch (err) {
    if (err.status === 401 || err.status === 403 || /API key/i.test(err.message || "")) {
      return res
        .status(401)
        .json({ error: "AI service is not configured correctly. Please set a valid GEMINI_API_KEY." });
    }
    if (err.status === 429) {
      return res
        .status(429)
        .json({ error: "Gemini's free-tier request limit was hit. Wait a bit and try again." });
    }
    next(err);
  }
});

export default router;
