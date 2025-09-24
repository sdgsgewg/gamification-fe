export enum Role {
  GUEST = "Guest",
  STUDENT = "Student",
  TEACHER = "Teacher",
  ADMIN = "Admin",
}

export const RoleLabels: Record<Role, string> = {
  [Role.GUEST]: "Guest",
  [Role.STUDENT]: "Siswa",
  [Role.TEACHER]: "Guru",
  [Role.ADMIN]: "Admin",
};
