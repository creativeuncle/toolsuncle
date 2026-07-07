import { useState } from "react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import FileDropzone from "../components/FileDropzone";
import Button from "../components/Button";
import { api, downloadBlob, extractErrorMessage } from "../config/api";

const tool = tools.find((t) => t.id === "image-compressor");

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
}

export default function ImageCompressor() {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(70);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleCompress = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", files[0]);
      formData.append("quality", quality);

      const res = await api.post("/tools/compress-image", formData, {
        responseType: "blob",
      });

      const originalSize = files[0].size;
      const compressedSize = Number(res.headers["x-compressed-size"]) || res.data.size;
      setResult({ blob: res.data, originalSize, compressedSize });
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageShell
      icon={tool.icon}
      color={tool.color}
      title={tool.name}
      description={tool.description}
    >
      <FileDropzone
        files={files}
        onChange={(f) => {
          setFiles(f);
          setResult(null);
        }}
        accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
        multiple={false}
        label="Drag & drop a JPG/PNG image here, or click to select"
      />

      <div className="mt-6">
        <label className="flex items-center justify-between text-sm font-medium mb-2">
          <span>Quality</span>
          <span className="text-slate-500">{quality}%</span>
        </label>
        <input
          type="range"
          min="10"
          max="95"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {result && (
        <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          Reduced from {formatBytes(result.originalSize)} to {formatBytes(result.compressedSize)} (
          {Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100))}%
          smaller)
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        {result && (
          <Button variant="success" onClick={() => downloadBlob(result.blob, "compressed.jpg")}>
            Download
          </Button>
        )}
        <Button onClick={handleCompress} loading={loading} disabled={files.length === 0}>
          Compress Image
        </Button>
      </div>
    </ToolPageShell>
  );
}
