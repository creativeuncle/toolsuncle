import "dotenv/config";
import express from "express";
import cors from "cors";
import scanRouter from "./routes/scan.js";
import { closeBrowser } from "./scanner/browserScan.js";

const app = express();
const PORT = process.env.PORT || 5501;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/scan", scanRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Something went wrong" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`website-checker backend running on http://localhost:${PORT}`);
});

async function shutdown() {
  await closeBrowser();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
