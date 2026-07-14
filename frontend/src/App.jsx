import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import JpgToPdf from "./pages/JpgToPdf";
import PdfToJpg from "./pages/PdfToJpg";
import MergePdf from "./pages/MergePdf";
import ImageCompressor from "./pages/ImageCompressor";
import HeicToJpg from "./pages/HeicToJpg";
import AiPromptGenerator from "./pages/AiPromptGenerator";
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
        <Route path="/tools/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/tools/pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="/tools/merge-pdf" element={<MergePdf />} />
        <Route path="/tools/image-compressor" element={<ImageCompressor />} />
        <Route path="/tools/heic-to-jpg" element={<HeicToJpg />} />
        <Route path="/tools/ai-prompt-generator" element={<AiPromptGenerator />} />
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
