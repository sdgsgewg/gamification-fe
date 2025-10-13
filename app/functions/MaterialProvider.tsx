import {
  ApiResponse,
  BaseResponseDto,
  DetailResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { FilterMaterialFormInputs } from "../schemas/materials/filterMaterial";
import { MaterialOverviewResponse } from "../interface/materials/responses/IMaterialOverviewResponse";
import { MaterialDetailResponse } from "../interface/materials/responses/IMaterialDetailResponse";
import {
  getAxios,
  postAxios,
  putAxios,
  deleteAxios,
} from "../utils/AxiosFunction";

const API_URL = "/materials";

export const materialProvider = {
  async getMaterials(
    params?: FilterMaterialFormInputs
  ): Promise<ApiResponse<MaterialOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.subjectId) query.append("subjectId", params.subjectId);

      if (params?.gradeIds && params.gradeIds.length > 0) {
        params.gradeIds.forEach((id) => query.append("gradeIds", id));
      }

      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<MaterialOverviewResponse[]>(error);
    }
  },

  async getMaterialDetail(
    slug: string
  ): Promise<ApiResponse<MaterialDetailResponse>> {
    try {
      const data = await getAxios(`${API_URL}/${slug}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<MaterialDetailResponse>(error);
    }
  },

  async createMaterial(
    formData: FormData
  ): Promise<ApiResponse<MaterialDetailResponse>> {
    try {
      const res: DetailResponseDto<MaterialDetailResponse> = await postAxios(
        API_URL,
        formData
      );
      return res;
    } catch (error) {
      return handleAxiosError<MaterialDetailResponse>(error);
    }
  },

  async updateMaterial(
    id: string,
    formData: FormData
  ): Promise<ApiResponse<MaterialDetailResponse>> {
    try {
      const res: DetailResponseDto<MaterialDetailResponse> = await putAxios(
        `${API_URL}/${id}`,
        formData
      );
      return res;
    } catch (error) {
      return handleAxiosError<MaterialDetailResponse>(error);
    }
  },

  async deleteMaterial(id: string): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await deleteAxios(`${API_URL}/${id}`);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
