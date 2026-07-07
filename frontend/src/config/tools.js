import {
  FileImage,
  FileText,
  Layers,
  ImageDown,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

export const tools = [
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Combine one or more images into a single PDF file.",
    icon: FileText,
    path: "/tools/jpg-to-pdf",
    color: "from-rose-500 to-orange-400",
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Turn every page of a PDF into a downloadable JPG image.",
    icon: FileImage,
    path: "/tools/pdf-to-jpg",
    color: "from-sky-500 to-cyan-400",
  },
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one, in the order you choose.",
    icon: Layers,
    path: "/tools/merge-pdf",
    color: "from-violet-500 to-purple-400",
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Shrink image file size while keeping good quality.",
    icon: ImageDown,
    path: "/tools/image-compressor",
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: "heic-to-jpg",
    name: "HEIC to JPG",
    description: "Convert Apple HEIC photos into universally supported JPG.",
    icon: RefreshCcw,
    path: "/tools/heic-to-jpg",
    color: "from-amber-500 to-yellow-400",
  },
  {
    id: "ai-prompt-generator",
    name: "AI Image Prompt Generator",
    description: "Turn a simple idea into detailed prompts for AI image tools.",
    icon: Sparkles,
    path: "/tools/ai-prompt-generator",
    color: "from-fuchsia-500 to-pink-400",
  },
];
