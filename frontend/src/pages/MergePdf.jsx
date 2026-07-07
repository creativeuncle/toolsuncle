import { useState } from "react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import FileDropzone from "../components/FileDropzone";
import Button from "../components/Button";
import { api, downloadBlob, extractErrorMessage } from "../config/api";

const tool = tools.find((t) => t.id === "merge-pdf");

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMerge = async () => {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("pdfs", file));

      const res = await api.post("/tools/merge-pdf", formData, {
        responseType: "blob",
      });
      downloadBlob(res.data, "merged.pdf");
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
        accept={{ "application/pdf": [".pdf"] }}
        label="Drag & drop two or more PDF files here, or click to select"
      />

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex justify-end">
        <Button onClick={handleMerge} loading={loading} disabled={files.length < 2}>
          Merge PDFs
        </Button>
      </div>
    </ToolPageShell>
  );
}
