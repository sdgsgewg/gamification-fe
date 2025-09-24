import { FilterRoleRequest } from "../interface/roles/requests/IFilterRoleRequest";
import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";
import { RoleOverviewResponse } from "../interface/roles/responses/IRoleOverviewResponse";
import { getAxios } from "../utils/AxiosFunction";

const API_URL = "/roles";

export const roleProvider = {
  async getRoles(
    params?: FilterRoleRequest
  ): Promise<ApiResponse<RoleOverviewResponse[]>> {
    try {
      const query = new URLSearchParams();

      if (params?.orderBy) query.append("orderBy", params.orderBy);
      if (params?.orderState) query.append("orderState", params.orderState);

      const url = query.toString() ? `${API_URL}?${query}` : API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<RoleOverviewResponse[]>(error);
    }
  },
};
