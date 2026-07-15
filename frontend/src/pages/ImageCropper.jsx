import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import FileDropzone from "../components/FileDropzone";
import Button from "../components/Button";
import { getCroppedImageBlob } from "../utils/cropImage";
import { downloadBlob } from "../config/api";

const tool = tools.find((t) => t.id === "image-cropper");

const ASPECT_OPTIONS = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
];

export default function ImageCropper() {
  const [files, setFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [error, setError] = useState("");

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
    if (newFiles[0]) {
      setImageUrl(URL.createObjectURL(newFiles[0]));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } else {
      setImageUrl("");
    }
  };

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleDownload = async () => {
    setError("");
    try {
      const blob = await getCroppedImageBlob(imageUrl, croppedAreaPixels);
      downloadBlob(blob, "cropped.png");
    } catch {
      setError("Couldn't crop this image");
    }
  };

  return (
    <ToolPageShell
      icon={tool.icon}
      color={tool.color}
      title={tool.name}
      description={tool.description}
    >
      {!imageUrl ? (
        <FileDropzone
          files={files}
          onChange={handleFilesChange}
          accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
          multiple={false}
          label="Drag & drop an image here, or click to select"
        />
      ) : (
        <>
          <div className="relative w-full h-96 rounded-xl overflow-hidden bg-slate-900">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect || undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden">
              {ASPECT_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setAspect(opt.value)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    aspect === opt.value
                      ? "bg-indigo-600 text-white"
                      : "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-[160px]">
              <span className="text-sm text-slate-500 dark:text-slate-400">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => handleFilesChange([])}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Choose another image
            </button>
            <Button onClick={handleDownload}>Crop & Download</Button>
          </div>
        </>
      )}
    </ToolPageShell>
  );
}
