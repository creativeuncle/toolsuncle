import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AllTools from "./pages/AllTools";
import JpgToPdf from "./pages/JpgToPdf";
import PdfToJpg from "./pages/PdfToJpg";
import MergePdf from "./pages/MergePdf";
import ImageCompressor from "./pages/ImageCompressor";
import HeicToJpg from "./pages/HeicToJpg";
import AiPromptGenerator from "./pages/AiPromptGenerator";
import ImageCropper from "./pages/ImageCropper";
import WordCounter from "./pages/WordCounter";
import LoremIpsumGenerator from "./pages/LoremIpsumGenerator";
import QrCodeGenerator from "./pages/QrCodeGenerator";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import ResumeBuilder from "./pages/ResumeBuilder";
import JsonFormatter from "./pages/JsonFormatter";
import HashtagGenerator from "./pages/HashtagGenerator";
import YoutubeMoneyCalculator from "./pages/YoutubeMoneyCalculator";
import GstCalculator from "./pages/GstCalculator";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminBlogs from "./admin/pages/AdminBlogs";
import AdminAddPost from "./admin/pages/AdminAddPost";
import AdminEditPost from "./admin/pages/AdminEditPost";
import AdminCategories from "./admin/pages/AdminCategories";
import RequireAdmin from "./admin/RequireAdmin";

function PublicLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<AllTools />} />
        <Route path="/tools/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/tools/pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="/tools/merge-pdf" element={<MergePdf />} />
        <Route path="/tools/image-compressor" element={<ImageCompressor />} />
        <Route path="/tools/heic-to-jpg" element={<HeicToJpg />} />
        <Route path="/tools/ai-prompt-generator" element={<AiPromptGenerator />} />
        <Route path="/tools/image-cropper" element={<ImageCropper />} />
        <Route path="/tools/word-counter" element={<WordCounter />} />
        <Route path="/tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
        <Route path="/tools/qr-code-generator" element={<QrCodeGenerator />} />
        <Route path="/tools/invoice-generator" element={<InvoiceGenerator />} />
        <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
        <Route path="/tools/json-formatter" element={<JsonFormatter />} />
        <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
        <Route path="/tools/youtube-money-calculator" element={<YoutubeMoneyCalculator />} />
        <Route path="/tools/gst-calculator" element={<GstCalculator />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/category/:slug" element={<BlogCategory />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Route>

      <Route path="/admin" element={<Navigate to="/admin/blogs" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/blogs"
        element={
          <RequireAdmin>
            <AdminBlogs />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/blogs/new"
        element={
          <RequireAdmin>
            <AdminAddPost />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/blogs/:id/edit"
        element={
          <RequireAdmin>
            <AdminEditPost />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <RequireAdmin>
            <AdminCategories />
          </RequireAdmin>
        }
      />
    </Routes>
  );
}

export default App;
