import axios, { AxiosError } from "axios";

export class BaseResponseDto {
  status: number;
  isSuccess: boolean;
  message: string;

  constructor(status: number, isSuccess: boolean, message: string) {
    this.status = status;
    this.isSuccess = isSuccess;
    this.message = message;
  }
}

export class DetailResponseDto<T> extends BaseResponseDto {
  data?: T;

  constructor(status: number, isSuccess: boolean, message: string, data?: T) {
    super(status, isSuccess, message);
    this.data = data;
  }
}

export interface ApiResponse<T = unknown> {
  status?: number;
  isSuccess: boolean;
  message?: string;
  data?: T;
}

export function handleAxiosError<T = unknown>(error: unknown): ApiResponse<T> {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      isSuccess: false,
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Terjadi kesalahan pada server",
    };
  }

  return {
    isSuccess: false,
    message: "Terjadi kesalahan yang tidak diketahui",
  };
}
