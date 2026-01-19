import {
  ApiResponse,
  DetailResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { getAxios, postAxios, putAxios } from "../utils/AxiosFunction";
import { CreateTaskAttemptFormInputs } from "../schemas/task-attempts/createTaskAttempt";
import { UpdateTaskAttemptFormInputs } from "../schemas/task-attempts/updateTaskAttempt";
import { UpsertTaskAttemptResponse } from "../interface/task-attempts/responses/IUpsertTaskAttemptResponse";
import { FilterTaskAttemptRequest } from "../interface/task-attempts/requests/IFilterTaskAttemptRequest";
import { GroupedTaskAttemptResponse } from "../interface/task-attempts/responses/IGroupedTaskAttemptResponse";
import { TaskAttemptDetailResponse } from "../interface/task-attempts/responses/ITaskAttemptDetailResponse";
import { MostPopularTaskResponse } from "../interface/task-attempts/responses/IMostPopularTaskResponse";
import { ActivityTaskAttemptResponse } from "../interface/task-attempts/responses/attempt-analytics/IActivityTaskAttemptResponse";
import { ClassTaskAttemptResponse } from "../interface/task-attempts/responses/attempt-analytics/IClassTaskAttemptResponse";
import { ClassTaskStudentAttemptResponse } from "../interface/task-attempts/responses/attempt-analytics/IClassTaskStudentAttemptResponse";
import { ActivityTaskStudentAttemptResponse } from "../interface/task-attempts/responses/attempt-analytics/IActivityTaskStudentAttemptResponse";

const API_URL = "/task-attempts";

export const taskAttemptProvider = {
  async getTaskAttemptsByUser(
    params?: FilterTaskAttemptRequest,
  ): Promise<ApiResponse<GroupedTaskAttemptResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.status) query.append("status", params.status);
      if (params?.isClassTask)
        query.append("isClassTask", params?.isClassTask ? "true" : "false");
      if (params?.dateFrom)
        query.append("dateFrom", params.dateFrom.toDateString());
      if (params?.dateTo) query.append("dateTo", params.dateTo.toDateString());
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<GroupedTaskAttemptResponse[]>(error);
    }
  },

  async getTaskAttemptDetail(
    id: string,
  ): Promise<ApiResponse<TaskAttemptDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/${id}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<TaskAttemptDetailResponse>(error);
    }
  },

  async getMostPopularTask(): Promise<ApiResponse<MostPopularTaskResponse[]>> {
    try {
      const data = await getAxios(`${API_URL}/popular`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<MostPopularTaskResponse[]>(error);
    }
  },

  async getAllTaskAttemptsFromClass(): Promise<
    ApiResponse<ClassTaskAttemptResponse[]>
  > {
    try {
      const data = await getAxios(`${API_URL}/class`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassTaskAttemptResponse[]>(error);
    }
  },

  async getAllTaskAttemptsFromActivityPage(): Promise<
    ApiResponse<ActivityTaskAttemptResponse[]>
  > {
    try {
      const data = await getAxios(`${API_URL}/activity`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ActivityTaskAttemptResponse[]>(error);
    }
  },

  async getStudentAttemptsFromClassTask(
    classSlug: string,
    taskSlug: string,
  ): Promise<ApiResponse<ClassTaskStudentAttemptResponse>> {
    try {
      const data = await getAxios(`${API_URL}/class/${classSlug}/${taskSlug}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassTaskStudentAttemptResponse>(error);
    }
  },

  async getStudentAttemptsFromActivityTask(
    taskSlug: string,
  ): Promise<ApiResponse<ActivityTaskStudentAttemptResponse>> {
    try {
      const data = await getAxios(`${API_URL}/activity/${taskSlug}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ActivityTaskStudentAttemptResponse>(error);
    }
  },

  async createActivityAttempt(
    payload: CreateTaskAttemptFormInputs,
  ): Promise<ApiResponse<UpsertTaskAttemptResponse>> {
    try {
      const res: DetailResponseDto<UpsertTaskAttemptResponse> = await postAxios(
        `${API_URL}/activity`,
        payload,
      );
      return res;
    } catch (error) {
      return handleAxiosError<UpsertTaskAttemptResponse>(error);
    }
  },

  async createClassTaskAttempt(
    payload: CreateTaskAttemptFormInputs,
  ): Promise<ApiResponse<UpsertTaskAttemptResponse>> {
    try {
      const res: DetailResponseDto<UpsertTaskAttemptResponse> = await postAxios(
        `${API_URL}/class`,
        payload,
      );
      return res;
    } catch (error) {
      return handleAxiosError<UpsertTaskAttemptResponse>(error);
    }
  },

  async updateActivityAttempt(
    id: string,
    payload: UpdateTaskAttemptFormInputs,
  ): Promise<ApiResponse<UpsertTaskAttemptResponse>> {
    try {
      const res: DetailResponseDto<UpsertTaskAttemptResponse> = await putAxios(
        `${API_URL}/activity/${id}`,
        payload,
      );
      return res;
    } catch (error) {
      return handleAxiosError<UpsertTaskAttemptResponse>(error);
    }
  },

  async updateClassTaskAttempt(
    id: string,
    payload: UpdateTaskAttemptFormInputs,
  ): Promise<ApiResponse<UpsertTaskAttemptResponse>> {
    try {
      const res: DetailResponseDto<UpsertTaskAttemptResponse> = await putAxios(
        `${API_URL}/class/${id}`,
        payload,
      );
      return res;
    } catch (error) {
      return handleAxiosError<UpsertTaskAttemptResponse>(error);
    }
  },
};
