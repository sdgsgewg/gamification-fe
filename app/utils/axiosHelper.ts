import axios, { AxiosError } from "axios";

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

export function handleAxiosError<T = unknown>(error: unknown): ApiResponse<T> {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      ok: false,
      error:
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Terjadi kesalahan pada server",
    };
  }

  return {
    ok: false,
    error: "Terjadi kesalahan yang tidak diketahui",
  };
}
