import { Router } from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { upload } from "../middleware/upload.js";

const execFileAsync = promisify(execFile);
const router = Router();

router.post("/", upload.single("pdf"), async (req, res, next) => {
  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-unlock-"));
  try {
    if (!req.file) {
      return res.status(400).json({ error: "A PDF file is required" });
    }
    const password = req.body.password || "";
    if (!password) {
      return res.status(400).json({ error: "Enter the PDF's password" });
    }

    const inputPath = path.join(workDir, "input.pdf");
    const outputPath = path.join(workDir, "output.pdf");
    await fs.writeFile(inputPath, req.file.buffer);

    await execFileAsync("qpdf", [`--password=${password}`, "--decrypt", inputPath, outputPath]);

    const buffer = await fs.readFile(outputPath);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=unlocked.pdf",
    });
    res.send(buffer);
  } catch (err) {
    const message = err.stderr || err.message || "";
    if (/invalid password/i.test(message)) {
      return res.status(401).json({ error: "Incorrect password. Please double-check and try again." });
    }
    next(err);
  } finally {
    await fs.rm(workDir, { recursive: true, force: true });
  }
});

export default router;
