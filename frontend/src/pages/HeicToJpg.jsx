import { useState } from "react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import FileDropzone from "../components/FileDropzone";
import Button from "../components/Button";
import { api, downloadBlob, extractErrorMessage } from "../config/api";

const tool = tools.find((t) => t.id === "heic-to-jpg");

export default function HeicToJpg() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("heic", files[0]);

      const res = await api.post("/tools/heic-to-jpg", formData, {
        responseType: "blob",
      });
      downloadBlob(res.data, "converted.jpg");
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
        onChange={setFiles}
        accept={{ "image/heic": [".heic"], "image/heif": [".heif"] }}
        multiple={false}
        label="Drag & drop a HEIC file here, or click to select"
      />

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex justify-end">
        <Button onClick={handleConvert} loading={loading} disabled={files.length === 0}>
          Convert to JPG
        </Button>
      </div>
    </ToolPageShell>
  );
}
