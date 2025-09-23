import { UserDetailResponse } from "../../users/responses/IUserDetailResponse";
// import { UserOverviewResponse } from "../../users/responses/IUserOverviewResponse";

export interface LoginDetailResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserDetailResponse;
}
