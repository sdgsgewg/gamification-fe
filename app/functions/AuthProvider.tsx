import { AxiosError } from "axios";
import { getItem, setItem, clearStorage } from "../utils/storage";
import { getAxios, postAxios } from "../utils/AxiosFunction";
import { jwtDecode } from "jwt-decode";
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

export default class AuthProvider {
  sessionTokenKey = "sessionToken";
  isLoggedInKey = "isLoggedIn";
  userProfileKey = "userProfile";

  sessionToken = "";
  isLoggedIn = false;
  isFirstTime = false;
  isGuest = true;
  userProfile: UserDetailResponse | null = null;

  async init() {
    this.getSessionToken();
    this.getLoginStatus();
    this.getUserProfile();
    this.getFirstTimeChecked();

    // const sessionToken = getItem(this.sessionTokenKey);
    // console.log("This sessionToken: ", sessionToken);

    // 🔁 Jika tidak ada token atau token tidak valid, coba refresh token
    if (!this.sessionToken || !this.isTokenValid(this.sessionToken)) {
      // if (!sessionToken || !this.isTokenValid(sessionToken)) {
      try {
        const refresh = await postAxios(`${API_URL}/refresh`);

        if (refresh?.accessToken) {
          this.sessionToken = refresh.accessToken;
          setItem(this.sessionTokenKey, refresh.accessToken);
          setItem(this.isLoggedInKey, JSON.stringify(true));

          await this.fetchUserProfile();
          this.isLoggedIn = true;
        }
      } catch (err: unknown) {
        const axiosErr = err as AxiosError;
        console.warn("Refresh token failed during init:", {
          status: axiosErr?.response?.status,
          data: axiosErr?.response?.data,
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

  async register(payload: RegisterRequest): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await postAxios(
        `${API_URL}/register`,
        payload
      );
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  }

  async verifyEmail(token: string): Promise<ApiResponse<string>> {
    try {
      const res: DetailResponseDto<string> = await postAxios(
        `${API_URL}/verify-email`,
        { token }
      );
      return res;
    } catch (error) {
      return handleAxiosError<string>(error);
    }
  }

  async completeProfile(
    uid: string,
    values: CompleteProfileFormInputs
  ): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await postAxios(
        `${API_URL}/complete-profile?uid=${uid}`,
        values
      );
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  }

  async login(
    values: LoginFormInputs
  ): Promise<ApiResponse<LoginDetailResponse>> {
    try {
      const res: DetailResponseDto<LoginDetailResponse> = await postAxios(
        `${API_URL}/login`,
        values
      );

      const data = res.data;

      if (!data || !data.accessToken) {
        throw new Error("Invalid response structure - missing access token");
      }

      // Simpan ke localStorage
      setItem(this.sessionTokenKey, data.accessToken);
      setItem(this.isLoggedInKey, JSON.stringify(true));
      setItem(this.userProfileKey, JSON.stringify(data.user));

      // Simpan ke memory
      this.sessionToken = data.accessToken;
      this.isLoggedIn = true;
      this.userProfile = data.user;

      // Set cookie role untuk middleware
      document.cookie = `role=${data.user.role.name}; path=/;`;

      return res;
    } catch (error) {
      return handleAxiosError<LoginDetailResponse>(error);
    }
  }

  async forgotPassword(
    values: ForgotPasswordInputs
  ): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await postAxios(
        `${API_URL}/forgot-password`,
        values
      );
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  }

  async resetPassword(
    token: string,
    password: string
  ): Promise<ApiResponse<null>> {
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
  }

  async logout(): Promise<ApiResponse<null>> {
    try {
      clearStorage();

      this.sessionToken = "";
      this.isLoggedIn = false;
      this.userProfile = null;

      authEventTarget.dispatchEvent(new Event("authChanged"));

      // Hapus cookie role
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      const res: BaseResponseDto = await postAxios(`${API_URL}/logout`);

      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  }

  async getLoggedInUser(): Promise<ApiResponse<UserDetailResponse>> {
    try {
      const data = await getAxios("/users/me");

      console.log("Logged In User: ", JSON.stringify(data, null, 2));

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<UserDetailResponse>(error);
    }
  }

  async fetchUserProfile() {
    try {
      const res = await this.getLoggedInUser();
      const { data } = res;

      if (data) {
        setItem(this.userProfileKey, JSON.stringify(data));
        this.userProfile = data;
      }
    } catch (err) {
      console.error("User profile not available: ", err);
    }
  }

  getCachedUserProfile() {
    if (this.userProfile) return this.userProfile;

    const cached = getItem(this.userProfileKey);

    if (cached) {
      const parsed = JSON.parse(cached);

      const { user_id, ...rest } = parsed;
      this.userProfile = { userId: user_id, ...rest };

      return this.userProfile;
    }
    return null;
  }
}

export const auth = new AuthProvider();
