import {
  ApiResponse,
  BaseResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { deleteAxios, postAxios } from "../utils/AxiosFunction";
import { JoinClassFormInputs } from "../schemas/classes/joinClass";

const API_URL = "/class-students";

export const classStudentProvider = {
  async joinClass(dto: JoinClassFormInputs): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await postAxios(API_URL, dto);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },

  async leaveClass(classId: string): Promise<ApiResponse<null>> {
    try {
      const res: BaseResponseDto = await deleteAxios(`${API_URL}/${classId}`);
      return res;
    } catch (error) {
      return handleAxiosError<null>(error);
    }
  },
};
