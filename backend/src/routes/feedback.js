import { Router } from "express";
import Feedback from "../models/Feedback.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, email, message, toolId, toolName } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Feedback message is required" });
    }

    const feedback = await Feedback.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      toolId: toolId || "",
      toolName: toolName || "",
    });

    res.status(201).json({ feedback });
  } catch (err) {
    next(err);
  }
});

export default router;
