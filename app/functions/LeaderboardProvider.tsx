import { FilterStudentLeaderboardRequest } from "../interface/leaderboards/requests/IFilterStudentLeaderboardRequest";
import { ClassLeaderboardResponse } from "../interface/leaderboards/responses/IClassLeaderboardResponse";
import { StudentLeaderboardResponse } from "../interface/leaderboards/responses/IStudentLeaderboardResponse";
import { getAxios } from "../utils/AxiosFunction";
import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";

const API_URL = "/leaderboards";

export const leaderboardProvider = {
  async getStudentLeaderboard(
    params?: FilterStudentLeaderboardRequest
  ): Promise<ApiResponse<StudentLeaderboardResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.scope) query.append("scope", params.scope);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString()
        ? `${API_URL}/students?${query}`
        : `${API_URL}/students`;
      const data = await getAxios(url);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<StudentLeaderboardResponse[]>(error);
    }
  },

  async getClassStudentsLeaderboard(
    classId: string
  ): Promise<ApiResponse<StudentLeaderboardResponse[]>> {
    try {
      const data = await getAxios(`${API_URL}/classes/${classId}/students`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<StudentLeaderboardResponse[]>(error);
    }
  },

  async getClassLeaderboard(): Promise<
    ApiResponse<ClassLeaderboardResponse[]>
  > {
    try {
      const data = await getAxios(`${API_URL}/classes`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassLeaderboardResponse[]>(error);
    }
  },
};
