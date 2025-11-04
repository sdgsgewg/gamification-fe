import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";
import { getAxios } from "../utils/AxiosFunction";
import { FilterActivityFormInputs } from "../schemas/activities/filterActivity";
import { ActivityOverviewResponse } from "../interface/activities/responses/IActivityOverviewResponse";
import { ActivityDetailResponse } from "../interface/activities/responses/IActivityDetailResponse";
import { ActivityWithQuestionsResponse } from "../interface/activities/responses/IActivityWithQuestionsResponse";
import { ActivitySummaryResponse } from "../interface/activities/responses/IActivitySummaryResponse";

const API_URL = "/activities";

export const activityProvider = {
  async getActivities(
    params?: FilterActivityFormInputs
  ): Promise<ApiResponse<ActivityOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.section) query.append("section", params.section);
      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.subjectId) query.append("subjectId", params.subjectId);
      if (params?.materialId) query.append("materialId", params.materialId);
      if (params?.taskTypeId) query.append("taskTypeId", params.taskTypeId);
      if (params?.userId) query.append("userId", params.userId);

      if (params?.gradeIds && params.gradeIds.length > 0) {
        params.gradeIds.forEach((id) => query.append("gradeIds", id));
      }

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;

      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ActivityOverviewResponse[]>(error);
    }
  },

  async getActivityDetail(
    slug: string
  ): Promise<ApiResponse<ActivityDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/${slug}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ActivityDetailResponse>(error);
    }
  },

  async getActivityWithQuestions(
    slug: string
  ): Promise<ApiResponse<ActivityWithQuestionsResponse>> {
    try {
      const data = await getAxios(`${API_URL}/attempt/${slug}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ActivityWithQuestionsResponse>(error);
    }
  },

  async getActivitySummaryFromAttempt(
    slug: string
  ): Promise<ApiResponse<ActivitySummaryResponse>> {
    try {
      const data = await getAxios(`${API_URL}/summary/${slug}`);

      console.log("Summary Data: ", JSON.stringify(data, null, 2));

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ActivitySummaryResponse>(error);
    }
  },
};
