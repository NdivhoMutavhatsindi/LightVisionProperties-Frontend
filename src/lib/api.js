import axios from "axios";

const defaultBaseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000"
  : typeof window !== "undefined"
  ? window.location.origin
  : import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const api = axios.create({
  baseURL: defaultBaseURL,
  withCredentials: true,
});
