"use client";

import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { getItem, setItem, clearStorage } from "../utils/storage";
import { getAxios, postAxios } from "../utils/AxiosFunction";
import { RegisterRequest } from "../schemas/auth/register";
import { CompleteProfileFormInputs } from "../schemas/auth/completeProfile";
import { LoginFormInputs } from "../schemas/auth/login";
import { ForgotPasswordInputs } from "../schemas/auth/forgotPassword";
import {
  ApiResponse,
  BaseResponseDto,
  DetailResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { LoginDetailResponse } from "../interface/auth/responses/ILoginDetailResponse";
import { UserDetailResponse } from "../interface/users/responses/IUserDetailResponse";

const API_URL = "/auth";

export const authEventTarget = new EventTarget();

export function useAuth() {
  // State utama
  const [sessionToken, setSessionToken] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Token validator
  const isTokenValid = useCallback((token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, []);

  // User ID extractor
  const getUserId = useCallback((): string => {
    if (!sessionToken) return "";
    try {
      const decoded: any = jwtDecode(sessionToken);
      return decoded.uid || decoded.userId || "";
    } catch {
      return "";
    }
  }, [sessionToken]);

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await getAxios("/users/me");

      setUserProfile(res);
      setItem("userProfile", JSON.stringify(res));
      return res;
    } catch (err) {
      console.error("User profile not available: ", err);
    }
  }, []);

  // Inisialisasi auth (mirip init())
  const init = useCallback(async () => {
    const token = getItem("sessionToken");
    const status = getItem("isLoggedIn");
    const storedUser = getItem("userProfile");
    const firstTime = getItem("firstTimeUser");

    if (firstTime) {
      setIsFirstTime(JSON.parse(firstTime));
    }

    if (token && isTokenValid(token)) {
      setSessionToken(token);
      setIsLoggedIn(true);
      setIsGuest(false);

      if (storedUser) setUserProfile(JSON.parse(storedUser));
      else await fetchUserProfile();
    } else {
      try {
        const refresh = await postAxios(`${API_URL}/refresh`);
        if (refresh?.accessToken) {
          setSessionToken(refresh.accessToken);
          setIsLoggedIn(true);
          setIsGuest(false);
          setItem("sessionToken", refresh.accessToken);
          setItem("isLoggedIn", JSON.stringify(true));
          await fetchUserProfile();
        }
      } catch (err) {
        const axiosErr = err as AxiosError;
        console.warn("Refresh token failed during init:", {
          status: axiosErr?.response?.status,
          data: axiosErr?.response?.data,
        });
        clearStorage();
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    }

    setLoading(false);
  }, [fetchUserProfile, isTokenValid]);

  // Jalankan init saat mount
  useEffect(() => {
    init();
  }, [init]);

  // Register
  const register = async (
    payload: RegisterRequest
  ): Promise<ApiResponse<null>> => {
    try {
      const res: BaseResponseDto = await postAxios(
        `${API_URL}/register`,
        payload
      );
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  };

  // Verify email
  const verifyEmail = async (token: string): Promise<ApiResponse<string>> => {
    try {
      const res: DetailResponseDto<string> = await postAxios(
        `${API_URL}/verify-email`,
        { token }
      );
      return res;
    } catch (error) {
      return handleAxiosError<string>(error);
    }
  };

  // Complete profile
  const completeProfile = async (
    uid: string,
    values: CompleteProfileFormInputs
  ): Promise<ApiResponse<null>> => {
    try {
      const res: BaseResponseDto = await postAxios(
        `${API_URL}/complete-profile?uid=${uid}`,
        values
      );
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  };

  // Login
  const login = async (
    values: LoginFormInputs
  ): Promise<ApiResponse<LoginDetailResponse>> => {
    try {
      const res: DetailResponseDto<LoginDetailResponse> = await postAxios(
        `${API_URL}/login`,
        values
      );

      const data = res.data;
      if (!data || !data.accessToken)
        throw new Error("Invalid response structure - missing access token");

      // Simpan ke localStorage
      setItem("sessionToken", data.accessToken);
      setItem("isLoggedIn", JSON.stringify(true));
      setItem("userProfile", JSON.stringify(data.user));

      // Simpan ke state
      setSessionToken(data.accessToken);
      setIsLoggedIn(true);
      setUserProfile(data.user);
      setIsGuest(false);

      // Set cookie role
      document.cookie = `role=${data.user.role.name}; path=/;`;

      return res;
    } catch (error) {
      return handleAxiosError<LoginDetailResponse>(error);
    }
  };

  // Forgot password
  const forgotPassword = async (
    values: ForgotPasswordInputs
  ): Promise<ApiResponse<null>> => {
    try {
      const res: BaseResponseDto = await postAxios(
        `${API_URL}/forgot-password`,
        values
      );
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  };

  // Reset password
  const resetPassword = async (
    token: string,
    password: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res: BaseResponseDto = await postAxios(
        `${API_URL}/reset-password`,
        { token, password }
      );
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  };

  // Logout
  const logout = async (): Promise<ApiResponse<null>> => {
    try {
      clearStorage();

      setSessionToken("");
      setIsLoggedIn(false);
      setUserProfile(null);
      setIsGuest(true);

      authEventTarget.dispatchEvent(new Event("authChanged"));

      // Hapus cookie role
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      const res: BaseResponseDto = await postAxios(`${API_URL}/logout`);

      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  };

  // Set first time used
  const setFirstTimeUsed = () => {
    setItem("firstTimeUser", JSON.stringify(false));
    setIsFirstTime(false);
  };

  // Get cached profile
  const getCachedUserProfile = useCallback((): UserDetailResponse | null => {
    if (userProfile) return userProfile;
    const cached = getItem("userProfile");
    if (!cached) return null;
    try {
      const parsed = JSON.parse(cached);
      const { user_id, ...rest } = parsed;
      return { userId: user_id, ...rest };
    } catch {
      return null;
    }
  }, [userProfile]);

  return {
    // state
    sessionToken,
    isLoggedIn,
    isFirstTime,
    isGuest,
    userProfile,
    loading,

    // functions
    init,
    login,
    logout,
    register,
    verifyEmail,
    completeProfile,
    forgotPassword,
    resetPassword,
    setFirstTimeUsed,
    fetchUserProfile,
    getCachedUserProfile,
    getUserId,
  };
}
