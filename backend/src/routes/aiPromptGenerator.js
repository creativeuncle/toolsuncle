import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res, next) => {
  try {
    const { idea, style, count } = req.body;

    if (!idea || !idea.trim()) {
      return res.status(400).json({ error: "An image idea/description is required" });
    }

    const promptCount = Math.min(10, Math.max(1, parseInt(count, 10) || 4));

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      `Generate ${promptCount} detailed, creative AI image generation prompts based on this idea: "${idea}".${
        style ? ` Preferred style: ${style}.` : ""
      } Each prompt should be vivid, specific, and include composition, lighting, and style details. Return ONLY a JSON array of strings, no other text, no markdown code fences.`
    );

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
    next(err);
  }
});

export default router;
