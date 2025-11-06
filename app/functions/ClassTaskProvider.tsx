import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";
import { ClassTaskResponse } from "../interface/class-tasks/responses/IClassTaskResponse";
import { getAxios } from "../utils/AxiosFunction";
import { FilterClassTask } from "../interface/class-tasks/requests/IFilterClassTaskRequest";
import { ClassTaskDetailResponseDto } from "../interface/class-tasks/responses/IClassTaskDetailResponse";
import { ClassTaskWithQuestionsResponseDto } from "../interface/class-tasks/responses/IClassTaskWithQuestionResponse";
import { ClassTaskSummaryResponseDto } from "../interface/class-tasks/responses/IClassTaskWithSummaryResponse";

const API_URL = "/classes";

export const classTaskProvider = {
  async getClassTasks(
    classSlug: string,
    params?: FilterClassTask
  ): Promise<ApiResponse<ClassTaskResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.status) query.append("status", params.status);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString()
        ? `${API_URL}/${classSlug}/tasks?${query}`
        : `${API_URL}/${classSlug}/tasks`;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassTaskResponse[]>(error);
    }
  },

  async getClassTaskDetail(
    classSlug: string,
    taskSlug: string
  ): Promise<ApiResponse<ClassTaskDetailResponseDto>> {
    try {
      const data = await getAxios(
        `${API_URL}/${classSlug}/tasks/${taskSlug}`
      );
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassTaskDetailResponseDto>(error);
    }
  },

  async getClassTaskWithQuestions(
    classSlug: string,
    taskSlug: string
  ): Promise<ApiResponse<ClassTaskWithQuestionsResponseDto>> {
    try {
      const data = await getAxios(
        `${API_URL}/${classSlug}/tasks/${taskSlug}/attempt`
      );
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassTaskWithQuestionsResponseDto>(error);
    }
  },

  async getClassTaskSummaryFromAttempt(
    classSlug: string,
    taskSlug: string
  ): Promise<ApiResponse<ClassTaskSummaryResponseDto>> {
    try {
      const data = await getAxios(
        `${API_URL}/${classSlug}/tasks/${taskSlug}/summary`
      );
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassTaskSummaryResponseDto>(error);
    }
  },
};
