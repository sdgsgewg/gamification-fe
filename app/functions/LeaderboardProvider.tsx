import { GlobalLeaderboardResponse } from "../interface/leaderboards/responses/IGlobalLeaderboardResponse";
import { LeaderboardResponse } from "../interface/leaderboards/responses/ILeaderboardResponse";
import { getAxios } from "../utils/AxiosFunction";
import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";

const API_URL = "/leaderboards";

export const leaderboardProvider = {
  async getGlobalLeaderboard(): Promise<
    ApiResponse<GlobalLeaderboardResponse[]>
  > {
    try {
      const data = await getAxios(`${API_URL}/global`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<GlobalLeaderboardResponse[]>(error);
    }
  },

  async getClassLeaderboard(): Promise<ApiResponse<LeaderboardResponse[]>> {
    try {
      const data = await getAxios(`${API_URL}/classes`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<LeaderboardResponse[]>(error);
    }
  },

  async getStudentLeaderboard(): Promise<ApiResponse<LeaderboardResponse[]>> {
    try {
      const data = await getAxios(`${API_URL}/students`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<LeaderboardResponse[]>(error);
    }
  },

  async getClassStudentsLeaderboard(
    classId: string
  ): Promise<ApiResponse<GlobalLeaderboardResponse[]>> {
    try {
      const data = await getAxios(`${API_URL}/classes/${classId}/students`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<GlobalLeaderboardResponse[]>(error);
    }
  },
};
