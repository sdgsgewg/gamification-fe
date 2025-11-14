import api from "./axiosInstance";
import { AxiosError } from "axios";

export const getAxios = async (url: string, props?: any) => {
  try {
    const res = await api.get(url, {
      withCredentials: true,
      ...props,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const postAxios = async (url: string, body?: any, props?: any) => {
  try {
    const isFormData = body instanceof FormData;

    const res = await api.post(url, body, {
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      withCredentials: true,
      ...props,
    });

    return res.data;
  } catch (err: any) {
    const error = err as AxiosError;

    console.error("POST Error:", {
      url,
      body,
      status: error.response?.status,
      data: error.response?.data,
    });

    throw err;
  }
};

export const putAxios = async (url: string, body?: any, props?: any) => {
  try {
    const isFormData = body instanceof FormData;

    const res = await api.put(url, body, {
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      withCredentials: true,
      ...props,
    });

    return res.data;
  } catch (err) {
    console.error("PUT Error:", err);
    throw err;
  }
};

export const deleteAxios = async (url: string, props?: any) => {
  try {
    const res = await api.delete(url, {
      withCredentials: true,
      ...props,
    });
    return res.data;
  } catch (err) {
    console.error("DELETE Error:", err);
    throw err;
  }
};
