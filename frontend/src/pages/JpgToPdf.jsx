import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import FileDropzone from "../components/FileDropzone";
import ReorderableImageGrid from "../components/ReorderableImageGrid";
import Button from "../components/Button";
import { api, downloadBlob, extractErrorMessage } from "../config/api";

const tool = tools.find((t) => t.id === "jpg-to-pdf");

export default function JpgToPdf() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const res = await api.post("/tools/jpg-to-pdf", formData, {
        responseType: "blob",
      });
      downloadBlob(res.data, "converted.pdf");
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
      {step === 1 && (
        <>
          <FileDropzone
            files={files}
            onChange={setFiles}
            accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
            label="Drag & drop JPG/PNG images here, or click to select"
          />

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setStep(2)} disabled={files.length === 0}>
              Arrange Pages
              <ChevronRight size={16} />
            </Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Drag and drop the images to set the page order of your PDF.
          </p>

          <ReorderableImageGrid files={files} onChange={setFiles} />

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>
              <ChevronLeft size={16} />
              Back
            </Button>
            <Button onClick={handleConvert} loading={loading} disabled={files.length === 0}>
              Convert to PDF
            </Button>
          </div>
        </>
      )}
    </ToolPageShell>
  );
}
