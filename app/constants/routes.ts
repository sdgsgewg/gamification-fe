export const ROUTES = {
  // 🔐 Auth
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    EMAIL_VERIFICATION: "/email-verification",
    COMPLETE_PROFILE: "/complete-profile",
  },

  // 🏠 Root
  ROOT: {
    HOME: "/",
    ABOUT: "/about",
    SUBJECTS: "/subjects",
    BADGES: "/badges",
    ACTIVITY: "/activity",
    LEADERBOARD: "/leaderboard",
    PROFILE: "/users",
  },

  // 🎓 Dashboard
  DASHBOARD: {
    BASE: "/dashboard",

    // 👩‍🎓 Student
    STUDENT: {
      BASE: "/dashboard/student",
      HOME: "/dashboard/student",
      CLASS: "/dashboard/student/class",
      TASKS: "/dashboard/student/tasks",
      LEADERBOARD: "/dashboard/student/leaderboard",
    },

    // 👨‍🏫 Teacher
    TEACHER: {
      BASE: "/dashboard/teacher",
      HOME: "/dashboard/teacher",
      CLASS: "/dashboard/teacher/class",
      TASKS: "/dashboard/teacher/tasks",
      LEADERBOARD: "/dashboard/teacher/leaderboard",
    },

    // 🧑‍💼 Admin
    ADMIN: {
      BASE: "/dashboard/admin",
      HOME: "/dashboard/admin",
      MANAGE_SUBJECTS: "/dashboard/admin/manage-subjects",
      MANAGE_MATERIALS: "/dashboard/admin/manage-materials",
      MANAGE_TASKS: "/dashboard/admin/manage-tasks",
      MANAGE_TASK_TYPES: "/dashboard/admin/manage-task-types",
      MANAGE_MINI_GAMES: "/dashboard/admin/manage-mini-games",
    },
  },
};
