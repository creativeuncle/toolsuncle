import "dotenv/config";
import express from "express";
import cors from "cors";

import jpgToPdfRouter from "./routes/jpgToPdf.js";
import pdfToJpgRouter from "./routes/pdfToJpg.js";
import mergePdfRouter from "./routes/mergePdf.js";
import compressImageRouter from "./routes/compressImage.js";
import heicToJpgRouter from "./routes/heicToJpg.js";
import aiPromptGeneratorRouter from "./routes/aiPromptGenerator.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/tools/jpg-to-pdf", jpgToPdfRouter);
app.use("/api/tools/pdf-to-jpg", pdfToJpgRouter);
app.use("/api/tools/merge-pdf", mergePdfRouter);
app.use("/api/tools/compress-image", compressImageRouter);
app.use("/api/tools/heic-to-jpg", heicToJpgRouter);
app.use("/api/tools/ai-prompt-generator", aiPromptGeneratorRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`toolsuncle backend running on http://localhost:${PORT}`);
});
