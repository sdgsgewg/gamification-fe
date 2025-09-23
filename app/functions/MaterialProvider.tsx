import {
  ApiResponse,
  BaseResponseDto,
  DetailResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { MaterialOverviewResponse } from "../interface/materials/responses/IMaterialOverviewResponse";

import {
  getAxios,
  postAxios,
  putAxios,
  deleteAxios,
} from "../utils/AxiosFunction";
import { CreateMaterialFormInputs } from "../schemas/materials/createMaterial";
import { EditMaterialFormInputs } from "../schemas/materials/editMaterial";
import { MaterialDetailResponse } from "../interface/materials/responses/IMaterialDetailResponse";
import { FilterMaterialRequest } from "../interface/materials/requests/IFilterMaterialRequest";

const API_URL = "/materials";

export const materialProvider = {
  async getMaterials(
    params?: FilterMaterialRequest
  ): Promise<ApiResponse<MaterialOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.searchText) query.append("searchText", params.searchText);
      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<MaterialOverviewResponse[]>(error);
    }
  },

  async getMaterial(
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
    payload: CreateMaterialFormInputs
  ): Promise<ApiResponse<MaterialDetailResponse>> {
    try {
      const res: DetailResponseDto<MaterialDetailResponse> = await postAxios(
        API_URL,
        payload
      );
      return res;
    } catch (error) {
      return handleAxiosError<MaterialDetailResponse>(error);
    }
  },

  async updateMaterial(
    id: string,
    payload: EditMaterialFormInputs
  ): Promise<ApiResponse<MaterialDetailResponse>> {
    try {
      const res: DetailResponseDto<MaterialDetailResponse> = await putAxios(
        `${API_URL}/${id}`,
        payload
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
