import axios from "axios";
// import Constants from "expo-constants";
import { getToken, setItem } from "./storage";

const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.warn("NEXT_PUBLIC_API_URL is not defined, using default");
    return "http://localhost:3001/api";
  }
  return `${apiUrl}/api`;
};

const BASE_URL = getBaseUrl();

export const getUrl = (url: string) => {
  return `${BASE_URL}${url}`;
};

// Helper functions
export const getAxios = async (url: string, props?: any) => {
  try {
    const token = await getToken();

    const response = await axios.get(getUrl(url), {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        "cache-control": "no-store",
      },
      withCredentials: true, // wajib untuk refresh token
      ...props,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postAxios = async (url: string, body?: any, props?: any) => {
  try {
    const token = await getToken();

    const isFormData = body instanceof FormData;

    const response = await axios.post(getUrl(url), body, {
      headers: {
        ...(isFormData
          ? {} // axios akan set multipart otomatis
          : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "cache-control": "no-store",
      },
      withCredentials: true,
      ...props,
    });

    return response.data;
  } catch (error: any) {
    console.error("Detailed POST error:", {
      url,
      requestBody: body,
      errorResponse: error.response?.data,
      errorMessage: error.message,
    });

    const errorToThrow = new Error(
      error.response?.data?.message || error.message || "Request failed"
    );
    (errorToThrow as any).status = error.response?.status;
    throw errorToThrow;
  }
};

export const putAxios = async (url: string, body?: any, props?: any) => {
  try {
    const token = await getToken();

    const isFormData = body instanceof FormData;

    const response = await axios.put(getUrl(url), body, {
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "cache-control": "no-store",
      },
      withCredentials: true,
      ...props,
    });

    return response.data;
  } catch (error) {
    console.error("Error in putAxios:", error);
    throw error;
  }
};

export const deleteAxios = async <T = any,>(
  url: string,
  props?: any
): Promise<T> => {
  try {
    const response = await axios.delete(getUrl(url), {
      headers: {
        "Content-Type": "application/json",
        Authorization: await getToken(),
        "cache-control": "no-store",
      },
      withCredentials: true,
      ...props,
    });
    return response.data;
  } catch (error) {
    console.error("Error in deleteAxios:", error);
    throw error;
  }
};
