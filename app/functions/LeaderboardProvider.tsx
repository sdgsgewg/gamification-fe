import { GlobalLeaderboardResponse } from "../interface/leaderboards/responses/IGlobalLeaderboardResponse";
import { getAxios } from "../utils/AxiosFunction";
import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";

const API_URL = "/leaderboards";

export const leaderboardProvider = {
  async getGlobalLeaderboard(): Promise<
    ApiResponse<GlobalLeaderboardResponse[]>
  > {
    try {
      const data = await getAxios(`${API_URL}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<GlobalLeaderboardResponse[]>(error);
    }
  },
};
