// useAuth.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AxiosError } from "axios";
import { getItem, setItem, clearStorage } from "../../utils/storage";
import { postAxios, getAxios } from "../../utils/AxiosFunction";
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
import { deleteCookie, getCookie, setCookie } from "../../utils/cookie";
import { useRouter } from "next/navigation";

import {
  setAccessToken as setMemToken,
  registerRefreshHandler,
  registerLogoutHandler,
  refreshAccessToken,
  logoutSilently,
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
  const hasInitRef = useRef(false);

  // fetch profile (kept simple)
  const fetchUserProfile = useCallback(async () => {
    const res = await getAxios("/users/me");
    setUserProfile(res);
    setItem("userProfile", JSON.stringify(res));
    return res;
  }, []);

  // Register refresh handler so axiosInstance can call it
  useEffect(() => {
    registerRefreshHandler(async () => {
      try {
        const res = await postAxios(`${API_URL}/refresh`);
        // expected shape: { accessToken: '...' }
        if (res?.accessToken) {
          setMemToken(res.accessToken);
          return res.accessToken;
        }
        return null;
      } catch (e) {
        return null;
      }
    });

    registerLogoutHandler(() => {
      clearStorage();
      setMemToken(null);
      setIsLoggedIn(false);
      setUserProfile(null);
      setIsGuest(true);
    });
  }, []);

  // init session — guarded so it runs once per hook instance
  const init = useCallback(async () => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;

    const loggedIn = getItem("isLoggedIn");
    const firstTime = getItem("firstTimeUser");

    if (firstTime) {
      try {
        setIsFirstTime(JSON.parse(firstTime));
      } catch {
        setIsFirstTime(true);
      }
    }

    if (!loggedIn) {
      setLoading(false);
      return;
    }

    try {
      // Fetch profile — getAxios will attempt refresh via interceptor on 401
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
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // run init once client-side
  useEffect(() => {
    // ensure only runs client-side
    if (typeof window !== "undefined") {
      init();
    }
  }, [init]);

  // Auth actions (register, login, logout, etc.)
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
        const { accessToken, refreshToken, user, cookieMaxAge } = data;

        console.log("Login data:", JSON.stringify(data));

        // accessToken → memory storage
        setMemToken(accessToken);

        // refreshToken → FE cookie
        setCookie("refreshToken", refreshToken, cookieMaxAge);

        // role cookie (existing logic)
        setCookie("role", user.role.name, cookieMaxAge);

        setItem("isLoggedIn", JSON.stringify(true));
        setItem("userProfile", JSON.stringify(user));

        setIsLoggedIn(true);
        setUserProfile(user);
        setIsGuest(false);

        // notify listeners
        authEventTarget.dispatchEvent(new Event("authChanged"));
      }

      return res;
    } catch (error) {
      return handleAxiosError<LoginDetailResponse>(error);
    }
  };

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

  const resetPassword = async (
    token: string,
    password: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res: BaseResponseDto = await postAxios(
        `${API_URL}/reset-password`,
        {
          token,
          password,
        }
      );
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = getCookie("refreshToken");

      // Server logout dulu (token masih ada)
      try {
        const res: BaseResponseDto = await postAxios(`${API_URL}/logout`, {
          refreshToken,
        });
        console.log("Server logout:", res);
      } catch (err) {
        console.warn("Server logout failed:", err);
      }

      // Baru hapus local session
      clearStorage();
      setMemToken(null);
      setIsLoggedIn(false);
      setUserProfile(null);
      setIsGuest(true);

      deleteCookie("refreshToken");
      deleteCookie("role");

      authEventTarget.dispatchEvent(new Event("authChanged"));
      router.push("/");
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  };

  const setFirstTimeUsed = () => {
    setItem("firstTimeUser", JSON.stringify(false));
    setIsFirstTime(false);
  };

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
