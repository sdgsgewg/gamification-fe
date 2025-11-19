import { useState, useEffect, useCallback, useRef } from "react";
import {
  clearStorage, // clears both local + session
  setSession,
  setLocal,
  getSession,
  getLocal,
  getCachedAuth,
} from "../../utils/storage";
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

    const json = JSON.stringify(res);
    setSession("userProfile", json);
    setLocal("userProfile", json);

    return res;
  }, []);

  // Register refresh handler so axiosInstance can call it
  useEffect(() => {
    registerRefreshHandler(async () => {
      try {
        const refreshToken = getCookie("refreshToken");
        if (!refreshToken) return null;

        const res = await postAxios(`${API_URL}/refresh`, {
          refreshToken,
        });

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
      // Completely clear storages and in-memory token
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

    // 1. Restore cached profile instantly (no flash GUEST)
    const cached = getCachedAuth("userProfile");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setUserProfile(parsed);
        setIsGuest(false);
        setIsLoggedIn(true);
      } catch {}
    }

    // If there's no refresh token, we consider not logged in.
    const refreshToken = getCookie("refreshToken");
    if (!refreshToken) {
      setLoading(false);
      return;
    }

    try {
      // Try to refresh access token using refresh token cookie
      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        throw new Error("Failed to refresh token");
      }

      // fetch profile using the new access token
      const profile = await fetchUserProfile();

      // update state
      setIsLoggedIn(true);
      setIsGuest(false);
      setUserProfile(profile);
    } catch (err) {
      // refresh failed → forced logout (silent)
      clearStorage();
      deleteCookie("refreshToken");
      deleteCookie("role");
      setMemToken(null);
      setIsLoggedIn(false);
      setUserProfile(null);
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // run init once client-side
  useEffect(() => {
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

        // accessToken → memory storage
        setMemToken(accessToken);

        // refreshToken → FE cookie
        setCookie("refreshToken", refreshToken, cookieMaxAge);

        // role cookie (existing logic)
        setCookie("role", user.role.name, cookieMaxAge);

        // store profile to sessionStorage and localStorage
        try {
          setSession("userProfile", JSON.stringify(user));
          setLocal("userProfile", JSON.stringify(user));
        } catch {}

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
      // clear storages first
      clearStorage();

      // Server logout (best effort)
      try {
        await postAxios(`${API_URL}/logout`, {
          refreshToken,
        });
      } catch (err) {
        console.warn("Server logout failed:", err);
      }

      // Clear local session
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
    // firstTimeUser is still ok to keep in localStorage
    setIsFirstTime(false);
  };

  const getCachedUserProfile = useCallback(():
    | UserDetailResponse
    | null
    | undefined => {
    if (userProfile) return userProfile;

    const cached = getCachedAuth("userProfile");
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
