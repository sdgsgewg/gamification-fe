// axiosInstance.ts
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import {
  getAccessToken,
  refreshAccessToken,
  logoutSilently,
} from "../hooks/auth/useAuthStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  withCredentials: true, // send refresh cookie
});

// Request interceptor to inject Authorization header
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    try {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with single-refresh queue logic
api.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }
  ) => {
    const original = error.config;

    // if no config or not our API call, just reject
    if (!original) return Promise.reject(error);

    const status = error.response?.status;

    // Only attempt refresh for 401
    if (status === 401 && !original._retry) {
      original._retry = true;

      try {
        // refreshAccessToken uses queue to avoid concurrent refresh
        const newToken = await refreshAccessToken();

        if (newToken) {
          // set header and retry
          if (!original.headers) original.headers = {};
          original.headers.Authorization = `Bearer ${newToken}`;

          // note: return api(original) directly to retry request
          return api(original);
        } else {
          // refresh failed — perform silent logout cleanup
          logoutSilently();
        }
      } catch (refreshErr) {
        // On refresh error, ensure logout cleanup
        logoutSilently();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
