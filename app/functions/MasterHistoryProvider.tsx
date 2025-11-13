import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";
import { getAxios } from "../utils/AxiosFunction";
import { MasterHistoryOverviewResponse } from "../interface/master-histories/responses/IMasterHistoryOverviewResponse";

const API_URL = "/master-history";

export const masterHistoryProvider = {
  async getUserMasterHistories(): Promise<
    ApiResponse<MasterHistoryOverviewResponse[]>
  > {
    try {
      const data = await getAxios(`${API_URL}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<MasterHistoryOverviewResponse[]>(error);
    }
  },
};
