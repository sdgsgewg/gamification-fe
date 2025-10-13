import { Role } from "../enums/Role";
import { ROUTES } from "./routes";

export function resolveDashboardRoute(role: Role, subPath = ""): string {
  switch (role) {
    case Role.ADMIN:
      return `${ROUTES.DASHBOARD.ADMIN.BASE}${
        subPath === "/tasks" ? "/manage-tasks" : subPath
      }`;
    case Role.TEACHER:
      return `${ROUTES.DASHBOARD.TEACHER.BASE}${subPath}`;
    case Role.STUDENT:
      return `${ROUTES.DASHBOARD.STUDENT.BASE}${subPath}`;
    default:
      return ROUTES.ROOT.HOME;
  }
}
