import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";
import { Subject } from "../interface/subjects/ISubject";
import { CreateSubjectFormInputs } from "../components/forms/subjects/create-subject-form";
import { EditSubjectFormInputs } from "../components/forms/subjects/edit-subject-form";
import {
  getAxios,
  postAxios,
  putAxios,
  deleteAxios,
} from "../utils/AxiosFunction";

const API_URL = "/subjects";

export const subjectProvider = {
  async getSubjects(searchText?: string): Promise<ApiResponse<Subject[]>> {
    try {
      const params = searchText
        ? `?searchText=${encodeURIComponent(searchText)}`
        : "";
      const data = await getAxios(`${API_URL}${params}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<Subject[]>(error);
    }
  },

  async getSubject(id: string): Promise<ApiResponse<Subject>> {
    try {
      const data = await getAxios(`${API_URL}/${id}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<Subject>(error);
    }
  },

  async createSubject(
    payload: CreateSubjectFormInputs
  ): Promise<ApiResponse<Subject>> {
    try {
      const data = await postAxios(API_URL, payload);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<Subject>(error);
    }
  },

  async updateSubject(
    id: string,
    payload: EditSubjectFormInputs
  ): Promise<ApiResponse<Subject>> {
    try {
      const data = await putAxios(`${API_URL}/${id}`, payload);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<Subject>(error);
    }
  },

  async deleteSubject(id: string): Promise<ApiResponse<null>> {
    try {
      await deleteAxios(`${API_URL}/${id}`);
      return { isSuccess: true };
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
