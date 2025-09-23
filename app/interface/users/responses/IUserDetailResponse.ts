import { Role } from "@/app/enums/Role";

export interface UserDetailResponse {
  userId: string;
  name: string;
  username: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
  dob: string;
  image: string;
  role: { roleId: string; name: Role };
  grade: { gradeId: string; name: string };
  level: number;
  xp: number;
  emailVerifiedAt: string;
  createdAt: string;
}
