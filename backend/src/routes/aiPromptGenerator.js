import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post("/", async (req, res, next) => {
  try {
    const { idea, style, count } = req.body;

    if (!idea || !idea.trim()) {
      return res.status(400).json({ error: "An image idea/description is required" });
    }

    const promptCount = Math.min(10, Math.max(1, parseInt(count, 10) || 4));

    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Generate ${promptCount} detailed, creative AI image generation prompts based on this idea: "${idea}".${
            style ? ` Preferred style: ${style}.` : ""
          } Each prompt should be vivid, specific, and include composition, lighting, and style details. Return ONLY a JSON array of strings, no other text.`,
        },
      ],
    });

    const text = message.content[0]?.text ?? "[]";
    let prompts;
    try {
      prompts = JSON.parse(text);
    } catch {
      prompts = text.split("\n").filter(Boolean);
    }

    res.json({ prompts });
  } catch (err) {
    if (err.status === 401) {
      return res
        .status(401)
        .json({ error: "AI service is not configured correctly. Please set a valid ANTHROPIC_API_KEY." });
    }
    next(err);
  }
});

export default router;
