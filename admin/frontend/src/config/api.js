import axios from "axios";

const TOKEN_KEY = "superadmin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function withAuth(instance) {
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return instance;
}

// One JWT (same JWT_SECRET across backends) is meant to authenticate
// against every tool's backend — each backend just needs its own
// requireAdmin middleware that verifies with that shared secret.
export const dctoolsApi = withAuth(
  axios.create({ baseURL: import.meta.env.VITE_DCTOOLS_API_URL || "http://localhost:5001/api" })
);

export const websiteCheckerApi = withAuth(
  axios.create({ baseURL: import.meta.env.VITE_WEBSITE_CHECKER_API_URL || "http://localhost:5501/api" })
);

export async function extractErrorMessage(err) {
  return err.response?.data?.error || "Something went wrong. Please try again.";
}
