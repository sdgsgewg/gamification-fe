// lib/apiClient.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // base URL NestJS API
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper functions
export const get = async <T = any>(url: string) => {
  const response = await api.get<T>(url);
  return response.data;
};

export const post = async <T = any>(url: string, data: any) => {
  const response = await api.post<T>(url, data);
  return response.data;
};

export const put = async <T = any>(url: string, data: any) => {
  const response = await api.put<T>(url, data);
  return response.data;
};

export const del = async <T = any>(url: string) => {
  const response = await api.delete<T>(url);
  return response.data;
};
