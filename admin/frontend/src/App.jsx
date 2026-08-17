import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToolProvider } from "./context/ToolContext";
import RequireAuth from "./auth/RequireAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import DctoolsOverview from "./pages/dctools/Overview";
import Blogs from "./pages/dctools/Blogs";
import Categories from "./pages/dctools/Categories";
import Feedback from "./pages/dctools/Feedback";
import FeedbackDetail from "./pages/dctools/FeedbackDetail";
import WebsiteCheckerComingSoon from "./pages/website-checker/ComingSoon";

function ProtectedShell() {
  return (
    <RequireAuth>
      <ToolProvider>
        <Layout>
          <Outlet />
        </Layout>
      </ToolProvider>
    </RequireAuth>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedShell />}>
        <Route path="/" element={<Navigate to="/dctools" replace />} />
        <Route path="/dctools" element={<DctoolsOverview />} />
        <Route path="/dctools/blogs" element={<Blogs />} />
        <Route path="/dctools/categories" element={<Categories />} />
        <Route path="/dctools/feedback" element={<Feedback />} />
        <Route path="/dctools/feedback/:id" element={<FeedbackDetail />} />
        <Route path="/website-checker" element={<WebsiteCheckerComingSoon />} />
      </Route>
    </Routes>
  );
}

export default App;
