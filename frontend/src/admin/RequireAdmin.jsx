import { Navigate } from "react-router-dom";
import { getAdminToken } from "./adminApi";

export default function RequireAdmin({ children }) {
  if (!getAdminToken()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
