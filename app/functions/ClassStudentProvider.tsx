import {
  ApiResponse,
  BaseResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { deleteAxios, getAxios, postAxios } from "../utils/AxiosFunction";
import { JoinClassFormInputs } from "../schemas/classes/joinClass";
import { ClassStudentOverviewResponse } from "../interface/class-students/response/IClassStudentOverviewResponse";

const API_URL = "/class-students";

export const classStudentProvider = {
  async getTeacherTotalStudents(): Promise<
    ApiResponse<ClassStudentOverviewResponse[]>
  > {
    try {
      const data = await getAxios(`${API_URL}/teacher/me/total-students`);
      return { isSuccess: true, data };
    } catch (error) {
      return handleAxiosError<ClassStudentOverviewResponse[]>(error);
    }
  },

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
