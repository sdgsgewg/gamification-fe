import {
  ApiResponse,
  BaseResponseDto,
  DetailResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { FilterSubjectRequest } from "../interface/subjects/requests/IFilterSubjectRequest";
import { SubjectOverviewResponse } from "../interface/subjects/responses/ISubjectOverviewResponse";
import { SubjectDetailResponse } from "../interface/subjects/responses/ISubjectDetailResponse";
import {
  getAxios,
  postAxios,
  putAxios,
  deleteAxios,
} from "../utils/AxiosFunction";

const API_URL = "/subjects";

export const subjectProvider = {
  async getSubjects(
    params?: FilterSubjectRequest
  ): Promise<ApiResponse<SubjectOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<SubjectOverviewResponse[]>(error);
    }
  },

  async getSubjectDetail(
    slug: string
  ): Promise<ApiResponse<SubjectDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/${slug}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<SubjectDetailResponse>(error);
    }
  },

  async createSubject(
    formData: FormData
  ): Promise<ApiResponse<SubjectDetailResponse>> {
    try {
      const res: DetailResponseDto<SubjectDetailResponse> = await postAxios(
        API_URL,
        formData
      );
      return res;
    } catch (error) {
      return handleAxiosError<SubjectDetailResponse>(error);
    }
  },

  async updateSubject(
    id: string,
    formData: FormData
  ): Promise<ApiResponse<SubjectDetailResponse>> {
    try {
      const res: DetailResponseDto<SubjectDetailResponse> = await putAxios(
        `${API_URL}/${id}`,
        formData
      );
      return res;
    } catch (error) {
      return handleAxiosError<SubjectDetailResponse>(error);
    }
  },

  async deleteSubject(id: string): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await deleteAxios(`${API_URL}/${id}`);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
