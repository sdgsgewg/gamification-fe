import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";
import { getAxios } from "../utils/AxiosFunction";
import { ActivityLogOverviewResponse } from "../interface/activity-logs/responses/IActivityLogOverviewResponse";

const API_URL = "/activity-logs";

export const activityLogProvider = {
  async getUserActivityLogs(): Promise<
    ApiResponse<ActivityLogOverviewResponse[]>
  > {
    try {
      const data = await getAxios(`${API_URL}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ActivityLogOverviewResponse[]>(error);
    }
  },
};
