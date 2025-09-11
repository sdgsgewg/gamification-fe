import { ApiResponse, BaseResponseDto, DetailResponseDto, handleAxiosError } from "../utils/axiosHelper";
import { Material } from "../interface/materials/IMaterial";
import {
  getAxios,
  postAxios,
  putAxios,
  deleteAxios,
} from "../utils/AxiosFunction";
import { CreateMaterialFormInputs } from "../components/forms/materials/create-material-form";
import { EditMaterialFormInputs } from "../components/forms/materials/edit-material-form";

const API_URL = "materials";

export const materialProvider = {
  async getMaterials(params?: {
    searchText?: string;
  }): Promise<ApiResponse<Material[]>> {
    try {
      const query = new URLSearchParams();
      if (params?.searchText) query.append("searchText", params.searchText);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<Material[]>(error);
    }
  },

  async getMaterial(slug: string): Promise<ApiResponse<Material>> {
    try {
      const data = await getAxios(`${API_URL}/${slug}`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<Material>(error);
    }
  },

  async createMaterial(
    payload: CreateMaterialFormInputs
  ): Promise<ApiResponse<Material>> {
    try {
      const res: DetailResponseDto<Material> = await postAxios(
        API_URL,
        payload
      );
      return res;
    } catch (error) {
      return handleAxiosError<Material>(error);
    }
  },

  async updateMaterial(
    id: string,
    payload: EditMaterialFormInputs
  ): Promise<ApiResponse<Material>> {
    try {
      const res: DetailResponseDto<Material> = await putAxios(
        `${API_URL}/${id}`,
        payload
      );
      return res;
    } catch (error) {
      return handleAxiosError<Material>(error);
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
