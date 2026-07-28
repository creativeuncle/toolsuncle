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
import SalarySlipGenerator from "./pages/SalarySlipGenerator";
import ResumeBuilder from "./pages/ResumeBuilder";
import BusinessCardMaker from "./pages/BusinessCardMaker";
import JsonFormatter from "./pages/JsonFormatter";
import HashtagGenerator from "./pages/HashtagGenerator";
import YoutubeMoneyCalculator from "./pages/YoutubeMoneyCalculator";
import GstCalculator from "./pages/GstCalculator";
import AgeCalculator from "./pages/AgeCalculator";
import Kundli from "./pages/Kundli";
import DomainNameSearch from "./pages/DomainNameSearch";
import EnglishToHindiTyping from "./pages/EnglishToHindiTyping";
import ConvertCase from "./pages/ConvertCase";
import EmojiCopy from "./pages/EmojiCopy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminBlogs from "./admin/pages/AdminBlogs";
import AdminAddPost from "./admin/pages/AdminAddPost";
import AdminEditPost from "./admin/pages/AdminEditPost";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminFeedback from "./admin/pages/AdminFeedback";
import AdminFeedbackDetail from "./admin/pages/AdminFeedbackDetail";
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
        <Route path="/tools/salary-slip-generator" element={<SalarySlipGenerator />} />
        <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
        <Route path="/tools/business-card-maker" element={<BusinessCardMaker />} />
        <Route path="/tools/json-formatter" element={<JsonFormatter />} />
        <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
        <Route path="/tools/youtube-money-calculator" element={<YoutubeMoneyCalculator />} />
        <Route path="/tools/gst-calculator" element={<GstCalculator />} />
        <Route path="/tools/age-calculator" element={<AgeCalculator />} />
        <Route path="/tools/kundli" element={<Kundli />} />
        <Route path="/tools/domain-name-search" element={<DomainNameSearch />} />
        <Route path="/tools/english-to-hindi-typing" element={<EnglishToHindiTyping />} />
        <Route path="/tools/convert-case" element={<ConvertCase />} />
        <Route path="/tools/emoji-copy" element={<EmojiCopy />} />
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
      <Route
        path="/admin/feedback"
        element={
          <RequireAdmin>
            <AdminFeedback />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/feedback/:id"
        element={
          <RequireAdmin>
            <AdminFeedbackDetail />
          </RequireAdmin>
        }
      />
    </Routes>
  );
}

export default App;
