import { useEffect, useRef, useState } from "react";
import { GripVertical, X } from "lucide-react";

export default function ReorderableImageGrid({ files, onChange }) {
  const [previews, setPreviews] = useState([]);
  const dragIndex = useRef(null);
  const [overIndex, setOverIndex] = useState(null);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleDragStart = (index) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (index !== overIndex) setOverIndex(index);
  };

  const handleDrop = (index) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    setOverIndex(null);
    if (from === null || from === index) return;

    const reordered = [...files];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(index, 0, moved);
    onChange(reordered);
  };

  const removeFile = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={() => setOverIndex(null)}
          className={`group relative rounded-xl border-2 bg-white dark:bg-slate-900 overflow-hidden cursor-grab active:cursor-grabbing transition-colors ${
            overIndex === index
              ? "border-indigo-500"
              : "border-slate-200 dark:border-slate-800"
          }`}
        >
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-black/60 text-white text-xs font-medium px-1.5 py-0.5">
            <GripVertical size={12} />
            {index + 1}
          </div>
          <button
            type="button"
            onClick={() => removeFile(index)}
            className="absolute top-2 right-2 z-10 rounded-full bg-black/60 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X size={14} />
          </button>
          {previews[index] && (
            <img
              src={previews[index]}
              alt={file.name}
              draggable={false}
              className="w-full h-32 sm:h-36 object-cover pointer-events-none"
            />
          )}
          <p className="truncate px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400">{file.name}</p>
        </div>
      ))}
    </div>
  );
}
