import {
  ApiResponse,
  BaseResponseDto,
  DetailResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import {
  getAxios,
  postAxios,
  putAxios,
  deleteAxios,
} from "../utils/AxiosFunction";
import { FilterTaskFormInputs } from "../schemas/tasks/filterTask";
import { TaskOverviewResponse } from "../interface/tasks/responses/ITaskOverviewResponse";
import { TaskDetailResponse } from "../interface/tasks/responses/ITaskDetailResponse";

const API_URL = "/tasks";

export const taskProvider = {
  async getTasks(
    params?: FilterTaskFormInputs
  ): Promise<ApiResponse<TaskOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.subjectId) query.append("subjectId", params.subjectId);
      if (params?.materialId) query.append("materialId", params.materialId);
      if (params?.taskTypeId) query.append("taskTypeId", params.taskTypeId);

      if (params?.gradeIds && params.gradeIds.length > 0) {
        params.gradeIds.forEach((id) => query.append("gradeIds", id));
      }

      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<TaskOverviewResponse[]>(error);
    }
  },

  async getTaskDetail(slug: string): Promise<ApiResponse<TaskDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/${slug}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<TaskDetailResponse>(error);
    }
  },

  async createTask(
    formData: FormData
  ): Promise<ApiResponse<TaskDetailResponse>> {
    try {
      const res: DetailResponseDto<TaskDetailResponse> = await postAxios(
        API_URL,
        formData
      );
      return res;
    } catch (error) {
      return handleAxiosError<TaskDetailResponse>(error);
    }
  },

  async updateTask(
    id: string,
    formData: FormData
  ): Promise<ApiResponse<TaskDetailResponse>> {
    try {
      const res: DetailResponseDto<TaskDetailResponse> = await putAxios(
        `${API_URL}/${id}`,
        formData
      );
      return res;
    } catch (error) {
      return handleAxiosError<TaskDetailResponse>(error);
    }
  },

  async deleteTask(id: string): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await deleteAxios(`${API_URL}/${id}`);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
