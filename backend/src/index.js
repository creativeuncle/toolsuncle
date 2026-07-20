import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";
import jpgToPdfRouter from "./routes/jpgToPdf.js";
import pdfToJpgRouter from "./routes/pdfToJpg.js";
import mergePdfRouter from "./routes/mergePdf.js";
import compressImageRouter from "./routes/compressImage.js";
import heicToJpgRouter from "./routes/heicToJpg.js";
import aiPromptGeneratorRouter from "./routes/aiPromptGenerator.js";
import youtubeChannelRouter from "./routes/youtubeChannel.js";
import postsRouter from "./routes/posts.js";
import adminAuthRouter from "./routes/admin/auth.js";
import adminPostsRouter from "./routes/admin/posts.js";
import adminCategoriesRouter from "./routes/admin/categories.js";
import adminMediaRouter from "./routes/admin/media.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/tools/jpg-to-pdf", jpgToPdfRouter);
app.use("/api/tools/pdf-to-jpg", pdfToJpgRouter);
app.use("/api/tools/merge-pdf", mergePdfRouter);
app.use("/api/tools/compress-image", compressImageRouter);
app.use("/api/tools/heic-to-jpg", heicToJpgRouter);
app.use("/api/tools/ai-prompt-generator", aiPromptGeneratorRouter);
app.use("/api/tools/youtube-channel", youtubeChannelRouter);

app.use("/api/posts", postsRouter);

app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin/posts", adminPostsRouter);
app.use("/api/admin/categories", adminCategoriesRouter);
app.use("/api/admin/media", adminMediaRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Something went wrong" });
});

connectDB().catch((err) => console.error("MongoDB connection error:", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`toolsuncle backend running on http://localhost:${PORT}`);
});
