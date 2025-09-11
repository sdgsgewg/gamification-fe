import { ApiResponse, handleAxiosError } from "../utils/axiosHelper";
import { Grade } from "../interface/grades/IGrade";
import { getAxios } from "../utils/AxiosFunction";

const API_URL = "grades";

export const gradeProvider = {
  async getGrades(): Promise<ApiResponse<Grade[]>> {
    try {
      const url = API_URL;
      const data = await getAxios(url);

      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<Grade[]>(error);
    }
  },
};
