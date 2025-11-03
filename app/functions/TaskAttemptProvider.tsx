import {
  ApiResponse,
  DetailResponseDto,
  handleAxiosError,
} from "../utils/axiosHelper";
import { postAxios, putAxios } from "../utils/AxiosFunction";
import { CreateTaskAttemptFormInputs } from "../schemas/task-attempts/createTaskAttempt";
import { UpdateTaskAttemptFormInputs } from "../schemas/task-attempts/updateTaskAttempt";
import { UpsertTaskAttemptResponseDto } from "../interface/task-attempts/responses/IUpsertTaskAttemptResponse";

const API_URL = "/task-attempts";

export const taskAttemptProvider = {
  async createTaskAttempt(
    payload: CreateTaskAttemptFormInputs
  ): Promise<ApiResponse<UpsertTaskAttemptResponseDto>> {
    try {
      const res: DetailResponseDto<UpsertTaskAttemptResponseDto> =
        await postAxios(API_URL, payload);
      return res;
    } catch (error) {
      return handleAxiosError<UpsertTaskAttemptResponseDto>(error);
    }
  },

  async updateTaskAttempt(
    id: string,
    payload: UpdateTaskAttemptFormInputs
  ): Promise<ApiResponse<UpsertTaskAttemptResponseDto>> {
    try {
      const res: DetailResponseDto<UpsertTaskAttemptResponseDto> =
        await putAxios(`${API_URL}/${id}`, payload);
      return res;
    } catch (error) {
      return handleAxiosError<UpsertTaskAttemptResponseDto>(error);
    }
  },
};
