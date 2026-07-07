import axios from "axios";

export const api = axios.create({ baseURL: "/api" });

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function filenameFromDisposition(disposition, fallback) {
  const match = disposition?.match(/filename="?([^"]+)"?/);
  return match ? match[1] : fallback;
}

export async function extractErrorMessage(err) {
  const data = err.response?.data;
  if (data instanceof Blob) {
    try {
      const parsed = JSON.parse(await data.text());
      return parsed.error || "Something went wrong";
    } catch {
      return "Something went wrong";
    }
  }
  return data?.error || "Something went wrong";
}
