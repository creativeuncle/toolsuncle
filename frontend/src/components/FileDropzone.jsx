import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

export default function FileDropzone({ files, onChange, accept, multiple = true, label }) {
  const onDrop = useCallback(
    (accepted) => {
      onChange(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
    },
    [files, multiple, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  const removeFile = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
            : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="text-slate-400" size={32} />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {label || "Drag & drop files here, or click to select"}
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm"
            >
              <span className="truncate mr-2">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-slate-400 hover:text-red-500 shrink-0"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
