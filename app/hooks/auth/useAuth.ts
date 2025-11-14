"use client";

import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { getItem, setItem, clearStorage } from "../../utils/storage";
import { getAxios, postAxios } from "../../utils/AxiosFunction";
import { RegisterRequest } from "../../schemas/auth/register";
import { CompleteProfileFormInputs } from "../../schemas/auth/completeProfile";
import { LoginFormInputs } from "../../schemas/auth/login";
import { ForgotPasswordInputs } from "../../schemas/auth/forgotPassword";
import {
  ApiResponse,
  BaseResponseDto,
  DetailResponseDto,
  handleAxiosError,
} from "../../utils/axiosHelper";
import { LoginDetailResponse } from "../../interface/auth/responses/ILoginDetailResponse";
import { UserDetailResponse } from "../../interface/users/responses/IUserDetailResponse";
import { deleteCookie, setCookie } from "../../utils/cookie";
import { useRouter } from "next/navigation";

import {
  setAccessToken as setMemToken,
  registerRefreshHandler,
  registerLogoutHandler,
} from "./useAuthStore";

const API_URL = "/auth";

export const authEventTarget = new EventTarget();

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  // =====================================================
  // Fetch user profile
  // =====================================================
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await getAxios("/users/me");

      setUserProfile(res);
      setItem("userProfile", JSON.stringify(res));
      return res;
    } catch (err) {
      throw err;
    }
  }, []);

  // =====================================================
  // Refresh token handler (REGISTERED to axiosInstance)
  // =====================================================
  useEffect(() => {
    registerRefreshHandler(async () => {
      try {
        const res = await postAxios(`${API_URL}/refresh`);
        if (res?.accessToken) {
          setMemToken(res.accessToken);
          return res.accessToken;
        }
      } catch {
        return null;
      }
      return null;
    });

    registerLogoutHandler(() => {
      clearStorage();
      setMemToken(null);
      setIsLoggedIn(false);
      setUserProfile(null);
      setIsGuest(true);
    });
  }, []);

  // =====================================================
  // Init session on mount
  // =====================================================
  const init = useCallback(async () => {
    const loggedIn = getItem("isLoggedIn");
    const storedUser = getItem("userProfile");
    const firstTime = getItem("firstTimeUser");

    if (firstTime) setIsFirstTime(JSON.parse(firstTime));

    // Not logged in? done
    if (!loggedIn) {
      setLoading(false);
      return;
    }

    try {
      // Try to fetch user profile (401 will trigger auto-refresh)
      const profile = await fetchUserProfile();

      setIsLoggedIn(true);
      setIsGuest(false);
      setUserProfile(profile);
    } catch (error) {
      const axiosErr = error as AxiosError;
      console.warn("Init: failed to restore session:", {
        status: axiosErr?.response?.status,
      });

      clearStorage();
      setMemToken(null);
      setIsLoggedIn(false);
      setUserProfile(null);
    }

    setLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    init();
  }, [init]);

  // =====================================================
  // Register
  // =====================================================
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

  // =====================================================
  // Verify Email
  // =====================================================
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

  // =====================================================
  // Complete Profile
  // =====================================================
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

  // =====================================================
  // Login
  // =====================================================
  const login = async (
    values: LoginFormInputs
  ): Promise<ApiResponse<LoginDetailResponse>> => {
    try {
      const res: DetailResponseDto<LoginDetailResponse> = await postAxios(
        `${API_URL}/login`,
        values
      );

      const { isSuccess, data } = res;

      if (isSuccess && data) {
        const { accessToken, user, cookieMaxAge } = data;
  
        // save token in-memory
        setMemToken(accessToken);
  
        // store session flags
        setItem("isLoggedIn", JSON.stringify(true));
        setItem("userProfile", JSON.stringify(user));
  
        // update state
        setIsLoggedIn(true);
        setUserProfile(user);
        setIsGuest(false);
  
        // role cookie (optional)
        setCookie("role", user.role.name, cookieMaxAge);
      }
      
      return res;
    } catch (error) {
      return handleAxiosError<LoginDetailResponse>(error);
    }
  };

  // =====================================================
  // Forgot Password
  // =====================================================
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

  // =====================================================
  // Reset Password
  // =====================================================
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

  // =====================================================
  // Logout
  // =====================================================
  const logout = useCallback(async () => {
    try {
      clearStorage();
      setMemToken(null);

      setIsLoggedIn(false);
      setUserProfile(null);
      setIsGuest(true);

      authEventTarget.dispatchEvent(new Event("authChanged"));

      deleteCookie("role");

      await postAxios(`${API_URL}/logout`);

      router.push("/");
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  }, [router]);

  // =====================================================
  // First Time User
  // =====================================================
  const setFirstTimeUsed = () => {
    setItem("firstTimeUser", JSON.stringify(false));
    setIsFirstTime(false);
  };

  // =====================================================
  // Get Cached Profile
  // =====================================================
  const getCachedUserProfile = useCallback((): UserDetailResponse | null => {
    if (userProfile) return userProfile;

    const cached = getItem("userProfile");
    if (!cached) return null;

    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }, [userProfile]);

  return {
    isLoggedIn,
    isFirstTime,
    isGuest,
    userProfile,
    loading,

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
  };
}
