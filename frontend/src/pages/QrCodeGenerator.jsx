import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import { downloadBlob } from "../config/api";

const tool = tools.find((t) => t.id === "qr-code-generator");

export default function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl("");
      setError("");
      return;
    }

    QRCode.toDataURL(text, { width: 320, margin: 1 })
      .then((url) => {
        setDataUrl(url);
        setError("");
      })
      .catch(() => setError("Couldn't generate a QR code for this input"));
  }, [text]);

  const handleDownload = async () => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    downloadBlob(blob, "qr-code.png");
  };

  return (
    <ToolPageShell
      icon={tool.icon}
      color={tool.color}
      title={tool.name}
      description={tool.description}
    >
      <label className="block text-sm font-medium mb-1.5">Text or URL</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="https://example.com"
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {dataUrl && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <img
            src={dataUrl}
            alt="Generated QR code"
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-4"
          />
          <Button onClick={handleDownload}>Download PNG</Button>
        </div>
      )}
    </ToolPageShell>
  );
}
