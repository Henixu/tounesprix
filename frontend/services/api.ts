import axios from "axios";

export const TOKEN_STORAGE_KEY = "tounesprix_token";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export function getApiErrorMessage(error: unknown, fallback = "Une erreur est survenue.") {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return fallback;
}
