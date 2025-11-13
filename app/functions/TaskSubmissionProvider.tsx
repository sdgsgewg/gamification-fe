import {
  ApiResponse,
  BaseResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { getAxios, putAxios } from "../utils/AxiosFunction";
import { UpdateTaskSubmissionFormInputs } from "../schemas/task-submissions/updateTaskSubmission";
import { FilterTaskSubmissionRequest } from "../interface/task-submissions/requests/IFilterTaskSubmissionRequest";
import { GroupedTaskSubmissionResponseDto } from "../interface/task-submissions/responses/IGroupedTaskSubmissionResponse";
import { TaskSubmissionDetailResponse } from "../interface/task-submissions/responses/ITaskSubmissionDetailResponse";
import { TaskSubmissionWithAnswersResponse } from "../interface/task-submissions/responses/TaskSubmissionWithAnswersResponse";

const API_URL = "/task-submissions";

export const taskSubmissionProvider = {
  async getAllTaskSubmissions(
    params?: FilterTaskSubmissionRequest
  ): Promise<ApiResponse<GroupedTaskSubmissionResponseDto[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.status) query.append("status", params.status);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const baseUrl = `${API_URL}`;

      const url = query.toString() ? `${baseUrl}?${query}` : baseUrl;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<GroupedTaskSubmissionResponseDto[]>(error);
    }
  },

  async getTaskSubmissionsInClass(
    classSlug: string,
    taskSlug: string,
    params?: FilterTaskSubmissionRequest
  ): Promise<ApiResponse<GroupedTaskSubmissionResponseDto[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.status) query.append("status", params.status);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const baseUrl = `${API_URL}/classes/${classSlug}/tasks/${taskSlug}`;

      const url = query.toString() ? `${baseUrl}?${query}` : baseUrl;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<GroupedTaskSubmissionResponseDto[]>(error);
    }
  },

  async getTaskSubmissionDetail(
    id: string
  ): Promise<ApiResponse<TaskSubmissionDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/${id}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<TaskSubmissionDetailResponse>(error);
    }
  },

  async getTaskSubmissionWithAnswers(
    id: string
  ): Promise<ApiResponse<TaskSubmissionWithAnswersResponse>> {
    try {
      const data = await getAxios(`${API_URL}/review/${id}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<TaskSubmissionWithAnswersResponse>(error);
    }
  },

  async updateTaskSubmission(
    id: string,
    payload: UpdateTaskSubmissionFormInputs
  ): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await putAxios(`${API_URL}/${id}`, payload);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
