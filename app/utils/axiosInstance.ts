import axios from "axios";
import { getAccessToken, logoutSilently, refreshAccessToken } from "../hooks/auth/useAuthStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  withCredentials: true, // penting: kirim cookie refresh token
});

// Inject access token (in-memory)
api.interceptors.request.use((config) => {
  const token = getAccessToken(); // MENGAMBIL DARI MEMORY, BUKAN localStorage
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Kalau token expired → refresh
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const newToken = await refreshAccessToken(); // auto refresh via backend
        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original); // ulang request
        }
      } catch {
        logoutSilently();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
