import {
  ApiResponse,
  BaseResponseDto,
  DetailResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { TaskTypeOverviewResponse } from "../interface/task-types/responses/ITaskTypeOverviewResponse";
import {
  getAxios,
  postAxios,
  putAxios,
  deleteAxios,
} from "../utils/AxiosFunction";
import { CreateTaskTypeFormInputs } from "../components/forms/task-types/create-task-type-form";
import { EditTaskTypeFormInputs } from "../components/forms/task-types/edit-task-type-form";
import { FilterTaskTypeRequest } from "../interface/task-types/requests/IFilterTaskTypeRequest";
import { TaskTypeDetailResponse } from "../interface/task-types/responses/ITaskTypeDetailResponse";

const API_URL = "/task-types";

export const taskTypeProvider = {
  async getTaskTypes(
    params?: FilterTaskTypeRequest
  ): Promise<ApiResponse<TaskTypeOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<TaskTypeOverviewResponse[]>(error);
    }
  },

  async getTaskType(
    slug: string
  ): Promise<ApiResponse<TaskTypeDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/${slug}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<TaskTypeDetailResponse>(error);
    }
  },

  async createTaskType(
    payload: CreateTaskTypeFormInputs
  ): Promise<ApiResponse<TaskTypeDetailResponse>> {
    try {
      const res: DetailResponseDto<TaskTypeDetailResponse> = await postAxios(
        API_URL,
        payload
      );
      return res;
    } catch (error) {
      return handleAxiosError<TaskTypeDetailResponse>(error);
    }
  },

  async updateTaskType(
    id: string,
    payload: EditTaskTypeFormInputs
  ): Promise<ApiResponse<TaskTypeDetailResponse>> {
    try {
      const res: DetailResponseDto<TaskTypeDetailResponse> = await putAxios(
        `${API_URL}/${id}`,
        payload
      );
      return res;
    } catch (error) {
      return handleAxiosError<TaskTypeDetailResponse>(error);
    }
  },

  async deleteTaskType(id: string): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await deleteAxios(`${API_URL}/${id}`);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
