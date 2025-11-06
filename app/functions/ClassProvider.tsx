import {
  ApiResponse,
  BaseResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { FilterClassRequest } from "../interface/classes/requests/IFilterClassRequest";
import { ClassOverviewResponse } from "../interface/classes/responses/IClassOverviewResponse";
import { ClassDetailResponse } from "../interface/classes/responses/IClassDetailResponse";
import { ClassTaskResponse } from "../interface/class-tasks/responses/IClassTaskResponse";
import { ClassMemberResponse } from "../interface/classes/responses/IClassMemberResponse";
import {
  getAxios,
  postAxios,
  putAxios,
  deleteAxios,
} from "../utils/AxiosFunction";
import { FilterClassTask } from "../interface/class-tasks/requests/IFilterClassTaskRequest";
import { FilterClassMember } from "../interface/classes/requests/IFilterClassMemberRequest";

const API_URL = "/classes";

export const classProvider = {
  async getUserClasses(
    params?: FilterClassRequest
  ): Promise<ApiResponse<ClassOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassOverviewResponse[]>(error);
    }
  },

  async getNotJoinedClasses(
    params?: FilterClassRequest
  ): Promise<ApiResponse<ClassOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString()
        ? `${API_URL}/not-joined?${query}`
        : `${API_URL}/not-joined`;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassOverviewResponse[]>(error);
    }
  },

  async getClassDetail(
    slug: string
  ): Promise<ApiResponse<ClassDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/${slug}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassDetailResponse>(error);
    }
  },

  async getClassTasks(
    slug: string,
    params?: FilterClassTask
  ): Promise<ApiResponse<ClassTaskResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.status) query.append("status", params.status);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString()
        ? `${API_URL}/${slug}/tasks?${query}`
        : `${API_URL}/${slug}/tasks`;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassTaskResponse[]>(error);
    }
  },

  async getClassMembers(
    slug: string,
    params?: FilterClassMember
  ): Promise<ApiResponse<ClassMemberResponse>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString()
        ? `${API_URL}/${slug}/members?${query}`
        : `${API_URL}/${slug}/members`;

      const data = await getAxios(url);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassMemberResponse>(error);
    }
  },

  async createClass(formData: FormData): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await postAxios(API_URL, formData);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },

  async updateClass(
    id: string,
    formData: FormData
  ): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await putAxios(`${API_URL}/${id}`, formData);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },

  async deleteClass(id: string): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await deleteAxios(`${API_URL}/${id}`);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
