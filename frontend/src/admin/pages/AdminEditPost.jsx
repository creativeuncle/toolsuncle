import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import PostForm from "../components/PostForm";
import { adminApi } from "../adminApi";

export default function AdminEditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .get(`/admin/posts/${id}`)
      .then((res) => setPost(res.data.post))
      .catch((err) => setError(err.response?.data?.error || "Failed to load post"));
  }, [id]);

  const handleSubmit = async (payload) => {
    await adminApi.put(`/admin/posts/${id}`, payload);
    navigate("/admin/blogs");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Edit Post</h1>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {post && <PostForm initialPost={post} onSubmit={handleSubmit} submitLabel="Save Changes" />}
    </AdminLayout>
  );
}
