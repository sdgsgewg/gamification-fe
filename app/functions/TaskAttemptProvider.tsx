import {
  ApiResponse,
  DetailResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { getAxios, postAxios, putAxios } from "../utils/AxiosFunction";
import { CreateTaskAttemptFormInputs } from "../schemas/task-attempts/createTaskAttempt";
import { UpdateTaskAttemptFormInputs } from "../schemas/task-attempts/updateTaskAttempt";
import { UpsertTaskAttemptResponseDto } from "../interface/task-attempts/responses/IUpsertTaskAttemptResponse";
import { FilterTaskAttemptRequest } from "../interface/task-attempts/requests/IFilterTaskAttemptRequest";
import { GroupedTaskAttemptResponseDto } from "../interface/task-attempts/responses/IGroupedTaskAttemptResponse";
import { TaskAttemptDetailResponse } from "../interface/task-attempts/responses/ITaskAttemptDetailResponse";

const API_URL = "/task-attempts";

export const taskAttemptProvider = {
  async getTaskAttemptsByUser(
    params?: FilterTaskAttemptRequest
  ): Promise<ApiResponse<GroupedTaskAttemptResponseDto[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.status) query.append("status", params.status);
      if (params?.dateFrom)
        query.append("dateFrom", params.dateFrom.toDateString());
      if (params?.dateTo) query.append("dateTo", params.dateTo.toDateString());
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<GroupedTaskAttemptResponseDto[]>(error);
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

  async createTaskAttempt(
    payload: CreateTaskAttemptFormInputs
  ): Promise<ApiResponse<UpsertTaskAttemptResponseDto>> {
    try {
      const res: DetailResponseDto<UpsertTaskAttemptResponseDto> =
        await postAxios(API_URL, payload);
      return res;
    } catch (error) {
      return handleAxiosError<UpsertTaskAttemptResponseDto>(error);
    }
  },

  async updateTaskAttempt(
    id: string,
    payload: UpdateTaskAttemptFormInputs
  ): Promise<ApiResponse<UpsertTaskAttemptResponseDto>> {
    try {
      const res: DetailResponseDto<UpsertTaskAttemptResponseDto> =
        await putAxios(`${API_URL}/${id}`, payload);
      return res;
    } catch (error) {
      return handleAxiosError<UpsertTaskAttemptResponseDto>(error);
    }
  },
};
