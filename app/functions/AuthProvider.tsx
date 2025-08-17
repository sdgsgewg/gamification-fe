import { getItem, setItem, clearStorage } from "../utils/storage";
import { getAxios, postAxios } from "../utils/AxiosFunction";
import { LoginFormInputs } from "../components/forms/auth/login-form";
import { jwtDecode } from "jwt-decode";
import { User } from "../interface/users/IUser";
import { RegisterFormInputs } from "../components/forms/auth/register-form";
import { ForgotPasswordInputs } from "../components/forms/auth/forgot-password-form";
import { CompleteProfileFormInputs } from "../components/forms/auth/complete-profile-form";

export const authEventTarget = new EventTarget();

export default class AuthProvider {
  sessionTokenKey = "sessionToken";
  isLoggedInKey = "isLoggedIn";
  userProfileKey = "userProfile";

  sessionToken = "";
  isLoggedIn = false;
  isLoading = false;
  isFirstTime = false;
  isGuest = true;
  userProfile: User | null = null;

  async init() {
    this.getSessionToken();
    this.getLoginStatus();
    this.getUserProfile();
    this.getFirstTimeChecked();

    // 🔁 Jika tidak ada token atau token tidak valid, coba refresh token
    if (!this.sessionToken || !this.isTokenValid(this.sessionToken)) {
      try {
        const refresh = await postAxios("auth/refresh");

        if (refresh?.accessToken) {
          this.sessionToken = refresh.accessToken;
          setItem(this.sessionTokenKey, refresh.accessToken);
          setItem(this.isLoggedInKey, JSON.stringify(true));

          await this.fetchUserProfile();
          this.isLoggedIn = true;
          return;
        }
      } catch (err: any) {
        console.warn("Refresh token failed during init:", {
          status: err?.response?.status,
          data: err?.response?.data,
        });
      }
    } else {
      await this.fetchUserProfile(); // token valid → fetch user
    }
  }

  getSessionToken() {
    const token = getItem(this.sessionTokenKey);
    if (token && this.isTokenValid(token)) {
      this.sessionToken = token;
    }
  }

  getLoginStatus() {
    const status = getItem(this.isLoggedInKey);
    if (status) {
      this.isLoggedIn = JSON.parse(status);
    }
  }

  getUserProfile() {
    const user = getItem(this.userProfileKey);
    if (user) {
      this.userProfile = JSON.parse(user);
    }
  }

  getFirstTimeChecked() {
    const isFirstTime = getItem("firstTimeUser");
    this.isFirstTime = isFirstTime ? JSON.parse(isFirstTime) : true;
  }

  setFirstTimeUsed() {
    setItem("firstTimeUser", JSON.stringify(false));
    this.isFirstTime = false;
  }

  isTokenValid(token: string) {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  }

  getUserId() {
    if (!this.sessionToken) return "";
    const decodedToken: any = jwtDecode(this.sessionToken);
    return decodedToken.uid;
  }

  toggleLoading(status: boolean) {
    this.isLoading = typeof status === "boolean" ? status : !this.isLoading;
  }

  async register(values: RegisterFormInputs) {
    this.isLoading = true;
    try {
      const response = await postAxios(`auth/register`, values);

      return { ok: true, user: response.user || null };
    } catch (error: any) {
      console.error("Registration error:", error);

      return {
        ok: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again.",
      };
    } finally {
      this.isLoading = false;
    }
  }

  async verifyEmail(token: string) {
    this.isLoading = true;
    try {
      const response = await postAxios(`auth/verify-email`, { token });
      return { ok: true, userId: response.userId };
    } catch (error: any) {
      console.error("Email verification error:", error);

      return {
        ok: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Email verification failed. Please try again.",
      };
    } finally {
      this.isLoading = false;
    }
  }

  async completeProfile(values: CompleteProfileFormInputs, uid: string) {
    this.isLoading = true;
    try {
      const response = await postAxios(
        `auth/complete-profile?uid=${uid}`,
        values
      );

      return { ok: true, user: response.user || null };
    } catch (error: any) {
      console.error("Profile completion error:", error);

      return {
        ok: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Profile completion failed. Please try again.",
      };
    } finally {
      this.isLoading = false;
    }
  }

  async login(values: LoginFormInputs) {
    this.isLoading = true;
    try {
      const response = await postAxios(`auth/login`, values);

      if (!response.accessToken) {
        throw new Error("Invalid response structure - missing access token");
      }

      // Simpan ke localStorage
      setItem(this.sessionTokenKey, response.accessToken);
      setItem(this.isLoggedInKey, JSON.stringify(true));
      setItem(this.userProfileKey, JSON.stringify(response.user));

      // Simpan ke memory
      this.sessionToken = response.accessToken;
      this.isLoggedIn = true;
      this.userProfile = response.user;

      return { ok: true, user: response.user || null };
    } catch (error: any) {
      console.error("Login error:", error);

      return {
        ok: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.",
      };
    } finally {
      this.isLoading = false;
    }
  }

  async forgotPassword(values: ForgotPasswordInputs) {
    this.isLoading = true;
    try {
      const response = await postAxios(`auth/forgot-password`, values);

      return { ok: true, message: response.message };
    } catch (error: any) {
      console.error("Reset link error:", error);
      return {
        ok: false,
        message: error.message || "Failed to send reset link.",
      };
    } finally {
      this.isLoading = false;
    }
  }

  async resetPassword(token: string, password: string) {
    this.isLoading = true;
    try {
      const response = await postAxios("auth/reset-password", {
        token,
        password,
      });

      return { ok: true, message: response.message };
    } catch (error: any) {
      console.error("Reset link error:", error);
      return {
        ok: false,
        message: error.message || "Failed to send reset link.",
      };
    } finally {
      this.isLoading = false;
    }
  }

  async logout() {
    try {
      await postAxios("auth/logout");
    } catch (error: any) {
      console.error("Logout API error:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      clearStorage();

      this.sessionToken = "";
      this.isLoggedIn = false;
      this.userProfile = null;

      authEventTarget.dispatchEvent(new Event("authChanged")); // Trigger update
    }
  }

  // ===== Profile ====

  async fetchUserProfile() {
    try {
      this.userProfile = await this.getLoggedInUser();
    } catch (err) {
      console.error("User profile not available");
    }
  }

  getCachedUserProfile() {
    if (this.userProfile) return this.userProfile;

    const cached = getItem(this.userProfileKey);
    if (cached) {
      this.userProfile = JSON.parse(cached);
      return this.userProfile;
    }
    return null;
  }

  async getLoggedInUser() {
    try {
      const data = await getAxios("users/get-logged-in-user");
      return data;
    } catch (error: any) {
      console.error("Failed to fetch logged-in user:", error);
      return null;
    }
  }
}

export const auth = new AuthProvider();
