import { UserDetailResponse } from "../interface/users/responses/IUserDetailResponse";
import { getAxios } from "../utils/AxiosFunction";
import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";

const API_URL = "/users";

export const userProvider = {
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
};
