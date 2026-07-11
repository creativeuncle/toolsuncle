import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import JpgToPdf from "./pages/JpgToPdf";
import PdfToJpg from "./pages/PdfToJpg";
import MergePdf from "./pages/MergePdf";
import ImageCompressor from "./pages/ImageCompressor";
import HeicToJpg from "./pages/HeicToJpg";
import AiPromptGenerator from "./pages/AiPromptGenerator";
import Blog from "./pages/Blog";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/tools/pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="/tools/merge-pdf" element={<MergePdf />} />
        <Route path="/tools/image-compressor" element={<ImageCompressor />} />
        <Route path="/tools/heic-to-jpg" element={<HeicToJpg />} />
        <Route path="/tools/ai-prompt-generator" element={<AiPromptGenerator />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Layout>
  );
}

export default App;
