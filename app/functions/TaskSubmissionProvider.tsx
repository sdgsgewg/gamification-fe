import {
  ApiResponse,
  BaseResponseDto,
  DetailResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { getAxios, putAxios } from "../utils/AxiosFunction";
import { TaskAttemptDetailResponse } from "../interface/task-attempts/responses/ITaskAttemptDetailResponse";
import { UpdateTaskSubmissionFormInputs } from "../schemas/task-submissions/updateTaskSubmission";
import { FilterTaskSubmissionRequest } from "../interface/task-submissions/requests/IFilterTaskSubmissionRequest";
import { GroupedTaskSubmissionResponseDto } from "../interface/task-submissions/responses/IGroupedTaskSubmissionResponse";

const API_URL = "/task-submissions";

export const taskSubmissionProvider = {
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

  async getTaskAttemptDetail(
    id: string
  ): Promise<ApiResponse<TaskAttemptDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/${id}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<TaskAttemptDetailResponse>(error);
    }
  },

  async updateTaskSubmission(
    id: string,
    payload: UpdateTaskSubmissionFormInputs
  ): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await putAxios(
        `${API_URL}/activity/${id}`,
        payload
      );
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
