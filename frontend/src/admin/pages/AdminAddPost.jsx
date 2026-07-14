import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import PostForm from "../components/PostForm";
import { adminApi } from "../adminApi";

export default function AdminAddPost() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    await adminApi.post("/admin/posts", payload);
    navigate("/admin/blogs");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Add Post</h1>
      <PostForm onSubmit={handleSubmit} submitLabel="Publish Post" />
    </AdminLayout>
  );
}
