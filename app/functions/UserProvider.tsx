import { getAxios } from "../utils/AxiosFunction";

export default class UserProvider {
  async getUserDetail(uid: string) {
    try {
      const data = await getAxios(`users/get-user-detail/${uid}`);
      return { ok: true, user: data };
    } catch (error: any) {
      console.error("Failed to fetch logged-in user:", error);
      return { ok: false, error: error.message };
    }
  }
}

export const userProvider = new UserProvider();