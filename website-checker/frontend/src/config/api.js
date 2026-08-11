import axios from "axios";

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

export async function extractErrorMessage(err) {
  return err.response?.data?.error || "Something went wrong. Please try again.";
}
