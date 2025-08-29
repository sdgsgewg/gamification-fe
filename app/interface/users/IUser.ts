export type Role = "guest" | "student" | "teacher" | "admin";

export interface User {
  userId: string;
  gradeId: string;
  name: string;
  username: string;
  email: string;
  gender: string;
  dob: string;
  phone: string;
  image: string;
  role: Role;
  xp: number;
  level: number;
  created_at: string;
}
