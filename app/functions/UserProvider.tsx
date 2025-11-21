import { FilterUserRequest } from "../interface/users/requests/IFilterUserRequest";
import { UserDetailResponse } from "../interface/users/responses/IUserDetailResponse";
import { UserLastLoginResponse } from "../interface/users/responses/IUserLastLoginResponse";
import { UserOverviewResponse } from "../interface/users/responses/IUserOverviewResponse";
import { UserRecentActivityResponse } from "../interface/users/responses/IUserRecentActivityResponse";
import { UserRoleCountResponse } from "../interface/users/responses/IUserRoleCountResponse";
import { UserStatsResponse } from "../interface/users/responses/IUserStatsResponse";
import { getAxios, putAxios } from "../utils/AxiosFunction";
import {
  ApiResponse,
  BaseResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";

const API_URL = "/users";

export const userProvider = {
  async getAllUsers(
    params?: FilterUserRequest
  ): Promise<ApiResponse<UserOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.role) query.append("role", params.role);
      if (params?.gradeId) query.append("gradeId", params.gradeId);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<UserOverviewResponse[]>(error);
    }
  },

  async getUserRoleCounts(): Promise<ApiResponse<UserRoleCountResponse>> {
    try {
      const data = await getAxios(`${API_URL}/statistics`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<UserRoleCountResponse>(error);
    }
  },

  async getUserById(id: string): Promise<ApiResponse<UserDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/${id}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<UserDetailResponse>(error);
    }
  },

  async getUserByUsername(
    username: string
  ): Promise<ApiResponse<UserDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/username/${username}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<UserDetailResponse>(error);
    }
  },

  async getUserLastLogin(): Promise<ApiResponse<UserLastLoginResponse>> {
    try {
      const data = await getAxios(`${API_URL}/me/last-login`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<UserLastLoginResponse>(error);
    }
  },

  async getUserStats(): Promise<ApiResponse<UserStatsResponse>> {
    try {
      const data = await getAxios(`${API_URL}/me/stats`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<UserStatsResponse>(error);
    }
  },

  async getUserRecentActivities(): Promise<
    ApiResponse<UserRecentActivityResponse[]>
  > {
    try {
      const data = await getAxios(`${API_URL}/recent-activities`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<UserRecentActivityResponse[]>(error);
    }
  },

  async updateProfile(formData: FormData): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await putAxios(`${API_URL}`, formData);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
