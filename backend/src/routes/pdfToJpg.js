import { Router } from "express";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import archiver from "archiver";
import { upload } from "../middleware/upload.js";

const execFileAsync = promisify(execFile);
const router = Router();

router.post("/", upload.single("pdf"), async (req, res, next) => {
  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf2jpg-"));
  try {
    if (!req.file) {
      return res.status(400).json({ error: "A PDF file is required" });
    }

    const inputPath = path.join(workDir, "input.pdf");
    await fs.writeFile(inputPath, req.file.buffer);

    const outputPrefix = path.join(workDir, "page");
    await execFileAsync("pdftoppm", ["-jpeg", "-r", "150", inputPath, outputPrefix]);

    const files = (await fs.readdir(workDir))
      .filter((f) => f.startsWith("page") && f.endsWith(".jpg"))
      .sort();

    if (files.length === 0) {
      return res.status(422).json({ error: "Could not extract any pages from the PDF" });
    }

    if (files.length === 1) {
      const buffer = await fs.readFile(path.join(workDir, files[0]));
      res.set({
        "Content-Type": "image/jpeg",
        "Content-Disposition": "attachment; filename=page-1.jpg",
      });
      return res.send(buffer);
    }

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=pages.zip",
    });

    const archive = archiver("zip");
    archive.pipe(res);
    for (let i = 0; i < files.length; i++) {
      const buffer = await fs.readFile(path.join(workDir, files[i]));
      archive.append(buffer, { name: `page-${i + 1}.jpg` });
    }
    await archive.finalize();
  } catch (err) {
    next(err);
  } finally {
    await fs.rm(workDir, { recursive: true, force: true });
  }
});

export default router;
