import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";
import { GradeOverviewResponse } from "../interface/grades/responses/IGradeOverviewResponse";
import { getAxios } from "../utils/AxiosFunction";
import { FilterGradeRequest } from "../interface/grades/requests/IFilterGradeRequest";

const API_URL = "/grades";

export const gradeProvider = {
  async getGrades(
    params?: FilterGradeRequest
  ): Promise<ApiResponse<GradeOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<GradeOverviewResponse[]>(error);
    }
  },
};
