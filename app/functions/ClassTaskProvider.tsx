import {
  ApiResponse,
  BaseResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { StudentClassTaskResponse } from "../interface/class-tasks/responses/IStudentClassTaskResponse";
import { getAxios, postAxios } from "../utils/AxiosFunction";
import { FilterClassTask } from "../interface/class-tasks/requests/IFilterClassTaskRequest";
import { ClassTaskDetailResponseDto } from "../interface/class-tasks/responses/IClassTaskDetailResponse";
import { ClassTaskWithQuestionsResponseDto } from "../interface/class-tasks/responses/IClassTaskWithQuestionResponse";
import { ClassTaskSummaryResponseDto } from "../interface/class-tasks/responses/IClassTaskWithSummaryResponse";
import { TeacherClassTaskResponse } from "../interface/class-tasks/responses/ITeacherClassTaskResponse";
import { AvailableClassesResponse } from "../interface/class-tasks/responses/IAvailableClassesResponse";
import { FilterClassRequest } from "../interface/classes/requests/IFilterClassRequest";
import { ShareTaskFormInputs } from "../schemas/class-tasks/shareTask";
import { FilterTaskAttemptRequest } from "../interface/task-attempts/requests/IFilterTaskAttemptRequest";
import { GroupedTaskAttemptResponse } from "../interface/task-attempts/responses/IGroupedTaskAttemptResponse";
import { ClassTaskOverviewResponse } from "../interface/class-tasks/responses/IClassTaskOverviewResponse";

const API_URL = "/class-tasks";

export const classTaskProvider = {
  async getTasksFromAllClasses(
    params?: FilterTaskAttemptRequest
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

  async getTasksFromAllClassesList(
    params?: FilterTaskAttemptRequest
  ): Promise<ApiResponse<ClassTaskOverviewResponse[]>> {
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

      const url = query.toString()
        ? `${API_URL}/list?${query}`
        : `${API_URL}/list`;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassTaskOverviewResponse[]>(error);
    }
  },

  async getStudentClassTasks(
    classSlug: string,
    params?: FilterClassTask
  ): Promise<ApiResponse<StudentClassTaskResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.status) query.append("status", params.status);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const baseUrl = `${API_URL}/classes/${classSlug}/tasks/student`;

      const url = query.toString() ? `${baseUrl}?${query}` : `${baseUrl}`;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<StudentClassTaskResponse[]>(error);
    }
  },

  async getTeacherClassTasks(
    classSlug: string,
    params?: FilterClassTask
  ): Promise<ApiResponse<TeacherClassTaskResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.status) query.append("status", params.status);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const baseUrl = `${API_URL}/classes/${classSlug}/tasks/teacher`;

      const url = query.toString() ? `${baseUrl}?${query}` : `${baseUrl}`;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<TeacherClassTaskResponse[]>(error);
    }
  },

  async getClassTaskDetail(
    classSlug: string,
    taskSlug: string
  ): Promise<ApiResponse<ClassTaskDetailResponseDto>> {
    try {
      const data = await getAxios(
        `${API_URL}/classes/${classSlug}/tasks/${taskSlug}`
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
        `${API_URL}/classes/${classSlug}/tasks/${taskSlug}/attempt`
      );
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassTaskWithQuestionsResponseDto>(error);
    }
  },

  async getClassTaskSummaryFromAttempt(
    attemptId: string
  ): Promise<ApiResponse<ClassTaskSummaryResponseDto>> {
    try {
      const data = await getAxios(`${API_URL}/attempts/${attemptId}/summary`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassTaskSummaryResponseDto>(error);
    }
  },

  async getAvailableClasses(
    taskId: string,
    params?: FilterClassRequest
  ): Promise<ApiResponse<AvailableClassesResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);

      const baseUrl = `${API_URL}/available-classes/${taskId}`;
      const url = query.toString() ? `${baseUrl}?${query}` : baseUrl;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<AvailableClassesResponse[]>(error);
    }
  },

  async shareTaskIntoClasses(
    payload: ShareTaskFormInputs
  ): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await postAxios(API_URL, payload);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
